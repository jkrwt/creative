# Job: check the seed, starting with the Americas and Africa

Dated 17 November 2026, after `2026-11-17-the-whole-world.md`. The owner's instruction: "check the seed, starting with the Americas and Africa". This file is the scope. Work outside it goes in Findings.

## What is being checked

The world seed was typed from memory by eight writers and merged without a line-by-line read. `docs/reports/world.md` names its weak points. This job takes the first two steps it recommends, for part 7 (the Americas) and part 6 (Africa south of the Sahara):

1. **Class.** A claim is attested only when a contemporary written source names the entry at a place that can be located. `tools/audit.py` holds, per region, the first year such sources exist (`WRITTEN_FROM`), and reports attested claims that start earlier. Exceptions are listed in the part file under `attested_early` and justified in the part's report.
2. **Grain.** No more than 60 peoples and states alive in a part at any keyframe, and no more than 14 members alive in any one group. The first brief asked for ten to thirty per keyframe; 60 is the ceiling this job set for parts that span a continent or two. Entries removed are listed in the part's report so they can be restored when the map goes finer.
3. **Facts.** Dates, centres and names of the entries kept, checked from knowledge and, for a stated number of entries, against pages on the web.

## What this job does not do

- It does not set any claim to `checked`. That status needs one named source opened at a locator, which is Stage 1c work. Everything stays `seed`.
- It does not write locators, counts or addresses into the tables. Addresses of pages that were read appear only in the reports.
- It does not touch the language wash except where a fact in it is wrong.

## Gates

1. Tests pass, the validator reports no errors, and `tools/wash_check.py --all` reports only islands before their first settlement.
2. `tools/audit.py` passes for parts 6 and 7.
3. Screenshots of Africa and the Americas at the six dates have been looked at after the change.
4. Each part has a report in `docs/reports/` that says how many entries were looked up on the web and lists what was not checked.

## Next

Parts 1 to 5 and 8 in the same way, then Europe's first seed. Then Stage 1c proper: one source and one locator per claim.

## Findings

Run on 17 November 2026. The detail is in `docs/reports/seed-check-part7.md` and `docs/reports/seed-check-part6.md`.

- **Class was less wrong than the world report said.** That report pooled all dates and called 40 to 65 percent attested too high. By date, almost no early claim was classed attested: none before 500 in the Americas and 5 percent in Africa. 22 claims in the Americas and 11 in Africa broke the rule. In the Americas 5 were demoted and 24 split at the year records begin; in Africa 3 were demoted and 24 split. Four entries are recorded exceptions: the two Norse Greenland entries, and Swahili and Kilwa.
- **Grain was the real fault.** The Americas went from 278 entries to 169 (109 removed) and Africa from 231 to 191 (40 removed). Peoples and states alive at the six keyframes are now 22, 31, 40, 54, 60, 60 in the Americas and 19, 26, 36, 52, 60, 57 in Africa. Every removal is listed in the part's report. The language wash was kept whole.
- **Facts.** The checkers looked up 60 entries in the Americas and 62 in Africa, plus two wash entries. Twelve facts were corrected in the Americas; Africa's corrections are tabled in its report. A lookup here means a search excerpt carried the fact: neither checker could open most pages in full, so this is weaker than reading the source. The rest of each part was checked from memory only.
- **Still a seed.** No claim is `checked`. No locator was written.
- **Not done by me.** I applied both parts, ran the gates and looked at the screenshots. I did not read the two part files or the two reports line by line.
- **Gates.** 1 holds: 30 tests pass, the validator is clean, and the dark-land check reports only islands before settlement. 2 holds. 3: the Americas at six dates and southern Africa at 1800 were looked at on a desktop width; Africa's six-date sheet was captured and not opened, and no phone width was looked at. 4 holds.
- **Tools changed.** `tools/audit.py` is new. `tools/add_part.py` now removes entries and empty groups a part has dropped. Three tests catch two parts using the same entry or group id, or wording a shared source differently.
- **Open.** Part 5 (Southeast Asia and the Pacific) is over the grain ceiling from 1500 on: 62, 74 and 77 alive. Parts 1 to 4 have no `WRITTEN_FROM` years yet, so the class rule does not test them. Click letters in two San names (Ju|'hoansi, G|ui and G||ana) have not been seen drawn in the map font.

### Second round: parts 1 to 5 and 8

Run the same day at the owner's instruction, with the ceiling kept at 60. One report per part in `docs/reports/`.

| Part | Entries before | after | Class changes | Entries looked up on the web |
| --- | --- | --- | --- | --- |
| 1 Near East and North Africa | 204 | 202 | 15 split | 102, plus 9 wash entries |
| 2 Iran and Central Asia | 169 | 166 | 5 split, 4 demoted | 52 |
| 3 South Asia | 186 | 185 | 13 split, 1 demoted | 97, of which 89 gave a usable result |
| 4 East Asia | 187 | 187 | 11 split, 2 demoted | 50, plus 10 wash entries |
| 5 Southeast Asia and the Pacific | 204 | 176 | 17 split | 83 |
| 8 Australia and New Guinea | 111 | 110 | 7 split | 46 |

- **Grain.** Only part 5 was over the ceiling. It now shows 56, 60 and 54 alive at 1500, 1800 and 2026. The audit passes for all eight parts.
- **Faults the check found beyond class and grain.** The wash for outer Fiji, Yap, Kosrae, Santa Cruz and southern Vanuatu was dark in every year; the grid check has no sample point on small islands and had missed it. Greek washed the Turkish Aegean coast after 1923. Cyprus was wrong around 1974. All three are corrected.
- **A colour clash found by looking.** Pama-Nyungan ochre and English orange were the same hue, so Australia in 2026 read as if English had never arrived. Pama-Nyungan is now red ochre and the other Australian families olive.
- **Left for the owner.** The Tasmania group is gone: Bass Strait Islanders were folded into Palawa, which now sits in the south-east group. The checker called this the change most worth reversing. The Guanche wash still starts at 1 though settlement of the Canaries is put between the 1st and 4th centuries, because starting later leaves the islands dark. The checker of part 2 holds that `WRITTEN_FROM` is too late for the steppe (550) and the upper Yenisei (1580); the tool is unchanged.
- **Not checked.** In East Asia, the pace of Chinese replacing other languages in the south and the frontier wash in the Ordos, Hexi and Liaodong. In each part some split years and dates stand from memory; each report lists them. Mer in the Torres Strait draws a label and no field because the coast file has no land there.
- **How strong a lookup is.** As before: most pages could not be opened in full, so a lookup means a search excerpt or summary carried the fact.
- **Not done by me.** I applied each part, ran the gates and looked at screenshots. I did not read the six part files or reports line by line.
- **Screenshots looked at after the change**, desktop width, six dates each: Southeast Asia, the Near East, Iran and Central Asia, South Asia, East Asia, Australia. Captured and not opened: Oceania, the world, and one phone-width page.
- **Totals now.** 1,915 entries, 3,536 claims, 213 groups. Everything is still a seed.
