# Test Plan

## Automated Tests

- CSV parser handles quoted fields, numeric defaults, image references, and effect strings.
- HTML parser handles text, image, and shape layers.
- Export presets resolve to expected width/height/format settings.
- Canvas fit calculation shrinks tall presets and preserves landscape fit when height allows it.
- Hit testing selects the frontmost overlapping layer while preserving selected resize handles.
- Hit testing supports intentional blank-click deselection.
- Layer deletion selection helpers keep selection on valid selectable layers.
- Layer selection helpers select all editable grouped members from one grouped layer and toggle whole groups additively.
- Relative layer transforms apply common movement and rotation deltas to selected editable layers.
- Multi-selection angle matching copies the first selected editable layer rotation to the other selected editable layers.
- Live relative transform controls convert current UI values into incremental movement and rotation deltas.
- Preview padding expands for visible off-canvas layer bounds.
- Text fit chooses the largest font size that fits the text layer bounds.
- Language detection selects Japanese or English from browser language tags and falls back to English.
- Color palette registration preserves names, color-value uniqueness, opacity, legacy storage migration, and per-row Fill/Stroke application.
- Color palette editing preserves selected swatch updates, opacity, saved multi-color palette generation, and legacy group metadata tolerance.
- CSV/HTML import and layout export preserve group metadata, layer blur, edge blur, corner radius, text kerning, fill/stroke opacity, and line styles.
- CSV/HTML import and layout export preserve signed edge blur direction, stroke/outline blur participation, and text writing mode.
- Text fit accounts for kerning/letter spacing.
- Text fit accounts for vertical text column width and character height.
- Vertical text visual bounds drive selection hit testing and preview padding while horizontal text keeps configured bounds.
- YouTube thumbnail helpers extract video ids from common URL shapes and order thumbnail candidates by quality.
- Custom font helpers validate supported formats, sanitize display names, create dropdown options, read localStorage records, and deduplicate stored fonts.
- Color palette helpers generate saved palette sets for analogous, complementary, split, triad, square, compound, shades, and monochromatic modes.
- Color palette helpers convert HEX and RGB channel input for synchronized numeric palette controls.
- Edit state helpers save and read a browser-local work-in-progress snapshot and autosave preference.
- Default template definitions provide exactly 20 distinct use-case layouts, five per category, with exportable CSV/HTML and supported layer types.
- Default template metadata exposes categories and mini-preview colors for guided selection.
- Brand kit helpers normalize stored data, capture current layer style, and apply brand font/colors to selected editable layers.
- Edit state helpers serialize, parse, and delete portable JSON recovery files.
- Quality warning helpers flag long text, low contrast, safe-area edges, many layers, large exports, large assets, and large storage estimates.

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
- Canvas drag move records undo/redo history only at confirmed drag start and drag completion positions.
- Preset changes fit tall canvases such as Shorts into the visible desktop stage.
- Custom font import accepts WOFF2/WOFF/TTF/OTF, loads through FontFace, appears in the dropdown, stores in localStorage, applies to a text layer, and is reflected in export.
- Multi-selection supports group selection, group movement, and alignment.
- Grouped preview objects can be selected as a multi-selection, not only grouped rows in Layers.
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
- Registered palette colors save names, display in layer-like list rows, then apply to text/shape fill and stroke colors through per-row Fill and Stroke buttons.
- Text alignment uses three direct buttons, and the selected alignment state is visible.
- Adjust tab numeric controls edit through paired range/number inputs without duplicated value readouts in labels.
- Named templates can be saved to browser storage, loaded, and deleted.
- Multiple saved templates with the same display name are preserved.
- Current edit state can be manually saved, restored after reload, and autosaved when the autosave toggle is on.
- Image Lab opens from the sidebar in a modal workspace and supports chroma key, rectangle/circle cutout, and polygon/free cutout.
- Image Lab Rect and Circle modes support direct drag selection on the preview, then preview-handle move/resize.
- Image Lab Polygon mode supports point dragging and point deletion.
- Image Lab modal supports close button, backdrop click, and Escape-key dismissal.
- Numeric value controls expose sliders with practical min/max bounds.
- Image import accepts a local image and creates an image layer.
- Imported asset rows support selected image-layer insertion and opening the selected asset in Image Lab.
- Image Lab imports make the new image the active processing target.
- Expanded quick add inserts text, shape, line, headline, subtitle, badge, and divider starters.
- All 20 bundled default templates can be loaded from Templates without unsupported parameters or layout collapse.
- Guided start remains visible when Assets, Layouts, or Templates is active.
- Edit state controls are visible in the preview pane and support save, restore, autosave, JSON export/import, and deletion without returning to Templates.
- Text line height, stroke colors, image asset switching, and palette application disable when they do not affect the current selection.
- Adjust reset controls return selected-layer rotation to 0 degrees and opacity to 100%.
- Layers supports choosing line styles through Adjust, grouping selected layers, renaming/ungrouping groups, and fitting selected image/shape layers to the canvas.
- Adjust supports layer blur, edge blur, corner radius, text kerning, and fill/stroke opacity.
- Adjust supports signed inner/outer edge blur, optional text/shape stroke blur participation, and horizontal/vertical text writing mode.
- Colors supports selecting and updating saved swatches, palette opacity, palette maker preview, saved multi-color palette sets, and direct Fill/Stroke buttons on registered single colors.
- Colors supports Adobe-style color wheel point selection without base-color changes, linked point dragging that regenerates the other scheme colors, explicit base-color controls, large palette bars, synchronized HEX/RGB slider input with practical slider width, and recent-color reuse.
- Assets supports importing a YouTube thumbnail by URL or video id and then editing/exporting it as an image layer.
- Layers supports selecting one grouped row individually for single-layer adjustment without ungrouping.
- Keyboard shortcuts support Delete confirmation, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y without intercepting text fields or modals.
- Export path creates a data URL/download for the selected format.
- Top toolbar exposes PNG, JPG, and WebP as direct export buttons without a separate format selector or generic export button.
- Desktop and mobile viewports have no incoherent overlap.
- Template filters, guided start controls, brand kit capture/apply, Colors-to-Brand-kit color registration, GitHub Issues link, privacy notice, storage warning, edit-state JSON export/import/delete, and status warning chips are visible without blocking primary editing.

## Current Results

Latest completed on 2026-06-09.

### Automated

- `npm test`: pass. 25 test files, 82 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.

### Expanded Font Options

Completed on 2026-06-09.

- Scope: expanded hosted Google Fonts choices in the text-layer font dropdown and Brand kit font selector.
- Added unit coverage: `src/lib/fonts.test.ts`.
- `npm test`: pass. 25 test files, 82 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Runtime gate URL: `http://127.0.0.1:4192/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x900`.
- Mobile viewport: `390x844`.
- Font dropdown count: pass. The text-layer Font dropdown exposed 26 options.
- Added font option visibility: pass. Dela Gothic One, M PLUS Rounded 1c, Mochiy Pop One, Montserrat, Poppins, Rampart One, and Zen Kaku Gothic New were present.
- Font selection: pass. The text-layer Font dropdown selected `Poppins 900 (Google Fonts)` and the canvas stayed nonblank.
- CSV import: pass. Status reported `CSV applied: 2 layers.`
- HTML import: pass. Status reported `HTML applied: 2 layers.`
- Layer editing: pass. Adjust numeric X edit accepted and the canvas stayed nonblank.
- Export: pass. WebP download created at `output/runtime-downloads-20260609-fonts/thumbnail-1280x720-2026-06-08T16-55-33-752Z.webp`.
- Mobile: pass. `390x844` viewport rendered a nonblank canvas and had horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-fonts-desktop.png`
  - `docs/assets/runtime-20260609-fonts-mobile.png`
- Console health: no page errors or relevant console warnings were reported. The gate used `getImageData` readbacks for canvas nonblank checks; Chromium may warn about frequent readbacks, but that is test-induced and not an app runtime error.

### Browser Runtime Gate

- URL: `http://127.0.0.1:4191/thumbnail-generator/`
- Tool: Playwright headless Chromium.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x900`
- Mobile viewport: `390x844`
- Evidence screenshots:
  - `docs/assets/runtime-20260608-open-p2-desktop.png`
  - `docs/assets/runtime-20260608-open-p2-mobile.png`

Passed checks:

- Page title: `Thumbnail Generator`.
- Nonblank canvas pixel check: pass on initial render and after every bundled default template load.
- Default template count: pass. Templates panel exposed exactly 20 bundled templates.
- Default template category filters: pass. YouTube, Shorts, Stream, and Cutout each exposed exactly 5 templates.
- Default template load: pass for all 20 templates, with nonblank canvas and visible layer rows after each load.
- Guided start visibility: pass. The guided start section remained visible on Assets, Layouts, and Templates.
- Edit state placement: pass. Save, restore, export/import, delete, autosave, saved-state metadata, and privacy/storage guidance were visible in the preview pane.
- Colors-to-Brand-kit registration: pass. The Colors tab registered a preview color as the Brand kit primary color and reported the status.
- Templates service section removal: pass. No `.service-section` rendered in the Templates tab.
- Layer list after template load: pass. Each loaded template exposed editable layer rows.
- CSV import: pass. Status reported `CSV applied: 2 layers.`
- HTML import: pass. Status reported `HTML applied: 2 layers.`
- Layer editing: pass. Adjust numeric X edit accepted in the inspector and canvas remained nonblank.
- Export: pass. WebP download created at `output/runtime-downloads-20260608-open-p2/thumbnail-1080x1920-2026-06-07T21-02-02-508Z.webp`.
- Mobile: pass. `390x844` viewport rendered a nonblank canvas, showed Guided start and preview-pane Edit state, and had horizontal overflow `0`.

Console health:

- No page errors or app HTTP 4xx/5xx responses were reported.
- The gate used `getImageData` readbacks for canvas nonblank checks; Chromium may warn about frequent readbacks, but that is test-induced and not an app runtime error.

### GitHub Pages

- Previous workflow: `Deploy GitHub Pages`, pass.
- Published URL: `https://sunmax0731.github.io/thumbnail-generator/`

### QCDS Code Starter Visibility

Completed on 2026-06-07.

- Code Starter-facing summary: pass.
- Machine-readable source: `docs/qcds-code-starter-summary.json`.
- Human-readable source: `docs/qcds-code-starter-summary.md`.
- Display label: `QCDS A+`.
- Axis label: `Q:A+ C:A+ D:A+ S:A+`.
- Previous `D-` display cause: unevaluated/open-work-item fallback for an issue that listed QCDS axes but did not yet have a work-item-linked per-axis rating artifact.
- Current work item: `Issues/0063-qcds-code-starter.md`, closed.
- Validation: `npm test` passed with 22 test files and 71 tests; `npm run build` passed.
- Runtime gate: pass with Playwright headless Chromium at `http://127.0.0.1:4186/thumbnail-generator/`.
- Runtime gate checks: nonblank initial canvas, primary workspace visible, CSV import, HTML import, Adjust X edit from `130` to `140`, and WebP export download.
- Runtime gate export evidence: `thumbnail-1280x720-2026-06-07T13-15-49-232Z.webp`.
- Manual note: if the VS Code Code Starter view is cached, reload/refresh the view after this repository update.

### Screenshot Feature Guide

Completed on 2026-06-07 for `Issues/0064-issue.md`.

- Added screenshot-based feature walkthrough: `docs/screenshot-guide.md`.
- Source captures were read from `dist/assets/screenshot/` and copied to tracked documentation assets named `docs/assets/screenshot-guide-*.png`.
- README access path: `README.md` -> `docs/screenshot-guide.md`.
- Markdown/image-link check: pass. All local image references in `docs/screenshot-guide.md` exist under `docs/assets/`.
- UTF-8 check: pass. Updated Markdown files read successfully with UTF-8.
- `npm test`: pass. 22 test files, 71 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Browser runtime gate: pass with Playwright headless Chromium at `http://127.0.0.1:4187/thumbnail-generator/`. Nonblank render, primary UI visible, CSV import, HTML import, layer edit, and WebP export path were exercised after the documentation update.
- Runtime gate export evidence: `thumbnail-1280x720-2026-06-07T14-03-52-685Z.webp`.
- Console health: no page errors and no app HTTP 4xx/5xx responses were reported.

### Work Items 0065-0068 UIUX, Creator, Reliability, Service Display

Completed on 2026-06-08.

- Issues closed: `Issues/0065-uiux.md`, `Issues/0066-issue.md`, `Issues/0067-issue.md`, and `Issues/0068-issues.md`.
- `npm test`: pass. 24 test files, 78 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Runtime gate URL: `http://127.0.0.1:4188/thumbnail-generator/`.
- Desktop viewport: `1440x900`.
- Mobile viewport: `390x844`.
- Evidence screenshots:
  - `docs/assets/runtime-20260608-desktop.png`
  - `docs/assets/runtime-20260608-mobile.png`
- Runtime gate checks: pass. Nonblank initial canvas, primary workspace visible, English language switch, template filter count, Brand kit capture/apply, GitHub Issues URL, privacy notice, CSV import, HTML import, Adjust X edit from `90` to `100`, WebP export download, mobile canvas-first layout, and mobile horizontal overflow `0`.
- Runtime gate export evidence: `output/runtime-downloads-20260608/thumbnail-1280x720-2026-06-07T16-12-01-946Z.webp`.
- Console health: no page errors, relevant console warnings, or app HTTP 4xx/5xx responses were reported.

### Toolbar Export Integration

Completed on 2026-06-08.

- Change: removed the redundant top-toolbar format selector and generic Export button. PNG, JPG, and WebP buttons now choose the format and export directly.
- `npm test`: pass. 24 test files, 78 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Runtime gate URL: `http://127.0.0.1:4189/thumbnail-generator/`.
- Runtime gate checks: pass. The `.format-field` count was `0`, the generic `出力` button count was `0`, PNG/JPG/WebP export buttons were each present once, WebP direct export downloaded a `.webp` file, and no page errors or relevant console warnings were reported.
