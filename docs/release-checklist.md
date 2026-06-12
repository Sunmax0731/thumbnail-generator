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

Latest validation note: 2026-06-12 generator actions and Adjust collapse follow-up passed `npm test` (30 files, 120 tests), `npm run build`, and a Playwright headless Chromium runtime gate at `http://127.0.0.1:4338/thumbnail-generator/`. The gate confirmed Schedule portrait action buttons sit directly below the preview, Standard and Vertical generator actions sit at the modal lower edge, Vertical modal right whitespace is reduced, Common settings / type-specific Adjust sections collapse and expand, signed bevel accepts `-12`, shadow parameter controls are hidden until shadow is enabled, WebP export downloaded, mobile horizontal overflow was `0`, and no relevant app console errors or non-analytics HTTP errors were reported. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
