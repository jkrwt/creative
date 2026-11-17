"""Cut the world's coast and the survey regions out of world-atlas (Natural Earth 1:10m, public domain).

    python3 tools/coast.py world-atlas-2.0.2.tgz site/data/coast.json

Decodes the TopoJSON by hand, simplifies, drops specks. Writes three things:
  polygons  land at full detail (finest inside Europe, where the regional views are closest)
  coarse    land for the world and continent views
  regions   one list of outlines per region in atlas.model.REGION_LIST, cut from present-day country
            outlines. A few large countries are split along lines of longitude and latitude.
The data is read, never run.
"""
import json
import sys
import tarfile

SOUTH, NORTH = -60.0, 84.0          # no Antarctica; Greenland's north tip is cut
EUROPE = (-25.0, 34.0, 50.0, 72.0)  # the first survey, kept at its first detail
TOL_EU, TOL_WORLD, TOL_COARSE, TOL_REGION = 0.011, 0.02, 0.12, 0.03   # degrees
MIN_AREA, MIN_AREA_COARSE = 0.004, 0.035                            # square degrees

W = None
THRACE = (25.5, 40.2, 29.3, 42.3)
# region -> items. An item is a country id (ISO numeric, as world-atlas spells it) or name, or
# (id, box) to keep the part of that country inside box (west, south, east, north), or
# (id, box, "in" | "out") to keep whole polygons whose centre is inside or outside box.
REGION_SPEC = {
    "gaul": [("250", EUROPE), "492"],
    "iberia": [("724", (-10.5, 35.0, 5.0, 44.5)), ("620", (-10.5, 36.0, -6.0, 43.0)), "020"],
    "italy": ["380", "674", "336", "470"],
    "central": ["056", "528", "442", "276", "756", "438", "040", "203", "703", "348", "616"],
    "north": ["208", ("578", (-10.0, 55.0, 35.0, 72.0)), "752", "246", "352", "234"],
    "balkans": ["705", "191", "070", "688", "499", "807", "008", "300", "100", "642", "Kosovo", ("792", THRACE, "in")],
    "east": ["233", "428", "440", "112", "804", ("643", (15.0, 40.0, 60.0, 84.0)), "498"],
    "anatolia": [("792", THRACE, "out"), "196", "N. Cyprus"],
    "caucasus": ["268", "051", "031"],
    "levant": ["760", "422", "376", "275", "400"],
    "mesopotamia": ["368", "414"],
    "arabia": ["682", "887", "512", "784", "634", "048"],
    "egypt": ["818"],
    "maghreb": ["434", "788", "012", "504", "732", ("724", (-19.0, 27.0, -13.0, 30.0))],
    "iran": ["364"],
    "afghanistan": ["004"],
    "turan": ["795", "860", "762", "417"],
    "steppe": ["398"],
    "wsiberia": [("643", (60.0, 40.0, 105.0, 84.0))],
    "esiberia": [("643", (105.0, 40.0, 180.0, 84.0)), ("643", (-180.0, 40.0, -168.0, 84.0))],
    "indus": ["586"],
    "hindustan": [("356", (66.0, 21.0, 88.0, 38.0)), "524"],
    "bengal": ["050", ("356", (88.0, 20.0, 98.0, 30.0))],
    "deccan": [("356", (66.0, 6.0, 88.0, 21.0))],
    "lanka": ["144", "462"],
    "tibet": [("156", (73.0, 26.0, 100.0, 36.0)), "064"],
    "tarim": [("156", (73.0, 36.0, 100.0, 50.0))],
    "mongolia": ["496", ("156", (100.0, 40.0, 119.0, 54.0))],
    "manchuria": [("156", (119.0, 40.0, 136.0, 54.0))],
    "chinan": [("156", (100.0, 32.0, 125.0, 40.0))],
    "chinas": [("156", (100.0, 17.0, 125.0, 32.0))],
    "korea": ["408", "410"],
    "japan": ["392"],
    "taiwan": ["158"],
    "burma": ["104"],
    "indochina": ["764", "418", "116", "704"],
    "malaya": [("458", (99.0, 0.0, 105.0, 8.0)), "702"],
    "sumatra": [("360", (94.0, -5.95, 108.6, 6.5))],
    "java": [("360", (105.0, -9.2, 115.75, -5.95))],
    "borneo": [("360", (108.6, -4.6, 118.7, 4.6)), ("458", (105.0, 0.0, 120.0, 8.0)), "096"],
    "eindonesia": [("360", (115.75, -11.5, 131.0, 6.0)), "626"],
    "philippines": ["608"],
    "papua": [("360", (131.0, -11.5, 142.0, 2.0)), "598"],
    "melanesia": ["090", "548", "540", "242"],
    "micronesia": ["316", "585", "583", "584", "296", "580", "520"],
    "polynesia": ["882", "776", "258", "184", "570", "016", "798",
                  ("840", (-161.0, 18.0, -154.0, 23.0)), ("152", (-111.0, -28.0, -100.0, -26.0))],
    "newzealand": [("554", (165.0, -48.0, 179.9, -34.0))],
    "madagascar": ["450", "174", "480", ("250", (43.0, -22.0, 56.0, -11.0))],
    "sahelw": ["478", "466", "686", "270", "854", "562", "624", "324", "132"],
    "guinea": ["694", "430", "384", "288", "768", "204", "566"],
    "chad": ["148", "140", "120"],
    "nile": ["729", "728"],
    "horn": ["231", "232", "262", "706", "Somaliland"],
    "congo": ["180", "178", "266", "226", "024", "678"],
    "lakes": ["404", "800", "834", "646", "108"],
    "zambezi": ["894", "454", "508", "716"],
    "southafrica": [("710", (16.0, -35.5, 33.5, -22.0)), "426", "748", "072", "516"],
    "arcticam": ["304", ("124", (-142.0, 60.0, -50.0, 84.0)), ("840", (-180.0, 50.0, -129.0, 72.0)),
                 ("840", (170.0, 50.0, 180.0, 56.0))],
    "canada": [("124", (-142.0, 41.0, -50.0, 60.0))],
    "usaeast": [("840", (-100.0, 24.0, -66.0, 50.0))],
    "usawest": [("840", (-125.5, 24.0, -100.0, 50.0))],
    "mexico": ["484"],
    "centralam": ["320", "084", "340", "222", "558", "188", "591"],
    "caribbean": ["192", "332", "214", "388", "630", "044", "780", "052", "662", "670", "308", "212", "028", "659",
                  ("250", (-64.0, 14.0, -60.0, 19.0))],
    "andesn": ["170", "862", ("218", (-82.0, -6.0, -74.0, 2.0))],
    "guianas": ["328", "740", ("250", (-55.0, 2.0, -51.0, 6.0))],
    "andes": ["604", "068"],
    "amazon": [("076", (-75.0, -15.0, -48.0, 6.0))],
    "brazil": [("076", (-48.0, -34.0, -34.0, 6.0)), ("076", (-75.0, -34.0, -48.0, -15.0))],
    "cone": [("152", (-80.0, -56.5, -66.0, -17.0)), "032", "858", "600", "238"],
    "australia": [("036", (112.0, -44.0, 154.5, -10.0))],
}


def decode(t):
    sx, sy = t["transform"]["scale"]
    tx, ty = t["transform"]["translate"]
    res = []
    for arc in t["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        res.append(pts)
    return res


def ring(arcs, indices):
    pts = []
    for i in indices:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts.extend(a if not pts else a[1:])
    return pts


def polygons(obj):
    for g in obj.get("geometries", [obj]):
        if g["type"] == "Polygon":
            yield g["arcs"]
        elif g["type"] == "MultiPolygon":
            for p in g["arcs"]:
                yield p


def clip(pts, box):
    """Sutherland-Hodgman against an axis-aligned box."""
    w, s, e, n = box
    edges = [
        (lambda p: p[0] >= w, lambda a, b: (w, a[1] + (b[1] - a[1]) * (w - a[0]) / (b[0] - a[0]))),
        (lambda p: p[0] <= e, lambda a, b: (e, a[1] + (b[1] - a[1]) * (e - a[0]) / (b[0] - a[0]))),
        (lambda p: p[1] >= s, lambda a, b: (a[0] + (b[0] - a[0]) * (s - a[1]) / (b[1] - a[1]), s)),
        (lambda p: p[1] <= n, lambda a, b: (a[0] + (b[0] - a[0]) * (n - a[1]) / (b[1] - a[1]), n)),
    ]
    for inside, cut in edges:
        if not pts:
            break
        res, prev = [], pts[-1]
        for cur in pts:
            if inside(cur):
                if not inside(prev):
                    res.append(cut(prev, cur))
                res.append(cur)
            elif inside(prev):
                res.append(cut(prev, cur))
            prev = cur
        pts = res
    return pts


def simplify(pts, tol):
    """Douglas-Peucker, iterative."""
    if len(pts) < 4:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = pts[a]
        bx, by = pts[b]
        dx, dy = bx - ax, by - ay
        norm = (dx * dx + dy * dy) ** 0.5 or 1e-12
        best, idx = 0.0, -1
        for i in range(a + 1, b):
            d = abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / norm
            if d > best:
                best, idx = d, i
        if best > tol:
            keep[idx] = True
            stack.append((a, idx))
            stack.append((idx, b))
    return [p for p, k in zip(pts, keep) if k]


def area(pts):
    return abs(sum(pts[i][0] * pts[i - 1][1] - pts[i - 1][0] * pts[i][1] for i in range(len(pts)))) / 2


def centre(pts):
    return sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)


def inside(pt, box):
    return box[0] <= pt[0] <= box[2] and box[1] <= pt[1] <= box[3]


def finish(pts, tol, min_area, digits):
    if len(pts) < 3 or area(pts) < min_area:
        return None
    half = len(pts) // 2
    c = simplify(pts[:half + 1], tol)[:-1] + simplify(pts[half:] + pts[:1], tol)[:-1]
    if len(c) < 3:
        return None
    return [[round(x, digits), round(y, digits)] for x, y in c]


def cut(arcs, obj, tol_world, min_area, box=None, mode=None, tol_eu=None):
    res = []
    world = (-180.0, SOUTH, 180.0, NORTH)
    for poly in polygons(obj):
        base = ring(arcs, poly[0])
        ys = [p[1] for p in base]
        if max(ys) < SOUTH or min(ys) > NORTH:
            continue
        if mode:                                   # whole polygons, chosen by where their centre is
            if inside(centre(base), box) != (mode == "in"):
                continue
            c = clip(base, world)
        else:
            c = clip(base, box or world)
        if len(c) < 3:
            continue
        eu = tol_eu is not None and inside(centre(c), EUROPE)
        done = finish(c, tol_eu if eu else tol_world, min_area, 3 if eu else 2)
        if done:
            res.append(done)
    res.sort(key=len, reverse=True)
    return res


def isles(pts):
    """Ireland, Britain and Man are told apart by position; they share no country outline with their names."""
    cx, cy = centre(pts)
    if -4.9 < cx < -4.2 and 54.0 < cy < 54.45:
        return "man"
    if cy < 49.85 or cy > 61.2 or cx > 1.9 or cx < -11:
        return None
    if cx < -5.35 and cy < 55.45:
        return "ireland"
    return "britain"


def main(tgz, out):
    with tarfile.open(tgz) as t:
        topo = json.load(t.extractfile("package/land-10m.json"))
        ctopo = json.load(t.extractfile("package/countries-10m.json"))
    arcs = decode(topo)
    land = cut(arcs, topo["objects"]["land"], TOL_WORLD, MIN_AREA, tol_eu=TOL_EU)
    coarse = cut(arcs, topo["objects"]["land"], TOL_COARSE, MIN_AREA_COARSE)

    regions = {"britain": [], "ireland": [], "man": []}
    for pts in land:
        name = isles(pts)
        if name:
            regions[name].append(pts)

    arcs = decode(ctopo)
    geoms = ctopo["objects"]["countries"]["geometries"]
    missing = []
    for name, items in REGION_SPEC.items():
        polys = []
        for item in items:
            key, box, mode = (item, None, None) if isinstance(item, str) else (tuple(item) + (None,))[:3]
            found = [g for g in geoms if str(g.get("id")) == key or g.get("properties", {}).get("name") == key]
            if not found:
                missing.append(key)
            for g in found:
                polys.extend(cut(arcs, g, TOL_REGION, MIN_AREA, box, mode, tol_eu=TOL_EU))
        regions[name] = polys
    print("not found:", missing)

    doc = {
        "source": "Natural Earth 1:10m land and countries, public domain, via the world-atlas package 2.0.2",
        "box": [-180.0, SOUTH, 180.0, NORTH],
        "polygons": land,
        "coarse": coarse,
        "regions": regions,
    }
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        json.dump(doc, f, separators=(",", ":"))
    count = lambda ps: (len(ps), sum(len(p) for p in ps))
    print("land", count(land), "coarse", count(coarse), "regions", count([p for v in regions.values() for p in v]))
    print({k: count(v) for k, v in regions.items()})


if __name__ == "__main__":
    main(*sys.argv[1:3])
