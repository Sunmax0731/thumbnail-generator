# Test Plan

## Automated Tests

- CSV parser handles quoted fields, numeric defaults, image references, and effect strings.
- HTML parser handles text, image, and shape layers.
- Export presets resolve to expected width/height/format settings.

## Manual Browser Runtime Gate

The WebApp runtime gate is passed only when Chrome or a headless browser confirms:

- Nonblank app render.
- Header, left import panel, canvas, layer list, inspector, and export controls are visible.
- CSV import updates the canvas/layer list.
- HTML import updates the canvas/layer list.
- Layer inspector edits position, size, rotation, color, stroke, and effects.
- Canvas direct editing supports drag move, corner resize, and rotation handle drag.
- Multi-selection supports group selection, group movement, and alignment.
- Single selection can align to the canvas.
- Selection handles remain visible in preview padding outside the thumbnail document area.
- Layers panel supports drag-and-drop stacking order edits.
- Layers panel supports visibility and selectable/editable lock toggles.
- Text font selector changes the rendered text font family.
- Registered palette colors apply to text/shape fill and stroke colors.
- Named templates can be saved to browser storage, loaded, and deleted.
- Multiple saved templates with the same display name are preserved.
- Image Lab supports chroma key, rectangle/circle cutout, polygon/free cutout, and drag-range cutout.
- Numeric value controls expose sliders with practical min/max bounds.
- Image import accepts a local image and creates an image layer.
- Export path creates a data URL/download for the selected format.
- Desktop and mobile viewports have no incoherent overlap.

## Current Results

Completed on 2026-06-06.

### Automated

- `npm test`: pass. 9 test files, 22 tests.
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

Passed checks:

- Page title: `Thumbnail Generator`
- Nonblank canvas pixel check: pass (`1280x720`, varied sampled pixels)
- Primary UI visible: app title, CSV layout, HTML layout, inspector, layers, WebP export button
- CSV import: pass, status reported `CSV applied: 3 layers.`
- HTML import: pass, status reported `HTML applied: 3 layers.`
- Inspector edit: pass, selected text updated to `QA INSPECTOR TITLE`
- Canvas direct editing: pass, selected text layer moved, resized, and rotated with pointer controls
- Multi-selection alignment: pass, `Main title` and `Subtitle` selected together and center-aligned
- Single-layer canvas alignment: pass, selected layer aligned to the canvas
- Preview padding handles: pass, preview canvas rendered at `1456x896` for a `1280x720` document so outside handles are not clipped
- Layer ordering: pass, Layers panel drag-and-drop changed stacking order
- Layer lock: pass, selected layer changed to locked/unselectable and was excluded from editing
- Font dropdown: pass, selected text layer font family changed through the dropdown
- Color palette: pass, registered `#123abc` and applied it to a selected layer
- Named templates: pass, current CSV/HTML layout saved to browser storage, loaded, and deleted
- Multiple template saves: pass, saving `Duplicate OK` twice produced two saved entries
- Image Lab: pass, drag-range cutout with chroma key created a processed image layer
- Image Lab polygon: pass, three free-cut points enabled processing and created a processed image layer
- Sliders: pass, output size sliders were present and layer/Image Lab slider controls were visible
- Image import: pass, local PNG file imported and created an image layer
- Export: pass, WebP download created (`thumbnail-1280x720-...webp`)
- Mobile: pass, no horizontal overflow (`0`)

Console health:

- No app errors or page errors.
- The latest advanced-editing runtime gate produced no app errors or page errors.
- One warning was produced by the QA script's repeated `getImageData` pixel-read check: Canvas readback performance warning. This is not an application runtime error.

### GitHub Pages

- Workflow: `Deploy GitHub Pages`
- Result: pass. Build, test, artifact upload, and deploy jobs succeeded on remote GitHub Actions.
- URL: `https://sunmax0731.github.io/thumbnail-generator/`
- HTTP check: pass (`200`)
