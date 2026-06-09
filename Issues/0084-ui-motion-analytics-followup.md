# ImageLab initial selection, deletion selection, analytics, Motion, and UI follow-up

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-09
- Closed: 2026-06-09
- QCDS: Quality, Satisfaction

## Context

Close the requested follow-up for Image Lab initial range state, deletion selection behavior, GitHub Pages analytics, Colors rows, Motion multi-set editing, export placement, and header copy.

## Acceptance Criteria

- [x] Image Lab opens with no cutout range selected by default.
- [x] Deleting the only selected layer leaves the editor with no selected layer instead of selecting another object.
- [x] Google Analytics tracking is present for the GitHub Pages build using the same Sunmax0731 Pages measurement ID.
- [x] Registered single-color rows no longer display the Fill label or color code while retaining the secondary row.
- [x] Saved palette color rows match the registered single-color row rhythm and show the palette color code while palette deletion stays in the palette header.
- [x] Motion direction is disabled for animation types that do not use direction.
- [x] One layer can store and preview multiple ordered motion sets.
- [x] The top header quality slider is removed and export uses maximum quality.
- [x] The preview-pane Generated layout section is removed from the GUI.
- [x] PNG/JPG/WebP export buttons are moved beside the preview-pane Edit state section.
- [x] The header subtitle is removed and the app title is `サムネイル作成支援サービス`.

## Evidence

- `npm test`: pass. 26 test files, 99 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4210/thumbnail-generator/`.
- Runtime gate confirmed title/header `サムネイル作成支援サービス`, no header subtitle, no Generated layout section, no Quality label, GA config `G-1LR6HRMGXE` with two analytics scripts, nonblank canvas, Image Lab default `範囲なし` with range sliders disabled, selected layer count `1 -> 0` after delete, registered single-color row text `線 / White / 100%` with no visible `Fill` or HEX code, saved palette color code `#10b6d7`, Motion direction disabled for Fade and enabled for Slide, two motion-set buttons after Add motion, WebP export download, mobile nonblank canvas, mobile overflow `0`, and no page errors.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-ui-motion-analytics-desktop.png`
  - `docs/assets/runtime-20260609-ui-motion-analytics-mobile.png`
