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

Latest validation note: 2026-06-12 Generator pattern follow-up passed `npm test` (30 files, 118 tests), `npm run build`, and a Playwright headless Chromium runtime gate at `http://127.0.0.1:4332/thumbnail-generator/`. The gate confirmed four generator buttons (Schedule, Standard thumbnail, Vertical thumbnail, Stream waiting), no visible default-template list, no YouTube waiting generator, no Horizontal thumbnail generator, five placement patterns in all three image generator modals, grouped Common/Title/Subtitle/Label text controls, Vertical thumbnail settings persistence after reload, nonblank Standard `1280x720`, Vertical `1080x1920`, and Stream `1920x1080` generated canvases, three modal action buttons on one horizontal row, layer rows, canvas drag, WebP export, mobile modal rendering, mobile horizontal overflow `0`, and no page/console/HTTP errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
