# Daily schedule time input and sector sync

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

Daily schedule generation already supports AM/PM circles, sector shapes, and visible time labels. Follow-up testing showed that the start time field should be a time-specific UI, each period needs an end time or duration, and generated sector wedges must align to the configured clock time. For example, a `09:00` start should begin from the left side of the circle, represented as `270` degrees in clock-style sector parameters.

## Requirements

- Replace free-text daily start time inputs with browser time inputs.
- Add daily end time inputs for each AM/PM period.
- Preserve existing saved generator settings by treating `dailyTimeLabels` as start times and adding fallback `dailyEndTimeLabels`.
- Generate daily sector start/end angles from the configured start/end times.
- Interpret sector angles as clock-style degrees: `0` at 12 o'clock, `90` at 3 o'clock, `180` at 6 o'clock, and `270` at 9 o'clock.
- Keep generated text editable and keep time display optional through the existing show-time toggle.

## Acceptance Criteria

- [x] Daily schedule start time controls use `input type="time"`.
- [x] Daily schedule end time controls exist for AM and PM.
- [x] `09:00` daily start generates a sector start angle of `270`.
- [x] Sector end angle is derived from the configured end time.
- [x] Visible start time labels sit near the corresponding clock position.
- [x] Automated tests cover the time-derived sector angles and time range label.
- [x] Browser runtime gate validates time inputs, generated sector alignment, layer editing, and WebP export.

## Evidence

- `npm test` passed on 2026-06-18 with 35 files and 143 tests.
- `npm run build` passed on 2026-06-18.
- Playwright local Chrome runtime gate passed at `http://127.0.0.1:4420/thumbnail-generator/?runtime=daily-time-sync-20260618`.
- Runtime evidence confirmed 4 daily `input type="time"` controls, nonblank initial/preview/generated canvases, generated AM sector start `270`, end `330`, angle edit to `275`, WebP export `253258` bytes, mobile horizontal overflow `0`, and no page/app console errors. Evidence is under `output/runtime-20260618-daily-time-sync/`.
