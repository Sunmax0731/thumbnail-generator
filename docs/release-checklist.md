# Release Checklist

- [x] README matches current setup and usage.
- [x] AGENTS.md and SKILL.md match repo workflow.
- [x] `docs/requirements.md` is current.
- [x] `docs/specification.md` is current.
- [x] `docs/design.md` is current and references the concept image.
- [x] `docs/test-plan.md` includes actual verification results.
- [x] `docs/features.md` lists the primary features and quick usage paths.
- [x] `docs/user-guide.md` covers manual app usage.
- [x] `docs/screenshot-guide.md` covers screenshot-based feature walkthroughs.
- [x] `docs/improvement-backlog.md` captures taskized follow-up improvement candidates.
- [x] `docs/qcds-evaluation.md`, `docs/qcds-strict-metrics.json`, Code Starter QCDS summary, and Codex Work Dashboard QCDS evidence are current.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] Browser runtime gate passes.
- [x] Docs ZIP is generated.
- [x] Git branch is pushed.

Current validation note: 2026-06-14 UI persistence and timeline grid follow-up passed `npm test` (35 files, 141 tests), `npm run build`, `npm run docs:zip`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4392/thumbnail-generator/?runtime=ui-persistence-20260614-final`. The gate confirmed nonblank canvas, left/right scrollbars constrained below tab rows, fresh autosave enabled, schedule defaults `week`/`portrait`/`1`, collapsible state persistence across tab switches and reloads, 0.5s timeline grid lines, layer editing, WebP export, and no page/app runtime errors.

Latest validation note: 2026-06-14 footer X contact no-wrap follow-up passed `npm test` (34 files, 139 tests), `npm run build`, `npm run docs:zip`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4386/thumbnail-generator/?runtime=footer-x-nowrap-20260614-rerun`. The gate confirmed nonblank canvas, Japanese `問い合わせ: X`, English `Contact: X`, no visible app legacy X co-brand text, footer X icon/text horizontal no-wrap alignment on desktop and mobile, static Privacy Policy and Terms pages with `X: @Sunmax0731` and no legacy X co-brand text, layer/group editing, WebP export, mobile overflow `0px`, and no page/app runtime errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.

Latest manual validation note: 2026-06-15 manual maintenance note follow-up passed `npm test` (35 files, 141 tests), `npm run build`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4405/thumbnail-generator/?runtime=manual-maintenance-20260615`. The gate confirmed the Manual Overview shows `マニュアル整備中` before the Overview heading, the maintenance note remains visible on mobile without horizontal overflow, layer editing works, WebP export works, and no page/app runtime errors were reported. `docs/manual-improvement-plan.md` captures the proposed target structure for improving the operation manual.

Latest schedule validation note: 2026-06-18 daily schedule sector follow-up passed `npm test` (35 files, 143 tests), `npm run build`, `npm run docs:zip`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4418/thumbnail-generator/?runtime=daily-sector-20260618`. The gate confirmed nonblank initial/generated canvases, Day schedule preview with AM/PM sector circles and time labels, generated `Daily AM sector` layer, sector Start angle editing to `210`, WebP export `247884` bytes, mobile horizontal overflow `0`, and no page/app runtime errors.

Latest daily time validation note: 2026-06-18 daily schedule time-sync follow-up passed `npm test` (35 files, 143 tests), `npm run build`, `npm run docs:zip`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4420/thumbnail-generator/?runtime=daily-time-sync-20260618`. The gate confirmed 4 daily time inputs, AM `09:00` to `11:00` generating sector angles `270` to `330`, angle editing to `275`, WebP export `253258` bytes, mobile horizontal overflow `0`, and no page/app runtime errors.

Latest daily compact clock validation note: 2026-06-18 daily schedule compact-controls follow-up passed `npm test` (35 files, 144 tests), `npm run build`, `npm run docs:zip`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4422/thumbnail-generator/?runtime=daily-compact-clock-20260618`. The gate confirmed Day mode hides action-count controls, renders 4 time inputs and 2 AM/PM event toggles, keeps the schedule dialog/grid vertical overflow at `0`, hides AM event text independently, generates AM/PM `0`-`23` hour labels, preserves sector angles `270` to `330`, edits Start angle to `275`, exports WebP `123380` bytes, keeps mobile horizontal overflow `0`, and reports no page/app runtime errors.

Latest daily hour-range validation note: 2026-06-18 daily schedule hour-range and circle-size follow-up passed `npm test` (35 files, 145 tests), `npm run build`, `npm run docs:zip`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4424/thumbnail-generator/?runtime=daily-hour-ranges-20260618`. The gate confirmed Day mode hides Grid style and Corner radius, shows Circle size and Line width on the same row, keeps schedule dialog/grid vertical overflow at `0`, generates AM `0`-`11` and PM `12`-`24` labels with PM boundary labels separated, centers the portrait AM circle at `540.5` on a `1080` canvas, edits Start angle to `280`, exports WebP `214864` bytes, keeps mobile horizontal overflow `0`, and reports no page/app runtime errors.

Latest daily spacing validation note: 2026-06-18 daily schedule spacing and contrast follow-up passed `npm test` (35 files, 146 tests), `npm run build`, `npm run docs:zip`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4426/thumbnail-generator/?runtime=daily-spacing-20260618`. The gate confirmed PM `12`-`23` labels with no `24` layer, opaque high-contrast Day period panel/editor backgrounds, visible Circle spacing control, generated sector Start angle editing to `281`, WebP export `132102` bytes, nonblank desktop/mobile canvases, mobile horizontal overflow `0`, and no page/app runtime errors.
