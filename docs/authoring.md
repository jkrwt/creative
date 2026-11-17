# Authoring a part of the world

Each part of the world is one file, `parts/partN.py`. It holds a single Python literal, a dict. `tools/add_part.py` reads it with `ast.literal_eval` and merges it into `data/*.csv`. The file is the record of the part, so edit the file and apply it again; never edit the CSV rows a part owns by hand.

```
python3 tools/add_part.py parts/part3.py --check    # validate, write nothing
python3 tools/wash_check.py parts/part3.py          # find land with no language wash, write nothing
python3 tools/add_part.py parts/part3.py            # merge into data/
```

## How the map uses what you write

- **The wash** is the base layer: entries of type `language`, the language most people spoke on that ground. It must cover all the land of your regions in every year from 1 to 2026. Land with no wash is dark, and a reader takes dark land for empty land.
- **Peoples** (type `people`) are drawn brighter over the wash: named peoples, kingdoms, confederations and early states.
- **States** (type `polity`) are lettered only. No fill, no border.
- Every claim is a soft circle: a centre, a radius in km, a first and last year. The field is brightest at the centre and has faded out at about 1.2 times the radius (1.3 for `r`, 1.45 for `i`). Cover an odd shape with several circles. Circles of the same entry merge. Where two entries overlap the stronger wins and the seam blends.
- A claim fades in and out over about 20 years on either side of its dates. When one claim of an entry replaces another, end the first and start the second in the same year.
- **A field stays inside the regions its entry lists.** Regions are cut along present-day country borders (`REGION_LIST` in `atlas/model.py`, cut by `REGION_SPEC` in `tools/coast.py`). A circle centred in Iran does not light Iraq unless the entry lists `mesopotamia` too. Join regions with `+`. The sets in `REGION_SETS` are shorthands.
- **Groups** fold peoples into leads. The world view shows top-level groups. Opening one shows its child groups, and opening a child shows its peoples. A group's colour is that of the commonest family among its members.

## The file

```python
{
 "part": 3,
 "regions": ["indus", "hindustan", "bengal", "deccan", "lanka"],     # the regions whose wash this part owns
 "sources": [
   # (source_id, citation, kind, date, bucket, note)      kind: text inscription coin record census modern-study
   ("xuanzang", "Xuanzang, Records of the Western Regions", "text", "646", "no", ""),
   ("indian-inscriptions", "Inscriptions of South Asia", "inscription", "3rd century BCE onward", "yes",
    "Bucket. A checked claim cites the inscription."),
 ],
 "groups": [
   # (group_id, name, parent, story)     parent "" makes a top-level lead for the world view
   ("indian-kingdoms", "Indian kingdoms", "", "One or two plain sentences shown when the group is opened."),
   ("deccan-kingdoms", "Deccan kingdoms", "indian-kingdoms", "..."),
 ],
 "entries": [
   # (people_id, name, type, family, family_inferred, region, group, [claims])
   # claim: (lon, lat, radius_km, year_from, year_to, open_end, class, "source;source", note)
   #   open_end 1 when the entry continues to the present (year_to is then 2026)
   #   class "a" attested, "r" reconstructed, "i" indicative
   ("tamil-speakers", "Tamil", "language", "tamil", "no", "deccan+lanka", "", [
     (78.5, 10.5, 330, 1, 2026, 1, "a", "sangam-poetry;indian-inscriptions", "Tamil has been written in the far south since before 1 CE."),
     (80.6, 9.2, 120, 1, 2026, 1, "r", "indian-inscriptions", "Northern Sri Lanka."),
   ]),
   ("cholas", "Cholas", "people", "tamil", "no", "deccan+lanka", "deccan-kingdoms", [
     (79.1, 10.8, 160, 1, 280, 0, "a", "sangam-poetry", "The early Cholas of the Kaveri delta."),
     (79.3, 11.0, 420, 850, 1279, 0, "a", "indian-inscriptions", "The imperial Cholas, who raided as far as Sumatra in 1025."),
   ]),
   ("mughal-empire", "Mughal Empire", "polity", "", "no", "india", "", [
     (77.5, 26.0, 900, 1526, 1707, 0, "a", "persian-chronicles", "Founded by Babur in 1526."),
   ]),
 ],
 "more_claims": [("existing-people-id", [ ...claims... ])],     # add claims to an entry that already exists
 "region_edits": [("existing-people-id", "balkans+italy+anatolia")],
 "group_edits": [("existing-group-id", "new-parent-id")],
 "member_edits": [("existing-people-id", "group-id")],
 "links": [("from_people", "to_people", "continues", 1206, "source", "note")],
 # relation: continues, name-continues, merged-into, absorbed-by, split-from
 "periods": {
   # view_id: [(year_from, year_to, name, jump_year, caption)]   contiguous, first starts at 1, last ends at 2026
   "southasia": [(1, 320, "Kushans and Satavahanas", 150, "Two or three plain sentences on who lived where and what changed."), ...],
 },
}
```

## Rules

1. **Wash first.** Write the language entries before anything else and run `tools/wash_check.py` until it reports no dark points. A wash claim over thinly peopled land (desert, tundra, ice, high mountains) is class `i` with a wide radius, and its note says the land was thinly peopled.
2. **Grain.** Ten to thirty named peoples or states alive at each of 1, 500, 1000, 1500, 1800 and 2026, folded into three to six child groups under one to three top-level leads. Do not go finer than that. District-level names do not belong on this map.
3. **Honesty.** Everything here is typed from memory and is a seed. Never write a locator, page, inscription number, census count or web address. Name a source at the level you are sure of. A broad source is a bucket (`bucket` "yes") and its note begins "Bucket." Where the evidence is archaeology or reconstruction from languages, class the claim `r` or `i`, name an archaeological culture as a culture (for example "Lapita culture"), and say in the note what the evidence is. Set `family_inferred` to "yes" wherever the language of a people is assumed.
4. **Names.** Use the name a people uses for itself where one is established in English (Diné, Haudenosaunee, Mapuche, Māori, Khoekhoe, Amazigh in the note), give the older outside name in the note, and never use the word "tribe" in a name. Keep names short: a lead has to fit on the map.
5. **Peoples are fields and only states have borders.** Do not invent a boundary. Do not trace or reproduce any published map.
6. **Disputed territory today.** Do not settle it. Say in the note that sovereignty is disputed.
7. **A shared name does not merge two records.** Give every entry its own id. Ids are lower-case slugs, unique in the whole atlas: check `data/peoples.csv`, `data/groups.csv` and `data/sources.csv`. Sources that already exist there can be cited without adding them again.
8. **Families.** `family` is a key of `FAMILIES` in `atlas/model.py`. Do not add families. A polity's family may be blank. A people gets the family of the language its people spoke; where rulers and ruled differed (Normans over English, Turks over Persians) give the people entry the rulers' language and let the wash carry the population's, which the map then stripes.
9. **Writing.** Notes, stories and captions are plain sentences. No em dashes. One or two sentences in a note, at most 45 words in a caption. A caption says who lived where and what changed, and for early periods what kind of evidence there is.
10. **Dates.** Whole years, no year 0. A claim's years are the years it is drawn for.
11. **Colonial and world languages.** Where a language arrived from another part of the world (Spanish, English, Russian, Arabic), make a separate language entry for your regions with its own id, for example `spanish-americas`, and use the existing family key.
