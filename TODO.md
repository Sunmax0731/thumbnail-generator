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

## 8. Multi-Select, Palette, Locking, and Image Lab

- [x] Add multi-layer selection from canvas and Layers panel.
- [x] Add alignment controls for multi-selection and canvas alignment for single selection.
- [x] Add browser-local color palette registration and quick color application to text and shape layers.
- [x] Render selection resize and rotation handles outside the canvas document bounds without clipping.
- [x] Add layer selectable/editable lock toggle and exclude locked layers from canvas selection and inspector edits.
- [x] Confirm named templates continue to support multiple saved entries after model changes.
- [x] Add Image Lab for imported-image processing.
- [x] Implement chroma-key transparency.
- [x] Implement rectangular and circular image cutouts.
- [x] Implement polygon/free cutout by placing points.
- [x] Implement mouse-drag range cutout.
- [x] Add sliders for numeric controls with practical min/max bounds.
- [x] Validate new interactions with automated tests and browser runtime gate.

## 9. Image Lab Workspace Modal

- [x] Move Image Lab processing out of the sidebar tab into a larger modal workspace.
- [x] Keep the sidebar as the Image Lab launcher and image import context.
- [x] Provide close controls, backdrop/Escape dismissal, and responsive modal layout.
- [x] Increase the Image Lab preview workspace for precise crop, polygon, and chroma-key work.
- [x] Validate the modal workspace with automated tests and browser runtime gate.

## 10. Image Lab Drag Selection and UI/UX Refresh

- [x] Make Rect and Circle cutout modes directly selectable by dragging on the Image Lab preview.
- [x] Keep Drag mode compatible with existing rectangular drag-range processing.
- [x] Reorganize the left sidebar into clearer Assets, Layouts, and Templates sections.
- [x] Reorganize the right inspector into clearer Layers, Adjust, and Colors sections.
- [x] Update design/spec/test/QCDS docs for the refreshed information architecture.
- [x] Validate desktop and mobile layout, Image Lab Rect/Circle drag selection, and existing primary workflows.
