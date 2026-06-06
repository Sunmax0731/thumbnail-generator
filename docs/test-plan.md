# Test Plan

## Automated Tests

- CSV parser handles quoted fields, numeric defaults, image references, and effect strings.
- HTML parser handles text, image, and shape layers.
- Export presets resolve to expected width/height/format settings.
- Canvas fit calculation shrinks tall presets and preserves landscape fit when height allows it.
- Hit testing selects the frontmost overlapping layer while preserving selected resize handles.
- Hit testing supports intentional blank-click deselection.
- Layer deletion selection helpers keep selection on valid selectable layers.
- Relative layer transforms apply common movement and rotation deltas to selected editable layers.
- Preview padding expands for visible off-canvas layer bounds.
- Text fit chooses the largest font size that fits the text layer bounds.
- Language detection selects Japanese or English from browser language tags and falls back to English.
- Color palette registration preserves names, Fill/Stroke targets, uniqueness, and legacy storage migration.
- Custom font helpers validate supported formats, sanitize display names, create dropdown options, read localStorage records, and deduplicate stored fonts.

## Manual Browser Runtime Gate

The WebApp runtime gate is passed only when Chrome or a headless browser confirms:

- Nonblank app render.
- Header, left import panel, canvas, layer list, inspector, and export controls are visible.
- Japanese and English UI labels can be switched from the top toolbar.
- Initial language detection chooses a supported language, and unsupported language tags fall back to English in unit coverage.
- Clicking blank preview space clears selection and updates the stage/inspector state.
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
- Multi-selection supports relative X/Y movement and relative rotation from the Adjust tab.
- Single selection can align to the canvas.
- Selection handles remain visible in preview padding outside the thumbnail document area.
- Off-canvas layer overflow remains visible and editable in the preview while export remains clipped to the output canvas.
- Text layers can run Fit text to box and remain inside the configured bounds.
- The rotation handle has distinct normal, hover, and drag states and uses a grab/grabbing cursor.
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

- `npm test`: pass. 17 test files, 44 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.

### Browser Runtime Gate

- URL: `http://127.0.0.1:4173/thumbnail-generator/`
- Browser path attempted first: Browser plugin.
- Browser fallback reason: in-app Browser returned `Browser is not available: iab`.
- Fallback used: Playwright 1.60.0 headless Chromium.
- Desktop viewport: `1440x900`
- Mobile viewport: `390x844`
- Evidence screenshots:
  - `docs/assets/runtime-p2-work-items-japanese.png`
  - `docs/assets/runtime-p2-work-items-desktop.png`
  - `docs/assets/runtime-p2-work-items-mobile.png`

Passed checks:

- Page title: `Thumbnail Generator`.
- Nonblank canvas pixel check: pass (`1500x940`, varied sampled pixels).
- Primary UI visible: app title, Assets/Layouts/Templates tabs, Layers/Adjust/Colors tabs, canvas, layers, and WebP export button.
- Initial language: pass. Headless Chromium started in Japanese UI; language selector switched to English for the rest of the gate.
- Blank-click deselection: pass. Clicking preview padding changed the stage selection label to `None`.
- Text fit: pass. `Main title` font size changed from `104` to `142`.
- Multi-select relative edit: pass. `Main title` and `Subtitle` received Move `12,-8` and Rotation `+15`; generated CSV reflected `Main title,90,74,...,12` and `Subtitle,103,524,...,13`.
- Off-canvas preview: pass. Moving `Cyan slash` to `x=-220` expanded the edit canvas to `1918x1358`.
- Rotation handle: pass. Hover cursor was `grab`; drag completed with `Rotate complete.`
- CSV import: pass. Status reported `CSV applied`.
- HTML import: pass. Status reported `HTML applied`.
- Image import: pass. A local image file import created an image layer and status reported `Imported 1 image file`.
- Export: pass. WebP download created (`thumbnail-1280x720-...webp`).
- Mobile: pass. `390x844` viewport had horizontal overflow `0`; task tabs remained visible.

Console health:

- No app errors or page errors.
- One warning was produced by the QA script's repeated `getImageData` pixel-read check: Canvas readback performance warning. This is not an application runtime error.

### GitHub Pages

- Previous workflow: `Deploy GitHub Pages`, pass.
- Published URL: `https://sunmax0731.github.io/thumbnail-generator/`
