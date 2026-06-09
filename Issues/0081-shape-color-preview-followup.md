# Colors/Adjust/Shape/Preview follow-up

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

Close the requested follow-up UI and editing fixes for Colors placement, Brand kit button removal, preview zoom stability while dragging off-canvas objects, Japanese distribution labels, additional shape choices, non-rect corner radius rendering, and Adjust color/opacity controls.

## Acceptance Criteria

- [x] Colors tab places the palette-pattern dropdown to the left of the color wheel.
- [x] Colors tab no longer renders Brand kit Primary, Accent, or Shadow registration buttons.
- [x] Dragging a preview object outside the document does not change the displayed zoom or effective canvas scale.
- [x] Layers distribution buttons have Japanese labels in Japanese UI.
- [x] Shape choices include Diamond, Pentagon, Hexagon, and Star in addition to existing shapes.
- [x] Corner radius affects polygon shape rendering, not only rectangles.
- [x] Adjust no longer exposes the overall layer Opacity control.
- [x] Adjust no longer exposes separate Fill opacity and Stroke opacity sliders for text/shape styles.
- [x] Adjust Fill and Stroke color displays open the same palette-wheel and Sketch-style color picker UI with alpha support.

## Evidence

- `npm test`: pass. 26 test files, 98 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4198/thumbnail-generator/`.
- Runtime gate confirmed palette dropdown before the wheel, `.brand-color-actions` count `0`, old palette strip count `0`, expanded shape options, removed Adjust opacity sliders, Fill and Stroke color picker dialogs, stroke color change to `#C7D435 / 100%`, off-canvas drag zoom stability from `94%` to `94%`, WebP export, mobile nonblank canvas, and mobile horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-shape-color-followup-desktop.png`
  - `docs/assets/runtime-20260609-shape-color-followup-mobile.png`

## Notes

- Browser-local Brand kit data remains compatible with saved states, but Colors no longer exposes direct Brand kit color registration buttons.
