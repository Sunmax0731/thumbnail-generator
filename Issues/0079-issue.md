# Disable automatic preview zoom and add pan

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

Keep preview zoom under user control instead of automatically fitting when presets or output size change. Add pan controls for navigating tall or zoomed canvases.

## Acceptance Criteria

- [x] Preset changes do not automatically change the current preview zoom.
- [x] Fit canvas remains available as an explicit one-time action.
- [x] Preview can be panned with the Pan button.
- [x] Preview can be panned with Space-drag or Alt-drag without conflicting with layer editing shortcuts.
- [x] Pan does not change zoom.

## Evidence

- Runtime gate confirmed switching to the Shorts portrait preset kept zoom at `94%`.
- Runtime gate confirmed Pan drag moved the preview scroll area without changing zoom.

## Notes

- This changes automatic zoom behavior only; canvas rendering and export clipping are unchanged.
