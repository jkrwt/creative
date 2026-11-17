# The whole world: report

Written 17 November 2026 at the close of `docs/jobs/2026-11-17-the-whole-world.md`.

## What was built

The atlas now covers the whole world from 1 CE to the present. It opens on the world, and drills down to a continent, a region, a group and a people. Everything in it is still a seed typed from memory. Nothing has been checked against a source.

### Engine

1. **Projection.** Each view has its own: Equal Earth for the world and the continents, the first local projection for regions. Longitudes wrap, so a view can cross the date line (Oceania, Polynesia, Siberia). The world is cut at 168.5 west, through the Bering Strait.
2. **Regions.** Every land cell carries a region number, and an entry carries the set of regions it may enter. There are 74 regions, cut from country outlines by `tools/coast.py`, with Russia, China, India, Indonesia, Brazil, Canada and the United States split along lines of longitude and latitude. Seas are hard edges: a field cannot cross the Red Sea, the Strait of Malacca or the Bering Strait unless its entry lists both sides.
3. **Soft borders.** Added during the job. Fields that stopped dead on a modern border or a ruled line looked wrong, above all inside China. Regions that share land are now grouped in `REGION_SOFT`, and a field runs on across such a border at four fifths strength.
4. **A third level.** `groups.csv` has a `parent` column. The world view shows the top-level leads, 41 in all and 15 at most lettered at once. Every other view shows the level below. Opening a group unfolds one level.
5. **Legend.** It lists only the branches on the map in the current view and year. With more than twelve it drops to a row of chips.
6. **Views and captions.** `views.csv` holds 32 views in a tree and `periods.csv` holds period names and captions for 13 of them. A view without its own uses its parent's. The switch is two steps: world or continent, then region.
7. **Glide.** One method for all cases: both pictures are scaled about the place the closer view looks at and cross-faded.
8. **Speed.** The field is made in two steps. The costly one, which claim owns each cell, runs only when the year, view or folding changes. The cheap one, colouring, runs every frame. The cell size grows on large canvases to hold about 230,000 cells.
9. **Calm.** Label budgets by view level and by canvas size. When a tall view is widened to fill the page, the land beside it is dimmed and not lettered. Stripes between a people and the wash under it now show only when they differ in branch, not in family. Two overlapping washes are striped only when they are nearly equal.

### Data

Each part of the world is a file in `parts/`, merged by `tools/add_part.py`. The parts were drafted in parallel by eight writers working to `docs/authoring.md`, each with the dark-land check as its gate, then merged one at a time in the brief's order.

| Part | Area | Language entries | Peoples | States | Claims | Groups | Sources | Claims classed attested |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| first seed | Europe | 63 | 382 | 53 | 597 | 52 | 40 | not counted |
| 1 | Near East and North Africa | 35 | 126 | 43 | 329 | 20 | 26 | 59% |
| 2 | Iran and Central Asia | 45 | 102 | 22 | 281 | 16 | 23 | 51% |
| 3 | South Asia | 42 | 131 | 13 | 311 | 16 | 22 | 65% |
| 4 | East Asia | 41 | 118 | 28 | 334 | 21 | 31 | 53% |
| 5 | Southeast Asia and the Pacific | 48 | 113 | 43 | 371 | 17 | 24 | 57% |
| 6 | Africa south of the Sahara | 46 | 149 | 36 | 391 | 29 | 18 | 43% |
| 7 | The Americas | 50 | 198 | 30 | 672 | 30 | 31 | 43% |
| 8 | Australia and New Guinea | 38 | 57 | 16 | 250 | 13 | 17 | 38% |
| 9 | Europe, gaps in the wash | 31 | 0 | 0 | 47 | 0 | 0 | 9% |

Totals after merging: 2,099 entries, 3,583 claims, 222 sources, 193 links, 214 groups. Part 0 holds the captions for the world and Asia. Group counts for Europe include the eight top-level leads added in this job.

## What was verified, and what was not

Verified:
- 27 tests pass and the validator reports no errors.
- `tools/wash_check.py --all` finds no dark land except islands before their first settlement: Iceland before 870, Madagascar before 600, New Zealand before 1280, Hawaii and the Marquesas, Mauritius, Jamaica and the Bahamas, the Falklands. The check samples a one degree grid every 25 years.
- In the viewer, land cells with no wash on the world view at 2026: 95 of 63,905.
- Screenshots looked at on a desktop width: the world at all six dates; each new part's main view at all six dates as a contact sheet; the Near East, East Asia, South Asia, the Americas and Australia singly at one date each; one opened group; the full page at Europe 900.
- Screenshots looked at on a phone width: the full page for Africa at 1500, and the map alone for the world and each continent at 1500.
- With motion on, a script clicked from the world to Asia to East Asia and opened a group. No page errors.
- The page is 4.3 MB.

Not verified:
- **Frame rate on a real device.** In headless Chromium with no GPU, colouring takes 8 ms a frame on the world view and 13 to 21 ms on the busiest regional views, and the page ran at 25 frames a second on East Asia. The gate is thirty on the world view, and this is not proof either way.
- **The glide in motion.** One frame mid-glide was captured and not looked at.
- **Most regional views.** Of the 26 regional views, about ten were looked at.
- **Phone screenshots at dates other than 1500**, and the final phone label budget, which was tightened after the last screenshot was read.
- **No overlapping labels** was judged by eye on the screenshots above, not measured.
- **The data.** None of it. Eight drafts were merged without a line-by-line read. The writers' own lists of what they were least sure of are below.

## What I am least sure of

1. **The grain is too fine in places.** The brief asked for ten to thirty named peoples or states per keyframe per part. Every part came in over: the Americas has about 125 alive at 1800, Africa 92, South Asia 49. Folding hides this on the overview, but an opened group can be crowded.
2. **Class.** 40 to 65 percent of claims in each part are classed attested. That is too high for Africa south of the Sahara, the Americas and Australia before 1500, and should be audited before any other check.
3. **Washes before writing.** The Bantu arrival dates, the Amazon, the Great Basin, eastern Siberia before 1600, central Africa before farmers, Balochistan, the Kazakh steppe before 550. All are classed reconstructed or indicative and say so, and all are staging by round numbers.
4. **Families forced by the fixed list.** Dayak and Sulawesi languages under Malay, Chamorro under Philippine, Kru and Tiv under Akan and Yoruba, Dogon under Gur, Meroitic under other Nilo-Saharan, Yue under Tai, Buyeo and Goguryeo under Korean. Unknown languages (Xiongnu, Dorset, Teotihuacan, Hopewell) sit under "Unclassified".
5. **Ruling language for states and dynasties.** Sultanates and Mughal successors are filed as Persian, Mamluks as Kipchak, Ayyubids as Arabic. The map stripes these over the population's language, and across north India at 1500 the stripes are heavy.
6. **One language, several records.** Arabic, Persian, Kurdish, Tamil, Spanish and others are separate entries in separate parts, with slightly different shades.
7. **Europe's seams.** Greek now reaches Anatolia, so the mainland Greece circle can faintly light the Aegean coast of Turkey today.
8. **Small land.** Micronesia, the Maldives, Cape Verde and Sao Tome have no sample point in the dark-land check. Mer in the Torres Strait lies outside every region. The Andaman and Nicobar islands, Svalbard, the Azores and Madeira are outside the survey and hatched.
9. **Colour.** There are about 60 branches, not the 40 the brief expected. One assignment serves every view, with hues and shapes reused on other continents, so a people keeps its colour between views. Chinese red and Turkic brick are close where they meet in Gansu.
10. **The edge waver is off.** At whole cells it read as a ragged edge. Contours and stripes still move.

## What the next job should be

My recommendation is to check the seed before adding deep time. In order:

1. Audit class and grain part by part, starting with the Americas and Africa: demote claims that are not attested, and thin or regroup where an opened group shows more than about thirty names.
2. Check a sample of each part against its sources, as Stage 1c set out for the Isles.
3. Import Cliopatria for the states layer worldwide. Its polygons would replace 284 lettered states and settle most questions of extent.
4. Measure frame rate on a phone and a laptop, and watch the glide.

Deep time would then start from a map whose first two thousand years can be trusted.
