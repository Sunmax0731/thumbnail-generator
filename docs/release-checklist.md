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

Latest validation note: 2026-06-14 legal/X/manual follow-up passed `npm test` (34 files, 139 tests), `npm run build`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4385/thumbnail-generator/?runtime=legal-x-manual-use-cases-20260614`. The gate confirmed nonblank canvas, taller Privacy Policy and Terms modals with no desktop legal-content overflow, official X logo path on the X / Twitter footer contact, Manual use-case rows, Manual header subtitle removal, layer editing, WebP export, mobile overflow `0px`, and no page/app runtime errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
