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

Latest validation note: 2026-06-10 Left Layers/Assets follow-up passed `npm test` (27 files, 102 tests), `npm run build`, and a Playwright headless Chromium runtime gate at `http://127.0.0.1:4213/thumbnail-generator/`. The gate confirmed Templates/Layers/Assets left-tab order, three right-inspector tabs, preview-header output size controls, hidden top-toolbar output controls, hidden YouTube URL UI, Output-section image import, deletion of every layer down to zero rows, no Restore sample button in Layers, template confirmation with `Shorts Quote` changing to `1080x1920`, imported asset deletion with related image-layer cleanup, Adjust X editing, WebP export download, nonblank desktop and mobile canvas renders, mobile horizontal overflow `0`, and no page errors or app console errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
