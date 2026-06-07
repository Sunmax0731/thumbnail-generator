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
- Multi-selection angle matching copies the first selected editable layer rotation to the other selected editable layers.
- Live relative transform controls convert current UI values into incremental movement and rotation deltas.
- Preview padding expands for visible off-canvas layer bounds.
- Text fit chooses the largest font size that fits the text layer bounds.
- Language detection selects Japanese or English from browser language tags and falls back to English.
- Color palette registration preserves names, Fill/Stroke targets, uniqueness, and legacy storage migration.
- Custom font helpers validate supported formats, sanitize display names, create dropdown options, read localStorage records, and deduplicate stored fonts.
- Edit state helpers save and read a browser-local work-in-progress snapshot and autosave preference.
- Default template definitions provide multiple use-case layouts with exportable CSV/HTML.

## Manual Browser Runtime Gate

The WebApp runtime gate is passed only when Chrome or a headless browser confirms:

- Nonblank app render.
- Header, left import panel, canvas, layer list, inspector, and export controls are visible.
- Japanese and English UI labels can be switched from the top toolbar.
- Initial language detection chooses a supported language, and unsupported language tags fall back to English in unit coverage.
- Clicking blank preview space clears selection and updates the stage/inspector state.
- Left sidebar task tabs expose Assets, Layouts, and Templates without crowding the first viewport.
- Right inspector task tabs expose Layers, Adjust, and Colors without crowding the first viewport.
- Layers and Colors tabs expose resizable list areas with no overlap or horizontal overflow.
- CSV import updates the canvas/layer list.
- HTML import updates the canvas/layer list.
- Preview selection respects layer stacking order when layers overlap.
- Layer inspector edits position, size, rotation, color, stroke, font, and effects.
- Canvas direct editing supports drag move, corner resize, and rotation handle drag.
- Preset changes fit tall canvases such as Shorts into the visible desktop stage.
- Custom font import accepts WOFF2/WOFF/TTF/OTF, loads through FontFace, appears in the dropdown, stores in localStorage, applies to a text layer, and is reflected in export.
- Multi-selection supports group selection, group movement, and alignment.
- Multi-selection supports live relative X/Y movement and relative rotation from the Adjust tab without Apply buttons.
- Multi-selection supports matching selected layer angles to the first selected editable layer from the Adjust tab.
- Single selection can align to the canvas.
- Selection handles remain visible in preview padding outside the thumbnail document area.
- Off-canvas layer overflow remains visible and editable in the preview while export remains clipped to the output canvas.
- Text layers can run Fit text to box and remain inside the configured bounds.
- The rotation handle has distinct normal, hover, and drag states and uses a grab/grabbing cursor.
- Layers panel supports drag-and-drop stacking order edits.
- Layers panel supports visibility and selectable/editable lock toggles.
- Layers panel supports Delete-key removal for a focused editable row.
- Layers panel delete buttons open a confirmation dialog; cancel preserves the layer and confirm removes it.
- Registered palette colors save names and Fill/Stroke targets, display in layer-like list rows, then apply to text/shape fill and stroke colors.
- Text alignment uses three direct buttons, and the selected alignment state is visible.
- Adjust tab numeric controls edit through paired range/number inputs without duplicated value readouts in labels.
- Named templates can be saved to browser storage, loaded, and deleted.
- Multiple saved templates with the same display name are preserved.
- Current edit state can be manually saved, restored after reload, and autosaved when the autosave toggle is on.
- Image Lab opens from the sidebar in a modal workspace and supports chroma key, rectangle/circle cutout, polygon/free cutout, and drag-range cutout.
- Image Lab Rect and Circle modes support direct drag selection on the preview.
- Image Lab modal supports close button, backdrop click, and Escape-key dismissal.
- Numeric value controls expose sliders with practical min/max bounds.
- Image import accepts a local image and creates an image layer.
- Imported asset rows support selected image-layer insertion and opening the selected asset in Image Lab.
- Image Lab imports make the new image the active processing target.
- Expanded quick add inserts headline, subtitle, badge, and divider starters.
- Bundled default templates can be loaded from Templates.
- Text line height, stroke colors, image asset switching, and palette application disable when they do not affect the current selection.
- Adjust reset controls return selected-layer rotation to 0 degrees and opacity to 100%.
- Export path creates a data URL/download for the selected format.
- Desktop and mobile viewports have no incoherent overlap.

## Current Results

Completed on 2026-06-07.

### Automated

- `npm test`: pass. 20 test files, 53 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.

### Browser Runtime Gate

- URL: `http://127.0.0.1:4174/thumbnail-generator/`
- Browser path attempted first: Browser plugin.
- Browser fallback reason: Browser tools were not exposed in this session after tool discovery.
- Fallback used: Playwright 1.60.0 headless Chromium.
- Desktop viewport: `1440x900`
- Mobile viewport: `390x844`
- Evidence screenshots:
  - `docs/assets/runtime-backlog-20260607-desktop.png`
  - `docs/assets/runtime-backlog-20260607-mobile.png`

Passed checks:

- Page title: `Thumbnail Generator`.
- Nonblank canvas pixel check: pass (`1500x940`, 3 distinct sampled colors).
- Primary UI visible: app title, Assets/Layouts/Templates tabs, Layers/Adjust/Colors tabs, canvas, layers, and WebP export button.
- Text newline edit regression: pass. Editing a text layer to `LINE ONE`, `LINE TWO`, and `LINE THREE` produced no page errors and no `Cannot read properties of null (reading 'value')`.
- Disabled inert controls: pass. Single-line text line height was disabled, then became enabled after multiline text input.
- Adjust reset: pass. Reset rotation and Reset opacity controls were clickable from Adjust.
- Quick Add: pass. Headline and Badge starters inserted editable layers.
- Asset row action: pass. Selected asset was added as an image layer.
- Image Lab selected asset path: pass. Asset-row scissors opened the modal with an editable preview; Rect drag selection and Create processed layer produced a processed image layer.
- Default templates: pass. Product Review loaded from Templates and replaced the canvas state.
- CSV import: pass. Status reported `CSV applied`.
- HTML import: pass. Status reported `HTML applied`.
- Export: pass. WebP download created (`thumbnail-1280x720-2026-06-07T02-08-33-351Z.webp`).
- Mobile: pass. `390x844` viewport had horizontal overflow `0`; task tabs remained visible.

Console health:

- No app errors, page errors, or console errors were reported.

Documentation release evidence:

- README user-facing release guidance: pass.
- Codex Work Dashboard QCDS re-evaluation: pass. See `docs/codex-work-dashboard-qcds.md`.

### GitHub Pages

- Previous workflow: `Deploy GitHub Pages`, pass.
- Published URL: `https://sunmax0731.github.io/thumbnail-generator/`
