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

Latest validation note: 2026-06-12 Generator follow-up passed `npm test` (30 files, 117 tests), `npm run build`, and a Playwright headless Chromium runtime gate at `http://127.0.0.1:4331/thumbnail-generator/`. The gate confirmed four generator buttons (Schedule, Standard thumbnail, Horizontal thumbnail, Stream waiting), no visible default-template list, no YouTube waiting generator, Standard thumbnail settings persistence after reload, no old Vertical/Cutout variant selector, nonblank Standard/Horizontal/Stream generated canvases, horizontal layer rows, canvas drag, WebP export, mobile modal rendering, mobile horizontal overflow `0`, and no page/console errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
