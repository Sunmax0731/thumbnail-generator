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

Latest validation note: 2026-06-14 footer/manual/legal-modal follow-up passed `npm test` (34 files, 139 tests), `npm run build`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4384/thumbnail-generator/?runtime=footer-legal-modal-20260614`. The gate confirmed nonblank canvas, English `ThumbNailed It?` title, `Need it quick? ThumbNailed It!` tagline, header Issue/Manual removal, footer Manual/Privacy/Terms/X contact/GitHub Issues links, GitHub icon, centered `© Sunmax Engineering`, no browser-only footer phrase, English/Japanese Privacy Policy and Terms modals, layer editing, WebP export, mobile overflow `0px`, and no page/app runtime errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
