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

Latest validation note: 2026-06-09 Image Lab/Single-color picker/OBS follow-up passed `npm test` (26 files, 98 tests), `npm run build`, and a Playwright headless Chromium runtime gate at `http://127.0.0.1:4199/thumbnail-generator/`. The gate confirmed Shape stroke width above the shape dropdown, compact Adjust Fill/Stroke single-color picker with alpha and no color wheel, fixed preview output-frame dimensions, no standalone Assets Image Lab button, asset-row Image Lab entry, removed Image Lab source/import/select controls, header processed-layer creation, inline chroma-key controls, popup-style canvas-only OBS preview document, WebP export, and mobile horizontal overflow `0`.
