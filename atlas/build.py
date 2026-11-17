"""Build the map data from the claim tables.

    py -3.13 -m atlas.build

Writes site/data/peoples.json and prints how many entries are live in each century.
Refuses to build from tables that fail validation.
"""
import argparse
import json
import sys
from pathlib import Path

from . import model
from .validate import validate


def build(tables):
    sources = {s["source_id"]: s["citation"] for s in tables["sources"]}
    by_people = {}
    for c in tables["claims"]:
        by_people.setdefault(c["people_id"], []).append({
            "id": c["claim_id"],
            "kind": c["kind"],
            "lon": float(c["lon"]),
            "lat": float(c["lat"]),
            "r_km": float(c["radius_km"] or 0),
            "from": int(c["year_from"]),
            "to": int(c["year_to"]),
            "open": c["open_end"] == "yes",
            "class": c["class"],
            "sources": model.split_ids(c["source_ids"]),
            "locator": c["locator"],
            "note": c["note"],
            "status": c["status"],
        })
    peoples = []
    for p in tables["peoples"]:
        peoples.append({
            "id": p["people_id"],
            "name": p["name"],
            "type": p["entity_type"],
            "family": p["family"],
            "family_inferred": p["family_inferred"] == "yes",
            "region": p["region"],
            "rs": [model.REGION_LIST.index(r) for r in model.region_names(p["region"])],
            "group": p.get("group", ""),
            "claims": sorted(by_people.get(p["people_id"], []), key=lambda c: c["from"]),
        })
    periods = {}
    for r in sorted(tables.get("periods", []), key=lambda r: int(r["year_from"])):
        periods.setdefault(r["view_id"], []).append(
            [int(r["year_from"]), int(r["year_to"]), r["caption"], r["name"], int(r["jump_year"])])
    return {
        "window": [1, model.YEAR_MAX],
        "families": model.FAMILIES,
        "branches": model.BRANCHES,
        "branch_names": model.BRANCH_NAMES,
        "sources": sources,
        "groups": {g["group_id"]: {"name": g["name"], "story": g["story"], "parent": g.get("parent", "")}
                   for g in tables.get("groups", [])},
        "regions": model.REGION_LIST,
        "covered": model.COVERED,
        "soft": [[model.REGION_LIST.index(r) for r in cluster] for cluster in model.REGION_SOFT],
        "views": [{"id": v["view_id"], "name": v["name"], "parent": v["parent"], "proj": v["projection"],
                   "box": [float(v[k]) for k in ("west", "south", "east", "north")]} for v in tables.get("views", [])],
        "periods": periods,
        "links": [dict(l) for l in tables["links"]],
        "peoples": peoples,
    }


def coverage(out, first=1, last=None):
    """Rows of (century start, live entries, of which have only seed claims)."""
    last = last or out["window"][1]
    rows = []
    for start in range(first, last + 1, 100):
        end = start + 99
        live = seed_only = 0
        for p in out["peoples"]:
            hits = [c for c in p["claims"] if c["from"] <= end and (c["open"] or c["to"] >= start)]
            if hits:
                live += 1
                if all(c["status"] == "seed" for c in hits):
                    seed_only += 1
        rows.append((start, live, seed_only))
    return rows


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--root", default=str(model.ROOT))
    ap.add_argument("--out", default=None, help="output file, default site/data/peoples.json")
    args = ap.parse_args(argv)

    tables = model.load(args.root)
    errors, _ = validate(tables)
    if errors:
        print("%d validation errors; run atlas.validate" % len(errors))
        return 1
    out = build(tables)
    target = Path(args.out) if args.out else Path(args.root) / "site" / "data" / "peoples.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    with open(target, "w", encoding="utf-8", newline="\n") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print("wrote %s: %d entries, %d claims" % (target, len(out["peoples"]),
                                               sum(len(p["claims"]) for p in out["peoples"])))
    print("century   live   unreviewed")
    for start, live, seed_only in coverage(out):
        print("%5d   %6d   %6d" % (start, live, seed_only))
    return 0


if __name__ == "__main__":
    sys.exit(main())
