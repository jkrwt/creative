"""Assemble the shareable atlas page: one file, the map across the page, everything inlined."""
import json
import os
import re
import sys

kit, out_path = sys.argv[1:3]
read = lambda p: open(p, encoding="utf-8").read()

css = read(kit + "/site/atlas.css")
js = read(kit + "/site/atlas.js")
index = read(kit + "/site/index.html")
peoples = json.load(open(kit + "/site/data/peoples.json", encoding="utf-8"))
coast = json.load(open(kit + "/site/data/coast.json", encoding="utf-8"))
n_entries = len(peoples["peoples"])
n_claims = sum(len(p["claims"]) for p in peoples["peoples"])
n_groups = len(peoples["groups"])
panel = re.search(r'<div class="atlas wide">.*?(?=</main>)', index, re.S).group(0).rstrip()

page = """<title>Peoples of the World</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@1,500;1,600&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: a night atlas. One dark ground, the story above the map, the map across the page, controls and tags beneath. */
:root {
  color-scheme: dark;
  --bg: #070a0f; --fg: #eef2f6; --muted: #a3adba; --line: #2c3746; --surface: #10151d;
  --display: "Space Grotesk", "Inter", system-ui, sans-serif;
  --body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --gut: max(16px, env(safe-area-inset-left, 0px));
}
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--fg); font-family: var(--body); font-size: 16px; line-height: 1.55; }
.col { width: min(1180px, calc(100% - 2 * var(--gut))); margin-inline: auto; }
/* The year is the hero. The title is a quiet label above it. */
.masthead { padding-block: 20px 10px; display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 16px; border-bottom: 1px solid var(--line); margin-bottom: 18px; }
.masthead h1 { margin: 0; font-family: var(--display); font-weight: 600; font-size: 19px; line-height: 1.2; letter-spacing: .01em; }
.masthead p { margin: 0; color: var(--muted); font-size: 14.5px; }
.about { padding-block: 40px 64px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px 40px; }
.about h2 { grid-column: 1 / -1; margin: 0; font-family: var(--display); font-weight: 600; font-size: 20px; }
.about h3 { margin: 0 0 6px; font-family: var(--display); font-weight: 600; font-size: 15px; }
.about p { margin: 0; color: var(--muted); font-size: 15px; max-width: 46ch; }
.about div { min-width: 0; }
%(css)s
</style>

<header class="masthead col">
  <h1>Peoples of the World</h1>
  <p>Who lived where, and what they spoke, from 1 CE to the present.</p>
</header>

%(panel)s

<section class="about col" aria-labelledby="about-h">
  <h2 id="about-h">About this map</h2>
  <div>
    <h3>It is a sketch</h3>
    <p>The %(entries)d entries and %(claims)d placements here were entered from memory of standard reference works. None has yet been checked against its source. Treat positions and dates as approximate, and every name as a lead to look up.</p>
  </div>
  <div>
    <h3>Written records and reconstruction</h3>
    <p>For Europe, the Near East, India and China the map rests on what people wrote at the time. For most of Africa south of the Sahara, the Americas outside the Maya lowlands, Australia, New Guinea and the Pacific before about 1500, nobody wrote. There the map rests on archaeology, on working back from languages and on oral tradition, and each such placement is marked reconstructed or indicative.</p>
  </div>
  <div>
    <h3>Peoples have no borders here</h3>
    <p>Almost no people before modern times has a border that anyone recorded. So peoples are drawn as soft fields, tighter where a centre is known and looser where it is not, and states are lettered and never outlined. Where sovereignty is disputed today the map does not settle it.</p>
  </div>
  <div>
    <h3>What it leaves out</h3>
    <p>%(leftout)s Minorities with no territory of their own, such as Yiddish and Romani speakers, and most communities that arrived in the last two centuries. Everything before 1 CE. The soft wash shows the language most people spoke, so a city of many languages shows one.</p>
  </div>
  <div>
    <h3>Sources</h3>
    <p>Each entry names the text or record it rests on, from Ptolemy and the Chinese dynastic histories to the censuses. Tap any people to see them. The coastline and the present-day country outlines that keep each field on its own land are from Natural Earth.</p>
  </div>
</section>

<script>
%(js)s
PeoplesAtlas(%(data)s,
%(coast)s);
</script>
"""
all_regions, covered = peoples.get("regions", []), set(peoples.get("covered", []))
leftout = "" if covered >= set(all_regions) else "Parts of the world the survey has not reached yet, which are hatched."
for key, value in dict(
    leftout=leftout, css=css, panel=panel, entries=n_entries, claims=n_claims, js=js,
    data=json.dumps(peoples, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/"),
    coast=json.dumps(coast, separators=(",", ":")),
).items():
    page = page.replace("%(" + key + ")s", str(value)).replace("%(" + key + ")d", str(value))
os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
open(out_path, "w", encoding="utf-8", newline="\n").write(page)
print("wrote", out_path, len(page), "bytes;", n_entries, "entries,", n_claims, "claims,", n_groups, "groups")
