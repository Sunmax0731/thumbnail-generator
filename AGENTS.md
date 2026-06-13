# AGENTS

## Scope

- Repository: `D:\AI\WebApp\thumbnail-generator`
- Domain: static WebApp for browser-based thumbnail layout and image export.

## Working Rules

- Read `README.md`, then this file, then `SKILL.md` before changing the repo.
- Review `docs/` before implementation decisions.
- Keep work scoped to this repository.
- Update `README.md`, `AGENTS.md`, `SKILL.md`, and docs when repository workflow or canonical paths change.
- Keep artifacts UTF-8 clean. Do not copy corrupted text fragments into docs or code.
- Write runtime-gate screenshots, debug captures, and temporary browser outputs under `output/`; this directory is intentionally ignored by Git.

## Validation

- Run `npm test` for parser/model coverage.
- Run `npm run build` for production static output.
- Run a browser runtime gate: nonblank Chrome/headless render, primary UI visible, CSV/HTML import, layer editing, and export path exercised.
- Record runtime gate results in `docs/test-plan.md` and QCDS results in `docs/qcds-evaluation.md`.

## Git

- Use one task branch named `codex/thumbnail-generator-static-app`.
- Commit docs and implementation in the same work unit.
- Push to `origin` when validation passes and permissions allow.
