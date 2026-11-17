"""Check the claim tables against the rules in docs/schema.md.

    py -3.13 -m atlas.validate              exit 1 on any error
    py -3.13 -m atlas.validate --sample 10  also print ten checked claims for a hand audit
"""
import argparse
import datetime
import random
import sys

from . import model


def _int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def validate(tables):
    """Return (errors, notes). Each error is (code, row id, message)."""
    errors, notes = [], []
    err = lambda code, rid, msg: errors.append((code, rid, msg))

    sources = {}
    for s in tables["sources"]:
        sid = s["source_id"]
        if sid in sources:
            err("E01", sid, "duplicate source_id")
        sources[sid] = s
        if s["bucket"] not in ("yes", "no"):
            err("E03", sid, "bucket must be yes or no")

    groups = {}
    for g in tables.get("groups", []):
        if g["group_id"] in groups:
            err("E01", g["group_id"], "duplicate group_id")
        groups[g["group_id"]] = 0
        if not g["name"].strip():
            err("E12", g["group_id"], "a group needs a name")
    parent = {g["group_id"]: g.get("parent", "") for g in tables.get("groups", [])}
    for gid, par in parent.items():
        if par and par not in groups:
            err("E02", gid, "unknown parent group %r" % par)
        seen_up, cur = set(), gid
        while cur and cur in parent and cur not in seen_up:
            seen_up.add(cur)
            cur = parent[cur]
        if cur and cur in seen_up:
            err("E12", gid, "a group cannot be its own ancestor")
        elif par in groups:
            groups[par] += 1          # a child group counts as a member

    peoples = {}
    for p in tables["peoples"]:
        pid = p["people_id"]
        if pid in peoples:
            err("E01", pid, "duplicate people_id")
        peoples[pid] = p
        if p["entity_type"] not in model.ENTITY_TYPES:
            err("E03", pid, "unknown entity_type %r" % p["entity_type"])
        if p["family"] not in model.FAMILIES and not (p["family"] == "" and p["entity_type"] == "polity"):
            err("E03", pid, "unknown family %r" % p["family"])
        if p["family_inferred"] not in ("yes", "no"):
            err("E03", pid, "family_inferred must be yes or no")
        if not p["region"] or any(part not in model.REGIONS for part in p["region"].split("+")):
            err("E03", pid, "unknown region %r" % p["region"])
        if p.get("group"):
            if p["group"] not in groups:
                err("E02", pid, "unknown group %r" % p["group"])
            elif p["entity_type"] != "people":
                err("E12", pid, "only entries of type people can belong to a group")
            else:
                groups[p["group"]] += 1

    w, s_, e, n = model.REGION_BBOX
    seen, claimed = set(), set()
    for c in tables["claims"]:
        cid = c["claim_id"]
        if cid in seen:
            err("E01", cid, "duplicate claim_id")
        seen.add(cid)
        if c["people_id"] not in peoples:
            err("E02", cid, "unknown people_id %r" % c["people_id"])
        claimed.add(c["people_id"])
        for field, allowed in (("kind", model.KINDS), ("class", model.CLASSES), ("status", model.STATUSES)):
            if c[field] not in allowed:
                err("E03", cid, "unknown %s %r" % (field, c[field]))
        if c["open_end"] not in ("yes", "no"):
            err("E03", cid, "open_end must be yes or no")

        lon, lat = _float(c["lon"]), _float(c["lat"])
        if lon is None or lat is None:
            err("E04", cid, "lon and lat must be numbers")
        elif not (w <= lon <= e and s_ <= lat <= n):
            err("E05", cid, "point %.2f, %.2f is outside the current region" % (lon, lat))

        y0, y1 = _int(c["year_from"]), _int(c["year_to"])
        if y0 is None or y1 is None:
            err("E06", cid, "year_from and year_to must be whole numbers")
        elif y0 == 0 or y1 == 0:
            err("E06", cid, "there is no year 0; use -1 for 1 BCE and 1 for 1 CE")
        elif y0 > y1:
            err("E06", cid, "year_from is after year_to")
        elif y0 < model.YEAR_MIN or y1 > model.YEAR_MAX:
            err("E06", cid, "year outside %d to %d" % (model.YEAR_MIN, model.YEAR_MAX))

        if c["kind"] == "range":
            r = _float(c["radius_km"])
            if r is None or r <= 0:
                err("E07", cid, "a range claim needs radius_km above 0")

        ids = model.split_ids(c["source_ids"])
        if not ids:
            err("E08", cid, "no source")
        for sid in ids:
            if sid not in sources:
                err("E08", cid, "unknown source %r" % sid)

        if c["status"] in ("checked", "reviewed"):
            if len(ids) != 1:
                err("E09", cid, "a checked claim cites exactly one source")
            elif ids[0] in sources and sources[ids[0]]["bucket"] == "yes":
                err("E09", cid, "a checked claim cannot cite the bucket source %r" % ids[0])
            if not c["locator"].strip():
                err("E09", cid, "a checked claim needs a locator")

        try:
            datetime.date.fromisoformat(c["entered_on"])
        except ValueError:
            err("E11", cid, "entered_on must be a date, YYYY-MM-DD")

    for pid in peoples:
        if pid not in claimed:
            err("E10", pid, "no claim places this entry")

    for l in tables["links"]:
        rid = "%s>%s" % (l["from_people"], l["to_people"])
        for end in (l["from_people"], l["to_people"]):
            if end not in peoples:
                err("E02", rid, "unknown people_id %r" % end)
        if l["relation"] not in model.RELATIONS:
            err("E03", rid, "unknown relation %r" % l["relation"])
        if l["status"] not in model.STATUSES:
            err("E03", rid, "unknown status %r" % l["status"])
        for sid in model.split_ids(l["source_ids"]):
            if sid not in sources:
                err("E08", rid, "unknown source %r" % sid)

    for gid, n in groups.items():
        if n < 2:
            err("E12", gid, "a group needs at least two members")

    views = {}
    for v in tables.get("views", []):
        vid = v["view_id"]
        if vid in views:
            err("E01", vid, "duplicate view_id")
        views[vid] = v
        box = [_float(v[k]) for k in ("west", "south", "east", "north")]
        if None in box or not box[0] < box[2] or not box[1] < box[3]:
            err("E13", vid, "a view needs west < east and south < north")
        if v["projection"] not in model.PROJECTIONS:
            err("E03", vid, "unknown projection %r" % v["projection"])
    for vid, v in views.items():
        if v["parent"] and v["parent"] not in views:
            err("E02", vid, "unknown parent view %r" % v["parent"])
    for r in tables.get("periods", []):
        rid = "%s %s" % (r["view_id"], r["year_from"])
        if r["view_id"] not in views:
            err("E02", rid, "unknown view %r" % r["view_id"])
        y0, y1, j = _int(r["year_from"]), _int(r["year_to"]), _int(r["jump_year"])
        if y0 is None or y1 is None or j is None or not y0 < y1 or not y0 <= j <= y1:
            err("E13", rid, "a period needs year_from < year_to and a jump_year between them")
        if not r["name"].strip() or not r["caption"].strip():
            err("E13", rid, "a period needs a name and a caption")
    for r in tables.get("events", []):
        rid = "%s %s" % (r["view_id"], r["year"])
        y = _int(r["year"])
        if r["view_id"] not in views:
            err("E02", rid, "unknown view %r" % r["view_id"])
        if y is None or not 1 <= y <= model.YEAR_MAX or not r["label"].strip():
            err("E14", rid, "an event needs a year inside the survey and a label")
        if r["status"] not in model.STATUSES:
            err("E03", rid, "unknown status %r" % r["status"])
    for name in model.COVERED:
        if name not in model.REGION_LIST:
            err("E03", name, "COVERED names an unknown region")

    by_name = {}
    for p in tables["peoples"]:
        by_name.setdefault(p["name"].split(" (")[0].lower(), []).append(p["people_id"])
    for name, ids in sorted(by_name.items()):
        if len(ids) > 1:
            notes.append("same name, separate records: %s" % ", ".join(ids))
    return errors, notes


def summary(tables):
    counts = {}
    for c in tables["claims"]:
        counts[c["status"]] = counts.get(c["status"], 0) + 1
    parts = ["%d %s" % (counts[k], k) for k in ("seed", "checked", "reviewed") if k in counts]
    return "%d entries, %d claims (%s), %d sources, %d links, %d groups, %d views" % (
        len(tables["peoples"]), len(tables["claims"]), ", ".join(parts),
        len(tables["sources"]), len(tables["links"]), len(tables.get("groups", [])), len(tables.get("views", [])))


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--root", default=str(model.ROOT))
    ap.add_argument("--sample", type=int, default=0, help="print N random checked claims for a hand audit")
    ap.add_argument("--seed", type=int, default=None, help="random seed for --sample")
    args = ap.parse_args(argv)

    tables = model.load(args.root)
    errors, notes = validate(tables)
    for code, rid, msg in errors:
        print("%s  %-28s %s" % (code, rid, msg))
    for note in notes:
        print("note %s" % note)
    print(summary(tables))
    if args.sample:
        pool = [c for c in tables["claims"] if c["status"] in ("checked", "reviewed")]
        random.Random(args.seed).shuffle(pool)
        print("\nAudit sample: open each source at its locator and confirm the claim.")
        for c in pool[:args.sample]:
            print("  %s  %s  %s to %s  %s  %s" % (c["claim_id"], c["people_id"], c["year_from"],
                                                c["year_to"], c["source_ids"], c["locator"]))
        if len(pool) < args.sample:
            print("  only %d checked claims exist" % len(pool))
    if errors:
        print("%d errors" % len(errors))
        return 1
    print("valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
