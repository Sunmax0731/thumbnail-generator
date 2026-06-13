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

Latest validation note: 2026-06-14 preview playback follow-up passed `npm test` (34 files, 134 tests), `npm run build`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4362/thumbnail-generator/?runtime=preview-playback-20260614-final2` after the Browser plugin script was unavailable. The gate confirmed nonblank canvas, editor timeline Play/Pause playback with moving playhead, playback locks for Layers/Inspector/timeline/preview editing, middle-button preview lockout, dimmed off-canvas object portions, matching schedule landscape and standard generator action widths, preserved schedule portrait action width, WebP export, mobile horizontal overflow `0`, and no page/app runtime errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
