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

Latest validation note: 2026-06-12 OBS preview fullscreen and viewport-fill follow-up passed `npm test` (30 files, 120 tests), `npm run build`, and a Playwright headless Chromium runtime check at `http://127.0.0.1:4339/thumbnail-generator/`. The gate confirmed nonblank render, Adjust numeric edit, OBS preview canvas-only popup with no visible body text, one nonblank `1280x720` canvas filling a `1280px x 720px` viewport, fullscreen retry hook after `F`, WebP export, mobile horizontal overflow `0`, and no relevant app console errors or non-analytics HTTP errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
