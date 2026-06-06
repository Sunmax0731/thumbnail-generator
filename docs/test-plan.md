# Test Plan

## Automated Tests

- CSV parser handles quoted fields, numeric defaults, image references, and effect strings.
- HTML parser handles text, image, and shape layers.
- Export presets resolve to expected width/height/format settings.
- Canvas fit calculation shrinks tall presets and preserves landscape fit when height allows it.
- Hit testing selects the frontmost overlapping layer while preserving selected resize handles.
- Layer deletion selection helpers keep selection on valid selectable layers.
- Color palette registration preserves names, Fill/Stroke targets, uniqueness, and legacy storage migration.
- Custom font helpers validate supported formats, sanitize display names, create dropdown options, read localStorage records, and deduplicate stored fonts.

## Manual Browser Runtime Gate

The WebApp runtime gate is passed only when Chrome or a headless browser confirms:

- Nonblank app render.
- Header, left import panel, canvas, layer list, inspector, and export controls are visible.
- Left sidebar task tabs expose Assets, Layouts, and Templates without crowding the first viewport.
- Right inspector task tabs expose Layers, Adjust, and Colors without crowding the first viewport.
- Colors tab has a vertically expanded swatch area with no overlap or horizontal overflow.
- CSV import updates the canvas/layer list.
- HTML import updates the canvas/layer list.
- Preview selection respects layer stacking order when layers overlap.
- Layer inspector edits position, size, rotation, color, stroke, font, and effects.
- Canvas direct editing supports drag move, corner resize, and rotation handle drag.
- Preset changes fit tall canvases such as Shorts into the visible desktop stage.
- Custom font import accepts WOFF2/WOFF/TTF/OTF, loads through FontFace, appears in the dropdown, stores in localStorage, applies to a text layer, and is reflected in export.
- Multi-selection supports group selection, group movement, and alignment.
- Single selection can align to the canvas.
- Selection handles remain visible in preview padding outside the thumbnail document area.
- Layers panel supports drag-and-drop stacking order edits.
- Layers panel supports visibility and selectable/editable lock toggles.
- Layers panel supports Delete-key removal for a focused editable row.
- Layers panel delete buttons open a confirmation dialog; cancel preserves the layer and confirm removes it.
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

- `npm test`: pass. 13 test files, 35 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.

### Browser Runtime Gate

- URL: `http://127.0.0.1:4173/thumbnail-generator/`
- Browser path attempted first: Browser plugin.
- Browser fallback reason: in-app Browser returned `Browser is not available: iab`.
- Fallback used: Playwright 1.60.0 headless Chromium.
- Desktop viewport: `1440x900`
- Mobile viewport: `390x844`
- Evidence screenshots:
  - `docs/assets/runtime-work-items-font.png`
  - `docs/assets/runtime-work-items-colors.png`
  - `docs/assets/runtime-work-items-preset.png`
  - `docs/assets/runtime-work-items-mobile.png`

Passed checks:

- Page title: `Thumbnail Generator`.
- Nonblank canvas pixel check: pass (`1456x896`, varied sampled pixels).
- Primary UI visible: app title, Assets/Layouts/Templates tabs, Layers/Adjust/Colors tabs, canvas, layers, and WebP export button.
- Custom font import: pass. `C:/Windows/Fonts/AGENCYB.TTF` loaded, selected option `AGENCYB (custom)`, generated value `TGFont-...`, localStorage count `1`, and `document.fonts.check(...)` returned true.
- Colors tab vertical expansion: pass. Swatch grid height `495.1875px`, inspector horizontal overflow `0`.
- CSV import: pass. Overlapping `Bottom box` and `Top box` layers applied.
- Z-order preview selection: pass. `Bottom box` was selected first, then clicking the overlap selected `Top box`.
- Preset fit: pass. `portrait` preset `1080x1920` produced frame `380.796875x635.46875` inside stage `724x680.0625` at `56%` zoom.
- HTML import: pass. Status reported `HTML applied`.
- Inspector edit: pass. Selected text updated to `QA INSPECTOR TITLE`.
- Export: pass. WebP download created (`thumbnail-1080x1920-...webp`).
- Mobile: pass. `390x844` viewport had horizontal overflow `0`; task tabs remained visible.

Console health:

- No app errors or page errors.
- One warning was produced by the QA script's repeated `getImageData` pixel-read check: Canvas readback performance warning. This is not an application runtime error.

### GitHub Pages

- Previous workflow: `Deploy GitHub Pages`, pass.
- Published URL: `https://sunmax0731.github.io/thumbnail-generator/`
