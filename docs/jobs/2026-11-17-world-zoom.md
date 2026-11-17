# Job: pinch, drag and zoom

Dated 17 November 2026, after `2026-11-17-world-zlook.md`. The owner: "Should be able to use finger spreads and pinches to zoom etc on mobile". This file is the scope. Work outside it goes in Findings.

## What is built

- **Two fingers** pinch to zoom and move the map any way.
- **One finger** slides the map sideways. Up and down are left to the page, so the page still scrolls when a thumb lands on the map.
- **A mouse** drags the map any way. The wheel zooms with Ctrl or Cmd held, which is also what a trackpad pinch sends. A plain wheel still scrolls the page.
- **Three buttons** on the map: zoom in, zoom out, and back to the whole view. They are the keyboard and screen-reader route.
- Zoom runs from the whole view to eight times closer. Choosing a view, opening a group, search and a shared address all start again from the view's own frame.

This replaces the sideways scroll the look job gave the phone. On a phone a wide view now opens on its middle at a working height, and a slide brings the rest.

## How it works

While fingers are down, the picture already on the canvas is slid and stretched with a CSS transform, which costs nothing. When they lift, the camera is updated and the map is drawn again at the new place: coast, regions and fields. `cam` in `site/atlas.js` holds the middle of the picture and its height in the view's projected units; `null` means the view's own frame.

## Gates

1. Tests pass.
2. `tools/zoom_check.js` and `tools/ux_check.js` run with no page error.
3. A phone-width screenshot before and after a pinch has been looked at.

## Findings

- **Verified.** 31 tests pass. `tools/zoom_check.js` ran thirteen steps with no page error: the plus button, a mouse drag, Ctrl and the wheel, a tap after zooming, the home button, and on a 390 pixel width a two-finger spread, a one-finger slide and a pinch back out, sent through Chromium's touch input. In each gesture the transform was set mid-gesture and gone after it. `tools/ux_check.js` still passes. Looked at: the phone before and after a pinch, and the desktop after zooming.
- **Not verified.** A real phone. Chromium's touch emulation is not Safari on iOS, where page zoom and edge swipes can compete with a map's gestures. How long the redraw takes on a phone when fingers lift: it is the same work as changing view, and was not timed on a device.
- **Known limits.** The picture is soft while fingers are down and sharp only when they lift. Zooming in does not unfold groups or show more names: it shows the same map closer. The camera is not in the shared address. Moving up and down on a phone needs two fingers.
- **Changed on the way.** The first limit let the map zoom far past anything it has to show. It is now eight times the whole view.
