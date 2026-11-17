"""Audit a part of the world for class and grain. Writes nothing.

    python3 tools/audit.py parts/part7.py
    python3 tools/audit.py parts/part7.py --list      also list every claim that breaks the class rule

Class rule: a claim is "attested" only when a contemporary written source names the entry at a place that
can be located. WRITTEN_FROM gives, for each region, the first year from which such sources exist for
more than an isolated case. An attested claim that starts earlier is reported unless its entry is listed
in "attested_early" in the part file, which is the place to record the exceptions and the source that
justifies each.

Grain rule: at each keyframe, how many peoples and states are alive in the part, and how many members
each group shows when opened.
"""
import ast
import collections
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from atlas import model  # noqa: E402

KEYFRAMES = [1, 500, 1000, 1500, 1800, 2026]
MAX_ALIVE, MAX_GROUP = 60, 14
# First year of contemporary written sources that place peoples, by region. Typed from memory of the
# standard accounts; a seed like everything else.
WRITTEN_FROM = {
    # Africa south of the Sahara: Arabic geographers reach the Sahel about 800 to 1000, Portuguese the
    # coasts from 1440 to 1500; the interior waits for the 19th century. The Nile and the Horn have
    # inscriptions and the Periplus from the 1st century.
    "sahelw": 850, "guinea": 1470, "chad": 850, "nile": 1, "horn": 1, "congo": 1483, "lakes": 1500,
    "zambezi": 1500, "southafrica": 1488,
    # The Americas: Maya inscriptions in Central America and southern Mexico; everything else from contact.
    "arcticam": 1576, "canada": 1534, "usaeast": 1513, "usawest": 1540, "mexico": 1, "centralam": 1,
    "caribbean": 1492, "andesn": 1499, "guianas": 1596, "andes": 1532, "amazon": 1542, "brazil": 1500,
    "cone": 1516,
    "australia": 1606, "papua": 1526,
}


def alive(claims, year):
    return any(c[3] <= year <= c[4] for c in claims)


def main(argv):
    path = [a for a in argv if a.endswith(".py")][0]
    part = ast.literal_eval(Path(path).read_text(encoding="utf-8"))
    entries = part.get("entries", [])
    early_ok = set(part.get("attested_early", []))
    parent = {g[0]: g[2] for g in part.get("groups", [])}
    name = {g[0]: g[1] for g in part.get("groups", [])}

    print("class of claims, by the year a claim starts")
    bands = [(1, 499), (500, 999), (1000, 1499), (1500, 1799), (1800, 2026)]
    for lo, hi in bands:
        tally = collections.Counter(c[6] for e in entries for c in e[7] if lo <= c[3] <= hi)
        total = sum(tally.values()) or 1
        print("  %4d to %4d   %4d claims   attested %3d%%   reconstructed %3d%%   indicative %3d%%" % (
            lo, hi, sum(tally.values()), 100 * tally["a"] // total, 100 * tally["r"] // total, 100 * tally["i"] // total))

    broken = []
    for e in entries:
        regions = [r for r in model.region_names(e[5]) if r in WRITTEN_FROM]
        if not regions or e[0] in early_ok:
            continue
        first = min(WRITTEN_FROM[r] for r in regions)
        for c in e[7]:
            if c[6] == "a" and c[3] < first:
                broken.append((e[0], c[3], c[4], first))
    print("attested claims that start before written records reach the region: %d" % len(broken))
    if "--list" in argv:
        for pid, y0, y1, first in broken:
            print("    %-34s %5d to %5d   records from %d" % (pid, y0, y1, first))

    print("grain: peoples and states alive at each keyframe (aim for %d or fewer)" % MAX_ALIVE)
    over = 0
    for y in KEYFRAMES:
        live = [e for e in entries if e[2] != "language" and alive(e[7], y)]
        by_group = collections.Counter(e[6] for e in live if e[2] == "people")
        crowded = ["%s %d" % (name.get(g, g or "ungrouped"), n) for g, n in by_group.most_common() if n > MAX_GROUP]
        flag = "" if len(live) <= MAX_ALIVE else "   OVER"
        over += len(live) > MAX_ALIVE or bool(crowded)
        print("  %4d   %3d alive%s%s" % (y, len(live), flag, ("   crowded groups: " + ", ".join(crowded)) if crowded else ""))
    ok = not broken and not over
    print("audit passes" if ok else "audit fails")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
