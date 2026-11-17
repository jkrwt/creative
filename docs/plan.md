# Plan

Written 16 November 2026.

Build a database of dated, sourced claims about where named peoples lived, and draw the map from those claims. Start with Ireland and Britain from 1 CE to the present. Then extend by region and by era, adding a layer only when a source exists that can carry it.

## Why this has to be built

No dataset of tribal territories exists, because territories were never recorded. What survives is a different kind of evidence in each period, and each kind locates a people in a different way.

| When | What names or locates a people | What it gives the map | Where the data is |
| --- | --- | --- | --- |
| Before about 100 BCE | Nothing names anyone. Hillforts, burials, metalwork, radiocarbon dates, ancient genomes | Settlement density, ancestry shifts, exchange. No names, so no peoples layer | Atlas of Hillforts, AEMA, p3k14c, AADR |
| 100 BCE to 43 CE, southern Britain | Coins stamped with rulers' names; Caesar | Issuing groups mapped by findspot | Celtic Coin Index Digital, PAS |
| 43 to 410, Britain | Ptolemy; Tacitus; towns named for their people | A fixed centre for each people. Extent is inferred | Pleiades, Roman Inscriptions of Britain |
| About 150, Ireland | Ptolemy alone | Names and rough positions | Ptolemy II.2; Pleiades |
| 400 to 700, Ireland and western Britain | Ogham stones: X son of Y, of the kindred of Z | A kin-group name at a known spot | OG(H)AM |
| 550 to 1000 | Annals, Bede, Adomnán, genealogies, king lists, the Tribal Hidage | Kingdoms, royal sites, events by year. Borders almost never | CELT, the Galway annals graph |
| 800 to 1000 | Norse place-names, hoards, burials, ship camps | Settlement density | Key to English Place-Names, PAS, monument records |
| 1000 onward | Charters, treaties and acts; from 1841 the census | States with real borders; language and birthplace by district | Cliopatria; the censuses |
| Afterwards | Names that outlived the people: Osraige became Ossory, Tír Eógain Tyrone, the East Saxons Essex | Boundary fossils. Dioceses and baronies often follow earlier kingdoms (MacCotter, Medieval Ireland, 2008) | Logainm, barony and diocese boundaries |

A period goes on the map when its row has been imported, and a people is drawn only as firmly as its row allows.

## The data model

Three tables, defined in `docs/schema.md`. The claim is the unit of record and every shape is computed from claims.

- **Entry**: a people, a state or a language community, with a stable ID and a language family.
- **Claim**: one statement from one source. This entry, at this place, between these years, with a locator, a class and a status.
- **Source**: the citation, its kind, and where it was read.

Class says how well the entry can be placed: attested, reconstructed or indicative. Status says whether anyone has checked the claim against its source.

A shared name never merges two records. Where scholars disagree, both positions go in as claims with their own sources.

## How the map draws

- **Peoples are fields.** Each is a soft surface around its claims. An attested centre gives a tight bright core, a reconstructed range a wide soft one. Fields are clipped to the coast.
- **States are polygons** from Cliopatria, at every date and in every region.
- **A language wash sits under the peoples.** It shows what most people spoke and stays lit when no people is named, so a gap in the record does not look like empty land.
- **Colour and shape are language.** Thirteen branches, each with a hue zone and a shape: Celtic, Germanic, Romance, Slavic, Baltic, Greek, Uralic, Turkic, Iranian, Balkan, Basque, Arabic and Berber, and the unclassified. Each family has a range inside its branch's zone and each entry its own shade.
- **Time is keyframes.** Each claim has its own dates and fades at the edges. Nothing is interpolated between unrelated claims, and thin periods stay visibly thin.
- **Motion is evidence.** A flow line appears only where a movement claim has a source.

Six layers, each with its own toggle: peoples, states, language, evidence points, ancestry, and land. Ancestry stays separate for good. A genome shows descent, and the peoples layer shows what people called themselves and were called.

## The build

| Part | Choice | Why |
| --- | --- | --- |
| Claims | CSV in git, one row per claim | Every change is a reviewable diff |
| Pipeline | Python standard library now; DuckDB with its spatial extension when polygons arrive | Runs on a laptop with no service |
| Checks | Tests on every change | Sources, locators, dates, geometry and licenses stay consistent |
| Output | JSON for the claims layer; PMTiles for large layers | Static files, hosted anywhere |
| Map | Canvas now; MapLibre GL JS with deck.gl when layers grow | Year filtering on the GPU keeps the slider smooth |
| Basemap | Our own, from Natural Earth and GEBCO relief | No modern borders under an ancient map |

A database server and an API come in only when more than one person is editing claims.

## Stages

| Stage | Work | Gate |
| --- | --- | --- |
| 0. Source audit | Download each source, record its license, count its records for the Isles by century | A coverage table and a license table |
| 1. Isles, 1 CE to the present | Keyframes at 150, 600 and 900. Cliopatria states to 2024. Language areas from the censuses. Hillforts, ogham and coins | Every name opens to a checked claim. No empty century |
| 2. Isles in depth | A frame per century from 300 BCE. Norse place-names, the Tribal Hidage, Irish dynasties, a layer for names that survive in baronies and counties | Disputed placements shown as alternatives |
| 3. The rest of Europe | Gaul and Iberia, then Italy, Germania, Scandinavia, the Balkans and the east. A first seed for all of Europe west of the Volga is already in the tables | The claim standard holds with no schema change |
| 4. Europe before names | 6000 to 800 BCE: radiocarbon density, ancestry, archaeological cultures as hypotheses, changing coasts | The interface makes plain that this era has no named peoples |
| 5. The world, 3400 BCE on | Cliopatria, HYDE population, language families and their documented expansions | Global view runs smoothly on a phone |
| 6. Out of Africa | 300,000 to 12,000 years ago: dated sites, ancestry, ice and sea level, a logarithmic time axis | Every pulse traces to dated sites |

The time control needs three scales: the last 2,000 years in decades, the last 10,000 in centuries, the last 300,000 in millennia.

## Risks

- **The map will be read as an argument about who belongs where.** The records are the answer. They show Norse Dublin, a Gaelic kingdom spanning the North Channel, British-speaking kingdoms in what is now Scotland and England, and Irish peoples in Ptolemy who share names with peoples in Britain and Gaul. The atlas shows the layers and cites them.
- **False precision.** A crisp edge on a people known to within fifty miles is a false statement. Class and field rendering exist to prevent it.
- **License mixing.** Share-alike and non-commercial sources cannot be merged into one open dataset. Each layer keeps its own license and file.
- **Copyrighted scholarship.** Findings can be cited as claims. Maps cannot be traced.
- **Scope.** Each stage starts only when the one under it has passed its gate.

## What was verified on 16 November 2026

Each of these was confirmed on the source's own page: Cliopatria (GitHub and Zenodo), the Atlas of Hillforts and its count of 4,147, Britain in AD 500, the AADR release of June 2026, Exploring the Irish Annals, the AEMA GeoJSON export, the OG(H)AM corpus, the Celtic Coin Index Digital launch, p3k14c and its count of 180,070, Poseidon, and the McColl et al. paper in Nature. No dataset was downloaded and no license was read. `catalogue/sources.csv` records what was and was not checked for each source.
