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

Latest validation note: 2026-06-09 Popup color picker/Template resizing follow-up passed `npm test` (26 files, 98 tests), `npm run build`, and a Playwright headless Chromium runtime gate at `http://127.0.0.1:4200/thumbnail-generator/`. The gate confirmed a draggable fixed-position Adjust Fill/Stroke single-color popup with no color wheel, preview outside-frame click deselection, Default templates height resize `260 -> 332`, Browser templates height resize `220 -> 166`, nonblank `1280x720` canvas, and mobile horizontal overflow `0`.
