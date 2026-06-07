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
- Default template definitions provide exactly 10 distinct use-case layouts with exportable CSV/HTML and supported layer types.

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
- All 10 bundled default templates can be loaded from Templates without unsupported parameters or layout collapse.
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
- Desktop and mobile viewports have no incoherent overlap.

## Current Results

Completed on 2026-06-07.

### Automated

- `npm test`: pass. 22 test files, 71 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.

### Browser Runtime Gate

- URL: `http://127.0.0.1:4186/thumbnail-generator/`
- Tool: Playwright headless Chromium.
- Desktop viewport: `1440x900`
- Mobile viewport: `390x844`
- Evidence screenshots:
  - `docs/assets/runtime-default-templates-20260607-desktop.png`
  - `docs/assets/runtime-default-templates-20260607-mobile.png`

Passed checks:

- Page title: `Thumbnail Generator`.
- Nonblank canvas pixel check: pass on initial render and after every bundled default template load.
- Default template count: pass. Templates panel exposed exactly 10 bundled templates.
- Default template load: pass for Creator Live, Product Review, Tutorial Steps, Shorts Quote, Breaking News, Versus Comparison, Gaming Highlight, Podcast Guest, Event Countdown, and Minimal Launch.
- Layer list after template load: pass. Each loaded template exposed editable layer rows.
- CSV import: pass. Status reported `CSV applied: 2 layers.`
- HTML import: pass. Status reported `HTML applied: 2 layers.`
- Layer editing: pass. Adjust numeric X edit accepted in the inspector and canvas remained nonblank.
- Export: pass. WebP download created (`thumbnail-1280x720-2026-06-07T11-36-17-278Z.webp` during export selector verification; full gate also produced a `.webp` download).
- Mobile: pass. `390x844` viewport exposed all 10 templates, rendered a nonblank canvas, and had horizontal overflow `0`.

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
