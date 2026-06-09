# Add even distribution to Layers

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

Add Excel-like horizontal and vertical even distribution controls for multi-layer selection in the Layers alignment area.

## Acceptance Criteria

- [x] Layers alignment controls include horizontal and vertical distribution.
- [x] Three or more selected editable layers can be distributed horizontally.
- [x] Three or more selected editable layers can be distributed vertically.
- [x] Distribution preserves layer sizes and only changes the relevant axis position.
- [x] Locked layers are not included.

## Evidence

- Added unit tests in `src/lib/alignment.test.ts`.
- Runtime gate confirmed Distribute H and Distribute V ran on a three-layer multi-selection.

## Notes

- Distribution spaces layer centers evenly between the first and last centers on the selected axis.
