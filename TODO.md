# TODO

Waterfall task contract for the initial `thumbnail-generator` implementation.

## 1. Requirements

- [x] Confirm platform root is `D:\AI\WebApp`.
- [x] Start new repo at `D:\AI\WebApp\thumbnail-generator`.
- [x] Create public GitHub remote and configure `origin`.
- [x] Define browser-only static app constraints.
- [x] Define required layout inputs: CSV and HTML.
- [x] Define required output: selected resolution/aspect ratio image export.

## 2. Specification

- [x] Document layer model for image, text, and shape.
- [x] Document CSV schema.
- [x] Document HTML `data-layer` schema.
- [x] Document export presets and custom output controls.
- [x] Document image effects supported in MVP.

## 3. Design

- [x] Generate and save primary UI concept.
- [x] Translate concept into implementation tokens and layout.
- [x] Document responsive behavior.

## 4. Implementation

- [x] Scaffold React + Vite static app.
- [x] Implement layer model and sample state.
- [x] Implement CSV parser and HTML parser.
- [x] Implement canvas renderer and export helpers.
- [x] Implement image import and image effects.
- [x] Implement editor UI, layer list, inspector, output controls, and import panels.
- [x] Implement responsive layout.

## 5. Verification

- [x] Add automated tests for parsers and export settings.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run browser runtime gate for desktop.
- [x] Run browser runtime gate for mobile viewport.
- [x] Exercise CSV import, HTML import, layer edit, image import, and export.

## 6. Release Preparation

- [x] Update README, AGENTS, SKILL, and docs to match implementation.
- [x] Create/update QCDS evaluation and strict metrics JSON.
- [x] Complete release checklist.
- [x] Create docs ZIP.
- [x] Commit and push if validation passes.

## 7. Direct Editing and Templates

- [x] Add direct canvas move, resize, and rotate controls for the selected layer.
- [x] Add drag-and-drop layer order editing in the Layers panel.
- [x] Change text font editing from free text to a dropdown list.
- [x] Generate CSV and HTML layout text from the current canvas state.
- [x] Save generated layouts as named browser-local templates.
- [x] Support multiple saved templates with load and delete controls.
- [x] Validate new interactions with automated tests and browser runtime gate.
