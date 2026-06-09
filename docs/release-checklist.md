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

Latest validation note: 2026-06-10 Theme/Palette reorder/Pages follow-up passed `npm test` (27 files, 102 tests), `npm run build`, and a Playwright headless Chromium runtime gate at `http://127.0.0.1:4212/thumbnail-generator/`. The gate confirmed upper-right Language and Theme controls, Dark theme DOM state and localStorage persistence, Export and Edit state side-by-side desktop placement, vertical action stacks inside both sections, saved-palette drag reorder persistence, registered single-color drag reorder persistence, Adjust X editing, WebP export download, nonblank desktop and mobile canvas renders, mobile horizontal overflow `0`, and no page errors or app console errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
