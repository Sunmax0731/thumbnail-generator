# Colors RGB slider width improvement

- Status: closed
- Priority: P2
- Type: bug
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

The Colors tab's palette maker placed R, G, and B controls in three compact columns. In the inspector width this left each range slider too narrow to adjust precisely because the channel label and numeric input consumed most of the row.

## Acceptance Criteria

- [x] RGB controls preserve synchronized range and number inputs.
- [x] Each RGB channel range slider has enough width for practical pointer adjustment in the compact inspector.
- [x] The controls do not overflow horizontally on desktop or mobile.
- [x] Existing HEX/RGB palette sync and linked color-wheel behavior remain intact.

## Notes

- Implemented in `src/styles.css` by stacking R, G, and B channel rows and reserving wider slider tracks.
- Verified by `npm test`, `npm run build`, and Playwright headless Chromium runtime gate on 2026-06-07.
