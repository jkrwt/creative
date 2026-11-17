# Schema

Eight tables in `data/`, all UTF-8 CSV with a header row. `py -3.13 -m atlas.validate` checks every rule on this page.

## peoples.csv

One row per entry on the map.

| Field | Meaning |
| --- | --- |
| `people_id` | Stable slug. Never reused, never renamed once a claim cites it |
| `name` | Display name, in the form the sources use |
| `entity_type` | `people` (a people or early kingdom), `polity` (a state whose borders come from Cliopatria), `language` (a language community) |
| `family` | Language family, one of the keys of `FAMILIES` in `atlas/model.py`. May be blank for a polity. Each family belongs to a branch (Celtic, Germanic, Romance, Basque, Arabic and Berber, Unclassified) in `BRANCHES` |
| `family_inferred` | `yes` when the language is assumed and no record shows it |
| `group` | The group this people folds into on the overview, a `group_id` from `groups.csv`. Blank for states, languages and peoples that stand alone |
| `region` | One or more region names from `REGION_LIST` in `atlas/model.py`, joined with `+`, or a shorthand from `REGION_SETS` (`isles`, `europe`, `india`, `china` and so on; `all` still means the ten regions of Europe). The viewer keeps an entry's field on that land. Regions are cut along present-day country outlines by `tools/coast.py`, and a few large countries are split along lines of longitude and latitude |

Adding a family means adding a row to `_FAMILIES` in `atlas/model.py`. A family of one of the first thirteen branches also needs a hue range in `site/atlas.js` (`RANGE`, `TONE` or `MORE`). A family of a later branch takes a share of its branch's zone in `BRANCH_STYLE` without further work. A new branch needs a row in `_BRANCHES` and in `BRANCH_STYLE`.

**Soft borders.** Regions listed together in `REGION_SOFT` share land. A field that lists one of them runs on into the others at four fifths strength, so it does not end on a ruled line. Seas, and borders between clusters, stay hard.

**Covered.** `COVERED` lists the regions the survey has reached. Land in any other region is hatched.

Entries of type `language` form the base layer: the language most people spoke. Entries of type `people` are drawn over it.

## claims.csv

One row per statement from a source: this entry, at this place, between these years.

| Field | Meaning |
| --- | --- |
| `claim_id` | Unique. Seed rows are `s-0001` onward. Use another prefix for new work |
| `people_id` | The entry the claim is about |
| `kind` | `centre` (a located seat), `named-at` (named at a place), `range` (a general area), `movement` |
| `lon`, `lat` | Decimal degrees, WGS84 |
| `radius_km` | For a `range`, how far the area reaches. The viewer widens it by class |
| `year_from`, `year_to` | Whole years the source speaks for. Negative is BCE. There is no year 0: 1 BCE is `-1` |
| `open_end` | `yes` when the entry continues to the present. `year_to` is then the last year checked |
| `class` | `attested`, `reconstructed` or `indicative` |
| `source_ids` | One source. Seed rows may list several, separated by `;` |
| `locator` | Where in the source: book and chapter, annal year, inscription number, table |
| `place_ref` | An address for the place in a gazetteer, Pleiades by preference |
| `note` | One or two plain sentences shown in the viewer |
| `status` | `seed`, `checked` or `reviewed` |
| `entered_by`, `entered_on` | Who and when, date as YYYY-MM-DD |

### Class

- **attested**: a contemporary source names the entry at a place that can be located.
- **reconstructed**: the name is contemporary and the placement is later scholarship.
- **indicative**: the placement could be off by a county or more.

### Status

- **seed**: typed from memory or from a secondary summary. Not checked against the source.
- **checked**: someone opened the source at the locator and the claim says what the source says.
- **reviewed**: a second reader has confirmed a checked claim.

## sources.csv

| Field | Meaning |
| --- | --- |
| `source_id` | Stable slug |
| `citation` | Author, title |
| `kind` | `text`, `inscription`, `coin`, `record`, `census`, `modern-study` |
| `date` | When it was written or compiled |
| `bucket` | `yes` for a placeholder that stands for many sources. Only seed claims may cite a bucket |
| `read_at` | Where it was read |
| `note` | Anything a reader of the citation should know |

## groups.csv

The leads of the overview. A group has a `group_id`, a short `name` that has to fit on the map beside its neighbours, a `parent`, a `story` of one or two sentences shown when the group is opened, and a `status`.

A group can hold groups. A group with a blank `parent` is a top-level lead: the world view shows these, about thirty at a time. Every other view shows the level below. Opening a group unfolds it by one level. Only entries of type `people` belong to groups, an entry names its innermost group, and a group needs at least two members, counting child groups. Where an ancient collective exists (Belgae, Armorica, Aquitani, Celtiberians), the group uses it. The rest are modern conveniences and say so in their story.

## views.csv

The views the reader can switch between: `view_id`, `name`, `parent`, a box (`west`, `south`, `east`, `north` in degrees; `east` may pass 180 for a view that crosses the date line) and a `projection`, `equal-earth` or `local`. The view with no parent is the world. Its children are the first step of the switch and their children the second.

## periods.csv

Period names and captions, keyed by view: `view_id`, `year_from`, `year_to`, `name`, `jump_year` (where the period buttons land) and `caption`. A view's periods run from 1 to the present without a gap. A view with none uses its parent's.

## events.csv

Dated events that mark the slider: `view_id`, `year`, `label` and `status`. A view with none uses its parent's. They are a seed like everything else: about a dozen per view, typed from memory, each a date sure enough to print. A tap near a mark lands on it and the label shows beside the year.

## parts/

Everything outside the first seed of Europe is authored as one file per part of the world, `parts/partN.py`, and merged into the tables by `tools/add_part.py`. `docs/authoring.md` describes the format. Edit the part file and apply it again; do not edit a part's rows in the CSV by hand. `tools/wash_check.py` finds land with no language wash.

## links.csv

Succession and naming links between entries. `relation` is one of `continues`, `name-continues`, `merged-into`, `absorbed-by`, `split-from`. A link has its own sources and status, because a claim of continuity is a claim.

## Rules the validator enforces

| Code | Rule |
| --- | --- |
| E01 | IDs are unique |
| E02 | A claim or link points at an entry that exists |
| E03 | Enumerated fields hold a known value |
| E04 | `lon` and `lat` are numbers |
| E05 | The point is on the globe, inside `REGION_BBOX` |
| E06 | Years are whole, non-zero, in order and in range |
| E07 | A `range` claim has a radius above zero |
| E08 | Every claim has at least one source and every source exists |
| E09 | A checked or reviewed claim has exactly one source, that source is not a bucket, and the locator is filled |
| E10 | Every entry has at least one claim |
| E11 | `entered_on` is a date |
| E12 | A group has a name and at least two members (peoples or child groups), and is not its own ancestor |
| E14 | An event has a year inside the survey and a label |
| E13 | A view has a box with west < east and south < north. A period has a name, a caption, and a jump year between its dates |

It also prints a note for every group of entries that share a name, so the separate records stay visible.
