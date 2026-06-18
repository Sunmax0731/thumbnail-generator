# Daily schedule compact controls and clock labels

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

Daily schedule generation supports AM/PM sector circles with start/end time inputs. Follow-up testing showed the modal could still show unnecessary daily action controls in Day mode and the day-specific parameters needed to be more compact to avoid scrollbars. The time-display option also needed to render clock-style hour markers around the circle rather than only the selected start time.

## Requirements

- Hide the daily action-count mode dropdown and actions-per-day slider when the schedule kind is Day.
- Compact the Daily periods controls by pairing start/end time fields horizontally and grouping period label plus visibility controls.
- Add independent AM and PM event display toggles.
- Generate optional outer clock-hour labels from `0` through `23` around each daily circle when the time display option is enabled.
- Preserve start/end-time-driven sector angles and existing generated sector editability.

## Acceptance Criteria

- [x] Day schedule mode does not render the daily action-count dropdown or actions-per-day slider.
- [x] Daily period controls render compact start/end rows with browser time inputs.
- [x] AM and PM event labels can be shown or hidden independently.
- [x] Time display generates `0` through `23` hour labels around each AM/PM circle.
- [x] Automated tests cover clock-hour generation and independent event visibility.
- [x] Browser runtime gate validates the compact UI, event toggles, generated clock labels, layer editing, and WebP export.

## Evidence

- `npm test` passed on 2026-06-18 with 35 files and 144 tests.
- `npm run build` passed on 2026-06-18.
- Playwright local Chrome runtime gate passed at `http://127.0.0.1:4422/thumbnail-generator/?runtime=daily-compact-clock-20260618`.
- Runtime evidence confirmed Day mode rendered no action-count controls, four time inputs, two AM/PM event toggles, no schedule dialog vertical overflow, AM event hidden after toggle-off, generated AM/PM `0`-`23` hour labels, generated sector angles `270` to `330`, Start angle edit to `275`, WebP export `123380` bytes, mobile horizontal overflow `0`, and no page/app console errors. Evidence is under `output/runtime-20260618-daily-compact-clock/`.
