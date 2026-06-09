# Improve Colors tab palette layout

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

Improve the Colors tab by concentrating palette controls around the wheel, removing the redundant wheel-side color strip, placing palette bars below the wheel, and making saved palette and single-color lists collapsible.

## Acceptance Criteria

- [x] Palette bars are placed below the wheel.
- [x] The wheel-side color strip is not rendered.
- [x] Palette pattern selection appears above the palette name input.
- [x] Saved multi-color palette rows can collapse and expand.
- [x] Registered single-color rows can collapse and expand.

## Evidence

- Runtime gate confirmed `.palette-preview-strip` count is `0`.
- Runtime gate confirmed saved-palette and registered-color collapsible headings are visible and both lists collapse.

## Notes

- Superseded by Issue 0081 for Brand kit actions: the linked wheel, Sketch-style input, recent colors, and Fill/Stroke buttons remain available, while Colors-side Brand kit registration buttons are now hidden.
