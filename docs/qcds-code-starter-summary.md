# QCDS Code Starter Summary

Completed on 2026-06-07. Refreshed on 2026-06-09 after popup color picker, template resizing, Image Lab, single-color picker, OBS preview, Colors, Adjust, Shape, and preview follow-up work.

## Code Starter Result

- Overall rating: A+
- Display label: `QCDS A+`
- Axis label: `Q:A+ C:A+ D:A+ S:A+`
- Source work item: `Issues/0063-qcds-code-starter.md`
- Machine-readable source: `docs/qcds-code-starter-summary.json`
- Supporting source: `docs/qcds-strict-metrics.json`

## Previous D- Display

The previous VS Code Code Starter display showed `D-` because the selected work item only carried QCDS axis names and did not yet have a work-item-linked rating summary. That made the starter fall back to an unevaluated/lowest visible grade for this open item, even though repository-level QCDS evidence already existed in `docs/qcds-evaluation.md` and `docs/qcds-strict-metrics.json`.

This work item closes that gap by adding a Code Starter-specific summary with explicit axis ratings, evidence paths, and a compact display label.

## Axis Status

| Axis | Rating | State | Evidence |
| --- | --- | --- | --- |
| Quality | A+ | pass | Automated tests, production build, 38 default templates including eight Schedule starts and ten animated Motion starts, Sunday-start weekly layouts, expanded Motion easing controls, multiple motion sets, selected-object preview, easing graph, popup-style OBS preview, expanded hosted font choices, vertical text display-bound resizing, hidden left Layouts tab and hidden Generated layout section, Layers Quick Add, even distribution, preview pan, preview-pane Edit state/export controls, hidden Colors-side Brand kit registration buttons, draggable popup Adjust single-color picker, expanded shape kinds, fixed output-frame preview, outside-frame deselection, resizable Default and Browser template lists, Image Lab asset-row entry with no-range default, Google Analytics tracking, headless Chromium runtime gate, and feature/docs coverage are recorded in `docs/test-plan.md` and `docs/qcds-evaluation.md`. |
| Cost | A+ | pass | The app remains static, browser-only, GitHub Pages compatible, and has no backend or paid-service dependency. |
| Delivery | A+ | pass | Docs, QCDS evidence, tests, build, and runtime gate are synchronized for the current release state. |
| Satisfaction | A+ | pass | Layer editing, Motion selected-object preview, easing graph, 12 animation types, 31 easing choices, multiple motion sets, direction disabling when movement is unavailable, popup-style OBS preview rendering, vertical text width/height resizing, maximum-quality preview-pane export, mobile layout, 38 bundled templates, weekly Sunday-start layouts, ten animated eyecatch/waiting templates, expanded font selection, hidden left clutter and hidden Generated layout section, Layers Quick Add, even distribution, preview pan, hidden Colors-side Brand kit registration buttons, draggable popup Adjust single-color picker, expanded shape kinds, outside-frame deselection, resizable Default and Browser template lists, Image Lab asset-row entry and no-range default, issue reporting, analytics tracking, and user-facing docs are validated and visible in the release evidence. |

Latest runtime gate: Playwright headless Chromium passed at `http://127.0.0.1:4200/thumbnail-generator/` with desktop and mobile screenshots in `docs/assets/runtime-20260609-popup-template-resize-*.png`.

## Code Starter Visibility Contract

Code Starter should prefer this order when displaying QCDS for the repository:

1. `docs/qcds-code-starter-summary.json` for compact display fields.
2. `docs/qcds-strict-metrics.json` for strict axis details.
3. `docs/qcds-evaluation.md` for human-readable rationale.
4. `Issues/0063-qcds-code-starter.md` for the completed work-item acceptance record.

If the VS Code view is cached, refresh/reload the Code Starter view after this repository update. The repo-side source of truth is no longer `D-`; it is A+ across Quality, Cost, Delivery, and Satisfaction.
