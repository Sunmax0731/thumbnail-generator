# Image Lab, single-color picker, and OBS preview UI cleanup

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

Close the requested follow-up for Adjust shape ordering, single-color style picking, non-stretching preview output area, Image Lab entry and layout cleanup, and OBS preview capture behavior.

## Acceptance Criteria

- [x] Shape stroke width appears above the shape-kind dropdown in Adjust.
- [x] Adjust Fill/Stroke color displays open a single-color picker without the palette wheel or palette bars.
- [x] The preview canvas no longer renders or stretches an edit-only checker area around the output document.
- [x] Assets no longer shows a standalone Image Lab open button; Image Lab opens from imported asset rows only.
- [x] Image Lab no longer shows image import controls or an asset-selection dropdown.
- [x] Image Lab separates chroma-key settings from the processed-layer creation action.
- [x] The processed-layer creation button appears in the Image Lab modal header.
- [x] Chroma-key settings appear to the right of the position and size controls.
- [x] OBS preview opens as a popup-style canvas-only window and requests fullscreen to avoid browser/tab chrome where the browser permits it.

## Evidence

- `npm test`: pass. 26 test files, 98 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4199/thumbnail-generator/`.
- Runtime gate confirmed shape control order, single-color picker with `0` wheel and `0` palette bars, preview canvas dimensions `1280x720`, no standalone Assets Image Lab button, asset-row Image Lab button present, Image Lab source/import/select UI removed, header processed-layer button present, inline chroma settings present to the right of position/size controls, OBS preview document containing only one canvas and no page toolbar/header/nav, WebP export, mobile nonblank canvas, and mobile horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-imagelab-color-obs-desktop.png`
  - `docs/assets/runtime-20260609-imagelab-color-obs-mobile.png`

## Notes

- Browser tab/title-bar visibility in OBS Window Capture is ultimately controlled by the browser and OBS capture mode. The app now opens the preview with popup/no-toolbar features and requests fullscreen; the preview document itself contains only the animated canvas.
