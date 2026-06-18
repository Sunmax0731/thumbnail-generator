# Daily schedule generator and sector shapes

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

Extend the Templates schedule generator so it can generate a single-day schedule, in addition to the existing monthly and weekly generator modes. The user supplied a reference layout with two large AM/PM circles, editable labels inside each circle, and wedge-like dividers. The generated daily layout also supports schedule elements already present in other schedule units, such as a date/title like "June 18 schedule", localized weekday/date labels, badges, grouping, font/color controls, live preview, saved generator settings, time display, and editable generated canvas objects.

## Required Inputs

- Schedule type: add `day` beside existing `month` and `week`.
- Date picker: use one exact target date for the daily schedule.
- Title/date heading: allow custom title text, with an automatic fallback derived from the selected date and active language.
- Date metadata: support weekday language and date format so generated headings can show day-only, month/day, and weekday context consistently with month/week schedules.
- Daily layout style: include an AM/PM circle layout matching the supplied reference image. Keep room for additional daily styles later, such as a time-list style.
- Period labels: provide editable default labels for the two circles, initially `AM` and `PM`.
- Time labels: provide optional editable time labels for each period, initially `09:00` and `14:00`.
- Event labels: generate editable text objects for one or more events per period, with defaults such as `Morning work` and `Collaboration`. The generated text remains editable after placement.
- Sector objects: support a sector shape kind with start angle, end angle, and inner radius parameters in the existing Adjust shape controls.
- Styling: reuse the existing schedule font family, font weight, title/date/event font-size sliders, background/surface/accent/text colors, corner radius, stroke width, grouping, and settings persistence.
- Badge option: allow a top date/day badge for day schedules, similar to month badges and future-compatible with `DAY` or localized date labels.

## Implementation Notes

- `src/lib/scheduleBuilder.ts` should extend `ScheduleBuilderKind` to include `day` and route `buildScheduleTemplate` to a new `createDayLayers` path.
- The daily implementation uses background shapes, ellipse shapes for the AM/PM circles, sector shapes for wedge areas, and text layers for period/time/event/date labels.
- `src/components/LeftPanel.tsx` should expose the `day` option in the ScheduleBuilderDialog and show day-specific controls only when `draft.kind === "day"`.
- Generator settings should continue using the existing `thumbnail-generator.generatorSettings.v1.schedule` key so saved schedule settings migrate forward with fallback defaults for new fields.
- The generated layers should refresh CSV/HTML compatibility text through the existing App schedule generation path.
- Daily generated objects should be grouped by the same `groupLayers` setting used by month/week schedules.

## Acceptance Criteria

- [x] The schedule generator kind selector includes Day schedule.
- [x] Selecting Day schedule uses a single date input and generates a single-day canvas instead of a seven-day or monthly grid.
- [x] The generated daily schedule includes a custom or automatic title/date heading, weekday/date context, optional badge, and at least two period sections.
- [x] The AM/PM circle layout generates two large circle outlines, period labels, sector wedge objects, editable event text, and optional time text similar to the supplied reference image.
- [x] Existing schedule controls for orientation, font, font sizes, colors, stroke width, grouping, live preview, Generate objects, and Save settings continue to work.
- [x] Saved schedule generator settings restore without breaking existing saved monthly or weekly settings.
- [x] Generated daily layers are editable through the existing Layers and Adjust panels and remain exportable through the Output menu.
- [x] Automated schedule builder tests cover daily naming, sector layers, time/event labels, grouping, and hidden-time behavior.
- [x] Browser runtime gate opens the schedule generator, switches to Day schedule, validates a nonblank AM/PM preview, generates layers, edits one generated object, and exports a WebP.

## Evidence

- `npm test` passed on 2026-06-18 with 35 files and 143 tests.
- `npm run build` passed on 2026-06-18.
- Playwright local Chrome runtime gate passed at `http://127.0.0.1:4418/thumbnail-generator/?runtime=daily-sector-20260618`.
- Runtime evidence confirmed nonblank initial/generated canvases, visible daily AM/PM preview, generated `Daily AM sector` layer, visible sector angle controls, sector start angle edit to `210`, WebP export `247884` bytes, mobile horizontal overflow `0`, and no page/app console errors. Evidence is under `output/runtime-20260618-daily-sector/`.
