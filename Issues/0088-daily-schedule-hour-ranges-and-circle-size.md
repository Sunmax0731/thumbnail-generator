# Daily schedule hour ranges and circle sizing

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-18
- Closed: 2026-06-18
- QCDS: Quality, Satisfaction

## Context

Daily schedule clock labels were generated as `0` through `23` around both AM and PM circles, causing labels such as `1` and `13` to overlap on the same circle. The portrait layout also placed daily circles left of center, and Day mode still showed grid-style and corner-radius controls that do not affect the AM/PM circle layout.

## Requirements

- Generate AM clock labels as `0` through `11`.
- Generate PM clock labels as `12` through `24`, with `24` placed so it does not overlap the `12` label.
- Center daily circles horizontally in portrait output.
- Replace the grid-style dropdown and corner-radius slider with a circle-size slider in Day schedule mode.
- Keep line width visible next to circle size for Day schedule mode.
- Preserve generated sector editability and start/end time synchronization.

## Acceptance Criteria

- [x] AM circle labels include `0` through `11` and exclude `12` through `23`.
- [x] PM circle labels include `12` through `24`.
- [x] Portrait daily circle `x` positions center the circle on the canvas.
- [x] Day schedule mode does not render the grid-style dropdown or corner-radius slider.
- [x] Day schedule mode renders circle size and line width sliders on the same row.
- [x] Automated tests cover clock label ranges and portrait circle centering/size.
- [x] Browser runtime gate validates the Day UI, portrait centering, generated labels, layer editing, and WebP export.

## Evidence

- `npm test` passed on 2026-06-18 with 35 files and 145 tests.
- `npm run build` passed on 2026-06-18.
- Playwright local Chrome runtime gate passed at `http://127.0.0.1:4424/thumbnail-generator/?runtime=daily-hour-ranges-20260618`.
- Runtime evidence confirmed Day mode hides Grid style and Corner radius, shows Circle size and Line width on the same row, dialog/grid vertical overflow `0`, AM labels include `0` and `11` while excluding `12` and `23`, PM labels include `12`, `13`, and `24`, PM `12` and `24` labels are separated, the portrait AM circle center is `540.5` on a `1080` canvas, sector start/end remain `270` to `330`, Start angle edits to `280`, WebP export `214864` bytes, mobile horizontal overflow `0`, and no page/app console errors. Evidence is under `output/runtime-20260618-daily-hour-ranges/`.
