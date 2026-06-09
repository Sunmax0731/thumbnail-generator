# Layers/Assets quick add relocation and collapse

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-09
- Closed: 2026-06-09
- QCDS: Quality, Satisfaction

## Context

Move quick layer creation out of the left Assets workflow and into the right Layers workflow so creation actions sit beside layer ordering and alignment. Reduce panel clutter with collapsible sections.

## Acceptance Criteria

- [x] Quick Add is placed at the top of the Layers tab.
- [x] Quick Add is no longer rendered in the Assets tab.
- [x] Quick Add can collapse and expand.
- [x] The Layers list can collapse and expand.
- [x] Fit to canvas is moved from the Layer list area into the Adjust context near position and size editing.

## Evidence

- `npm test`: pass. 26 files, 95 tests.
- `npm run build`: pass.
- Runtime gate: pass at `http://127.0.0.1:4197/thumbnail-generator/`.
- Runtime checks covered Layers Quick Add collapse/expand, Layer list collapse/expand, Quick Add Text/Shape/Line insertion, and Adjust Fit to canvas placement.

## Notes

- Screenshot evidence: `docs/assets/runtime-20260609-ui-pan-colors-desktop.png`.
