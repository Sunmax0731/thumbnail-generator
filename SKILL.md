# SKILL

Use this workflow for work inside `thumbnail-generator`.

## Description

Build and validate a static browser thumbnail generator for video creators. The app accepts CSV and HTML layout definitions, composes image/text/shape layers on a canvas, and exports the final thumbnail image at selected resolutions.

## Workflow

1. Confirm the current task in `TODO.md`.
2. Review `docs/requirements.md`, `docs/specification.md`, `docs/design.md`, and `docs/test-plan.md`.
3. Keep core parsing and rendering logic in testable modules under `src/lib/`.
4. Keep React UI components focused under `src/components/`.
5. Validate with `npm test`, `npm run build`, and browser runtime gate.
6. Update QCDS, test-plan, release checklist, and docs ZIP before handoff.

## Notes

- The app must remain static and GitHub Pages compatible.
- Do not add backend services or server-only dependencies.
- Prefer reversible MVP choices and keep browser-only data handling explicit.

