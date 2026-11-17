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
