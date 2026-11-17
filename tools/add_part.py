"""Merge one part of the world into the claim tables.

    python3 tools/add_part.py parts/part3.py --check     validate the part against the tables, write nothing
    python3 tools/add_part.py parts/part3.py             write it into data/*.csv

A part file is one Python literal (a dict), read with ast.literal_eval and never run. docs/authoring.md
describes it. Applying a part twice is safe: rows the part owns are replaced.
"""
import ast
import csv
import io
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from atlas import model, validate  # noqa: E402

CLASS = {"a": "attested", "r": "reconstructed", "i": "indicative"}
FIELDS = {
    "peoples": ["people_id", "name", "entity_type", "family", "family_inferred", "region", "group"],
    "claims": ["claim_id", "people_id", "kind", "lon", "lat", "radius_km", "year_from", "year_to", "open_end", "class",
               "source_ids", "locator", "place_ref", "note", "status", "entered_by", "entered_on"],
    "sources": ["source_id", "citation", "kind", "date", "bucket", "read_at", "note"],
    "links": ["from_people", "to_people", "relation", "year", "source_ids", "note", "status"],
    "groups": ["group_id", "name", "parent", "story", "status"],
    "periods": ["view_id", "year_from", "year_to", "name", "jump_year", "caption"],
}
TODAY = "2026-11-17"


def read_part(path):
    part = ast.literal_eval(Path(path).read_text(encoding="utf-8"))
    if not isinstance(part, dict) or not isinstance(part.get("part"), int):
        raise SystemExit("a part file is a dict with an integer 'part'")
    return part


def claim_rows(part, problems):
    """Every claim in the part as table rows, numbered in file order."""
    rows, n = [], 0
    blocks = [(e[0], e[7]) for e in part.get("entries", [])] + list(part.get("more_claims", []))
    for pid, claims in blocks:
        for c in claims:
            n += 1
            if len(c) != 9:
                problems.append("%s: a claim has 9 fields, got %d: %r" % (pid, len(c), c))
                continue
            lon, lat, r, y0, y1, open_end, cls, srcs, note = c
            if cls not in CLASS:
                problems.append("%s: class must be a, r or i, got %r" % (pid, cls))
                continue
            rows.append({
                "claim_id": "w%d-%04d" % (part["part"], n), "people_id": pid, "kind": "range",
                "lon": repr(float(lon)), "lat": repr(float(lat)), "radius_km": str(r),
                "year_from": str(y0), "year_to": str(y1), "open_end": "yes" if open_end else "no",
                "class": CLASS[cls], "source_ids": srcs, "locator": "", "place_ref": "", "note": note,
                "status": "seed", "entered_by": "sketch", "entered_on": TODAY,
            })
    return rows


def merge(tables, part):
    """Return (new tables, problems). Rows the part owns replace earlier rows with the same ids."""
    problems = []
    t = {k: [dict(r) for r in v] for k, v in tables.items()}
    prefix = "w%d-" % part["part"]
    own_people = {e[0] for e in part.get("entries", [])}
    own_groups = {g[0] for g in part.get("groups", [])}
    own_sources = {s[0] for s in part.get("sources", [])}
    own_views = set(part.get("periods", {}))
    for e in part.get("entries", []):
        if len(e) != 8:
            problems.append("%s: an entry has 8 fields, got %d" % (e[0], len(e)))
    foreign = {c["people_id"] for c in t["claims"] if not c["claim_id"].startswith(prefix)}
    for pid in sorted(own_people & foreign):
        problems.append("%s: this id already belongs to another part of the atlas" % pid)
    # Entries this part placed last time and has since dropped go too: they are the ones whose every claim
    # carries this part's prefix.
    had = {c["people_id"] for c in t["claims"] if c["claim_id"].startswith(prefix)}
    dropped = had - foreign - own_people
    t["claims"] = [c for c in t["claims"] if not c["claim_id"].startswith(prefix)]
    t["peoples"] = [p for p in t["peoples"] if p["people_id"] not in own_people | dropped]
    t["links"] = [l for l in t["links"] if l["from_people"] not in dropped and l["to_people"] not in dropped]
    t["groups"] = [g for g in t["groups"] if g["group_id"] not in own_groups]
    t["sources"] = [s for s in t["sources"] if s["source_id"] not in own_sources]
    t["periods"] = [r for r in t["periods"] if r["view_id"] not in own_views]
    own_links = {(l[0], l[1]) for l in part.get("links", [])}
    t["links"] = [l for l in t["links"] if (l["from_people"], l["to_people"]) not in own_links]

    for s in part.get("sources", []):
        sid, citation, kind, date, bucket, note = s
        t["sources"].append({"source_id": sid, "citation": citation, "kind": kind, "date": date, "bucket": bucket,
                             "read_at": "", "note": note})
    for g in part.get("groups", []):
        gid, name, parent, story = g
        t["groups"].append({"group_id": gid, "name": name, "parent": parent, "story": story, "status": "seed"})
    for e in part.get("entries", []):
        pid, name, etype, family, inferred, region, group = e[:7]
        t["peoples"].append({"people_id": pid, "name": name, "entity_type": etype, "family": family,
                             "family_inferred": inferred, "region": region, "group": group})
    t["claims"].extend(claim_rows(part, problems))
    by_id = {p["people_id"]: p for p in t["peoples"]}
    for pid, region in part.get("region_edits", []):
        if pid in by_id:
            by_id[pid]["region"] = region
        else:
            problems.append("region_edits: no entry %r" % pid)
    groups = {g["group_id"]: g for g in t["groups"]}
    for gid, parent in part.get("group_edits", []):
        if gid in groups:
            groups[gid]["parent"] = parent
        else:
            problems.append("group_edits: no group %r" % gid)
    for pid, group in part.get("member_edits", []):
        if pid in by_id:
            by_id[pid]["group"] = group
        else:
            problems.append("member_edits: no entry %r" % pid)
    for l in part.get("links", []):
        a, b, relation, year, srcs, note = l
        t["links"].append({"from_people": a, "to_people": b, "relation": relation, "year": str(year),
                           "source_ids": srcs, "note": note, "status": "seed"})
    for view, rows in part.get("periods", {}).items():
        for y0, y1, name, jump, caption in rows:
            t["periods"].append({"view_id": view, "year_from": str(y0), "year_to": str(y1), "name": name,
                                 "jump_year": str(jump), "caption": caption})
    while True:                                   # a group the part no longer fills is removed with it
        used = {p["group"] for p in t["peoples"]} | {g["parent"] for g in t["groups"]}
        empty = [g for g in t["groups"] if g["group_id"] not in used and g["group_id"] not in own_groups]
        if not empty or not dropped:
            break
        gone = {g["group_id"] for g in empty}
        t["groups"] = [g for g in t["groups"] if g["group_id"] not in gone]
    for text in [e[1] for e in part.get("entries", [])] + [g[1] for g in part.get("groups", [])]:
        if "—" in text or "tribe" in text.lower():
            problems.append("name %r: no em dashes, and no 'tribe' in labels" % text)
    for code, rid, msg in validate.validate(t)[0]:
        problems.append("%s %s %s" % (code, rid, msg))
    return t, problems


def write(tables, root=ROOT):
    for name, fields in FIELDS.items():
        buf = io.StringIO()
        w = csv.DictWriter(buf, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        for row in tables[name]:
            w.writerow({k: row.get(k, "") for k in fields})
        (Path(root) / "data" / (name + ".csv")).write_text(buf.getvalue(), encoding="utf-8", newline="")


def main(argv):
    check = "--check" in argv
    paths = [a for a in argv if not a.startswith("--")]
    tables = model.load(ROOT)
    for path in paths:
        part = read_part(path)
        tables, problems = merge(tables, part)
        n_claims = sum(len(e[7]) for e in part.get("entries", [])) + sum(len(c) for _, c in part.get("more_claims", []))
        print("%s: part %d, %d entries, %d claims, %d groups, %d sources" % (
            path, part["part"], len(part.get("entries", [])), n_claims, len(part.get("groups", [])),
            len(part.get("sources", []))))
        for p in problems[:60]:
            print("  problem:", p)
        if problems:
            print("  %d problems; nothing written" % len(problems))
            return 1
    if check:
        print("ok, nothing written")
        return 0
    write(tables)
    print("written; now run atlas.build")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
