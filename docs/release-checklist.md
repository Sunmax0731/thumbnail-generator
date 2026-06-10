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

Latest validation note: 2026-06-10 Beta schedule generator V2 passed `npm test` (28 files, 109 tests), `npm run build`, and a Playwright headless Chromium runtime gate at `http://127.0.0.1:4173/thumbnail-generator/`. The gate confirmed primary UI visibility, nonblank canvas render, Templates-side Generate schedule entry, beta notice, pre-generation preview, calendar-style date input `2026-06-10`, Japanese weekday language, day-only date format, Monday week start, title/font/font-size/grid/corner/line settings, individual seven-day action counts `0/1/2/3/4/5/6`, generated-layer grouping disabled, 95 generated editable layers with no group pills, six day-seven action rows, Adjust numeric editing, WebP export download, mobile preview visibility, mobile horizontal overflow `0`, and no page errors or app console errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
