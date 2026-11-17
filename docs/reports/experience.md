# Making the map better to use: an assessment

Written 17 November 2026 at the owner's request, with God's Eye View (github.com/bilawalsidhu/gods-eye-view) as a reference. Nothing here is built yet. It is a ranked list of what to change and why.

## Where the map falls short today

These come from using the page and from its code, not from testing with readers.

1. **A tap does not pick what is under the finger.** The viewer picks the nearest claim centre within 34 pixels. A tap on the edge of a large field picks nothing, or a small neighbour. The viewer already knows which entry owns every cell, so it can answer exactly.
2. **Nothing responds to a pointer on a desktop.** There is no hover name, and the cursor is a crosshair everywhere.
3. **There is no way to find a people.** 1,950 entries, and the only route to one is to guess its year, view and group.
4. **The slider is blunt.** 2,026 years on one track is about half a pixel a year on a phone. There are no marks for events, the period strip under it cannot be tapped, and arrow keys move one year at a time.
5. **A selected people does not show when it lived.** The card says "about 850 to 1279". The slider does not show that span, and nothing offers to jump to its start or end.
6. **Succession is in the data and not on the page.** 190 links say who continued, merged into or split from whom. The card never shows them.
7. **The view cannot be shared.** Year, view, open group and selection are lost on reload, and a link cannot point at "the Sahel in 1350".
8. **Views are fixed frames.** There is no pan or zoom. A reader who wants the Gulf of Guinea a little closer has no way to ask.
9. **Labels flick on and off while the year moves.** Each frame decides afresh which labels fit, so a name can appear, vanish and return within a second of play.
10. **The page is long on a phone.** The story is above the map and the slider below it, so the year and the map are rarely on screen together, and the card covers part of a small map.
11. **The map opens without a word.** A first-time reader lands on the world at 150 CE with no hint that groups open or that the slider is the point.
12. **The contours animate all the time**, which costs battery, though the Motion button and the reduced-motion setting stop them.
13. **The two great stories are not told as stories.** The Bantu expansion and the settlement of the Pacific are there for a reader who scrubs the right view at the right speed.

## What God's Eye View does

It is a different kind of thing: a live 3D globe of flights, ships and satellites, built on CesiumJS, Vue and a server, with a heap of about 105 MB at start. Almost none of its machinery fits a single self-contained page. Its interaction ideas do.

Worth borrowing:

- **A timeline with labelled marks that snap.** Its track carries marks for dated events. A tap near a mark lands on it, and arrow keys step from mark to mark. Wheel or pinch zooms the track around the handle, and a double-tap shows the whole span again.
- **One shared clock.** Every layer reads one time from one module. Ours has a single `year` already; the lesson is to keep it that way as layers are added.
- **Label hysteresis.** Labels fade in over 150 ms and out over 300 ms, live at least 2.5 seconds, and wait 1.2 seconds before coming back, with a budget per 32-pixel cell of screen. That is what stops flicker.
- **The address follows the view.** Camera, layers and selection live in the hash and update as you move, so any moment can be shared without a server.
- **Redraw only when something changes.**
- **A phone shell with one bottom sheet at a time**, closed by a swipe down, with focus moved into the sheet and back.
- **A touch that misses looks nearby** before giving up.
- **A first-run choice** of where to start, skipped by a shared link and dismissible for good.
- **Stories**: scripted scenes with chapters.
- **A loading indicator that waits** 160 ms before showing, so fast loads never flash one.

Not for this map:

- The military cockpit look, detection boxes and the night-vision and thermal shaders. The owner asked for cool colours and a calm, print-atlas feel.
- Split-flap and sonar motion. The map's only motion should be the fields.
- Voice, AI summaries and live feeds. They need a server and outside requests, and the page makes none.
- A 3D globe. Equal Earth shows the whole world at once, which a globe cannot, and a people's extent reads truer on an equal-area map.

## What I would build, in order

Ranked by what a reader gains against what it costs and risks. The first five are small and do not touch the look.

| # | Change | Why first | Cost |
| --- | --- | --- | --- |
| 1 | **Pick by field, and name on hover.** A tap or hover asks the grid which entry owns that cell. Hover shows the name in a small label by the pointer; a missed touch searches nearby. | Fixes the most basic interaction. The data is already in memory. | Small |
| 2 | **Search.** A box that finds a people, state, language or group by name, and on choosing one sets the year to the middle of its life, moves to the smallest view that holds it, opens its group and selects it. | The only way most of the 1,950 entries will ever be found. | Small to medium |
| 3 | **A better slider.** The period strip becomes buttons. Marks for a dozen dated events per view sit on the track and snap. Left and right step ten years, with Shift a hundred, and Page keys step a period. A selected entry's lifespan is drawn on the track, and the card offers "first appears" and "last appears". | Time is the point of the map and the weakest control. | Medium. Needs a small table of dated events per view, which is new seed data. |
| 4 | **Succession in the card.** "Continues as", "merged into", "split from", each a button that selects the other entry and moves the year. | The data exists and is invisible. | Small |
| 5 | **The address follows the view.** Year, view, open group and selection in the hash, restored on load. | Makes every moment shareable. | Small. Unverified: whether the hosted artifact page lets a script read and write its hash. It works for the page opened as a file or served. |
| 6 | **Label hysteresis.** Labels fade, and a label that has appeared keeps its place for a second or two unless something stronger needs it. | The single largest gain in calm during play. | Medium. The label pass has to remember the last frame. |
| 7 | **Stories.** Four or five guided tours, each a list of chapters: a view, a year, a sentence, and Next. Start with the Bantu expansion, the settlement of the Pacific, the Arab conquests, the steppe from the Xiongnu to the Mongols, and the Americas before and after 1492. | Tells the stories the map exists to tell, and doubles as onboarding. | Medium. Mostly writing. |
| 8 | **Phone layout.** The year and a compact slider pinned under the map so both stay on screen. The card, the legend and the list become one bottom sheet, one at a time, closed by a swipe. | Phone was the least-checked surface in the world job. | Medium to large |
| 9 | **Free pan and zoom.** Drag to pan and pinch or wheel to zoom inside the current view, with the view buttons as presets and a reset. | What readers expect of a map. | Large. The field grid, the region raster and the coast are rebuilt on every view change today, which takes too long to do on every drag frame. It needs a cheaper path first. |
| 10 | **Draw only when something changes**, with the contour drift as an option. | Battery. | Small, but it removes motion the owner asked for, so it is the owner's call. |

Two further ideas that came from the audit, not from the reference:

- **An evidence switch.** One control that dims everything not classed attested, so a reader can see at a glance how much of a view rests on written record. This is the map's honesty made visible, and it is cheap.
- **Compare two dates.** Hold one year and scrub another, with the held year as a ghost outline. This was in the first brief as "if time allows".

## What I would not do yet

- Pan and zoom before items 1 to 6. It is the largest change and the others make the fixed views good enough to judge whether it is still wanted.
- Any change to the look, until a reader has used items 1 to 5.

## Decisions for the owner

- Whether to start on items 1 to 5 as one job.
- Whether the contour drift may stop when nothing else is moving (item 10).
- Whether stories should open the page for a first-time reader, or sit behind a button.
