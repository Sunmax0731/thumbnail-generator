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

Latest validation note: 2026-06-12 Motion tab timeline/OBS shortcut follow-up passed `npm test` (30 files, 122 tests), `npm run build`, and a Playwright headless Chromium runtime check at `http://127.0.0.1:4340/thumbnail-generator/?runtime=motion-followup` after the in-app Browser attempt failed with `Browser is not available: iab`. The gate confirmed nonblank render, timeline hidden outside Motion and visible in Motion, easing graph show/hide, movement/effect dropdowns, effect intensity disabled for Fade and enabled for Glow pulse, text-only controls hidden for shape selection and visible for text selection, timeline handles/body drag/height resize, WebP export, OBS `P`/`R`/`H` shortcuts, nonblank OBS canvas, and mobile horizontal overflow `0`. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.
