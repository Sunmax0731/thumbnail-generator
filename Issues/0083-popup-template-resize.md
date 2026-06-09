# Popup color picker and template list resizing

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

Close the requested follow-up for Adjust color picker placement, clearing selection from the preview area outside the output frame, and resizing both Default templates and Browser templates lists.

## Acceptance Criteria

- [x] Adjust Fill/Stroke color displays open a popup-style color picker instead of expanding inside the Adjust tab.
- [x] The color picker popup can be moved by drag and drop.
- [x] The popup keeps the compact single-color Sketch-style picker with alpha and no palette wheel.
- [x] Clicking the preview area outside the output document clears the selected object when pan mode is not active.
- [x] The Default templates display area can be resized with a visible handle.
- [x] The Browser templates display area can be resized with a visible handle.
- [x] The resize handles also support Arrow Up/Down keyboard adjustment.

## Evidence

- `npm test`: pass. 26 test files, 98 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4200/thumbnail-generator/`.
- Runtime gate confirmed fixed-position color popup, draggable popup movement, Sketch picker count `1`, palette wheel count `0`, selection row count changed from `1` to `0` after clicking outside the output frame, Default templates list height changed `260 -> 332`, Browser templates list height changed `220 -> 166`, nonblank `1280x720` canvas, mobile horizontal overflow `0`, and no page errors.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-popup-template-resize-desktop.png`
  - `docs/assets/runtime-20260609-popup-template-resize-mobile.png`
