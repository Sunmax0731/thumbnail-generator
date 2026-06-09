# Test Plan

## Automated Tests

- CSV parser handles quoted fields, numeric defaults, image references, and effect strings.
- HTML parser handles text, image, and shape layers.
- Export presets resolve to expected width/height/format settings.
- Canvas fit calculation shrinks tall or wide presets by visible width/height and preserves preferred fit only when both axes allow it.
- Hit testing selects the frontmost overlapping layer while preserving selected resize handles.
- Hit testing supports intentional blank-click deselection.
- Layer deletion selection helpers retain other selected layers but leave no fallback selection after deleting the only selected layer.
- Layer selection helpers select all editable grouped members from one grouped layer and toggle whole groups additively.
- Relative layer transforms apply common movement and rotation deltas to selected editable layers.
- Multi-selection angle matching copies the first selected editable layer rotation to the other selected editable layers.
- Multi-selection distribution spaces three or more selected layers evenly by horizontal or vertical centers.
- Live relative transform controls convert current UI values into incremental movement and rotation deltas.
- Preview zoom and output-frame sizing remain stable when layers move off canvas.
- Text fit chooses the largest font size that fits the text layer bounds.
- Language detection selects Japanese or English from browser language tags and falls back to English.
- Color palette registration preserves names, color-value uniqueness, opacity, legacy storage migration, and per-row Fill/Stroke application.
- Color palette editing preserves selected swatch updates, opacity, saved multi-color palette generation, and legacy group metadata tolerance.
- CSV/HTML import and layout export preserve group metadata, layer blur, edge blur, corner radius, text kerning, fill/stroke opacity, expanded shape kinds, and line styles.
- CSV/HTML import and layout export preserve signed edge blur direction, stroke/outline blur participation, and text writing mode.
- Text fit accounts for kerning/letter spacing.
- Text fit accounts for vertical text column width and character height.
- Vertical text uses configured layer bounds for selection hit testing, preview resize handles, and Adjust width/height edits.
- Vertical text preview resizing changes the configured display bounds without translating the anchored corner unexpectedly.
- YouTube thumbnail helpers extract video ids from common URL shapes and order thumbnail candidates by quality.
- Custom font helpers validate supported formats, sanitize display names, create dropdown options, read localStorage records, and deduplicate stored fonts.
- Color palette helpers generate saved palette sets for analogous, complementary, split, triad, square, compound, shades, and monochromatic modes.
- Color palette helpers convert HEX and RGB channel input for palette controls.
- Edit state helpers save and read a browser-local work-in-progress snapshot and autosave preference.
- Default template definitions provide exactly 38 distinct use-case layouts, five each for YouTube, Shorts, Stream, and Cutout, eight Schedule templates, and ten animated Motion templates, with exportable CSV/HTML and supported layer types.
- Weekly Schedule Landscape and Weekly Schedule Portrait keep Sunday-start weekday labels in `SUN`, `MON`, `TUE`, `WED`, `THU`, `FRI`, `SAT` order.
- Default template metadata exposes categories and mini-preview colors for guided selection.
- Layer animation helpers apply fade, slide, pop, pulse, blink, drift, zoom, spin, sway, shake, and breathe transforms, including multiple ordered animation entries, without mutating source layer state.
- Easing helpers expose linear plus easings.net-style Sine, Quad, Cubic, Quart, Quint, Expo, Circ, Back, Elastic, and Bounce curves.
- CSV/HTML import and layout export preserve optional layer animation metadata.
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
- Clicking the preview area outside the output frame clears selection when pan mode is not active.
- Left sidebar task tabs expose Assets and Templates without showing the hidden Layouts tab.
- The preview-pane Generated layout section remains hidden from the GUI while edit-state and template compatibility keep CSV/HTML text internally.
- Right inspector task tabs expose Layers, Adjust, and Colors without crowding the first viewport.
- Layers exposes collapsible Quick Add above a collapsible layer list.
- Layers and Colors tabs expose resizable list areas with no overlap or horizontal overflow.
- Default templates and Browser templates expose resizable list areas with no overlap or horizontal overflow.
- CSV import updates the canvas/layer list.
- HTML import updates the canvas/layer list.
- Preview selection respects layer stacking order when layers overlap.
- Layer inspector edits position, size, rotation, color, stroke, font, and effects.
- Canvas direct editing supports drag move, corner resize, and rotation handle drag.
- Canvas drag move records undo/redo history only at confirmed drag start and drag completion positions.
- Preset changes keep the current preview zoom until Fit canvas is selected.
- Preview pan works through the Pan button, Space-drag, or Alt-drag without changing zoom.
- Dragging a layer outside the document keeps the displayed zoom, effective canvas scale, and output frame stable.
- Custom font import accepts WOFF2/WOFF/TTF/OTF, loads through FontFace, appears in the dropdown, stores in localStorage, applies to a text layer, and is reflected in export.
- Multi-selection supports group selection, group movement, and alignment.
- Grouped preview objects can be selected as a multi-selection, not only grouped rows in Layers.
- Multi-selection supports live relative X/Y movement and relative rotation from the Adjust tab without Apply buttons.
- Multi-selection supports matching selected layer angles to the first selected editable layer from the Adjust tab.
- Multi-selection supports horizontal and vertical even distribution from Layers.
- Single selection can align to the canvas.
- The preview does not stretch a surrounding edit-only checker area around off-canvas layer overflow, and export remains clipped to the output canvas.
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
- Image Lab opens from imported asset rows in a modal workspace and supports chroma key, rectangle/circle cutout, and polygon/free cutout.
- Image Lab Rect and Circle modes support direct drag selection on the preview, then preview-handle move/resize.
- Image Lab Polygon mode supports point dragging and point deletion.
- Image Lab modal supports close button, backdrop click, and Escape-key dismissal.
- Numeric value controls expose sliders with practical min/max bounds.
- Image import accepts a local image and creates an image layer.
- Imported asset rows support selected image-layer insertion and opening the selected asset in Image Lab.
- Image Lab does not duplicate image import or asset-selection controls; source changes stay in Assets before opening the modal.
- Expanded quick add in Layers inserts text, shape, line, headline, subtitle, badge, divider, and selected-image starters.
- All 38 bundled default templates can be loaded from Templates without unsupported parameters or layout collapse.
- Schedule filter shows exactly eight bundled templates and each schedule template renders nonblank.
- Weekly schedule templates render Sunday-start day labels in both landscape and portrait orientations.
- Motion filter shows exactly ten animated eyecatch/waiting templates and each motion template renders nonblank.
- Motion tab can assign a selected-layer animation preset, preview the selected object, and show the easing graph.
- Motion tab exposes 12 animation types, 31 easing choices, direction `None`, and disables distance while direction `None` is selected.
- OBS preview opens in a popup-style separate window and renders a nonblank animated canvas without editor controls or selection handles.
- Guided start is not visible in the left panel.
- Edit state controls are visible in the preview pane and support save, restore, autosave, JSON export/import, and deletion without returning to Templates.
- Text line height, stroke colors, image asset switching, and palette application disable when they do not affect the current selection.
- Adjust reset controls return selected-layer rotation to 0 degrees.
- Layers supports choosing line styles through Adjust, grouping selected layers, renaming/ungrouping groups, and fitting selected image/shape layers to the canvas.
- Adjust supports layer blur, edge blur, corner radius, text kerning, expanded shape kinds, and Fill/Stroke color buttons that open a draggable popup compact single-color picker with alpha.
- Adjust supports signed inner/outer edge blur, optional text/shape stroke blur participation, and horizontal/vertical text writing mode.
- Vertical text display bounds can be changed through Adjust width/height controls and direct preview resize handles without the text moving instead of resizing.
- Colors supports selecting and updating saved swatches, palette opacity, palette maker preview, saved multi-color palette sets, and direct Fill/Stroke buttons on registered single colors.
- Colors supports Adobe-style color wheel point selection without base-color changes, linked point dragging that regenerates the other scheme colors, a palette-pattern dropdown to the left of the wheel, explicit base-color controls, large palette bars, embedded `@uiw/react-color` Sketch-style HEX/RGB/alpha input, and recent-color reuse.
- Assets supports importing a YouTube thumbnail by URL or video id and then editing/exporting it as an image layer.
- Layers supports selecting one grouped row individually for single-layer adjustment without ungrouping.
- Keyboard shortcuts support Delete confirmation, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y without intercepting text fields or modals.
- Export path creates a data URL/download for the selected format.
- Top toolbar exposes PNG, JPG, and WebP as direct export buttons without a separate format selector or generic export button.
- Desktop and mobile viewports have no incoherent overlap.
- Template filters, hidden Brand kit setup in Templates, hidden Colors-side Brand kit registration buttons, GitHub Issues link, privacy notice, storage warning, edit-state JSON export/import/delete, and status warning chips are visible without blocking primary editing.

## Current Results

Latest completed on 2026-06-10.

### Theme, Palette Reorder, And Pages Follow-Up

Completed on 2026-06-10 for the requested bottom-pane layout, Colors reorder, theme controls, and GitHub Pages reflection.

- `npm test`: pass. 27 test files, 102 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4212/thumbnail-generator/`.
- Tool: Playwright headless Chromium.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks: primary UI visible, initial canvas nonblank, language and theme controls visible in the top-right toolbar, dark theme selected from the theme selector and persisted to `thumbnail-generator.theme.v1`, Export and Edit state rendered side by side on desktop, Export and Edit state action groups each used one vertical column, saved multi-color palettes reordered by drag/drop and persisted to `thumbnail-generator.savedColorPalettes.v1`, registered single colors reordered by drag/drop and persisted to `thumbnail-generator.colorPalette.v1`, Adjust layer X editing kept the canvas nonblank, WebP export downloaded, mobile canvas nonblank, mobile horizontal overflow `0`, and no page errors or app console errors were reported.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-theme-reorder-desktop.png`
  - `docs/assets/runtime-20260610-theme-reorder-mobile.png`
- Export evidence: `output/runtime-downloads-20260610-theme-reorder-pages/thumbnail-1280x720-2026-06-09T15-53-50-093Z.webp`.
- GitHub Pages: `.github/workflows/pages.yml` deploys on pushes to `codex/thumbnail-generator-static-app`, so pushing this validated branch triggers the Pages build/deploy workflow.

### Export, Colors, And Adjust Layout Follow-Up

Completed on 2026-06-10 for the requested Export, Colors, and Adjust UI cleanup.

- `npm test`: pass. 26 test files, 99 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4211/thumbnail-generator/`.
- Tool: Playwright headless Chromium.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks: primary UI visible, initial canvas nonblank, Export and Edit state shared a one-column bottom layout with matching width and left edge, Export actions rendered as three columns, a text layer was selected and Adjust showed common `Layer` controls above `Text settings`, Adjust X editing kept the canvas nonblank, registered single-color Fill button text was `Fill`, legacy `Fill #10b6d7` displayed as `#10b6d7`, saved palette color rows showed only HEX values without `Color 1` labels, WebP export downloaded, mobile canvas nonblank, mobile horizontal overflow `0`, and no page errors or app console errors were reported.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-export-colors-adjust-desktop.png`
  - `docs/assets/runtime-20260610-export-colors-adjust-mobile.png`
- Export evidence: `output/runtime-downloads-20260610-export-colors-adjust/thumbnail-1280x720-2026-06-09T15-29-06-954Z.webp`.

### ImageLab, Motion, Analytics, And Preview Export Follow-Up

Completed on 2026-06-09 for `Issues/0084-ui-motion-analytics-followup.md`.

- `npm test`: pass. 26 test files, 99 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4210/thumbnail-generator/`.
- Tool: Playwright headless Chromium.
- Desktop viewport: `1440x900`.
- Mobile viewport: `390x844`.
- Checks: title/header `サムネイル作成支援サービス`, no header subtitle, no Generated layout section, no Quality label, GA config `G-1LR6HRMGXE` and analytics scripts present, initial canvas nonblank, Image Lab default range `範囲なし` and range sliders disabled, delete flow changed selected layer rows from `1` to `0`, registered single-color row had no visible `Fill` or HEX code, saved palette rows showed `#10b6d7`, Motion disabled direction for Fade and enabled it for Slide, Add motion created two motion-set buttons, WebP export downloaded, mobile canvas nonblank, and mobile horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-ui-motion-analytics-desktop.png`
  - `docs/assets/runtime-20260609-ui-motion-analytics-mobile.png`
- Export evidence: `output/runtime-downloads-20260609-ui-motion-analytics/thumbnail-1280x720-2026-06-09T14-51-40-218Z.webp`.
- Console health: no page errors or app console errors were reported.

### Popup Color Picker And Template List Resizing

Completed on 2026-06-09.

- Scope: changed Adjust Fill/Stroke color selection from an in-tab panel to a draggable popup, added selection clearing from the preview area outside the output frame, and added independent resize handles for Default templates and Browser templates.
- `npm test`: pass. 26 test files, 98 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Runtime gate URL: `http://127.0.0.1:4200/thumbnail-generator/`.
- Browser automation path: Playwright headless Chromium.
- Desktop viewport: `1440x1100`.
- Mobile viewport: `390x844`.
- Primary UI: pass. Header, Assets/Templates tabs, preview, inspector tabs, and export controls were visible.
- Adjust color popup: pass. Fill/Stroke color display opened a fixed-position popup with Sketch picker count `1`, palette wheel count `0`, five color inputs, no confirm-backdrop wrapper, and drag movement from `1050,128` to `940,205`.
- Preview outside-frame deselection: pass. A selected shape produced selected row count `1`; clicking the preview area outside the output frame changed selected row count to `0` and the stage label to `未選択`.
- Template list resizing: pass. Default templates height changed `260 -> 332`; Browser templates height changed `220 -> 166`.
- Canvas render: pass. Runtime canvas dimensions were `1280x720` and nonblank.
- Mobile: pass. `390x844` viewport had horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-popup-template-resize-desktop.png`
  - `docs/assets/runtime-20260609-popup-template-resize-mobile.png`
- Console health: no page errors, relevant console warnings, or app HTTP 4xx/5xx responses were reported.

### Image Lab, Single-Color Picker, And OBS Preview Follow-Up

Completed on 2026-06-09.

- Scope: moved Shape stroke width above the shape dropdown, replaced Adjust Fill/Stroke color menus with compact single-color Sketch-style pickers, kept the preview output frame fixed when objects move off canvas, removed the standalone Assets Image Lab button, removed Image Lab import and asset-selection controls, separated chroma-key settings from processed-layer creation, moved processed-layer creation to the Image Lab header, placed chroma-key settings beside position/size controls, and changed OBS preview to a popup-style canvas-only window with fullscreen request.
- `npm test`: pass. 26 test files, 98 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Runtime gate URL: `http://127.0.0.1:4199/thumbnail-generator/`.
- Browser automation path: Playwright headless Chromium.
- Desktop viewport: `1440x1100`.
- Mobile viewport: `390x844`.
- Primary UI: pass. Header, Assets/Templates tabs, preview, inspector tabs, and export controls were visible.
- Adjust shape order: pass. The selected shape controls showed Stroke width before the Shape dropdown.
- Adjust color picker: pass. Fill/Stroke color display opened one Sketch-style single-color picker with five inputs, `0` color wheels, and `0` palette bars.
- Preview output frame: pass. Runtime canvas dimensions stayed `1280x720`, and the surrounding edit-only checker/padding was not stretched around off-canvas content.
- Assets/Image Lab entry: pass. Standalone Assets Image Lab buttons count was `0`; imported asset-row Image Lab button count was `1`.
- Image Lab cleanup: pass. Source/import sections, file inputs, and asset-selection dropdowns count were `0`; the processed-layer button was present in the modal header; chroma-key settings rendered inline beside position/size controls.
- OBS preview: pass. The preview document contained one canvas, no toolbar/header/nav-like controls, and no body text. The app opened the preview with popup/no-toolbar feature flags and requested fullscreen; actual browser chrome capture remains controlled by the browser and OBS.
- Export: pass. WebP download created at `output/runtime-downloads-20260609-imagelab-color-obs/thumbnail-1280x720-2026-06-09T10-58-13-045Z.webp`.
- Mobile: pass. `390x844` viewport rendered a nonblank canvas and had horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-imagelab-color-obs-desktop.png`
  - `docs/assets/runtime-20260609-imagelab-color-obs-mobile.png`
- Console health: no page errors, relevant console warnings, or app HTTP 4xx/5xx responses were reported.

### Colors, Adjust, Shape, And Preview Follow-Up

Completed on 2026-06-09.

- Scope: moved the Colors palette-pattern dropdown to the left of the color wheel, removed Colors Brand kit Primary/Accent/Shadow registration buttons, fixed off-canvas preview drag so zoom and canvas scale remain stable, added Japanese labels for distribution buttons, added Diamond/Pentagon/Hexagon/Star shape choices, rounded polygon corners through `cornerRadius`, removed overall Adjust opacity plus separate Fill/Stroke opacity sliders, and opened the shared palette-wheel/Sketch color picker from Adjust Fill and Stroke color displays.
- `npm test`: pass. 26 test files, 98 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Runtime gate URL: `http://127.0.0.1:4198/thumbnail-generator/`.
- Browser automation path: Playwright headless Chromium.
- Desktop viewport: `1440x1100`.
- Mobile viewport: `390x844`.
- Primary UI: pass. Header, left Assets/Templates tabs, preview, inspector tabs, and export controls were visible.
- Colors UI: pass. The palette-pattern dropdown was the first item in `.palette-maker-preview`, immediately before `.palette-wheel`; `.brand-color-actions` count was `0`; old `.palette-preview-strip` count was `0`.
- Shape UI: pass. Shape options included `diamond`, `pentagon`, `hexagon`, and `star`; Star accepted `cornerRadius: 32`.
- Adjust cleanup: pass. Adjust no longer showed overall `Opacity`, `Fill opacity`, or `Stroke opacity` controls for the selected shape.
- Adjust color picker: pass. Fill and Stroke color display buttons opened the shared palette-wheel and Sketch-style picker. Fill changed to `#D710B6 / 100%`; supplementary Stroke check changed Stroke to `#C7D435 / 100%`.
- Preview off-canvas drag: pass. Dragging the selected shape outside the document kept zoom `94%` to `94%`; effective canvas scale stayed stable within tolerance.
- Export: pass. WebP download created at `output/runtime-downloads-20260609-shape-color-followup/thumbnail-1280x720-2026-06-09T10-01-08-547Z.webp`.
- Mobile: pass. `390x844` viewport rendered a nonblank canvas and had horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-shape-color-followup-desktop.png`
  - `docs/assets/runtime-20260609-shape-color-followup-mobile.png`
- Console health: no page errors, relevant console warnings, or app HTTP 4xx/5xx responses were reported.

### UI Reposition, Preview Pan, And Colors Layout

Completed on 2026-06-09.

- Scope: hid the left Layouts tab, removed the left guided start strip, hid Templates Brand kit setup, moved Quick Add to the top of Layers with collapse controls, made the Layers list collapsible, added horizontal and vertical even distribution, moved Fit to canvas into Adjust, disabled automatic preview zoom changes on preset changes, added preview pan, and reorganized Colors with palette bars below the wheel plus collapsible saved palette and registered color lists.
- `npm test`: pass. 26 test files, 95 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Runtime gate URL: `http://127.0.0.1:4197/thumbnail-generator/`.
- Browser automation path: Playwright headless Chromium.
- Desktop viewport: `1440x1100`.
- Mobile viewport: `390x844`.
- Primary UI: pass. Header, left Assets/Templates tabs, preview, Layers/Adjust/Colors inspector, and export controls were visible.
- Left panel cleanup: pass. Layouts tab, guided start, Templates Brand kit setup, and Assets-side Quick Add were not rendered.
- Layers UI: pass. Quick Add rendered at the top of Layers, collapsed and expanded, added Text/Shape/Line layers, and the layer list collapsed and expanded.
- Distribution: pass. Distribute H and Distribute V ran on a three-layer multi-selection.
- Preview zoom and pan: pass. Switching to the Shorts portrait preset kept zoom at `94%`; Pan drag moved the preview scroll area without changing zoom.
- Layout I/O: pass. Preview-pane CSV import reported `CSV applied: 3 layers`; preview-pane HTML import reported `HTML applied: 3 layers`.
- Layer editing: pass. Adjust numeric X edit accepted and the canvas stayed nonblank.
- Colors UI: pass. The old wheel-side color strip was absent, saved palettes and registered colors exposed collapsible headings, and both lists collapsed.
- Export: pass. WebP download created at `output/runtime-downloads-20260609-ui-pan-colors/thumbnail-1080x1920-2026-06-09T09-14-14-576Z.webp`.
- Mobile: pass. `390x844` viewport rendered a nonblank canvas and had horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-ui-pan-colors-desktop.png`
  - `docs/assets/runtime-20260609-ui-pan-colors-mobile.png`
- Console health: no page errors, relevant console warnings, or app HTTP 4xx/5xx responses were reported. The gate used `getImageData` readbacks for canvas nonblank checks; Chromium may warn about frequent readbacks, but that is test-induced and not an app runtime error.

### UIW React Color Palette Input

Completed on 2026-06-09.

- Scope: replaced the custom single-color HEX/RGB/opacity controls in Colors with an embedded `@uiw/react-color` Sketch-style editor while leaving the linked color wheel, harmony generation, saved palettes, Fill/Stroke application, and Brand kit color actions unchanged.
- `npm test`: pass. 26 test files, 93 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Runtime gate URL: `http://127.0.0.1:4173/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1100`.
- Primary UI: pass. Top toolbar and thumbnail canvas were visible.
- Nonblank canvas: pass.
- CSV import: pass. Status reported `CSV applied: 6 layers.`
- HTML import: pass. Status reported `HTML applied: 5 layers.`
- Layer editing: pass. Selecting `Main title`, editing Adjust X to `100`, and generating layout text reflected the change in CSV.
- Colors UI: pass. The embedded `@uiw/react-color` Sketch picker rendered in Colors with five editable input fields.
- Color change path: pass. Editing the Sketch HEX input and saving the generated palette reported a saved multi-color palette.
- Export: pass. WebP download was created as `thumbnail-1280x720-2026-06-09T08-34-00-150Z.webp`.

### Motion Easings And Animated Templates

Completed on 2026-06-09.

- Scope: added easings.net-style easing choices, selected-object Motion preview, easing graph, additional animation types, direction `None` default with disabled distance, and ten animated eyecatch/waiting templates in the Motion category.
- `npm test`: pass. 26 test files, 93 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Runtime gate URL: `http://127.0.0.1:4196/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Default template count: pass. The Templates panel exposed exactly 38 bundled rows.
- Motion filter: pass. The Templates panel exposed exactly 10 Motion rows: Animated Eyecatch Neon Pulse, Animated Eyecatch Pop Title, Animated Eyecatch News Flash, Animated Eyecatch Countdown, Animated Eyecatch Product Reveal, Animated Waiting Stream Start, Animated Waiting Chat Lobby, Animated Waiting Countdown, Animated Waiting Calm Screen, and Animated Waiting Game Room.
- Motion template load: pass. Animated Waiting Stream Start and Animated Waiting Countdown rendered nonblank canvases.
- Motion tab: pass. The selected-object preview canvas rendered nonblank and the easing graph SVG was visible.
- Motion controls: pass. Animation type count was 12, easing count was 31, directions were `none`, `left`, `right`, `up`, and `down`.
- Direction `None`: pass. Distance was disabled while direction was `none`, then re-enabled after changing direction to `right`.
- OBS preview: pass. A separate preview window opened and rendered a nonblank canvas.
- CSV import: pass. Status reported `CSV applied: 2 layers.`
- HTML import: pass. Status reported `HTML applied: 2 layers.`
- Layer editing: pass. Adjust numeric X edit accepted and the canvas stayed nonblank.
- Export: pass. WebP download created at `output/runtime-downloads-20260609-motion-easing/thumbnail-1280x720-2026-06-09T02-15-42-059Z.webp`.
- Mobile: pass. `390x844` viewport loaded Animated Waiting Countdown, rendered a nonblank canvas, and had horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-motion-easing-desktop.png`
  - `docs/assets/runtime-20260609-motion-easing-mobile.png`
- Console health: no page errors, relevant console warnings, or app HTTP 4xx/5xx responses were reported. The gate used `getImageData` readbacks for canvas nonblank checks; Chromium may warn about frequent readbacks, but that is test-induced and not an app runtime error.

### Weekly Schedule Templates

Completed on 2026-06-09.

- Scope: added Weekly Schedule Landscape and Weekly Schedule Portrait to the Schedule default-template category, both Sunday-start.
- `npm test`: pass. 26 test files, 89 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Runtime gate URL: `http://127.0.0.1:4195/thumbnail-generator/`.
- Browser automation path: Playwright headless Chromium.
- Desktop viewport: `1440x900`.
- Mobile viewport: `390x844`.
- Default template count: pass. The Templates panel exposed exactly 28 bundled rows.
- Schedule filter: pass. The Templates panel exposed exactly 8 Schedule rows.
- Weekly template load: pass. Weekly Schedule Landscape and Weekly Schedule Portrait each rendered a nonblank canvas.
- Sunday-start order: pass. Generated CSV for both weekly templates listed `Week day SUN label`, `MON`, `TUE`, `WED`, `THU`, `FRI`, and `SAT` in order.
- CSV import: pass. A two-layer CSV layout rendered nonblank.
- HTML import: pass. A two-layer HTML layout rendered nonblank.
- Layer editing: pass. Adjust numeric X edit accepted and the canvas stayed nonblank.
- Export: pass. WebP download created at `output/runtime-downloads-20260609-weekly-schedule/thumbnail-1080x1920-2026-06-09T00-34-47-979Z.webp`.
- Mobile: pass. `390x844` viewport loaded Weekly Schedule Portrait, rendered a nonblank canvas, and had horizontal overflow `0`.
- Mobile warning layout: pass. Status warning chips wrap within the viewport after the high-layer-count weekly template is loaded.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-weekly-schedule-desktop.png`
  - `docs/assets/runtime-20260609-weekly-schedule-mobile.png`
- Console health: no page errors or relevant console warnings were reported. The gate used `getImageData` readbacks for canvas nonblank checks; Chromium may warn about frequent readbacks, but that is test-induced and not an app runtime error.

### Schedule Templates, Motion, And OBS Preview

Completed on 2026-06-09.

- Scope: added Schedule default-template category, six yearly/monthly/daily schedule templates in landscape and portrait orientations, selected-layer Motion animation metadata, and a separate OBS preview window.
- `npm test`: pass. 26 test files, 88 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Runtime gate URL: `http://127.0.0.1:4194/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x900`.
- Mobile viewport: `390x844`.
- Schedule filter: pass. The Templates panel exposed exactly 6 Schedule rows.
- Schedule template load: pass. Yearly Schedule Landscape, Yearly Schedule Portrait, Monthly Schedule Landscape, Monthly Schedule Portrait, Daily Schedule Landscape, and Daily Schedule Portrait each rendered a nonblank canvas.
- CSV import: pass. Status reported `CSV applied: 2 layers.`
- HTML import: pass. Status reported `HTML applied: 2 layers.`
- Layer editing: pass. Adjust numeric edit accepted and the canvas stayed nonblank.
- Motion setting: pass. The selected layer animation type changed to `fade`.
- OBS preview: pass. A separate preview window opened and rendered a nonblank canvas.
- Export: pass. WebP download created at `output/runtime-downloads-20260609-schedule-motion/thumbnail-1080x1920-2026-06-09T00-14-07-206Z.webp`.
- Mobile: pass. `390x844` viewport rendered a nonblank canvas and had horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-schedule-motion-desktop.png`
  - `docs/assets/runtime-20260609-schedule-motion-mobile.png`
- Console health: no page errors or relevant console warnings were reported. The gate used `getImageData` readbacks for canvas nonblank checks; Chromium may warn about frequent readbacks, but that is test-induced and not an app runtime error.

### Automated

- `npm test`: pass. 26 test files, 88 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.

### Vertical Text Bounds

Completed on 2026-06-09.

- Scope: vertical text display bounds now resize like horizontal text from both Adjust width/height controls and preview resize handles.
- Added unit coverage: `src/lib/canvasInteraction.test.ts`, `src/lib/hitTest.test.ts`, and `src/lib/layerVisualBounds.test.ts`.
- `npm test`: pass. 25 test files, 84 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed.
- Runtime gate URL: `http://127.0.0.1:4193/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x900`.
- Mobile viewport: `390x844`.
- HTML import: pass. Status reported `HTML applied: 2 layers.`
- Adjust vertical text bounds edit: pass. The selected vertical layer changed from `120x220` to `180x260` while X/Y stayed `180/120`.
- Preview handle vertical text resize: pass. Dragging the bottom-right preview handle changed the layer to `240x310` while X/Y stayed `180/120`.
- CSV import: pass. Status reported `CSV applied: 2 layers.`
- Export: pass. WebP download created at `output/runtime-downloads-20260609-vertical-bounds/thumbnail-1280x720-2026-06-08T17-18-05-440Z.webp`.
- Mobile: pass. `390x844` viewport rendered a nonblank canvas and had horizontal overflow `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260609-vertical-bounds-desktop.png`
  - `docs/assets/runtime-20260609-vertical-bounds-mobile.png`
- Console health: no page errors or relevant console warnings were reported. The gate used `getImageData` readbacks for canvas nonblank checks; Chromium may warn about frequent readbacks, but that is test-induced and not an app runtime error.

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
- Edit state and export placement: pass. PNG/JPG/WebP export, save, restore, export/import, delete, autosave, saved-state metadata, and privacy/storage guidance were visible in the preview pane.
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
