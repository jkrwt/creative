# Job: a modern look

Dated 17 November 2026, after `2026-11-17-world-use-1-to-5.md`. The owner sent a phone screenshot of the world view and said: "Apply mastery of gestalt principles, visual and motion design, and storytelling. Improve the look. It looks like 90s encyclopedia Britannica right now. Vibe should exude modern confidence, momentum, builder energy." This file is the scope. Work outside it goes in Findings.

## What was wrong in the screenshot

- The map, the point of the page, was a strip 160 pixels tall under a screen of text.
- Names on the map were italic serif capitals, the print-atlas lettering of the first brief. That is where the encyclopedia came from.
- Engraved rings round every coast, soft glowing blobs and a heavy vignette read as old and decorative.
- Nothing on the page said "start here". Every control had the same weight.

## What changed

**Hierarchy and grouping**
- The year is the largest thing on the page, set tight in a grotesk, with the period beside it as a tag.
- On a narrow screen the order is: search, where, the year, the map, the timeline that drives it, then the story. The map is never shorter than 56 percent of the screen: where a view is wider than that allows, the map runs on sideways and is dragged.
- On a wide screen the year and its story share one row above the map.
- One accent, an acid lime, marks the one thing to do (Play), the place you are (the active period, the current event) and nothing else.
- The view switch is a single strip of pills that scrolls and never wraps. The second step is quieter than the first.
- Panels have one-pixel edges and small radii. Headings are small mono capitals.

**The map**
- Names are upright grotesk: leads bold capitals, peoples semibold capitals, languages plain lower case, states wide-spaced capitals.
- The sea carries a faint graticule and one soft glow at the coast, in place of five engraved rings.
- Fields are flatter. Washes of one family sit close in colour and hold their strength to the edge, so a continent reads as a few clear fields and not as overlapping bubbles.
- The vignette is halved.

**Motion**
- Controls answer in 120 milliseconds. Play is labelled with its glyph. No new motion was added to the map.

## Rules of the first brief this replaces

`docs/jobs/2026-11-16-stage-0-and-1.md`, "The look", still holds except where the owner's new direction overrides it:
- "Lettering follows print atlases" and its italic serif: replaced by the grotesk above.
- "The sea is near black with engraved waterlines": the sea is still near black; the rings are gone.
- "The story comes before the picture": still true on a wide screen. On a narrow one the year comes before the picture and the caption after the timeline, so the map is on the first screen.
- "Contour lines follow each field": still there, fainter.

Everything about meaning is unchanged: colour and shape for language, stripes for two languages on one ground, stipple for loose placement, hatching outside the survey, nothing drawn over the sea, labels never overlapping.

## Gates

1. Tests pass and the validator reports no errors.
2. `tools/ux_check.js` runs with no page error.
3. Phone and desktop screenshots have been looked at.

## Findings

- **A bug found on the way.** After two resizes to the same size the map drew its labels and no fields, because the field cache thought nothing had changed while its arrays were new and empty. A phone that fires a second resize could hit it. Fixed.
- **Verified.** 31 tests pass. `tools/ux_check.js` ran with no page error. Looked at: the world and Africa on a 390 pixel phone width, the Americas full page on the phone width, the world and Europe on a desktop width. Colouring time on East Asia is unchanged at about 17 to 20 ms in headless Chromium.
- **Not verified.** A real phone: the tests emulate one, and the first emulation lied because the page opened as a file has no viewport tag, which the hosted page supplies. Text contrast of the lime tag and the muted grey was chosen to pass 4.5 to 1 and was not measured. Screen readers. The legend, key and list panels were restyled and looked at only in passing.
- **Judgement calls the owner may want to reverse.** The accent colour. Moving the caption below the timeline on phones. Dropping the engraved coast. The sideways drag on phones, which is new behaviour: a first-time reader may not find it, though the hint under the timeline says so.
- **Not done.** Label hysteresis, stories and the full phone sheet layout from `docs/reports/experience.md`. Momentum on the map itself would come mostly from those.
