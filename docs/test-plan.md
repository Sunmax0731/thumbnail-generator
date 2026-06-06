# Test Plan

## Automated Tests

- CSV parser handles quoted fields, numeric defaults, image references, and effect strings.
- HTML parser handles text, image, and shape layers.
- Export presets resolve to expected width/height/format settings.
- Layer deletion selection helpers keep selection on valid selectable layers.
- Color palette registration preserves names, Fill/Stroke targets, uniqueness, and legacy storage migration.

## Manual Browser Runtime Gate

The WebApp runtime gate is passed only when Chrome or a headless browser confirms:

- Nonblank app render.
- Header, left import panel, canvas, layer list, inspector, and export controls are visible.
- Left sidebar task tabs expose Assets, Layouts, and Templates without crowding the first viewport.
- Right inspector task tabs expose Layers, Adjust, and Colors without crowding the first viewport.
- CSV import updates the canvas/layer list.
- HTML import updates the canvas/layer list.
- Layer inspector edits position, size, rotation, color, stroke, and effects.
- Canvas direct editing supports drag move, corner resize, and rotation handle drag.
- Multi-selection supports group selection, group movement, and alignment.
- Single selection can align to the canvas.
- Selection handles remain visible in preview padding outside the thumbnail document area.
- Layers panel supports drag-and-drop stacking order edits.
- Layers panel supports visibility and selectable/editable lock toggles.
- Layers panel supports Delete-key removal for a focused editable row.
- Layers panel delete buttons open a confirmation dialog; cancel preserves the layer and confirm removes it.
- Text font selector changes the rendered text font family.
- Registered palette colors save names and Fill/Stroke targets, then apply to text/shape fill and stroke colors.
- Adjust tab numeric controls edit through paired range/number inputs without duplicated value readouts in labels.
- Named templates can be saved to browser storage, loaded, and deleted.
- Multiple saved templates with the same display name are preserved.
- Image Lab opens from the sidebar in a modal workspace and supports chroma key, rectangle/circle cutout, polygon/free cutout, and drag-range cutout.
- Image Lab Rect and Circle modes support direct drag selection on the preview.
- Image Lab modal supports close button, backdrop click, and Escape-key dismissal.
- Numeric value controls expose sliders with practical min/max bounds.
- Image import accepts a local image and creates an image layer.
- Export path creates a data URL/download for the selected format.
- Desktop and mobile viewports have no incoherent overlap.

## Current Results

Completed on 2026-06-06.

### Automated

- `npm test`: pass. 10 test files, 26 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- `npm audit --audit-level=high`: pass. 0 vulnerabilities.

### Browser Runtime Gate

- URL: `http://127.0.0.1:4173/thumbnail-generator/`
- Browser path attempted first: Browser plugin.
- Browser fallback reason: in-app Browser returned `Browser is not available: iab`.
- Fallback used: Playwright 1.60.0 headless Chromium.
- Desktop viewport: `1440x900`
- Mobile viewport: `390x844`
- Evidence screenshots:
  - `docs/assets/runtime-desktop.png`
  - `docs/assets/runtime-mobile.png`
  - `docs/assets/runtime-mobile-canvas.png`
  - `docs/assets/runtime-direct-editing.png`
  - `docs/assets/runtime-direct-editing-mobile.png`
  - `docs/assets/runtime-advanced-editing.png`
  - `docs/assets/runtime-advanced-editing-mobile.png`
  - `docs/assets/runtime-image-lab-modal.png`
  - `docs/assets/runtime-image-lab-modal-mobile.png`
  - `docs/assets/runtime-ux-refresh-desktop.png`
  - `docs/assets/runtime-ux-refresh-mobile.png`
  - `docs/assets/runtime-image-lab-rect-circle-drag.png`
  - `docs/assets/runtime-layers-colors-adjust-desktop.png`
  - `docs/assets/runtime-layer-delete-modal.png`
  - `docs/assets/runtime-layers-colors-adjust-after.png`
  - `docs/assets/runtime-layers-colors-adjust-mobile.png`

Passed checks:

- Page title: `Thumbnail Generator`
- Nonblank canvas pixel check: pass (`1280x720`, varied sampled pixels)
- Primary UI visible: app title, Assets/Layouts/Templates tabs, Layers/Adjust/Colors tabs, canvas, layers, and WebP export button
- Left task tabs: pass, Assets, Layouts, and Templates sections opened and exposed the expected controls
- Right task tabs: pass, Layers, Adjust, and Colors sections opened and exposed layer list, inspector fields, and palette registration
- CSV import: pass, generated layout was applied and status reported `CSV applied`.
- HTML import: pass, status reported `HTML applied: 5 layers.`
- Inspector edit: pass, selected text updated to `QA INSPECTOR TITLE`
- Canvas direct editing: pass, selected text layer moved, resized, and rotated with pointer controls
- Multi-selection alignment: pass, `Main title` and `Subtitle` selected together and center-aligned
- Single-layer canvas alignment: pass, selected layer aligned to the canvas
- Preview padding handles: pass, preview canvas rendered at `1456x896` for a `1280x720` document so outside handles are not clipped
- Layer ordering: pass, Layers panel drag-and-drop changed stacking order
- Layer lock: pass, selected layer changed to locked/unselectable and was excluded from editing
- Layer Delete key: pass, focused editable row was removed, layer count changed from `7` to `6`, and one valid row remained selected
- Layer delete modal: pass, delete button opened a confirmation dialog, Cancel preserved the layer, and Delete removed it
- Font dropdown: pass, selected text layer font family changed through the dropdown
- Color palette: pass, registered named `QA fill` and `QA stroke` entries, saved Fill/Stroke targets to localStorage, applied `#123abc` to shape Fill, and applied `#456def` to shape Stroke
- Adjust controls: pass, slider labels no longer repeated numeric values; values remained editable through range/number inputs
- Named templates: pass, current CSV/HTML layout saved to browser storage, loaded, and deleted
- Multiple template saves: pass, saving `Duplicate OK` twice produced two saved entries
- Image Lab modal: pass, sidebar launcher opened a modal workspace at `1220x865` with an `832x518` Image Lab preview canvas
- Image Lab processing: pass, drag-range cutout with chroma key created a processed image layer
- Image Lab Rect/Circle drag selection: pass, Rect drag changed crop values from `0,0,320,180` to `186,130,718,362`; Circle drag changed them to `426,151,958,638`
- Image Lab close controls: pass, Escape key, close button, and backdrop click dismissed the modal
- Image Lab mobile modal: pass, `390x844` viewport opened the modal at `374px` width with horizontal overflow `0`
- Image Lab polygon: pass, three free-cut points enabled processing and created a processed image layer
- Sliders: pass, output size sliders were present and layer/Image Lab slider controls were visible
- Image import: pass, local PNG file imported and created an image layer
- Export: pass, WebP download created (`thumbnail-1280x720-...webp`)
- Mobile: pass, task tabs had no horizontal overflow (`0`)

Console health:

- No app errors or page errors.
- The latest advanced-editing runtime gate produced no app errors or page errors.
- One warning was produced by the QA script's repeated `getImageData` pixel-read check: Canvas readback performance warning. This is not an application runtime error.

### GitHub Pages

- Workflow: `Deploy GitHub Pages`
- Result: pass. Build, test, artifact upload, and deploy jobs succeeded on remote GitHub Actions.
- URL: `https://sunmax0731.github.io/thumbnail-generator/`
- HTTP check: pass (`200`)
