# Job: make the map smooth and fast

Dated 17 November 2026, after `2026-11-17-world-zoom.md`. The owner: "It is super laggy. Figure out how to make it smoothly and faster". This file is the scope. Work outside it goes in Findings.

## What was slow, and why

Measured in headless Chromium on a 390 by 844 page at two device pixels per pixel, with the processor slowed four times to stand in for a phone.

1. **Every frame copied five full-size pictures.** The base, the fields, a land mask, the coastline and the names were laid over each other in one canvas, about thirty times a second, whether or not anything had changed.
2. **The legend and the lists drew each symbol in its own small canvas.** A page held several hundred. Their mere presence made every update of the page slow, and Play rebuilt them constantly.
3. **Redrawing the map after a pinch or a change of view took 0.4 to 1.6 seconds.** It traced every region outline at full size, and read one picture back per region, 74 times.
4. **The names were placed afresh on every frame.**

## What changed

- **The map is four stacked pictures**, and the browser lays them over each other: the still base, the small field picture stretched to fit, the sea and coastline with the land cut out, and the names. A frame now changes only the small field picture. The glide still gets one whole picture, put together when it starts.
- **Symbols in the legend and lists are vector shapes**, made from the same outlines as the symbols on the map.
- **Regions are painted into one small picture and read once.** Each region is painted in a colour that spells its number. A cell where two regions blend into a third number is found by its neighbours and filled from them.
- **Surveyed land is filled in one go.** Only land outside the survey is hatched, and its shape comes from the grid.
- **Coastline points closer than a third of a pixel to the last one are skipped.** Three points of every ring are always kept, so small islands stay.
- **Each claim's place on the screen is worked out once** per redraw, not on every frame and every update.
- **The fields are repainted only as often as the device can afford**: painting may take a quarter of the time at most. They are not repainted while fingers are on the map, while the page scrolls, or when the map is off the screen.
- **While the year runs**, names are placed a few times a second and the lists below the map catch up twice a second. Playback now keeps its pace of sixty years a second on a slow device.

## Measured

Same page, processor slowed four times. Before is `main`.

| | Before | After |
| --- | --- | --- |
| Redraw the world view | 1,578 ms | 617 ms |
| Redraw Africa | 564 ms | 334 ms |
| Redraw East Asia | 429 ms | 319 ms |
| Update the page for a new year | 24 to 65 ms | 7 to 26 ms |
| Frames a second at rest, motion on | 10 to 14 | 52 to 58 |
| Frames a second while playing | 4 | 17 |
| Year reached after six seconds of Play from 150 | 300 | 533 |

Without the slowdown the page holds 60 frames a second at rest and while playing, and a redraw takes 70 to 130 ms.

## Gates

1. Tests pass.
2. `tools/ux_check.js` and `tools/zoom_check.js` run with no page error.
3. The picture is the same as before: screenshots compared and looked at.

## Findings

- **Verified.** 31 tests pass and the validator reports no errors. Both browser checks ran with no page error; the zoom check still sees the transform set in the middle of each gesture and gone after it. Screenshots of the world, Africa and Oceania on a phone width and a desktop width were compared with `main` pixel by pixel: at most 0.1 percent of pixels differ by more than a tenth of full scale. Looked at: the phone world view, the phone view after zooming in, a desktop frame in the middle of a glide, and the full phone page with the new symbols.
- **Not verified.** A real phone. The numbers come from a browser with no graphics card, slowed by a fixed factor. A phone has a graphics card, so the old copying may have cost less there than it did here, and the gain may be smaller or larger than the table says. Safari on iOS was not tried. The glide was looked at as one frame, not watched.
- **Known limits.** On a slow device the contours now move in fewer steps a second, since painting is held to a quarter of the time. Names can lag the year by up to about half a second during Play. A redraw after a pinch still takes a third to two thirds of a second in the slowed test; most of what is left is filling the coastline and the field grid.
- **Kept for the next session.** `window.__atlas.bench()` returns the time each kind of work takes on the device in hand. Run it in the console on a real phone to replace the numbers above.
