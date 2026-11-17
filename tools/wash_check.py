"""Find land with no language wash: the gate "no land in the survey is dark in any century".

    python3 tools/wash_check.py --regions iran+afghanistan            the tables as they stand
    python3 tools/wash_check.py parts/part2.py                        the tables plus a part, over the part's regions
    python3 tools/wash_check.py --all                                 every covered region

Samples each region on a grid, and for each sample year looks for a language claim that reaches the point
and whose entry may enter that region. It uses the same reach the viewer draws, so a point this passes is lit.
"""
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from atlas import model  # noqa: E402
import add_part  # noqa: E402

REACH = {"attested": 1.15, "reconstructed": 1.3, "indicative": 1.45}   # share of radius_km still lit
YEARS = list(range(1, 2026, 25)) + [2026]


def inside(x, y, polys):
    hit = False
    for pts in polys:
        n = len(pts)
        j = n - 1
        for i in range(n):
            xi, yi = pts[i]
            xj, yj = pts[j]
            if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
                hit = not hit
            j = i
    return hit


def samples(polys, step):
    xs = [p[0] for pts in polys for p in pts]
    ys = [p[1] for pts in polys for p in pts]
    if not xs:
        return []
    out = []
    y = math.floor(min(ys)) + step / 2
    while y < max(ys):
        x = math.floor(min(xs)) + step / 2
        while x < max(xs):
            if inside(x, y, polys):
                out.append((x, y))
            x += step
        y += step
    return out


def km(lon1, lat1, lon2, lat2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dl = math.radians(lon2 - lon1)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 6371.0 * 2 * math.asin(min(1.0, math.sqrt(a)))


def check(tables, regions, coast, verbose=12):
    people = {p["people_id"]: p for p in tables["peoples"]}
    by_region = {}
    for c in tables["claims"]:
        p = people.get(c["people_id"])
        if not p or p["entity_type"] != "language":
            continue
        row = (float(c["lon"]), float(c["lat"]), float(c["radius_km"]) * REACH[c["class"]],
               int(c["year_from"]), 2026 if c["open_end"] == "yes" else int(c["year_to"]), p["people_id"])
        for r in model.region_names(p["region"]):
            by_region.setdefault(r, []).append(row)
    total_bad = 0
    for region in regions:
        polys = coast["regions"].get(region, [])
        # a ring that crosses the date line is stored with longitudes on both sides of it: put it on one side
        polys = [[(x + 360 if x < 0 else x, y) for x, y in pts] if max(p[0] for p in pts) - min(p[0] for p in pts) > 180 else pts
                 for pts in polys]
        pts = samples(polys, 1.0)
        if len(pts) < 25:
            pts = samples(polys, 0.34)
        claims = by_region.get(region, [])
        bad = {}
        for y in YEARS:
            live = [c for c in claims if c[3] <= y <= c[4]]
            for (x, yy) in pts:
                if not any(km(x, yy, c[0], c[1]) <= c[2] for c in live):
                    bad.setdefault((x, yy), []).append(y)
        total_bad += len(bad)
        print("%-12s %4d points, %3d dark at some date" % (region, len(pts), len(bad)))
        for (x, yy), years in sorted(bad.items(), key=lambda kv: -len(kv[1]))[:verbose]:
            spans, start, prev = [], years[0], years[0]
            for y in years[1:] + [None]:
                if y is None or y - prev > 25:
                    spans.append("%d-%d" % (start, prev) if prev != start else str(start))
                    start = y
                prev = y
            print("    dark at lon %7.2f lat %6.2f in %s" % (x, yy, ", ".join(spans)))
    return total_bad


def main(argv):
    tables = model.load(ROOT)
    coast = json.loads((ROOT / "site" / "data" / "coast.json").read_text(encoding="utf-8"))
    regions = []
    if "--all" in argv:
        regions = list(model.COVERED)
    if "--regions" in argv:
        regions = model.region_names(argv[argv.index("--regions") + 1])
    for path in [a for a in argv if a.endswith(".py")]:
        part = add_part.read_part(path)
        tables, problems = add_part.merge(tables, part)
        for p in problems[:20]:
            print("problem:", p)
        regions = regions or model.region_names("+".join(part.get("regions", [])))
    bad = check(tables, regions, coast)
    print("%d dark points in all" % bad)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
