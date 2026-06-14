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

Current validation note: 2026-06-14 UI persistence and timeline grid follow-up passed `npm test` (35 files, 141 tests), `npm run build`, `npm run docs:zip`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4392/thumbnail-generator/?runtime=ui-persistence-20260614-final`. The gate confirmed nonblank canvas, left/right scrollbars constrained below tab rows, fresh autosave enabled, schedule defaults `week`/`portrait`/`1`, collapsible state persistence across tab switches and reloads, 0.5s timeline grid lines, layer editing, WebP export, and no page/app runtime errors.

Latest validation note: 2026-06-14 footer X contact no-wrap follow-up passed `npm test` (34 files, 139 tests), `npm run build`, `npm run docs:zip`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4386/thumbnail-generator/?runtime=footer-x-nowrap-20260614-rerun`. The gate confirmed nonblank canvas, Japanese `問い合わせ: X`, English `Contact: X`, no visible app legacy X co-brand text, footer X icon/text horizontal no-wrap alignment on desktop and mobile, static Privacy Policy and Terms pages with `X: @Sunmax0731` and no legacy X co-brand text, layer/group editing, WebP export, mobile overflow `0px`, and no page/app runtime errors. GitHub Pages deploys through `.github/workflows/pages.yml` on pushes to `codex/thumbnail-generator-static-app`.

Latest manual validation note: 2026-06-14 manual overview and visual guides passed `npm test` (35 files, 141 tests), `npm run build`, and a Playwright local Chrome runtime check at `http://127.0.0.1:4398/thumbnail-generator/?runtime=manual-overview-visuals-20260614`. The gate confirmed the first Manual side tab is `Overview`, Overview top tabs are `What it does`, `Feature list`, and `Workflow`, active entries show access/operation GUI SVG visuals, shortcut/mouse entries show dedicated SVG diagrams, layer editing works, WebP export works, mobile manual overflow is `0px`, and no page/app runtime errors were reported.
