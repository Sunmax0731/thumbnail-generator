# Test Plan

## Automated Tests

- CSV parser handles quoted fields, numeric defaults, image references, and effect strings.
- HTML parser handles text, image, and shape layers.
- Export presets resolve to expected width/height/format settings.
- Canvas fit calculation shrinks tall or wide presets by visible width/height, preserves preferred fit only when both axes allow it, and rounds down so the fitted frame does not spill past the container.
- Hit testing selects the frontmost overlapping layer while preserving selected resize handles.
- Hit testing can find visible selectable objects fully contained by a canvas range-selection rectangle, while excluding partial overlaps.
- Hit testing only range-selects grouped objects when the full visible selectable group bounds are contained by the range.
- Hit testing supports intentional blank-click deselection.
- Layer deletion selection helpers retain other selected layers but leave no fallback selection after deleting the only selected layer.
- Layer selection helpers select all editable grouped members from one grouped layer and toggle whole groups additively.
- Layer selection helpers merge range-selected ids in replace, add, and subtract modes while preserving group-selection expansion.
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
- CSV/HTML import and layout export preserve shadow, pseudo-3D rotation, and bevel decoration fields.
- CSV/HTML import and layout export preserve signed edge blur direction, stroke/outline blur participation, and text writing mode.
- Text fit accounts for kerning/letter spacing.
- Text fit accounts for vertical text column width and character height.
- Vertical text uses configured layer bounds for selection hit testing, preview resize handles, and Adjust width/height edits.
- Vertical text preview resizing changes the configured display bounds without translating the anchored corner unexpectedly.
- YouTube thumbnail helpers extract video ids from common URL shapes and order thumbnail candidates by quality.
- Custom font helpers validate supported formats, sanitize display names, create dropdown options, read localStorage records, and deduplicate stored fonts.
- Color palette helpers generate saved palette sets across order, proximity, similarity, and clarity principles: identity, analogous, intermediate, diod, opponent, split-complementary, triad, tetrad, pentad, hexad, rectangular, complex-harmony, natural-harmony, dominant-color, tone-on-tone, dominant-tone, tone-in-tone, tonal-color, camaieu, faux-camaieu, tricolor, and bicolor.
- Color palette helpers convert HEX and RGB channel input for palette controls.
- Edit state helpers save and read a browser-local work-in-progress snapshot and autosave preference.
- PWA helper registers the service worker under the GitHub Pages base path when service workers are available and exits cleanly when they are unavailable.
- Chrome extension bridge helpers respond to `ping`, return the current edit-state snapshot, and validate `applySnapshot` payloads.
- Default template definitions provide exactly 38 distinct use-case layouts, five each for YouTube, Shorts, Stream, and Cutout, eight Schedule templates, and ten animated Motion templates, with exportable CSV/HTML and supported layer types.
- Weekly Schedule Landscape and Weekly Schedule Portrait keep Sunday-start weekday labels in `SUN`, `MON`, `TUE`, `WED`, `THU`, `FRI`, `SAT` order.
- Beta schedule builder calculates UTC-safe month lengths, weekdays, leap years, Sunday/Monday-start monthly grids, weekly date ranges, weekday language, date format, action counts, month-aware badge labels, separate title/weekday/date/plan font sizes, and grouped/ungrouped layer metadata before generating editable text/shape layers.
- Default template metadata exposes categories and mini-preview colors for guided selection.
- Layer animation helpers apply fade, slide, pop, pulse, blink, drift, zoom, spin, sway, shake, and breathe transforms, including multiple ordered animation entries, without mutating source layer state.
- Easing helpers expose linear plus easings.net-style Sine, Quad, Cubic, Quart, Quint, Expo, Circ, Back, Elastic, and Bounce curves.
- CSV/HTML import and layout export preserve optional layer animation metadata.
- Brand kit helpers normalize stored data, capture current layer style, and apply brand font/colors to selected editable layers.
- Edit state helpers serialize, parse, and delete portable JSON recovery files.
- Quality warning helpers flag long text, low contrast, safe-area edges, many layers, large exports, large assets, and large storage estimates.
- Browser template helpers normalize, sanitize, deduplicate, and preserve saved template tags.
- Tag registry helpers normalize, deduplicate, read/write, and remove common/image/group-object/template tags independently.

## Manual Browser Runtime Gate

The WebApp runtime gate is passed only when Chrome or a headless browser confirms:

- Nonblank app render.
- Header, left import panel, canvas, Canvas object list, inspector, Output menu, Manual button, edit-state icons, and service footer are visible; the timeline appears only while Animation in English mode / アニメ in Japanese mode is active.
- Page title, app header, manifest name, and installed-app labels use `サムネいる？`.
- The PWA manifest and service worker are served from the GitHub Pages base path, and a supported browser registers the service worker without blocking normal rendering.
- The Chrome extension bridge announces readiness, responds to `ping`, returns a current edit-state snapshot, and can re-apply a valid snapshot.
- Japanese and English UI labels can be switched from the top toolbar.
- Initial language detection chooses a supported language, and unsupported language tags fall back to English in unit coverage.
- Clicking blank preview space clears selection and updates the stage/inspector state.
- Clicking the preview area outside the output frame clears selection when pan mode is not active.
- Left sidebar task tabs expose Assets and Templates without showing the hidden Layouts tab.
- The preview-pane Generated layout section remains hidden from the GUI while edit-state and template compatibility keep CSV/HTML text internally.
- Right inspector task tabs expose Adjust, Colors, and Animation/アニメ without crowding the first viewport.
- Layers exposes collapsible Quick Add above a collapsible Canvas object list.
- Layers and Colors tabs expose resizable list areas with no overlap or horizontal overflow.
- Browser templates expose a resizable list area with no overlap or horizontal overflow.
- The Templates tab exposes generator buttons for schedule, standard thumbnail, vertical thumbnail, and stream waiting screen, while the previous default-template list is not shown.
- The beta schedule generator modal opens from Templates, displays a beta notice, accepts calendar date, weekday language, date format, uniform/per-day action count, preview, grouping, style, Adjust-shared font choices, separate font-size sliders, color settings, settings-only save, and generates editable monthly or weekly schedule layers with localized badge text.
- The image generator modals open from Templates, provide live previews, five placement patterns per generator, grouped common/title/subtitle/label text controls, save settings without generating, restore saved settings after reload, and generate editable standard thumbnail, vertical thumbnail, and stream waiting layer sets.
- CSV import updates the canvas/object list.
- HTML import updates the canvas/object list.
- Preview selection respects layer stacking order when layers overlap.
- Layer inspector edits position, size, rotation, color, stroke, font, and effects.
- Canvas direct editing supports drag move, corner resize, and rotation handle drag.
- Canvas drag move records undo/redo history only at confirmed drag start and drag completion positions.
- Preset changes keep the current preview zoom until Fit canvas is selected.
- Preview pan works through the Pan button, Space-drag, or Alt-drag without changing zoom.
- Dragging a layer outside the document keeps the displayed zoom, effective canvas scale, and output frame stable.
- Custom font import accepts WOFF2/WOFF/TTF/OTF, loads through FontFace, appears in the dropdown, stores in localStorage, applies to a text object, and is reflected in export.
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
- Named templates can be saved with free-form tags, existing tags appear as suggestions, and the saved template list can be filtered by a tag dropdown.
- Multiple saved templates with the same display name are preserved.
- Current edit state can be manually saved, restored after reload, and autosaved when the autosave toggle is on.
- Image Lab opens from imported asset rows in a modal workspace and supports chroma key, rectangle/circle cutout, and polygon/free cutout.
- Image Lab Rect and Circle modes support direct drag selection on the preview, then high-contrast preview-handle move/resize.
- Image Lab Polygon mode supports point dragging and point deletion.
- Image Lab modal supports close button, backdrop click, and Escape-key dismissal.
- Numeric value controls expose sliders with practical min/max bounds.
- Image import accepts a local image and creates an image object.
- Image import registers typed tag draft text when Register assets is pressed without first adding a tag chip.
- Image and group-object tag filters operate independently.
- Imported asset rows support selected image-layer insertion and opening the selected asset in Image Lab.
- Image Lab does not duplicate image import or asset-selection controls; source changes stay in Assets before opening the modal.
- Expanded quick add in Layers inserts text, shape, line, headline, subtitle, badge, divider, and selected-image starters.
- The previous bundled default-template list is not visible in Templates after generator flows are available.
- Schedule filter shows exactly eight bundled templates and each schedule template renders nonblank.
- Weekly schedule templates render Sunday-start day labels in both landscape and portrait orientations.
- Motion filter shows exactly ten animated eyecatch/waiting templates and each motion template renders nonblank.
- Animation/アニメ tab can assign a selected-layer animation preset, preview the selected object, and show or hide the easing graph.
- Animation/アニメ tab exposes movement and non-moving/effect dropdowns, 31 easing choices, direction `None`, and disables distance while direction `None` is selected.
- Animation/アニメ tab hides text-only motion controls unless a text object is selected, and disables effect intensity for choices that cannot use intensity.
- The bottom timeline shows animated objects only while Animation/アニメ is active, supports collapse/expand, supports start/end handles, supports segment bar drag, supports top-edge height resizing, and displays faint later-cycle hints for loop-enabled animations.
- The bottom timeline Play/Pause control previews animation in the editor, defaults to paused/editable, shows a moving playhead bar, has a Reset button that returns playback to the beginning, and locks object list, inspector, timeline, and preview editing while playing.
- Middle-button drag on the preview range-selects fully contained objects. Shift+middle drag adds objects in the range, Ctrl+middle drag removes objects in the range from the current selection, and partially contained objects or partially contained groups are excluded.
- Objects outside the output frame remain visible in the editor preview with dimmed outside-frame portions, while export stays clipped to the output canvas.
- Schedule generator landscape action buttons match the standard thumbnail generator modal action width; schedule portrait action width remains unchanged.
- OBS preview opens from the Output menu in a popup-style separate window and renders a nonblank animated canvas without editor controls or selection handles.
- OBS preview Play/Pause, Reset, and Hide controls are visible by default; `P`, `R`, and `H` trigger Play/Pause, Reset, and Hide/show.
- Guided start is not visible in the left panel.
- Edit state controls are visible as top-right icons and support save, restore, autosave, JSON export/import, and deletion without returning to Templates.
- Text line height, stroke colors, image asset switching, and palette application disable when they do not affect the current selection.
- Adjust reset controls return selected-layer rotation to 0 degrees.
- Layers supports choosing line styles through Adjust, grouping selected objects, renaming/ungrouping groups, and fitting selected image/shape objects to the canvas.
- Adjust supports layer blur, edge blur, corner radius, text kerning, expanded shape kinds, and Fill/Stroke color buttons that open a draggable popup compact single-color picker with alpha.
- Adjust supports shadow color/opacity/blur/distance/angle, pseudo-3D X/Y rotation, bevel size/opacity, and smooth wave line rendering.
- Adjust supports signed inner/outer edge blur, optional text/shape stroke blur participation, and horizontal/vertical text writing mode.
- Vertical text display bounds can be changed through Adjust width/height controls and direct preview resize handles without the text moving instead of resizing.
- Colors supports selecting and updating saved swatches, palette opacity, palette maker preview, saved multi-color palette sets, and direct Fill/Stroke buttons on registered single colors.
- Colors supports Adobe-style color wheel point selection without base-color changes, linked point dragging that regenerates the other scheme colors, palette-principle and palette-pattern dropdowns to the left of the wheel, explicit base-color controls, large palette bars, embedded `@uiw/react-color` Sketch-style HEX/RGB/alpha input, and recent-color reuse.
- Assets supports importing a YouTube thumbnail by URL or video id and then editing/exporting it as an image object.
- Layers supports selecting one grouped row individually for single-layer adjustment without ungrouping.
- Keyboard shortcuts support Delete confirmation, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y without intercepting text fields or modals.
- Export path creates a data URL/download for the selected format.
- Preview header exposes one Output menu with JPG, PNG, WebP, and OBS preview choices.
- Desktop and mobile viewports have no incoherent overlap.
- Template filters, hidden Brand kit setup in Templates, hidden Colors-side Brand kit registration buttons, GitHub Issues link, privacy policy link, terms link, X contact, storage warning, and edit-state JSON export/import/delete are visible without blocking primary editing.
- The Manual button opens a fixed-size modal, supports left feature tabs and top section tabs, and preserves the last tab pair plus scroll position after close/reopen.
- Manual table-of-contents focus and hover highlight the matching manual content entry.

## Current Results

Latest completed on 2026-06-14.

### UI Scrollbar, Collapsible State Persistence, Timeline Grid, And Defaults

Completed on 2026-06-14 for panel scrollbar containment, UI show/hide persistence, 0.5s timeline grid lines, and generator/default state updates.

- Scope: moved left and right panel scrollbars below the tab rows, persisted collapsible UI state across tab switches and reloads for left Assets/Layers, right Adjust/Colors/Animation, and the bottom timeline, added 0.5s dotted timeline grid lines, changed first-run autosave to enabled, and changed schedule generator defaults to weekly, portrait, and one action per day.
- `npm test`: pass. 35 test files, 141 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; the existing Vite chunk-size warning remained non-blocking.
- Runtime gate URL: `http://127.0.0.1:4392/thumbnail-generator/?runtime=ui-persistence-20260614-final`.
- Desktop viewport: `1440x960`.
- Runtime checks:
  - Canvas rendered nonblank with `24000` sampled nonblank pixels.
  - Left/right panels used `overflow-y: hidden`, while `.side-panel-body` used `overflow-y: auto`; tab rows were not inside the scroll body.
  - Autosave defaulted to enabled in a fresh browser context.
  - Schedule generator defaults were `kind=week`, `orientation=portrait`, and actions per day `1`.
  - Layers Quick Add, Assets Images, Adjust Common, Colors palette picker, and the bottom timeline stayed collapsed after tab switches.
  - The same collapsed states persisted after reload.
  - Timeline ruler rendered `21` half-second grid lines across a 10.0s default duration.
  - Layer editing changed `Corner tag` to `Runtime UI persistence layer`.
  - WebP export downloaded `thumbnail-1280x720-2026-06-14T10-50-31-170Z.webp` with `728640` bytes.
  - Console health: no page errors or app console warnings/errors.
- Evidence:
  - `output/runtime-20260614-ui-persistence/runtime-result.json`
  - `output/runtime-20260614-ui-persistence/desktop-final.png`
- CSV/HTML compatibility: visible CSV/HTML import controls remain absent in this build; parser/model compatibility is covered by `npm test`.

### Toolbar Alignment, Animation Label, Manual Highlight, And Legal Footer

Completed on 2026-06-14 for the top-right toolbar layout, English Animation label, Manual contents highlighting, privacy/terms pages, contact links, and standard service footer.

- Scope: bottom-aligned the edit-state control group with the tag/language/theme control group, changed the English right-inspector tab label from `アニメ` to `Animation`, updated the Manual to use the active-language tab label, added table-of-contents focus/hover highlighting for the matching Manual entry, replaced the bottom status footer with service/legal links, added static privacy policy and terms pages, and added X contact linking to `https://x.com/Sunmax0731`.
- `npm test`: pass. 34 test files, 138 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; the existing Vite chunk-size warning remained non-blocking.
- Runtime gate URL: `http://127.0.0.1:4380/thumbnail-generator/?runtime=legal-footer-20260614`.
- Desktop viewport: `1440x960`.
- Runtime checks:
  - Primary UI and canvas rendered nonblank (`1516x956`, sampled nonblank pixels `118377`).
  - Top-right edit-state group, Language selector, and Theme selector shared the same bottom edge (`64.9375px`).
  - English right-inspector tabs rendered `Adjust`, `Colors`, and `Animation`; stale English `Motion`/`Anime` tab labels were absent.
  - English Manual side category rendered `Animation`, and focusing the first table-of-contents item highlighted the matching Manual entry `Motion / Glow / effects items`.
  - Footer rendered `Privacy Policy`, `Terms`, `Contact: X`, `GitHub Issues`, and `© Sunmax Engineering`.
  - `privacy-policy.html` and `terms.html` returned HTTP 200 and rendered their expected headings.
  - Layer editing was exercised by changing the selected group name from `Object group` to `Runtime legal footer layer`.
  - WebP export downloaded `thumbnail-1280x720-2026-06-14T06-33-09-438Z.webp` with `714072` bytes.
  - CSV/HTML compatibility note: visible CSV/HTML import controls are hidden in this build; parser/model import compatibility remains covered by `npm test`.
  - Console health: no page errors or app console errors.
- Evidence:
  - `output/runtime-20260614-legal-footer/runtime-result.json`
  - `output/runtime-20260614-legal-footer/desktop-initial.png`
  - `output/runtime-20260614-legal-footer/desktop-final.png`

### Manual Dropdown Item Localization And OBS Detail

Completed on 2026-06-14 for active-language dropdown item wording, preview preset localization, and deeper Manual coverage.

- Scope: localized preview preset option labels in Japanese mode, removed stale English dropdown item names from Japanese Manual copy for Templates, Layers/Canvas grouping, Assets image import, Image Lab mouse operations, Adjust shape choices, and Preview size presets, added Manual detail for OBS preview including its Output-menu call path, controls, shortcuts, and OBS capture notes, and added missing Manual detail for image palette extraction and multi-selection relative editing call paths.
- `npm test`: pass. 34 test files, 137 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; the existing Vite chunk-size warning remained non-blocking.
- Runtime gate URL: `http://127.0.0.1:4372/thumbnail-generator/?runtime=manual-dropdown-detail-20260614`.
- Browser plugin attempt: failed because `C:\Users\gkkjh\.codex\plugins\cache\openai-bundled\browser\26.609.30741\scripts\browser-client.mjs` was not present; Playwright local Chrome was used with service workers blocked for current-source rendering.
- Desktop viewport: `1440x960`.
- Checks:
  - Primary UI and initial canvas rendered nonblank (`1516x956`, sampled nonblank pixels `90581`).
  - Japanese preset dropdown options rendered as `YouTube 向け横長 16:9 1280x720`, `フルHD 16:9 1920x1080`, `Twitch 向け横長 16:9 1280x720`, `正方形 1080x1080`, `縦型ショート 1080x1920`, and `カスタム`.
  - Manual traversal covered 10 side categories and 21 top-tab sections; Japanese Manual had no hits for stale dropdown/item terms such as `monthly は`, `landscape は`, `Bold は`, `groupId`, `MIME`, `Wheel / right-drag`, `rectangle は`, `ellipse は`, `Twitch panel`, or `Portrait short`.
  - Japanese Manual contained required localized detail for schedule type/orientation, generator tone, group identifiers, general image formats, Image Lab mouse wheel/right-drag operations, Japanese shape names, localized preview presets, OBS preview, call-source wording, image extraction, and multi-selection relative editing.
  - OBS preview opened from the Output menu, used Japanese controls (`一時停止`, `リセット`, `非表示`), rendered a nonblank `1280x720` canvas, and the `H` shortcut hid and restored the overlay.
  - Layer editing changed an inspector number from `890` to `897`.
  - WebP export downloaded `thumbnail-1280x720-2026-06-14T05-35-06-208Z.webp` with `728312` bytes.
  - Console health: no page/app runtime errors were reported. The only warning was Playwright service-worker blocking.
- Evidence:
  - `output/runtime-20260614-manual-dropdown-detail/runtime-result.json`
  - `output/runtime-20260614-manual-dropdown-detail/manual-dropdown-detail.png`
  - `output/runtime-20260614-manual-dropdown-detail/obs-preview-ja.png`
  - `output/runtime-20260614-manual-dropdown-detail/thumbnail-1280x720-2026-06-14T05-35-06-208Z.webp`
- CSV/HTML compatibility: visible CSV/HTML import controls remain hidden in this build; parser/model compatibility is covered by `npm test`.

### Preview Range Containment, Stable Off-Canvas Drag, And Expanded Manual

Completed on 2026-06-14 for middle-button range containment rules, grouped range-selection containment, off-canvas drag display stability, and expanded manual coverage.

- Scope: changed preview range selection from intersection to full-containment hit testing, made grouped range selection require the full visible selectable group bounds, fixed range rectangle display coordinates inside the transformed canvas frame, froze preview edit padding during active canvas drag to prevent display-size oscillation while objects move off canvas, expanded the Manual modal, added per-feature headings, added a right-side table of contents, and documented language/theme/tag settings, preview presets/output size, GUI resizing/collapse controls, shortcuts, and mouse operations.
- `npm test`: pass. 34 test files, 137 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; the existing Vite chunk-size warning remained non-blocking.
- Runtime gate URL: `http://127.0.0.1:4366/thumbnail-generator/?runtime=preview-manual-20260614-final3`.
- Browser runtime tool: Playwright local Chrome channel with service workers blocked for current-source rendering.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x900`.
- Checks:
  - Initial seeded workspace canvas rendered nonblank (`1376x816` editor canvas).
  - Off-canvas drag kept the canvas frame width stable through active movement (`1293px` for all sampled drag frames), addressing the display-range oscillation/glitch path.
  - Manual modal opened at `1360x880`, showed right-side table of contents, 10 side categories, 3 preview top tabs including the size section, and 5 item headings in the active section.
  - Manual table-of-contents button click completed without runtime errors.
  - WebP export succeeded with a non-empty download (`75834` bytes).
  - Mobile viewport rendered a nonblank canvas with horizontal overflow `0`.
  - Console health: no page/app runtime errors were reported.
- Range-selection note: headless Chrome in this environment did not emit middle-button PointerEvents through Playwright or CDP, so the rendered-browser gate could not directly perform the middle-button drag. The full-containment object and group behavior is covered by `src/lib/hitTest.test.ts`.
- Evidence:
  - `output/runtime-20260614-preview-manual/runtime-result.json`
  - `output/runtime-20260614-preview-manual/01-offcanvas-drag.png`
  - `output/runtime-20260614-preview-manual/02-manual-toc.png`
  - `output/runtime-20260614-preview-manual/03-mobile.png`
  - `output/runtime-20260614-preview-manual/thumbnail-1280x720-2026-06-14T03-01-32-051Z.webp`
- CSV/HTML compatibility: visible CSV/HTML import controls remain hidden in this build; parser/model compatibility is covered by `npm test`.

### Manual Modal, Range Selection, Timeline Reset, Loop Echo, And Terminology

Completed on 2026-06-14 for middle-button preview range selection, object/canvas terminology cleanup, timeline loop-cycle hinting, timeline Reset, Image Lab processed-image wording, and the feature manual modal.

- Scope: added middle-button drag range selection with replace/add/subtract modes, kept grouped-object selection expansion, added loop echo segments behind timeline bars, added editor-preview Reset, changed the Layers tab object-list section label to Canvas, updated Image Lab processed-image add copy with the selected asset name, added the top-left Manual button, and implemented a fixed-size manual modal with left feature tabs, top section tabs, related links, and preserved tab/scroll state.
- `npm test`: pass. 34 test files, 136 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; the existing Vite chunk-size warning remained non-blocking.
- Runtime gate URL: `http://127.0.0.1:4364/thumbnail-generator/?runtime=manual-range-timeline-20260614-final3`.
- Browser plugin attempt: failed because the bundled Browser skill script `scripts/browser-client.mjs` was missing; Playwright with local Chrome channel was used with service workers blocked for a clean current-source render.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x900`.
- Checks:
  - Initial app workspace and canvas rendered nonblank.
  - Manual modal opened from the header button, showed the Canvas object manual section, and preserved category, section, and scroll position after close/reopen (`180px` before and after).
  - Middle-button range selection selected seven objects, Ctrl+middle drag subtracted them to zero, and Shift+middle drag added the seven objects back.
  - Timeline loop echo segments rendered for loop-enabled animations (`7` echo elements in the gate).
  - Timeline Reset changed the playhead label from `0.7s` back to `0.0s`.
  - WebP export succeeded.
  - Mobile viewport rendered nonblank with horizontal overflow `0`.
  - Console health: no page/app runtime errors were reported. The only warning was Playwright service-worker blocking.
- Evidence:
  - `output/runtime-20260614-manual-range-timeline/runtime-result.json`
  - `output/runtime-20260614-manual-range-timeline/01-loaded.png`
  - `output/runtime-20260614-manual-range-timeline/02-manual-canvas.png`
  - `output/runtime-20260614-manual-range-timeline/03-range-selection.png`
  - `output/runtime-20260614-manual-range-timeline/04-timeline-loop-reset.png`
  - `output/runtime-20260614-manual-range-timeline/05-mobile.png`
  - `output/runtime-20260614-manual-range-timeline/thumbnail-1280x720-2026-06-14T00-04-22-832Z.webp`
- CSV/HTML compatibility: visible CSV/HTML import controls remain hidden in this build; parser/model compatibility is covered by `npm test`.

### Preview Playback, Middle Button Lockout, Schedule Button Width, And Off-Canvas Display

Completed on 2026-06-14 for editor-preview animation playback and edit locking, middle-button preview lockout, schedule landscape action width alignment, and dimmed off-canvas object display.

- Scope: added timeline Play/Pause editor playback, playhead visualization, playback-time rendering on the main preview canvas, playback lock guards for Layers, Inspector, timeline editing, output/pan/zoom controls, and preview pointer operations; ignored non-left preview pointer down events including middle button; rendered off-canvas layer portions dimmed while preserving normal opacity inside the output frame; matched schedule landscape action width to the standard thumbnail generator modal and preserved portrait width; ignored `output/` debug artifacts in Git.
- `npm test`: pass. 34 test files, 134 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; the existing Vite chunk-size warning remained non-blocking.
- Runtime gate URL: `http://127.0.0.1:4362/thumbnail-generator/?runtime=preview-playback-20260614-final2`.
- Browser plugin attempt: failed because the bundled Browser skill script `scripts/browser-client.mjs` was missing; Playwright with local Chrome channel was used with service workers blocked for a clean current-source render.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x900`.
- Checks:
  - Initial app workspace and canvas rendered nonblank.
  - Off-canvas object pixels were dimmer outside the output frame (`outside rgb 242.4/136/155.6`) than inside (`inside rgb 255/61/90`).
  - Middle-button preview click in pause mode did not change selection; left-click selection still worked while paused.
  - Timeline showed one animated row, Play set `aria-pressed=true`, the main preview animation frame changed, and the playhead label advanced to `0.7s`.
  - Playback set left panel and inspector `aria-disabled=true`, blocked left/right tab switching, and kept selected layer rows at `0` while playing despite left and middle preview clicks.
  - Schedule landscape action row width matched the standard thumbnail generator action row (`647.0625px` each).
  - Schedule portrait action row width remained `390px`.
  - WebP export succeeded with size `51646` bytes.
  - Mobile viewport horizontal overflow was `0`.
  - Console health: no page/app runtime errors were reported. The only warnings were Playwright service-worker blocking and test-induced Canvas2D readback guidance.
- Evidence:
  - `output/runtime-20260614-preview-playback/runtime-result.json`
  - `output/runtime-20260614-preview-playback/01-loaded.png`
  - `output/runtime-20260614-preview-playback/02-playing-locked.png`
  - `output/runtime-20260614-preview-playback/03-schedule-portrait.png`
  - `output/runtime-20260614-preview-playback/04-mobile.png`
- CSV/HTML compatibility: visible CSV/HTML import controls remain hidden in this build; parser/model compatibility is covered by `npm test`.

### Selection Display, Tag Settings, Fit Canvas, And Timeline Height Follow-Up

Completed on 2026-06-13 for selection rendering stability, category-scoped tag settings, canvas-fit sizing, and doubled timeline height.

- Scope: reset transient canvas state before drawing selection handles, added a top-toolbar Tag settings dialog, separated common/image/group-object/template tag registries, kept common tags available across filters, changed Fit canvas to fit the output canvas only and round zoom down, and raised the timeline maximum height to `640px`.
- `npm test`: pass. 34 test files, 134 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; the existing Vite chunk-size warning remained non-blocking.
- Runtime gate URL: `http://127.0.0.1:4358/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback was used.
- Desktop viewport: `1600x1000`.
- Checks:
  - Initial canvas rendered nonblank.
  - Tag settings kept `shared-tag` under Common only, and `image-only`, `group-only`, and `template-only` under their own categories.
  - Image, group-object, and template tag filters each showed their category tag plus the common tag, without leaking tags from other categories.
  - Selecting a layer kept canvas dimensions `1280x720`, frame ratio `1.778`, and Preview overflow hidden.
  - Fit canvas after zooming in produced `65%`, with frame `832x468` inside visible content `840x668`.
  - Timeline top-edge resize expanded from `170px` to `640px`.
  - PNG export succeeded with size `1141605` bytes.
- Evidence:
  - `output/playwright/runtime-gate.json`
  - `output/playwright/selection-gate.png`
  - `output/playwright/runtime-export.png`
- CSV/HTML compatibility: visible CSV/HTML import controls remain hidden in this build; parser/model compatibility is covered by `npm test`.

### Asset Tag Filter, Group Delete, ImageLab Handle, And Timeline Follow-Up

Completed on 2026-06-13 for independent asset/group-object tag filters, import-tag draft registration, grouped-selection deletion, ImageLab handle contrast, and top-edge timeline resizing.

- Scope: split image and group-object tag filters, committed typed import-tag drafts when Register assets is pressed, deleted all selected group members when deleting a selected group, redrew ImageLab selection outlines/handles with layered dark/light/accent strokes, and moved the timeline height handle to the top edge.
- `npm test`: pass. 33 test files, 129 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; the existing Vite chunk-size warning remained non-blocking.
- Runtime gate URL: `http://127.0.0.1:4354/thumbnail-generator/?runtime=tag-group-followup-1781357219396`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x900`.
- Checks:
  - Initial canvas rendered nonblank with 980 sampled color values.
  - Import-time typed draft tag `image-draft-tag` was saved on the imported `runtime-color` asset without pressing Add.
  - Image tag filtering showed the imported image while keeping the seeded group object visible.
  - Group-object tag filtering showed the seeded group object while keeping the image asset filter unchanged.
  - ImageLab rectangle handles rendered high-contrast white and accent pixels on a saturated test image (`white=1384`, `accent=1788`).
  - Deleting a selected two-layer group removed the whole group (`8` rows before, `6` after).
  - Timeline resize handle was positioned at the top edge (`handleTop=777.0625`, `timelineTop=776.0625`), and upward drag increased height from `170px` to `245px`.
  - PNG export succeeded with size `1137407` bytes.
  - Mobile Assets viewport rendered with horizontal overflow `0`.
  - Console health: no page/app runtime errors were reported.
- Evidence:
  - `output/runtime-20260613-tag-group-followup/runtime-result.json`
  - `output/runtime-20260613-tag-group-followup/imagelab-handles.png`
  - `output/runtime-20260613-tag-group-followup/desktop-final.png`
  - `output/runtime-20260613-tag-group-followup/mobile-assets.png`
  - `output/runtime-20260613-tag-group-followup/thumbnail-1280x720-2026-06-13T13-27-03-316Z.png`
- CSV/HTML compatibility: visible CSV/HTML import controls remain hidden in this build; parser/model compatibility is covered by `npm test`.

### PWA, Extension Bridge, And Anime Label Follow-Up

Completed on 2026-06-12 for the Motion-tab rename, collapsible timeline, PWA shell, Chrome extension bridge structure, and サムネいる？ title update.

- Scope: renamed the right inspector Motion tab to `アニメ`, added timeline collapse/expand while preserving the expanded default height, added manifest/service worker PWA files, added the Chrome extension page bridge, updated the app title and related metadata to `サムネいる？`, and fixed public asset URLs so Vite dev and production builds both resolve manifest/icons/scripts under `/thumbnail-generator/`.
- `npm test`: pass. 32 test files, 126 tests.
- `npm run build`: pass. Vite emitted only the existing chunk-size warning.
- Runtime gate URL: `http://127.0.0.1:4341/thumbnail-generator/?runtime=pwa-extension`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x900`.
- Checks:
  - Document title and app header were both `サムネいる？`; old `サムネイル作成支援サービス` text count was `0`.
  - Right inspector tab exposed `アニメ`; right inspector `Motion` tab text count was `0`.
  - Initial canvas rendered nonblank.
  - Manifest loaded from `http://127.0.0.1:4341/thumbnail-generator/manifest.webmanifest`, returned `application/manifest+json`, and contained name/short name `サムネいる？`.
  - Service worker registered with scope `http://127.0.0.1:4341/thumbnail-generator/` and script `http://127.0.0.1:4341/thumbnail-generator/sw.js`.
  - Extension bridge `ping` returned `ping`, `getSnapshot`, and `applySnapshot`; `getSnapshot` returned seven layers; re-applying that snapshot returned `{ applied: true }`.
  - Timeline count was `0` before opening `アニメ`, became visible in `アニメ`, collapsed to `47px`, and expanded back to the default `170px`.
  - WebP export succeeded as `output/runtime-20260612-pwa-extension/thumbnail-1280x720-2026-06-12T08-12-59-986Z.webp` with size `714072` bytes.
  - Mobile viewport rendered with horizontal overflow `0`.
  - Console health: no page/app runtime errors were reported.
- Evidence:
  - `output/runtime-20260612-pwa-extension/desktop-initial.png`
  - `output/runtime-20260612-pwa-extension/anime-timeline-expanded.png`
  - `output/runtime-20260612-pwa-extension/mobile.png`
  - `output/runtime-20260612-pwa-extension/runtime-result.json`

### Motion Tab Timeline And OBS Shortcut Follow-Up

Completed on 2026-06-12 for the Motion tab visibility, timeline editing, and OBS shortcut follow-up.

- Scope: hid text-only motion controls for non-text selections, hid the bottom timeline outside Motion, split movement and non-moving/effect dropdowns inside common parameters, added easing-graph show/hide, added draggable timeline start/end handles plus segment drag and timeline height resizing, and added OBS preview `P`/`R` shortcuts.
- `npm test`: pass. 30 test files, 122 tests.
- `npm run build`: pass. Vite emitted the existing analytics script and chunk-size warnings.
- Runtime gate URL: `http://127.0.0.1:4340/thumbnail-generator/?runtime=motion-followup`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x900`.
- Checks:
  - Nonblank app render and primary stage visible.
  - No Vite/React framework overlay detected.
  - Timeline hidden before opening Motion, visible while Motion is active, and hidden again after switching back to Adjust.
  - Easing graph visible by default, hidden by the toggle, and restored by the toggle.
  - Movement Motion dropdown and non-moving/effect dropdown both rendered.
  - Effect intensity disabled for Fade and enabled for Glow pulse.
  - Text-only motion select hidden for a shape layer and visible for a text layer.
  - Timeline row rendered after applying a preset, exposed two segment handles, accepted handle/body drag edits, and resized from `170px` to `215px`.
  - WebP export succeeded as `output/runtime-20260612-motion-followup/thumbnail-1280x720-2026-06-12T07-27-17-072Z.webp`.
  - OBS preview rendered nonblank; `P` changed the button to `Play`, a second `P` changed it back to `Pause`, `R` reset without error, and `H` hid/restored controls.
  - Mobile viewport rendered with horizontal overflow `0`.
  - Console health: no page/app runtime errors were reported. The dev server logged non-blocking 404s for existing analytics static script requests in this local runtime.
- Evidence:
  - `output/runtime-20260612-motion-followup/desktop-initial.png`
  - `output/runtime-20260612-motion-followup/motion-timeline-edited.png`
  - `output/runtime-20260612-motion-followup/obs-shortcuts.png`
  - `output/runtime-20260612-motion-followup/mobile.png`
  - `output/runtime-20260612-motion-followup/runtime-result.json`

### OBS Preview Fullscreen And Viewport Fill

Completed on 2026-06-12 for the OBS preview window chrome/letterboxing follow-up.

- Scope: changed the OBS preview document to keep the body canvas-only, stretch the animated canvas to the preview viewport, size the popup to the current output aspect ratio where browser APIs allow it, and retry fullscreen from the preview click, `F`, or `Enter`.
- `npm test`: pass. 30 test files, 120 tests.
- `npm run build`: pass. Vite emitted the existing analytics script and chunk-size warnings.
- Runtime gate URL: `http://127.0.0.1:4339/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks:
  - Nonblank app render and primary stage visible.
  - Layer edit: first Adjust number input changed from `890` to `900`, and the canvas stayed nonblank.
  - OBS preview: pass. Separate preview window opened with title `OBS Preview - Thumbnail Generator`; the document body had no visible text, contained exactly one canvas and no toolbar/header/nav/form controls, rendered nonblank at intrinsic `1280x720`, filled the viewport with CSS `1280px x 720px`, hid the cursor, and exposed the fullscreen retry hook after pressing `F`.
  - Export path: WebP download succeeded as `thumbnail-1280x720-2026-06-12T06-07-57-216Z.webp`.
  - Mobile viewport rendered nonblank with horizontal overflow `0`.
  - Console health: no relevant app console errors, app warnings, or non-analytics HTTP errors were reported. Canvas `getImageData` readback warnings were test-induced and ignored.
  - CSV/HTML compatibility note: dedicated CSV/HTML text controls are hidden in the current GUI; parser/import compatibility remains covered by `npm test` and saved layout metadata.
- Evidence:
  - `output/runtime-20260612-obs-frameless/main-desktop.png`
  - `output/runtime-20260612-obs-frameless/obs-popup.png`
  - `output/runtime-20260612-obs-frameless/mobile.png`
  - `output/runtime-20260612-obs-frameless/thumbnail-1280x720-2026-06-12T06-07-57-216Z.webp`

### Schedule Generator Button Height Fix

Completed on 2026-06-12 for the schedule generator portrait modal button stretch regression.

- `npm test`: pass. 30 test files, 120 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4338/thumbnail-generator/`.
- Browser automation path: Playwright headless Chromium.
- Desktop viewport: `1440x1000`.
- Check: Schedule portrait generator action buttons stayed directly below the preview and measured normal button height: Cancel `32px`, Save settings `32px`, Generate layers `32px`.
- Console health: no relevant page errors, app console errors, or non-analytics HTTP errors were reported.
- Evidence: `output/runtime-20260612-schedule-button-height/schedule-portrait-buttons.png`.

### Generator Actions And Adjust Collapse Follow-Up

Completed on 2026-06-12 for generator modal action placement and Adjust section collapse behavior.

- `npm test`: pass. 30 test files, 120 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4338/thumbnail-generator/`.
- Browser plugin attempt: failed because `scripts/browser-client.mjs` was missing from the installed Browser plugin path; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks:
  - Nonblank app render and primary workspace visible.
  - Schedule portrait generator action buttons measured directly under the preview, centered to the preview pane.
  - Standard thumbnail generator action buttons measured at the modal lower edge.
  - Vertical thumbnail modal used the reduced portrait preview column, preview width stayed under `430px`, and modal width stayed under `1300px`.
  - Vertical thumbnail action buttons measured at the modal lower edge.
  - Adjust common section label changed to Common settings / 共通設定.
  - Common settings collapsed and expanded from its heading.
  - Text/Shape/Image-specific settings expose the same collapse behavior.
  - Signed bevel value accepted `-12` in the Adjust number field.
  - Shadow enable checkbox is visible; shadow parameter sliders are hidden while off and appear after enabling.
  - WebP export downloaded successfully.
  - Mobile viewport horizontal overflow was `0`.
  - No relevant page errors, app console errors, or non-analytics HTTP errors were reported.
- Evidence:
  - `output/runtime-20260612-ui-adjust-generator/schedule-portrait.png`
  - `output/runtime-20260612-ui-adjust-generator/standard.png`
  - `output/runtime-20260612-ui-adjust-generator/vertical.png`
  - `output/runtime-20260612-ui-adjust-generator/adjust.png`
  - `output/runtime-20260612-ui-adjust-generator/mobile.png`

### UI Tags Decoration Follow-Up

Completed on 2026-06-12 for generator modal polish, browser-template tags, and decoration controls.

- `npm test`: pass. 30 test files, 120 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4337/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks:
  - Nonblank app render and four generator buttons visible.
  - Standard thumbnail letter spacing number input increments from `-1` to `0` and direct `0` input is retained.
  - Standard thumbnail common controls include letter spacing and corner radius together; standard modal shows only image-slot and grouping checkboxes.
  - Standard preview measured `647.0625x363.96875`; action buttons measured the same x-position and width as the preview pane.
  - Vertical thumbnail preview measured `393.75x700`; action buttons measured the same x-position and width as the preview pane.
  - Schedule landscape preview measured at least `600px` wide with 16:9 ratio after layout update.
  - Schedule portrait preview measured `382.5x680` with 9:16 ratio.
  - Browser template save accepted a free-form tag, the tag appeared in the filter dropdown, and filtering showed only matching template rows.
  - Adjust decoration controls exposed 17 inputs covering shadow, pseudo-3D rotation, and bevel, and editing those values kept the canvas nonblank.
  - WebP export downloaded successfully.
  - Mobile viewport horizontal overflow was `0`.
  - No relevant page errors, app console errors, or non-analytics HTTP errors were reported.
- Evidence screenshots:
  - `docs/assets/runtime-20260612-ui-tags-decoration-standard.png`
  - `docs/assets/runtime-20260612-ui-tags-decoration-vertical.png`
  - `docs/assets/runtime-20260612-ui-tags-decoration-schedule-portrait.png`
  - `docs/assets/runtime-20260612-ui-tags-decoration-template-filter.png`
  - `docs/assets/runtime-20260612-ui-tags-decoration-adjust.png`
  - `docs/assets/runtime-20260612-ui-tags-decoration-mobile.png`
- Export evidence:
  - `output/runtime-downloads/20260612-template-tags-decoration/thumbnail-1280x720-2026-06-12T04-33-12-656Z.webp`.

### Creative Generator Modal Compact Preview Follow-Up

Completed on 2026-06-12 for the standard thumbnail, vertical thumbnail, and stream waiting generator modal follow-up.

- `npm test`: pass. 30 test files, 119 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4336/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks:
  - Nonblank app render and primary workspace visible.
  - Templates exposed four generator buttons.
  - Standard thumbnail and Vertical thumbnail modals removed the animation checkbox and kept only image-slot and grouping checkboxes.
  - Stream waiting kept the animation checkbox.
  - Standard thumbnail, Vertical thumbnail, and Stream waiting modals paired Title, Subtitle, and Label sliders two per row on desktop.
  - Standard thumbnail preview widened to `647x364`.
  - Stream waiting preview widened to `647x364`.
  - Vertical thumbnail preview preserved the generated 9:16 ratio at `394x700` (`0.563`).
  - Standard thumbnail Tone changed the live preview data URL.
  - Standard thumbnail generated a nonblank canvas.
  - Right-inspector numeric layer edit changed `896` to `897`.
  - Stream waiting generated a nonblank canvas.
  - WebP export downloaded successfully.
  - Mobile Vertical thumbnail modal opened with horizontal overflow `0`.
  - No relevant page errors, app console errors, or non-analytics HTTP errors were reported.
  - Dev server still reports 404 for local analytics files under `/thumbnail-generator/thumbnail-generator/analytics*.js`; this is a local-dev static-path artifact and was excluded from app console health.
  - CSV/HTML import controls remain hidden in this build; parser/import/export compatibility is covered by unit tests and internal layout text refresh checks.
- Evidence screenshots:
  - `docs/assets/runtime-20260612-creative-modal-standard-desktop.png`
  - `docs/assets/runtime-20260612-creative-modal-vertical-desktop.png`
  - `docs/assets/runtime-20260612-creative-modal-waiting-desktop.png`
  - `docs/assets/runtime-20260612-creative-modal-mobile.png`
- Export evidence:
  - `output/runtime-downloads/20260612-creative-modal-compact/thumbnail-1920x1080-2026-06-12T03-02-31-384Z.webp`.

### Generator Modal Follow-Up

Completed on 2026-06-12 for the generator modal follow-up.

- `npm test`: pass. 30 test files, 118 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4332/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks:
  - Nonblank app render and primary workspace visible.
  - Templates exposed four generator buttons: Schedule, Standard thumbnail, Vertical thumbnail, and Stream waiting.
  - The old Horizontal thumbnail button was absent.
  - YouTube waiting generator button/modal/function was absent from the current UI.
  - Previous default-template list count was `0`.
  - Standard thumbnail, Vertical thumbnail, and Stream waiting modals each exposed five placement patterns.
  - Each image generator Grid / text section grouped controls into Common, Title, Subtitle, and Label with letter spacing, stroke width, alignment, and label corner radius controls.
  - Cancel, Save settings, and Generate layers rendered on one horizontal row in all three image generator modals; desktop button widths were `125px`.
  - Vertical thumbnail Save settings wrote and restored placement pattern `pattern-5` and letter spacing `12` after reload.
  - Standard thumbnail generated a nonblank `1280x720` canvas from placement pattern 3.
  - Vertical thumbnail opened as its own modal, generated a nonblank `1080x1920` canvas from placement pattern 5, and produced visible layer rows after switching to Layers.
  - Vertical thumbnail generated a `Vertical source image` layer.
  - Stream waiting generated a nonblank `1920x1080` canvas from placement pattern 4 and saved generator settings under the creative storage keys.
  - Canvas drag interaction kept the generated canvas nonblank.
  - WebP export downloaded successfully.
  - Mobile Vertical thumbnail modal opened with five placement patterns, grouped text controls, three action buttons on one row at `112px` each, and mobile horizontal overflow was `0`.
  - No page errors, app console errors, or app HTTP errors were reported.
  - CSV/HTML import controls remain hidden in this build; parser/import/export compatibility is covered by unit tests and internal layout text refresh checks.
- Evidence screenshots:
  - `docs/assets/runtime-20260612-generator-patterns-desktop.png`
  - `docs/assets/runtime-20260612-generator-patterns-mobile.png`
- Export evidence:
  - `output/runtime-downloads/20260612-generator-patterns/thumbnail-1920x1080-2026-06-12T02-39-19-763Z.webp`.

### Generator Modals And Default Template List Removal

Completed on 2026-06-12 for the generator-entry rollout.

- `npm test`: pass. 30 test files, 117 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4327/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks:
  - Nonblank app render and primary workspace visible.
  - Templates exposed four generator buttons.
  - Previous default-template list count was `0`.
  - Schedule generator Save settings wrote `thumbnail-generator.generatorSettings.v1.schedule`.
  - Schedule generation rendered nonblank and produced 203 visible layer rows in Layers.
  - Video thumbnail generator saved the `vertical` variant, generated a `1080x1920` canvas, and restored that variant after reload.
  - Canvas drag interaction kept the generated canvas nonblank.
  - Assets image import added a second asset row and kept the canvas nonblank.
  - WebP export downloaded successfully.
  - Mobile YouTube waiting modal opened and mobile horizontal overflow was `0`.
  - No page errors, app console errors, or app HTTP errors were reported.
  - CSV/HTML import controls remain hidden in this build; parser/import/export compatibility is covered by unit tests and internal layout text refresh checks.
- Evidence screenshots:
  - `docs/assets/runtime-20260612-generator-modals-desktop.png`
  - `docs/assets/runtime-20260612-generator-modals-mobile.png`
- Export evidence:
  - `output/runtime-downloads/20260612-generator-modals/desktop-thumbnail-1280x720-2026-06-12T00-34-28-592Z.webp`.

### Color Palette Extraction Modal (Image-based, Production Gate)

Completed on 2026-06-10 for the production rollout of image palette extraction interactions.

- `npm test`: pass. 28 test files, 112 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4313/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks:
  - Nonblank app render.
  - Left panel, preview, layer rows, and export controls were all visible.
  - Colors tab opened the image-palette modal successfully.
  - Candidate count became `3` in the preview extraction result.
- Lens interaction details:
  - Lens became visible on hover.
  - Candidate code observed: `#000008`.
  - Lens code read on hover: `#021220`.
- Exclusion flow:
  - Excluded color count changed from `0` to `1`.
- Adjust-flow stability:
  - Adjust X edit changed from `371` to `372` on desktop and `371` to `372` on mobile.
- Export:
  - WebP export succeeded on both desktop and mobile.
- Overflow:
  - Desktop horizontal overflow: `0`.
  - Mobile horizontal overflow: `0`.
- Console health:
  - No page errors and no app HTTP 4xx/5xx responses were reported.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-image-palette-desktop.png`
  - `docs/assets/runtime-20260610-image-palette-mobile.png`
- Export evidence:
  - `output/runtime-downloads/20260610-image-palette-production/desktop/thumbnail-1280x720-1781102767692.webp`
  - `output/runtime-downloads/20260610-image-palette-production/mobile/thumbnail-1280x720-1781102774685.webp`

### Color Palette Extraction Modal (Image-based)

Completed on 2026-06-10 for the latest beta image-palette extraction flow.

- `npm test`: pass. 28 test files, 112 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4173/thumbnail-generator/`.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks:
  - Nonblank app render.
  - Left panel assets import and image-layer insertion via asset row succeeded.
  - Colorsタブ opened the image-palette modal with title containing `ベータ機能`.
  - Extracted color count selector changed from `3` to `4`/`5`.
  - Candidate count became 5 when selecting 5 colors and nonzero on 4-color mode.
  - Preview image click was recorded as an excluded color.
  - Excluded-color list rendered at least one entry.
  - Clicking the register action closed the modal and saved the palette path.
  - Mobile horizontal overflow: `0`.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-image-palette-5colors-exclude-desktop.png`
  - `docs/assets/runtime-20260610-image-palette-5colors-exclude-mobile.png`.

### Beta Schedule Generator V3

Completed on 2026-06-10 for the requested shared-font, typography-slider, monthly-badge, and wide-modal follow-up.

- `npm test`: pass. 28 test files, 111 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4173/thumbnail-generator/`.
- Browser plugin attempt: previously failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks: schedule generator modal opened from Templates, beta notice remained visible, desktop dialog measured `1320px` wide with four columns, font choices included the same Adjust-tab options such as Poppins 900, Noto Sans JP 900, and Impact, title/weekday/date/plan sliders synchronized to numeric values `72/24/34/20`, month input accepted `2026-06`, weekday language changed to Japanese, date format changed to month/day, pre-generation preview showed `6/1`, monthly generation created a Japanese month badge layer named `6月 badge text`, generated layers were grouped by default, an Adjust numeric edit persisted after switching rows, WebP export downloaded, mobile preview was visible, mobile horizontal overflow was `0`, and no page errors or app console errors were reported.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-schedule-builder-v3-desktop.png`
  - `docs/assets/runtime-20260610-schedule-builder-v3-mobile.png`
- Export evidence: `output/runtime-downloads-20260610-schedule-builder-v3/thumbnail-1280x720-2026-06-10T01-59-36-365Z.webp`.

### Beta Schedule Generator V2

Completed on 2026-06-10 for the requested schedule generator follow-up controls.

- `npm test`: pass. 28 test files, 109 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4173/thumbnail-generator/`.
- Tool: Playwright headless Chromium.
- Desktop viewport: `1500x1120`.
- Mobile viewport: `390x900`.
- Checks: primary UI visible, initial canvas nonblank, schedule generator modal opened from Templates, beta notice visible, pre-generation preview visible, calendar-style date input accepted `2026-06-10`, weekday language changed to Japanese, date format changed to day-only, week start changed to Monday, title/font/font-size/grid/corner/line settings accepted, action-count mode changed to seven individual day counts `0/1/2/3/4/5/6`, generated-layer grouping was disabled, preview reflected Japanese weekday text and day-only date text before generation, generating produced 95 editable layers with no group pills, day seven produced six action rows, an Adjust numeric edit persisted, WebP export downloaded, mobile preview was visible, mobile horizontal overflow was `0`, and no page errors or app console errors were reported.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-schedule-builder-v2-desktop.png`
  - `docs/assets/runtime-20260610-schedule-builder-v2-mobile.png`
- Export evidence: `output/runtime-downloads-20260610-schedule-builder-v2/thumbnail-1080x1920-2026-06-10T01-14-23-065Z.webp`.

### Beta Schedule Generator

Completed on 2026-06-10 for the requested beta monthly/weekly schedule generator.

- `npm test`: pass. 28 test files, 107 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4173/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1100`.
- Mobile viewport: `390x900`.
- Checks: primary UI visible, initial canvas nonblank, Templates showed **Generate schedule**, the schedule generator modal opened with a visible beta notice, weekly schedule generation accepted portrait canvas, `2026/6/10` start date, Monday week start, custom title, Montserrat 900, line grid, corner radius, line width, and accent color settings, generated 53 editable layers, the generated canvas rendered nonblank, an Adjust numeric edit persisted, WebP export downloaded, mobile modal showed the beta notice, mobile horizontal overflow was `0`, and no page errors or app console errors were reported.
- CSV/HTML note: GUI layout text inputs remain hidden by design; schedule generation refreshed internal CSV/HTML text, and CSV/HTML parser/model compatibility passed through `npm test`.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-schedule-builder-desktop.png`
  - `docs/assets/runtime-20260610-schedule-builder-mobile.png`
- Export evidence: `output/runtime-downloads-20260610-schedule-builder/thumbnail-1080x1920-2026-06-10T00-49-31-824Z.webp`.

### Bottom Preview Actions Layout

Completed on 2026-06-10 for the requested bottom preview Output and Edit state button layout.

- `npm test`: pass. 27 test files, 103 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4216/thumbnail-generator/`.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback used.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks: primary UI visible in Japanese, initial canvas nonblank, Output section buttons rendered on one horizontal row, Edit state action buttons rendered on one horizontal row, all eight Output/Edit state buttons measured the same `136px` width and `36px` height, the autosave checkbox stayed on a separate row above Edit state actions, button-row overflow was `0` in the desktop three-panel preview width, Adjust X editing changed the selected layer from `890` to `900`, Save state reported a saved timestamp, WebP export downloaded, mobile canvas was nonblank, mobile button widths stayed equal, mobile horizontal overflow was `0`, and no page errors or app console errors were reported.
- CSV/HTML note: GUI layout text inputs remain hidden by design; CSV/HTML parser and compatibility coverage passed through `npm test`.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-bottom-actions-desktop.png`
  - `docs/assets/runtime-20260610-bottom-actions-mobile.png`
- Export evidence: `output/runtime-downloads-20260610-bottom-actions/thumbnail-1280x720-2026-06-09T22-57-10-819Z.webp`.

### Template Modal Localization, Autofit, And Browser Template Delete Confirmation

Completed on 2026-06-10 for the requested template confirmation localization, preview auto-fit after template application, and browser-template delete confirmation.

- `npm test`: pass. 27 test files, 103 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4215/thumbnail-generator/`.
- Tool: Playwright headless Chromium.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks: primary UI visible in Japanese, initial canvas nonblank, selecting `Shorts Quote` opened the shared `.confirm-backdrop .confirm-dialog` modal with Japanese title/copy/confirm button text, the modal no longer contained fixed English `Apply template?` text, confirming applied `1080x1920`, preview zoom auto-fitted from `94%` to `18%`, the scaled canvas frame fit inside the visible preview scroll area, saving a browser template and clicking delete opened the same confirmation modal style with Japanese delete title/copy and danger confirm styling, confirming removed the browser-template row, WebP export downloaded, mobile canvas was nonblank, mobile horizontal overflow was `0`, and no page errors or app console errors were reported.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-template-modal-autofit-desktop.png`
  - `docs/assets/runtime-20260610-template-modal-autofit-mobile.png`
- Export evidence: `output/runtime-downloads-20260610-template-modal-autofit/thumbnail-1080x1920-2026-06-09T22-14-43-248Z.webp`.

### Layout Readjust Follow-Up

Completed on 2026-06-10 for the requested tab wrapping, right-pane tab width, Assets-tab image import, and template modal style adjustments.

- `npm test`: pass. 27 test files, 102 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4214/thumbnail-generator/`.
- Tool: Playwright headless Chromium.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks: left tabs stayed on one line with `white-space: nowrap` on desktop and mobile, right inspector tabs rendered as three equal-width columns without an unused right-side column, preview Output no longer contained the image import button, Assets tab contained exactly one image import input, YouTube URL UI remained hidden, importing `asset-tab-import.png` from Assets added an asset row, selecting `Shorts Quote` opened a `.confirm-backdrop .confirm-dialog` modal matching the layer-delete modal style, confirming applied the template and changed the canvas size to `1080x1920`, WebP export downloaded, mobile horizontal overflow `0`, and no page errors or app console errors were reported.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-layout-readjust-desktop.png`
  - `docs/assets/runtime-20260610-layout-readjust-mobile.png`
- Export evidence: `output/runtime-downloads-20260610-layout-readjust/thumbnail-1080x1920-2026-06-09T21-54-33-738Z.webp`.

### Left Layers, Asset Deletion, And Preview Size Controls

Completed on 2026-06-10 for the requested left-panel Layers relocation, asset deletion, preview-header size controls, and template confirmation flow.

- `npm test`: pass. 27 test files, 102 tests.
- `npm run build`: pass.
- Runtime gate URL: `http://127.0.0.1:4213/thumbnail-generator/`.
- Tool: Playwright headless Chromium.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Checks: primary UI visible, initial canvas nonblank, left tabs ordered Templates/Layers/Assets, right inspector reduced to three tabs, top toolbar output controls removed, preview header exposed Preset/Width/Height controls, preview title metadata for layer count and canvas size removed, YouTube URL import UI hidden, preview Output section image import visible, left Layers tab rendered the layer list and no Restore sample button, deleting every layer through the Layers tab left zero layer rows, applying `Shorts Quote` showed a confirmation dialog and changed the canvas size to `1080x1920`, importing `runtime-import.png` from Output added an asset and image layer, deleting that asset removed the asset row and related image layer, selecting a remaining layer and editing Adjust X kept the canvas nonblank, WebP export downloaded, mobile canvas nonblank, mobile horizontal overflow `0`, and no page errors or app console errors were reported.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-left-layer-assets-desktop.png`
  - `docs/assets/runtime-20260610-left-layer-assets-mobile.png`
- Export evidence: `output/runtime-downloads-20260610-left-layer-assets/thumbnail-1080x1920-2026-06-09T20-18-55-009Z.webp`.
- Note: CSV/HTML parser/model coverage remains in `npm test`; the current GUI keeps CSV/HTML layout text hidden for edit-state and template compatibility.

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
- GitHub Pages: `.github/workflows/pages.yml` deploys on pushes to `codex/thumbnail-generator-static-app`; the pushed branch's `Deploy GitHub Pages` workflow passed after this follow-up.

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

## Schedule Builder Color Picker Runtime Gate (2026-06-10)

Completed on 2026-06-10.

- Scope: registered single-color swatches and saved palette swatches are integrated into each Schedule Builder color field, making them directly selectable inside the modal before generation.
- Browser runtime evidence: Playwright headless Chromium passed at `http://127.0.0.1:4225/thumbnail-generator/`.
- Browser plugin attempt: no in-app browser plugin was used; Playwright fallback was used directly.
- Desktop viewport: `1440x900`.
- Mobile viewport: `390x844`.
- Runtime checks:
  - Nonblank render: pass.
  - Primary UI visible: pass (left panel and stage panel are both visible).
  - Schedule Builder modal opened and registered color swatches rendered (`24` entries).
  - Schedule color select applied at least one palette swatch in the modal.
  - Layer edit: number field edit changed the selected value (`0` → `10` on desktop, `1057` → `1067` on mobile).
  - Export path: WebP download succeeded.
  - Mobile horizontal overflow: `0`.
  - CSV/HTML compatibility note: CSV/HTML text controls are not visible in this build; parser compatibility is verified by unit coverage and saved-state layout metadata compatibility.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-schedule-color-picker-desktop.png`
  - `docs/assets/runtime-20260610-schedule-color-picker-mobile.png`

## Schedule Builder Color Picker Modal Flow Runtime Gate (2026-06-10)

Completed on 2026-06-10.

- Scope: separate color target selection from color-value selector so that clicking one of four targets opens one modal, then selecting a swatch auto-closes the modal and applies color to target.
- Browser runtime evidence: Playwright headless Chromium passed at `http://127.0.0.1:4225/thumbnail-generator/`.
- Desktop viewport: `1440x900`.
- Mobile viewport: `390x844`.
- Runtime checks:
  - Nonblank render: pass.
  - Primary UI visible: pass.
  - Schedule builder open: pass.
  - Color target buttons available: `4`.
  - Color picker modal opened after selecting a target: pass.
  - Registered color swatches available: `6`.
  - Color selection applied and modal closed automatically: pass.
  - Layer edit: first number input changed from `56` to `10`.
  - Export path: WebP download succeeded.
  - CSV/HTML compatibility note: no dedicated visible CSV/HTML control panel in this build.
- Evidence screenshots:
  - `docs/assets/runtime-20260610-schedule-color-picker-gate-2-desktop.png`
  - `docs/assets/runtime-20260610-schedule-color-picker-gate-2-mobile.png`
- Export evidence:
  - `output/runtime-downloads/20260610-schedule-color-picker-gate-2/desktop-thumbnail-1280x720-2026-06-10T05-35-56-556Z.webp`
  - `output/runtime-downloads/20260610-schedule-color-picker-gate-2/mobile-thumbnail-1280x720-2026-06-10T05-35-58-894Z.webp`

## Motion UI And Output Menu Runtime Gate (2026-06-12)

Completed on 2026-06-12.

- Scope: moved export actions into one Output menu, moved edit-state actions to top-right icons, added bottom motion timeline, added Motion presets/text-only/effect controls, and added OBS preview operation controls.
- `npm test`: pass. 30 test files, 122 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed. Existing analytics script and chunk-size Vite warnings remained non-blocking.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback was used.
- Runtime gate URL: `http://127.0.0.1:4177/thumbnail-generator/?runtime=motion-ui`.
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x900`.
- Runtime checks:
  - Nonblank initial canvas: pass (`1280x720`, sampled nonblank pixels `230400`).
  - Primary app/canvas visible: pass.
  - Removed old preview-bottom Output/Edit state sections: pass (`.stage-export-panel` and `.stage-edit-state` count `0`).
  - Output menu choices visible: pass (`JPG`, `PNG`, `WebP`, `OBSプレビューを開く`).
  - WebP export path: pass, downloaded `output/runtime-20260612-motion-ui/thumbnail-1280x720-2026-06-12T06-41-52-232Z.webp`.
  - Top-right edit-state icons: pass, each icon had a tooltip title; autosave text remained visible.
  - Motion presets: pass (`6` preset buttons).
  - Bottom timeline: pass after applying a preset (`1` animated layer row).
  - OBS preview controls: pass. Overlay visible by default, Hide made it invisible, `H` restored it, and the OBS canvas was nonblank.
  - Mobile horizontal overflow: `0`.
  - Console health: no page errors or app console errors were reported.
- Evidence screenshots:
  - `output/runtime-20260612-motion-ui/desktop-initial.png`
  - `output/runtime-20260612-motion-ui/motion-timeline.png`
  - `output/runtime-20260612-motion-ui/obs-preview-controls.png`
  - `output/runtime-20260612-motion-ui/mobile.png`
- CSV/HTML compatibility: no dedicated visible CSV/HTML control panel in this build; compatibility is covered by unit tests for CSV import, HTML import, and CSV/HTML export of `animationText`, `animationEffect`, and `animationEffectIntensity`.

## Assets, Preview Pan/Zoom, And ImageLab Runtime Gate (2026-06-13)

Completed on 2026-06-13.

- Scope: default unselected state, Preview wheel zoom/right-drag pan/no scrollbars, folder image import, asset tags and filtering, group-object assets, registered-template label update, resizable/collapsible asset sections, and ImageLab wheel zoom/right-drag pan/free-selection behavior.
- `npm test`: pass. 33 test files, 128 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; Vite chunk-size warning remained non-blocking.
- Browser plugin attempt: failed with `Browser is not available: iab`; Playwright headless Chromium fallback was used.
- Runtime gate URL: `http://127.0.0.1:4351/thumbnail-generator/?runtime=assets-preview-1781348714215`.
- Desktop viewport: `1440x980`.
- Mobile viewport: `390x844`.
- Runtime checks:
  - Nonblank initial canvas: pass.
  - Initial page load and creative generator output both left the editor in the unselected state.
  - Registered templates label visible: pass.
  - Preview wheel zoom exceeded 100% (`53 -> 114`) and the preview container kept `overflow-x/y: hidden`.
  - Preview right-drag pan changed the frame transform (`matrix(..., 0, 1) -> matrix(..., 95, 56)`) without scrollbars.
  - Folder input exposed `webkitdirectory`; folder import registered the two supported image files and ignored the text file.
  - Import-time tags were applied before list registration; asset tag filtering narrowed the list; registered asset tags were editable.
  - Asset image list resize changed height (`260 -> 332`), and the group-object section collapsed/expanded.
  - Group-object registration was disabled before grouping, enabled for a selected group, saved with tags, appeared in Assets, and was reusable on the canvas (`layers=13`).
  - ImageLab wheel zoom and right-drag pan changed the preview; free selection ignored right-click point placement and still accepted left-click points.
  - Export path was exercised and downloaded a non-empty thumbnail file.
  - Mobile canvas nonblank and horizontal overflow `0`.
  - Console health: no page errors or app console warnings/errors.
- Evidence:
  - `output/runtime-20260613-assets-preview/runtime-result.json`
  - `output/runtime-20260613-assets-preview/desktop-final.png`
  - `output/runtime-20260613-assets-preview/mobile-final.png`
- CSV/HTML compatibility: visible CSV/HTML import controls remain hidden in this build; parser/model compatibility is covered by `npm test`.

## Asset Row Density And Group Object Management Runtime Gate (2026-06-13)

Completed on 2026-06-13.

- Scope: minimum row heights for dense asset lists, group-object tag editing and deletion, Ctrl-click delete confirmation bypass, and lighter group-object canvas dragging.
- `npm test`: pass. 33 test files, 129 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; Vite chunk-size warning remained non-blocking.
- Runtime gate URL: `http://127.0.0.1:4353/thumbnail-generator/?runtime=followup-1781355528797`.
- Desktop viewport: `1440x980`.
- Runtime checks:
  - Bulk folder import registered 10 supported image files plus the sample row and ignored a text file (`rows=11`).
  - Imported asset rows kept a minimum usable height (`[94,94,94,94,94,94,94,94,94,94,94]`).
  - Group-object row kept a minimum usable height (`108` px).
  - Group-object tags were editable after registration.
  - Group-object canvas drag remained responsive (`457ms` in the gate).
  - Group object deletion removed the row from Assets.
  - Ctrl-click browser-template delete skipped the confirmation dialog.
  - Ctrl-click layer delete skipped the confirmation dialog.
  - Console health: no page errors or app console warnings/errors.
- Evidence:
  - `output/runtime-20260613-followup/runtime-result.json`
  - `output/runtime-20260613-followup/desktop-followup.png`

## Preview Range Selection, Fit Centering, And Manual Localization Runtime Gate (2026-06-14)

Completed on 2026-06-14.

- Scope: middle-button preview range-selection crash fix, Fit canvas position centering, and expanded localized manual content.
- `npm test`: pass. 34 test files, 137 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; Vite chunk-size warning remained non-blocking.
- Browser plugin attempt: failed because `C:\Users\gkkjh\.codex\plugins\cache\openai-bundled\browser\26.609.30741\scripts\browser-client.mjs` was not present; Playwright headless Chromium fallback was used.
- Runtime gate URL: `http://127.0.0.1:4368/thumbnail-generator/`.
- Desktop viewport: `1440x960`.
- Runtime checks:
  - Middle-button range drag displayed the range rectangle and kept the app/canvas rendered with no `getBoundingClientRect` page error.
  - Real right-drag pan changed the preview frame offset, then Fit canvas returned the frame center to the preview center (`afterDelta x=0.5`, `y=0`).
  - Manual opened in English with Preview range-selection detail and right-side Contents.
  - Manual Other tab exposed Language and theme, Tag settings modal, and GUI detail entries.
  - Switching the top-toolbar language to Japanese while the manual was open updated the manual text, category labels, headings, and table of contents.
  - Console health: no page errors or app console errors in the final Playwright gate.
- CSV/HTML compatibility: visible CSV/HTML import controls remain absent in this build; parser/model compatibility is covered by `npm test`.

## Manual Dropdown Detail And Anime Label Runtime Gate (2026-06-14)

Completed on 2026-06-14.

- Scope: expanded the Manual modal's parameter/dropdown explanations into itemized bullets, aligned the manual's motion wording with the visible `アニメ` tab, and matched Japanese manual labels to the visible Japanese editor labels such as `モーション`, `発光 / エフェクト`, `フェード`, `発光パルス`, `ぼかしイン`, `シャイン`, `モーションプリセット`, and `テキスト専用モーション`.
- `npm test`: pass. 34 test files, 137 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; Vite chunk-size warning remained non-blocking.
- Browser plugin attempt: failed because `C:\Users\gkkjh\.codex\plugins\cache\openai-bundled\browser\26.609.30741\scripts\browser-client.mjs` was not present; Playwright headless Chromium fallback was used.
- Runtime gate URL: `http://127.0.0.1:4370/thumbnail-generator/`.
- Desktop viewport: `1440x960`.
- Runtime checks:
  - Initial canvas rendered nonblank and the Manual button, Output menu, canvas, and inspector were visible.
  - Manual side categories retained 10 items including `アニメ`; the アニメ category exposed `オブジェクト` and `文字効果` top tabs.
  - English manual content contained the `アニメ tab`, `Motion / Glow / effects`, `Fade appears from transparent`, `Glow pulse pulses brightness`, and `Text wave adds a wave motion` explanations.
  - Japanese manual content contained `マニュアル`, `アニメタブ`, `モーション / 発光 / エフェクト`, `フェードは透明から表示`, `発光パルスは発光を脈動`, and `文字ウェーブは文字に波の動き` explanations.
  - The active manual section showed a right-side table of contents and 12 itemized bullet rows.
  - Manual content contained no known mojibake marker or Unicode replacement character.
  - Layer editing was exercised by changing the selected group name from `Object group` to `Runtime manual detail group`.
  - WebP export downloaded `thumbnail-1280x720-2026-06-14T04-25-06-319Z.webp` with `714072` bytes.
  - Console health: no page errors or app console errors.
- Evidence:
  - `output/runtime-20260614-manual-detail-final/runtime-result.json`
  - `output/runtime-20260614-manual-detail-final/initial-render.png`
  - `output/runtime-20260614-manual-detail-final/manual-animation-ja.png`
  - `output/runtime-20260614-manual-detail-final/layer-edit.png`
- CSV/HTML compatibility: visible CSV/HTML import controls remain absent in this build; parser/model compatibility is covered by `npm test`.

## Manual Active-Language GUI Label Sync Runtime Gate (2026-06-14)

Completed on 2026-06-14.

- Scope: updated Manual copy so Japanese mode references Japanese GUI labels and English mode references English GUI labels across Adjust, Canvas, Assets, アニメ, Preview, Edit state, tag settings, theme/language settings, and timeline controls.
- `npm test`: pass. 34 test files, 137 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; Vite chunk-size warning remained non-blocking.
- Browser plugin attempt: failed because `C:\Users\gkkjh\.codex\plugins\cache\openai-bundled\browser\26.609.30741\scripts\browser-client.mjs` was not present; Playwright headless Chromium fallback was used.
- Runtime gate URL: `http://127.0.0.1:4371/thumbnail-generator/`.
- Desktop viewport: `1440x960`.
- Runtime checks:
  - Initial canvas rendered nonblank.
  - Manual traversal covered 10 side categories and 21 top-tab sections in both Japanese and English.
  - Japanese manual contained required GUI labels including `調整`, `共通設定`, `文字設定`, `図形設定`, `画像設定`, `キャンバス`, `発光 / エフェクト`, `エフェクト強度`, `全体表示`, `出力メニュー`, `表示言語`, and `現在の編集状態を自動保存`.
  - Japanese manual did not contain stale English GUI labels such as `Adjust`, `Common settings`, `Text settings`, `Shape settings`, `Image settings`, `Canvas object list`, `Effect intensity`, `Fit canvas`, `Output menu`, `Language:`, `Registered templates`, `Motion:`, `Glow / effects:`, `Save settings:`, or `Generate objects:`.
  - English manual retained required English GUI labels including `Adjust`, `Common settings`, `Text settings`, `Shape settings`, `Image settings`, `Canvas`, `Glow / effects`, `Effect intensity`, `Fit canvas`, `Output menu`, `Language`, and `Autosave current edit state`.
  - Manual content contained no known mojibake marker or Unicode replacement character.
  - Layer editing was exercised by changing the selected group name from `Object group` to `Runtime label sync group`.
  - WebP export downloaded `thumbnail-1280x720-2026-06-14T05-05-31-474Z.webp` with `714072` bytes.
  - Console health: no page errors or app console errors.
- Evidence:
  - `output/runtime-20260614-manual-label-sync/runtime-result.json`
  - `output/runtime-20260614-manual-label-sync/initial.png`
  - `output/runtime-20260614-manual-label-sync/manual-label-sync-ja.png`
  - `output/runtime-20260614-manual-label-sync/layer-edit.png`
- CSV/HTML compatibility: visible CSV/HTML import controls remain absent in this build; parser/model compatibility is covered by `npm test`.

## Footer Manual And Legal Modal Runtime Gate (2026-06-14)

Completed on 2026-06-14.

- Scope: moved Manual access from the header to the footer, removed header Issue reporting, added a GitHub icon to footer GitHub Issues, centered `© Sunmax Engineering`, removed the browser-only footer phrase, localized the visible English title to `ThumbNailed It?`, added the `Need it quick? ThumbNailed It!` tagline, and changed Privacy Policy / Terms to localized in-app modals.
- `npm test`: pass. 34 test files, 139 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; Vite chunk-size warning remained non-blocking.
- Browser plugin attempt: failed because `C:\Users\gkkjh\.codex\plugins\cache\openai-bundled\browser\26.609.30741\scripts\browser-client.mjs` was not present; Playwright with the local Chrome channel was used.
- Runtime gate URL: `http://127.0.0.1:4384/thumbnail-generator/?runtime=footer-legal-modal-20260614`.
- Desktop viewport: `1440x960`; mobile viewport: `390x760`.
- Runtime checks:
  - Page title and header were `ThumbNailed It?` in English mode, and the visible tagline was `Need it quick? ThumbNailed It!`.
  - Header Issue reporting and header Manual access were absent.
  - Footer Manual, Privacy Policy, Terms, X contact, centered `© Sunmax Engineering`, and GitHub Issues were visible; GitHub Issues included an SVG GitHub icon.
  - The footer did not contain `Browser-only static app` or `ブラウザ内完結の静的アプリ`.
  - Copyright center delta was `0.0078125px` from the viewport center.
  - Manual opened from the footer.
  - Privacy Policy and Terms opened as modals in English; Privacy Policy and Terms opened as Japanese modals after switching the language selector to Japanese.
  - Japanese mode header changed to `サムネいる？`; English `ThumbNailed It?` no longer appeared as the `h1`.
  - Canvas rendered nonblank (`1516x956`, sampled nonblank pixels `90581`).
  - Layer editing changed a selected layer name to `Runtime footer legal layer`.
  - WebP export downloaded `728640` bytes.
  - Mobile horizontal overflow was `0px`.
  - Console health: no page errors or app console errors; the only captured warning was the expected Playwright service worker block.
- Evidence:
  - `output/runtime-20260614-footer-legal-modal/runtime-result.json`
  - `output/runtime-20260614-footer-legal-modal/01-desktop-en.png`
  - `output/runtime-20260614-footer-legal-modal/02-privacy-en.png`
  - `output/runtime-20260614-footer-legal-modal/03-privacy-ja.png`
  - `output/runtime-20260614-footer-legal-modal/04-layer-edit.png`
  - `output/runtime-20260614-footer-legal-modal/05-mobile.png`
- CSV/HTML compatibility: visible CSV/HTML import controls remain absent in this build; parser/model compatibility is covered by `npm test`.

## Legal Modal Height, X Contact Icon, And Manual Use Cases Runtime Gate (2026-06-14)

Completed on 2026-06-14.

- Scope: enlarged Privacy Policy and Terms modal layout so desktop viewports avoid internal legal-content scrollbars, replaced the footer X contact with the official X logo SVG path from the X Brand toolkit asset, added a use-case line to every Manual feature entry, and removed the Manual header subtitle text.
- Source check: the X logo source was checked against X's official Brand toolkit page and downloaded official `logo.svg` asset under `output/x-brand-assets/` for implementation comparison; the committed app uses the matching local SVG path and does not load the asset from the network.
- `npm test`: pass. 34 test files, 139 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; Vite chunk-size warning remained non-blocking.
- Browser plugin attempt: failed because `C:\Users\gkkjh\.codex\plugins\cache\openai-bundled\browser\26.609.30741\scripts\browser-client.mjs` was not present; Playwright with the local Chrome channel was used.
- Runtime gate URL: `http://127.0.0.1:4385/thumbnail-generator/?runtime=legal-x-manual-use-cases-20260614`.
- Desktop viewport: `2048x1152`; mobile viewport: `390x760`.
- Runtime checks:
  - Canvas rendered nonblank (`1516x956`, sampled nonblank pixels `90581`).
  - Footer X contact rendered one `svg.x-logo-icon`, and its path matched the official X logo asset prefix.
  - Terms modal desktop metrics: dialog height `718.765625px`, legal-content client/scroll height `632/632`, overflow `visible`, no vertical overflow.
  - Privacy modal desktop metrics: dialog height `770.265625px`, legal-content client/scroll height `684/684`, overflow `visible`, no vertical overflow.
  - Manual header no longer contained the removed subtitle text.
  - Manual active section displayed use-case rows; the initial section showed `2` `.manual-use-case` rows, and the `ユースケース` / `Use case` label was present.
  - Layer editing changed the selected layer name to `Runtime legal x manual layer`.
  - WebP export downloaded `728640` bytes.
  - Mobile horizontal overflow was `0px`.
  - Console health: no page errors or app console errors; the only captured warning was the expected Playwright service worker block.
- Evidence:
  - `output/runtime-20260614-legal-x-manual-use-cases/runtime-result.json`
  - `output/runtime-20260614-legal-x-manual-use-cases/01-desktop-initial.png`
  - `output/runtime-20260614-legal-x-manual-use-cases/02-terms-dialog.png`
  - `output/runtime-20260614-legal-x-manual-use-cases/03-privacy-dialog.png`
  - `output/runtime-20260614-legal-x-manual-use-cases/04-manual-use-case.png`
  - `output/runtime-20260614-legal-x-manual-use-cases/05-layer-edit.png`
  - `output/runtime-20260614-legal-x-manual-use-cases/06-mobile.png`
- CSV/HTML compatibility: visible CSV/HTML import controls remain absent in this build; parser/model compatibility is covered by `npm test`.

## Footer X Contact No-Wrap Runtime Gate (2026-06-14)

Completed on 2026-06-14.

- Scope: changed the footer contact label from legacy X co-brand wording to X-only wording across the app, legal modals, static fallback pages, README, and docs; fixed the footer contact link so the official X icon and contact text remain horizontally aligned as one no-wrap item.
- `npm test`: pass. 34 test files, 139 tests.
- `npm run build`: pass. TypeScript build and Vite production build completed; Vite chunk-size warning remained non-blocking.
- Browser plugin attempt: failed because `C:\Users\gkkjh\.codex\plugins\cache\openai-bundled\browser\26.609.30741\scripts\browser-client.mjs` was not present; Playwright with the local Chrome channel was used.
- Runtime gate URL: `http://127.0.0.1:4386/thumbnail-generator/?runtime=footer-x-nowrap-20260614-rerun`.
- Desktop viewport: `1440x960`; mobile viewport: `390x760`.
- Runtime checks:
  - Canvas rendered nonblank (`1516x956`, sampled nonblank pixels `46036`).
  - Japanese footer contact rendered as `問い合わせ: X`; English footer contact rendered as `Contact: X`.
  - No visible app text contained legacy X co-brand text in Japanese, English, or mobile checks.
  - Footer contact link displayed as `flex`, used `white-space: nowrap`, and had one `svg.x-logo-icon`.
  - Desktop Japanese contact metrics: icon before text `true`, icon/text same line `true`, center delta `0px`, contact height `15.9375px`.
  - Desktop English contact metrics: icon before text `true`, icon/text same line `true`, center delta `0px`, contact height `15.9375px`.
  - Static fallback Privacy Policy and Terms pages returned HTTP 200, contained `X: @Sunmax0731`, and contained no legacy X co-brand text.
  - Layer/group editing changed the group name to `Runtime footer x nowrap group`.
  - WebP export downloaded `728640` bytes.
  - Mobile horizontal overflow was `0px`, and the X icon/text remained horizontally aligned.
  - Console health: no page errors or app console errors.
- Evidence:
  - `output/runtime-20260614-footer-x-nowrap/runtime-result.json`
  - `output/runtime-20260614-footer-x-nowrap/01-desktop-footer-x.png`
  - `output/runtime-20260614-footer-x-nowrap/02-mobile-footer-x.png`
- CSV/HTML compatibility: visible CSV/HTML import controls remain absent in this build; parser/model compatibility is covered by `npm test`.
