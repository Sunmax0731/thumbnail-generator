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

Latest validation note: 2026-06-10 Layout readjust follow-up passed `npm test` (27 files, 102 tests), `npm run build`, and a Playwright headless Chromium runtime gate at `http://127.0.0.1:4214/thumbnail-generator/`. The gate confirmed left tabs stay on one line on desktop and mobile, right inspector tabs are three equal-width columns without an unused right-side column, image import is inside the Assets tab, preview Output no longer contains image import, YouTube URL UI stays hidden, template confirmation uses the same `.confirm-backdrop .confirm-dialog` modal style as layer deletion, `Shorts Quote` applies at `1080x1920`, WebP export downloads, mobile horizontal overflow is `0`, and no page errors or app console errors occur. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
