"""py -3.13 -m unittest -v"""
import copy
import csv
import json
import tempfile
import unittest
from pathlib import Path

from atlas import build, fetch, model, validate


def codes(tables):
    return {code for code, _, _ in validate.validate(tables)[0]}


class SeedData(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tables = model.load()

    def test_seed_tables_are_valid(self):
        errors, _ = validate.validate(self.tables)
        self.assertEqual(errors, [])

    def test_same_names_stay_separate(self):
        ids = {p["people_id"] for p in self.tables["peoples"]}
        self.assertIn("brigantes", ids)
        self.assertIn("brigantes-ireland", ids)
        _, notes = validate.validate(self.tables)
        self.assertTrue(any("brigantes" in n for n in notes))

    def test_every_claim_is_marked_seed_until_checked(self):
        for c in self.tables["claims"]:
            if c["entered_by"] == "sketch":
                self.assertEqual(c["status"], "seed", c["claim_id"])


class Rules(unittest.TestCase):
    def setUp(self):
        self.tables = copy.deepcopy(model.load())
        self.claim = self.tables["claims"][0]

    def test_unknown_source(self):
        self.claim["source_ids"] = "no-such-source"
        self.assertIn("E08", codes(self.tables))

    def test_no_source(self):
        self.claim["source_ids"] = ""
        self.assertIn("E08", codes(self.tables))

    def test_years_reversed(self):
        self.claim["year_from"], self.claim["year_to"] = "400", "100"
        self.assertIn("E06", codes(self.tables))

    def test_year_zero_rejected(self):
        self.claim["year_from"] = "0"
        self.assertIn("E06", codes(self.tables))

    def test_point_outside_region(self):
        self.claim["lon"], self.claim["lat"] = "77.2", "88.6"
        self.assertIn("E05", codes(self.tables))

    def test_checked_claim_needs_one_real_source_and_a_locator(self):
        self.claim["status"] = "checked"          # two sources, one a bucket
        self.assertIn("E09", codes(self.tables))
        self.claim["source_ids"], self.claim["locator"] = "civitas-names", "RIB 1"
        self.assertIn("E09", codes(self.tables))  # bucket source
        self.claim["source_ids"], self.claim["locator"] = "ptolemy-geog", ""
        self.assertIn("E09", codes(self.tables))  # no locator
        self.claim["locator"] = "II.3"
        self.assertNotIn("E09", codes(self.tables))

    def test_entry_without_a_claim(self):
        self.tables["peoples"].append({"people_id": "nobody", "name": "Nobody", "entity_type": "people",
                                       "family": "brit", "family_inferred": "no", "region": "britain"})
        self.assertIn("E10", codes(self.tables))

    def test_link_to_unknown_entry(self):
        self.tables["links"][0]["to_people"] = "nobody"
        self.assertIn("E02", codes(self.tables))


class Branches(unittest.TestCase):
    def test_every_family_has_a_branch(self):
        self.assertEqual(set(model.BRANCHES), set(model.FAMILIES))
        self.assertEqual(set(model.BRANCHES.values()), set(model.BRANCH_NAMES))

    def test_the_peoples_ptolemy_lists_are_celtic(self):
        fam = {p["people_id"]: p["family"] for p in model.load()["peoples"]}
        for pid in ("iceni", "brigantes", "iverni", "caledonii"):
            self.assertEqual(model.BRANCHES[fam[pid]], "celtic", pid)


    def test_branches_on_the_continent(self):
        fam = {p["people_id"]: p["family"] for p in model.load()["peoples"]}
        expect = {"parisii": "celtic", "arevaci": "celtic", "bretons": "celtic", "visigoths": "germanic",
                  "franks": "germanic", "castile": "romance", "vascones": "basque", "al-andalus": "afroasiatic"}
        for pid, branch in expect.items():
            self.assertEqual(model.BRANCHES[fam[pid]], branch, pid)


class Groups(unittest.TestCase):
    def test_groups_hold_only_named_peoples(self):
        tables = model.load()
        gids = {g["group_id"] for g in tables["groups"]}
        for p in tables["peoples"]:
            if p["group"]:
                self.assertIn(p["group"], gids, p["people_id"])
                self.assertEqual(p["entity_type"], "people", p["people_id"])

    def test_unknown_group_is_an_error(self):
        tables = copy.deepcopy(model.load())
        tables["peoples"][0]["group"] = "no-such-group"
        self.assertIn("E02", codes(tables))


class World(unittest.TestCase):
    def test_a_group_can_hold_groups(self):
        tables = model.load()
        parent = {g["group_id"]: g["parent"] for g in tables["groups"]}
        self.assertEqual(parent["britons"], "celts")
        self.assertEqual(parent["celts"], "")
        tables = copy.deepcopy(tables)
        by_id = {g["group_id"]: g for g in tables["groups"]}
        by_id["celts"]["parent"] = "britons"            # a loop
        self.assertIn("E12", codes(tables))
        by_id["celts"]["parent"] = "no-such-group"
        self.assertIn("E02", codes(tables))

    def test_regions_and_sets(self):
        self.assertEqual(len(model.REGION_LIST), len(set(model.REGION_LIST)))
        for name, members in model.REGION_SETS.items():
            self.assertNotIn(name, model.REGION_LIST)
            self.assertTrue(set(members) <= set(model.REGION_LIST), name)
        self.assertEqual(model.region_names("isles+gaul"), ["britain", "ireland", "man", "gaul"])
        self.assertTrue(set(model.COVERED) <= set(model.REGION_LIST))

    def test_every_covered_region_has_an_outline(self):
        with open(model.ROOT / "site" / "data" / "coast.json", encoding="utf-8") as f:
            coast = json.load(f)
        for name in model.REGION_LIST:
            self.assertTrue(coast["regions"].get(name), name)

    def test_views_and_periods(self):
        tables = model.load()
        views = {v["view_id"]: v for v in tables["views"]}
        self.assertEqual(views["world"]["parent"], "")
        self.assertEqual(views["world"]["projection"], "equal-earth")
        with_periods = {r["view_id"] for r in tables["periods"]}
        self.assertIn("europe", with_periods)
        for vid in with_periods:                       # contiguous, 1 to the present
            rows = sorted((int(r["year_from"]), int(r["year_to"])) for r in tables["periods"] if r["view_id"] == vid)
            self.assertEqual(rows[0][0], 1, vid)
            self.assertEqual(rows[-1][1], model.YEAR_MAX, vid)
            for a, b in zip(rows, rows[1:]):
                self.assertEqual(a[1], b[0], vid)
        bad = copy.deepcopy(tables)
        bad["views"][1]["parent"] = "no-such-view"
        self.assertIn("E02", codes(bad))
        bad = copy.deepcopy(tables)
        bad["periods"][0]["jump_year"] = "5000"
        self.assertIn("E13", codes(bad))

    def test_events_mark_the_slider(self):
        tables = model.load()
        out = build.build(tables)
        self.assertIn("world", out["events"])
        years = [y for y, _ in out["events"]["world"]]
        self.assertEqual(years, sorted(years))
        bad = copy.deepcopy(tables)
        bad["events"][0]["year"] = "0"
        self.assertIn("E14", codes(bad))
        bad = copy.deepcopy(tables)
        bad["events"][0]["view_id"] = "no-such-view"
        self.assertIn("E02", codes(bad))

    def test_build_carries_the_world(self):
        out = build.build(model.load())
        self.assertEqual(out["regions"], model.REGION_LIST)
        self.assertEqual(out["views"][0]["id"], "world")
        self.assertIn("europe", out["periods"])
        p = next(p for p in out["peoples"] if p["id"] == "cantiaci")
        self.assertEqual(p["rs"], [model.REGION_LIST.index("britain")])


class Parts(unittest.TestCase):
    """The part files are the record of everything outside Europe's first seed."""

    @classmethod
    def setUpClass(cls):
        import ast
        cls.parts = {}
        for path in sorted((model.ROOT / "parts").glob("part*.py")):
            cls.parts[path.name] = ast.literal_eval(path.read_text(encoding="utf-8"))

    def test_no_two_parts_use_the_same_id(self):
        for key, what in (("entries", "entry"), ("groups", "group")):
            seen = {}
            for name, part in self.parts.items():
                for row in part.get(key, []):
                    self.assertNotIn(row[0], seen, "%s id %r is in %s and %s" % (what, row[0], seen.get(row[0]), name))
                    seen[row[0]] = name

    def test_a_source_named_by_two_parts_is_the_same_source(self):
        seen = {}
        for name, part in self.parts.items():
            for row in part.get("sources", []):
                if row[0] in seen:
                    self.assertEqual(tuple(row), seen[row[0]][1], "source %r differs between %s and %s" % (row[0], seen[row[0]][0], name))
                seen[row[0]] = (name, tuple(row))

    def test_the_tables_hold_what_the_parts_say(self):
        ids = {p["people_id"] for p in model.load()["peoples"]}
        for name, part in self.parts.items():
            for row in part.get("entries", []):
                self.assertIn(row[0], ids, "%s: %s is not in data/peoples.csv; apply the part" % (name, row[0]))


class Build(unittest.TestCase):
    def test_build_output(self):
        tables = model.load()
        out = build.build(tables)
        self.assertEqual(len(out["peoples"]), len(tables["peoples"]))
        self.assertEqual(sum(len(p["claims"]) for p in out["peoples"]), len(tables["claims"]))
        for p in out["peoples"]:
            for c in p["claims"]:
                self.assertTrue(c["sources"], c["id"])
                for sid in c["sources"]:
                    self.assertIn(sid, out["sources"])
        json.dumps(out)

    def test_coverage_reaches_the_present(self):
        rows = build.coverage(build.build(model.load()))
        self.assertEqual(rows[0][0], 1)
        self.assertEqual(rows[-1][0], 2001)
        self.assertTrue(all(live > 0 for _, live, _ in rows), rows)

    def test_published_json_matches_the_tables(self):
        published = model.ROOT / "site" / "data" / "peoples.json"
        with open(published, encoding="utf-8") as f:
            self.assertEqual(json.load(f), json.loads(json.dumps(build.build(model.load()))),
                             "site/data/peoples.json is stale; run atlas.build")


class Coast(unittest.TestCase):
    def test_coast_is_inside_the_region_and_names_its_source(self):
        with open(model.ROOT / "site" / "data" / "coast.json", encoding="utf-8") as f:
            coast = json.load(f)
        self.assertIn("Natural Earth", coast["source"])
        self.assertGreater(len(coast["polygons"]), 20)
        w, s, e, n = coast["box"]
        for ring in coast["polygons"]:
            self.assertGreaterEqual(len(ring), 3)
            for lon, lat in ring:
                self.assertTrue(w <= lon <= e and s <= lat <= n, (lon, lat))


class Catalogue(unittest.TestCase):
    def test_catalogue_reads_cleanly(self):
        rows = model.read_table(model.ROOT / "catalogue" / "sources.csv")
        ids = [r["id"] for r in rows]
        self.assertEqual(len(ids), len(set(ids)))
        for r in rows:
            self.assertNotIn(None, r, r["id"])           # no extra columns
            self.assertNotIn(None, r.values(), r["id"])  # no missing columns
            self.assertTrue(r["stage"].isdigit(), r["id"])


class Fetch(unittest.TestCase):
    def test_fetch_writes_file_and_manifest(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)
            src = tmp / "source.txt"
            src.write_bytes(b"hillforts\n")
            row = fetch.fetch("demo", src.as_uri(), root=tmp)
            self.assertEqual(row["bytes"], 10)
            self.assertEqual((tmp / "raw" / "demo" / "source.txt").read_bytes(), b"hillforts\n")
            with open(tmp / "raw" / "manifest.csv", encoding="utf-8", newline="") as f:
                rows = list(csv.DictReader(f))
            self.assertEqual(rows[0]["sha256"], row["sha256"])
            self.assertEqual(len(row["sha256"]), 64)


if __name__ == "__main__":
    unittest.main()
