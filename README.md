# Peoples Atlas

An interactive map of who lived where, and what they spoke, through time. It covers the whole world from 1 CE to the present.

Every shape on the map is drawn from a dated claim that cites a source. The data is a hand-entered seed of 1,915 entries and 3,536 claims, typed from memory and all marked unreviewed.

## Run it

Python 3.13, standard library only.

```
py -3.13 -m unittest -v
py -3.13 -m atlas.validate
py -3.13 -m atlas.build
py -3.13 -m http.server 8000 -d site
py -3.13 tools/build_page.py . dist/peoples-of-the-world.html
```

Then open `http://localhost:8000`. On macOS or Linux use `python3` in place of `py -3.13`.

## Layout

| Path | Contents |
| --- | --- |
| `data/` | The claim tables: entries, claims, sources, succession links, and the groups the overview folds peoples into |
| `catalogue/` | The datasets to import and what has been checked about each |
| `atlas/` | Validator, build, download tool |
| `site/` | The viewer |
| `tests/` | Tests for the tables and the tools |
| `parts/` | One file per part of the world, merged into `data/` by `tools/add_part.py` |
| `tools/` | Coastline and regions, the part merger, the dark-land check, the page builder |
| `docs/authoring.md` | How to write a part |
| `docs/reports/world.md` | What the world job built and what it is least sure of |
| `docs/plan.md` | The plan, seven stages |
| `docs/schema.md` | Field definitions and rules |
| `docs/jobs/` | Dated briefs. The newest one is the work in hand |

## Next

`docs/reports/world.md` ends with what the next job should be. The owner decides between deep time and checking the seed against its sources.
