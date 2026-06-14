# Specification

## Layer Model

All layers share:

- `id`: stable layer identifier.
- `type`: `image`, `text`, or `shape`.
- `name`: display label.
- `x`, `y`: top-left position in output pixels.
- `width`, `height`: layer bounds in output pixels.
- `rotation`: degrees clockwise around the layer center.
- `opacity`: `0` to `1`.
- `visible`: whether the layer renders.
- `selectable`: whether the layer can be selected or edited.
- `groupId` and `groupName`: optional group metadata.
- `layerBlur`: whole-layer blur in CSS filter pixels.
- `edgeBlur`: signed soft edge blur amount. `0` disables edge blur, positive values draw a blurred layer copy behind the layer, and negative values draw the layer through a feathered alpha mask so inner edge softening is visible in preview and export.
- `edgeBlurStroke`: whether text outlines and shape strokes participate in edge blur. When false, the blur source uses the fill/body so strokes stay sharp.
- `cornerRadius`: rounded corner radius for image layers and supported shape paths. Rectangles use rounded rectangles; triangle, diamond, pentagon, hexagon, and star shapes use rounded polygon corners.
- `shadowColor`, `shadowOpacity`, `shadowBlur`, `shadowDistance`, and `shadowAngle`: optional draw-time layer shadow settings. The Adjust UI exposes these parameter controls only while the shadow checkbox is enabled; disabling shadow sets `shadowOpacity` to `0`.
- `rotateX` and `rotateY`: pseudo-3D plane rotation values in degrees, applied during preview and export rendering.
- `bevelSize` and `bevelOpacity`: optional bevel overlay settings for image, text, and shape layers. `bevelSize` is signed; positive and negative values reverse the highlight/shadow direction so users can choose the apparent bevel side without adding another field.
- `animation`: optional first per-layer animation setting retained for backward compatibility.
- `animations`: optional ordered list of per-layer animation settings used by Motion and OBS preview. Static PNG/JPEG/WebP export ignores animation time and renders the base layer state.

## Layer Animation

Layer animation is optional metadata on existing image, text, and shape layers. It does not add a new layer type. A layer may store multiple entries in `animations`; the legacy `animation` field mirrors the first entry for older saved data and layout import/export paths.

- `type`: `none`, `fade`, `slide`, `pop`, `pulse`, `blink`, `drift`, `zoom`, `spin`, `sway`, `shake`, or `breathe`.
- `startMs`: start time in milliseconds.
- `durationMs`: animation duration in milliseconds.
- `easing`: `linear` plus easings.net-style Sine, Quad, Cubic, Quart, Quint, Expo, Circ, Back, Elastic, and Bounce variants for `easeIn*`, `easeOut*`, and `easeInOut*`.
- `loop`: whether the animation repeats.
- `direction`: `none`, `left`, `right`, `up`, or `down` for motion presets that use movement. Direction is enabled for Slide, Drift, and Shake. New animations default to `none`.
- `distance`: movement distance in output pixels for movement presets. The Motion UI disables the distance control while direction is unavailable or `none`.
- `textAnimation`: text-only animation mode. Supported values are `none`, `typewriter`, `lineReveal`, and `wave`. These controls are exposed separately from common motion parameters and are enabled for text layers.
- `effectAnimation`: effect motion mode. Supported values are `none`, `glow`, `blur`, and `shine`.
- `effectIntensity`: effect strength from `0` to `100`.

Rendering applies each animation entry in order as a temporary draw-time transform. Text-only and effect motion can run even when the common `type` is `none`. The stored layer position, size, rotation, and opacity are not mutated by playback.

The right-panel animation tab is labeled `Animation` in English mode and `アニメ` in Japanese mode. It groups movement presets (`slide`, `drift`, and `shake`) into the Motion dropdown and non-moving animation/effect choices into the Glow / effects dropdown inside Common parameters. Text-only controls render only when the selected layer is a text layer. Effect intensity is disabled unless the selected Glow / effects choice supports intensity, such as Glow pulse, Blur in, or Shine. The bottom timeline is visible only while the Animation/アニメ tab is active, can be collapsed, can resize vertically from its top edge, supports direct segment start/end and whole-segment dragging, and exposes a Reset button that returns editor-preview playback to the beginning.

Editor-preview playback is controlled from the bottom timeline Play/Pause button and starts in the paused/editable state. When playback is running, selected objects are cleared and canvas object rows, right-inspector controls, timeline timing edits, output-size controls, pan/zoom edit controls, and direct preview canvas interactions are inert until playback is paused. The timeline ruler and each animated row show a playhead bar for the current playback position. Loop-enabled animation entries keep their editable start/end handles at the first cycle, while the timeline additionally draws faint repeated segments for later cycles to make ongoing loop playback visible without changing stored timing values.

## PWA Shell

The static build includes install metadata in `public/manifest.webmanifest`, a same-origin service worker in `public/sw.js`, and app icons in `public/favicon.svg` and `public/pwa-icon.svg`.

- Manifest name and short name: `サムネいる？`.
- GitHub Pages base path: `/thumbnail-generator/`.
- Display mode: `standalone`.
- Service worker scope: `/thumbnail-generator/`.
- Service worker cache: app shell files plus same-origin runtime responses under the service worker scope.

The app remains usable if service worker registration fails or the browser does not support PWA installation.

## Chrome Extension Bridge

Chrome extensions can integrate through a page-message bridge installed by `src/lib/extensionBridge.ts`. A content script should inject or use page-context messaging and communicate with `window.postMessage`.

- Channel: `thumbnail-generator.extension.v1`.
- Ready event: `thumbnail-generator:extension-ready`.
- Request shape: `{ channel, direction: "request", requestId, command, payload }`.
- Response shape: `{ channel, direction: "response", requestId, command, ok, payload, error }`.
- Commands:
  - `ping`: returns bridge capabilities.
  - `getSnapshot`: returns the current `SavedEditState` snapshot.
  - `applySnapshot`: accepts `{ snapshot }`, validates it through the saved edit-state parser, applies it to the editor, and persists it to the browser work-in-progress slot.

The bridge reuses the existing `SavedEditState` schema so extension integrations do not need a second model for layers, assets, output settings, CSV/HTML compatibility text, or template name.

## Image Layers

Image layers include:

- `imageKey`: imported image key or known sample asset key.
- `effects.grayscale`: `0` to `1`.
- `effects.blur`: CSS filter pixels.
- `effects.brightness`: percent, where `100` is unchanged.
- `effects.contrast`: percent, where `100` is unchanged.
- `effects.mosaic`: pixel block size. `0` disables mosaic.

Imported image assets may also store `tags`: an ordered list of browser-local free-form labels. Tags are assigned before imported images are registered, including any typed draft tag text that has not been added as a chip yet, can be edited later from the Assets tab, are preserved in edit-state and template snapshots, and are used by the image asset tag filter.

Folder import uses the browser file picker directory capability when available. Only files returned by the picker with supported image MIME types or common image extensions are registered; no backend or server scan is used.

## Group Object Assets

Group object assets are browser-local reusable layer groups stored under `thumbnail-generator.groupObjects.v1`. A group object stores:

- Group object id and user-visible name.
- Tags.
- Created and updated timestamps.
- A cloned layer list from the selected group.
- Referenced image assets needed by image layers inside that group.

Registering is only enabled while one selected editable group is active. Reusing a group object creates new layer ids, assigns one fresh shared `groupId`/`groupName`, offsets the layers slightly, merges any missing referenced image assets into the current asset list, and selects the newly inserted group for immediate placement. Group object rows in Assets support later tag edits, their own tag filter, and deletion from browser-local storage.

## Text Layers

Text layers include:

- `text`
- `fontSize`
- `fontFamily`
- `fontWeight`
- `color`
- `strokeColor`
- `strokeWidth`
- `strokeOpacity`
- `align`: `left`, `center`, or `right`
- `writingMode`: `horizontal` or `vertical`
- `lineHeight`
- `letterSpacing`: additional spacing between rendered characters.
- `fillOpacity`

Text layers can run a Fit text to box action. The action measures each line with the selected font, line height, and stroke width, then chooses the largest integer font size that fits within the layer width and height.

Text layer edit selection rectangles, hit testing, and resize handles use the configured layer `width` and `height` for both horizontal and vertical writing. Vertical text still renders as columns, and render padding/offscreen blur measurement also accounts for the rendered vertical text content so visible text is not lost while editing.

## Shape Layers

Shape layers include:

- `shape`: `rect`, `ellipse`, `triangle`, `diamond`, `pentagon`, `hexagon`, `star`, or `line`
- `fill`
- `fillOpacity`
- `strokeColor`
- `strokeWidth`
- `strokeOpacity`
- `lineStyle`: `solid`, `dotted`, `dashed`, or `wave` for line shapes.

Wave line rendering uses a smooth quadratic wave path based on stroke width and layer height so the style remains visible in both preview and export.

## CSV Layout Schema

CSV rows support the following columns:

```text
type,name,x,y,width,height,rotation,opacity,visible,selectable,groupId,groupName,layerBlur,edgeBlur,edgeBlurStroke,cornerRadius,shadowColor,shadowOpacity,shadowBlur,shadowDistance,shadowAngle,rotateX,rotateY,bevelSize,bevelOpacity,animationType,animationStartMs,animationDurationMs,animationEasing,animationLoop,animationDirection,animationDistance,animationText,animationEffect,animationEffectIntensity,text,fontSize,fontFamily,fontWeight,color,fillOpacity,strokeColor,strokeWidth,strokeOpacity,align,writingMode,lineHeight,letterSpacing,shape,fill,lineStyle,effect,image
```

Rules:

- `type` is required.
- Missing numbers fall back to safe defaults.
- `effect` accepts semicolon-separated values such as `grayscale=1;blur=4;mosaic=12`.
- `image` references an imported image name/key or a bundled sample key.
- `letterSpacing`, `fillOpacity`, `strokeOpacity`, `layerBlur`, `edgeBlur`, `edgeBlurStroke`, `cornerRadius`, shadow, pseudo-3D rotation, bevel, `groupId`, `groupName`, `writingMode`, `lineStyle`, and animation columns including text/effect motion columns are optional and fall back to safe defaults.
- Quoted CSV fields are supported.

## HTML Layout Schema

HTML layout import reads elements with `data-layer`.

Examples:

```html
<div data-layer="text" data-name="Title" data-x="80" data-y="90" data-width="900" data-height="150" data-font-size="96" data-color="#ffffff" data-stroke-color="#111827" data-stroke-width="10">LIVE TONIGHT</div>
<img data-layer="image" data-name="Hero" data-image="sample-bg" data-x="0" data-y="0" data-width="1280" data-height="720" data-effect="contrast=112;brightness=96" />
<div data-layer="shape" data-shape="rect" data-x="72" data-y="590" data-width="760" data-height="86" data-fill="#ff3d5a"></div>
<div data-layer="shape" data-shape="star" data-corner-radius="18" data-fill="#ffd166"></div>
<div data-layer="shape" data-shape="line" data-line-style="wave" data-stroke-width="12" data-stroke-color="#ffffff"></div>
<div data-layer="text" data-writing-mode="vertical" data-edge-blur="-8" data-edge-blur-stroke="true">VERT</div>
<div data-layer="text" data-shadow-color="#000000" data-shadow-opacity="45" data-shadow-blur="18" data-shadow-distance="20" data-shadow-angle="135" data-rotate-x="12" data-rotate-y="-8" data-bevel-size="8" data-bevel-opacity="35">DECORATED</div>
<div data-layer="text" data-animation-type="breathe" data-animation-duration-ms="1200" data-animation-easing="easeInOutSine" data-animation-direction="none" data-animation-loop="true" data-animation-text="wave" data-animation-effect="glow" data-animation-effect-intensity="70">MOTION</div>
```

## Export

Supported formats:

- PNG
- JPEG
- WebP

Presets:

- YouTube 16:9: `1280x720`
- Full HD 16:9: `1920x1080`
- Twitch panel 16:9: `1280x720`
- Square: `1080x1080`
- Portrait short: `1080x1920`
- Custom width and height

Preset option labels are localized in the preview header. Japanese mode displays user-facing names such as `YouTube 向け横長 16:9 1280x720`, `フルHD 16:9 1920x1080`, `Twitch 向け横長 16:9 1280x720`, `正方形 1080x1080`, `縦型ショート 1080x1920`, and `カスタム`; saved state continues to store stable preset ids.

## Direct Canvas Editing

The selected layer can be edited directly on the canvas:

- Drag inside the selected layer to move it.
- Drag corner handles to resize it.
- Drag the rotation handle above the layer to rotate it.
- Canvas drag move, resize, and rotate interactions suppress intermediate pointermove history entries and commit one undo/redo history step at pointerup when the final layer state differs from the drag start state.
- The preview frame is the output document area; it does not stretch a surrounding edit-only area when layers move outside the document.
- Ctrl/Meta/Shift click toggles layers into or out of a multi-selection.
- Dragging a selected layer in a multi-selection moves the selected group.
- The Adjust tab exposes live Relative edit controls for multi-selection. Move X and Move Y apply coordinate deltas to each selected editable layer as the control value changes. Rotation delta adds the same degree delta to each selected editable layer's current rotation as the control value changes. The UI tracks incremental deltas, so changing a live value from `12` to `5` applies `-7` rather than another absolute `5`.
- The Adjust tab also exposes Match angle to first selected when multiple editable layers are selected. The first selected editable layer is the reference; every other selected editable layer receives that exact rotation value. Locked layers remain unchanged.
- Inspector numeric fields remain the source of precise values.
- When multiple visible editable layers overlap under the pointer, body clicks select the frontmost layer in the current render order.
- Clicking preview space that is not a selectable layer or active handle, including the preview area outside the output frame, clears the current selection when pan mode is not active.
- Resize and rotation handles for the selected layer keep priority over body hit testing so direct editing remains reachable.
- The rotation handle is drawn as a distinct circular control with a rotate glyph. Hover and drag states use stronger contrast, and the cursor changes to a grab/grabbing affordance.
- Dragging an object outside the document does not change the user-selected zoom scale or expand the output frame.
- Visible objects outside the output frame are still rendered in the editor preview, but only outside-frame portions are dimmed. Static export remains clipped to the configured output canvas.
- Middle-button drag on the preview starts a range selection rectangle. Without modifiers, the range replaces the current selection. Shift+middle drag adds visible selectable objects fully contained by the range, and Ctrl/Meta+middle drag removes fully contained objects from the current selection. Partially overlapped objects are not selected. Grouped objects are range-selected only when the full visible selectable group bounds are contained by the range, then the editable group members are selected together.
- Vertical text selection, hit testing, resize handles, and Adjust width/height edits use the configured layer display bounds so preview resizing behaves like horizontal text. Edit padding still accounts for the rendered vertical columns after text, font size, line height, letter spacing, alignment, or line-break changes.

## Keyboard Shortcuts

Global editor shortcuts are active when focus is outside text fields, select controls, and modals:

- Delete or Backspace opens the same layer delete confirmation flow used by layer-row delete buttons.
- Ctrl-clicking a delete button skips confirmation for delete actions that normally ask for confirmation, such as layer and browser-template deletion.
- Ctrl+C copies selected editable layers to the internal editor clipboard.
- Ctrl+V pastes copied layers as offset independent copies.
- Ctrl+X cuts selected editable layers when at least one layer remains.
- Ctrl+D duplicates selected editable layers.
- Ctrl+Z and Ctrl+Y undo and redo layer edits. Canvas drag movement returns to the drag start position with one undo and returns to the drag completion position with one redo.

## Alignment

Alignment controls support left, center, right, top, middle, and bottom:

- With one selected layer, alignment targets the full canvas/output area.
- With multiple selected layers, alignment targets the selected group bounds.
- With three or more selected editable layers, Distribute H and Distribute V space layer centers evenly between the first and last selected-layer centers on that axis.

## Layer Ordering

The Layers panel displays the topmost layer first. Dragging a row in the list changes the canvas stacking order.

Layer rows also include:

- Visibility toggle.
- Selectable/editable lock toggle. Locked layers render and can be reordered, but cannot be selected or edited until unlocked.
- Delete button. Button deletion and keyboard Delete/Backspace on a focused editable layer row open the same confirmation dialog before removing the layer.
- Group metadata. Grouped rows show a folder-like group marker plus the group name, and selecting one grouped layer selects all editable members of that group.
- Grouped rows also expose an individual-edit button. This selects only that row's layer, marks it as an individual grouped selection, and lets Adjust edit that one layer without removing the group metadata.

The Layers tab also includes:

- Group selected objects, rename the selected group, and ungroup it.
- Alignment and distribution controls. Fit selected image/shape objects to the canvas is exposed from Adjust near position and size editing.
- Deleting the final remaining layer is allowed; the editor may intentionally show a zero-layer canvas.

## Editor Information Architecture

The left sidebar is grouped by task in this order:

- Templates: generator entry buttons plus browser-local template naming, optional tag entry, tag-filter dropdown, saving, loading, deletion, and independent list resizing. Existing template tags appear as input suggestions and as filter options; free-form tag input is allowed. Applying a browser-local template asks for confirmation, then replaces the current layer state and applies the template output aspect ratio.
- Layers: collapsible quick add, collapsible Canvas object ordering, visibility, selectable/editable lock, alignment, and even distribution.
- Assets: local image import, imported asset list, selected asset image-object insertion, Image Lab launch from imported asset rows, asset deletion, group-object reuse, group-object tag editing, and group-object deletion. Deleting an image asset also removes image objects that reference it.
- The previous left-panel Layouts tab and preview-pane Generated layout section are hidden from the GUI. CSV/HTML text remains part of edit-state and template compatibility.
- The previous guided creation strip is removed from the left panel.

The right inspector is grouped by task:

- Adjust: selected layer properties such as position, size, rotation, layer blur, edge blur, corner radius, shadow, pseudo-3D rotation, signed bevel, text, shape, Fill/Stroke color, and image effects. Common controls are labeled Common settings and can be collapsed or expanded; Text, Shape, and Image-only controls use the same collapsible section behavior below them. Numeric values are edited in the paired range/number inputs and are not repeated as separate readouts in the labels. Text alignment is edited with direct Left, Center, and Right buttons. Fill and Stroke color displays open a draggable popup Sketch-style single-color picker with alpha, so color editing does not expand the Adjust tab and separate fill/stroke opacity sliders are not duplicated.
- Colors: browser-local single-color registration, saved multi-color palettes, graphical palette maker preview, and quick application with per-row Fill/Stroke buttons. Saved single colors are displayed in list rows similar to layer rows. Registered single-color Fill buttons display the word `Fill`, legacy `Fill`/`Stroke` prefixes are hidden from row names, and saved multi-color palette rows show HEX values without `Color 1`-style labels. Registered single colors and saved multi-color palettes can both be reordered by dragging rows, and the new order is written back to browser storage.
- Animation / アニメ: ordered motion sets for the selected object, preset buttons, selected-object preview, toggleable easing graph, collapsible common parameters, text-only motion controls only for text objects, a movement Motion dropdown, a Glow / effects dropdown, start time, duration, easing, direction, distance, and loop behavior for OBS preview playback.

The visible app title is localized: Japanese mode shows `サムネいる？`, English mode shows `ThumbNailed It?`, and both show `Need it quick? ThumbNailed It!` below the title. The preview header exposes one Output menu for JPG, PNG, WebP, and OBS preview. The previous always-visible preview-pane Output section is removed. Edit-state save/restore/export/import/delete actions live in the top-right toolbar as icon buttons with tooltips; the Autosave current edit state checkbox remains text-labeled. The footer Manual button opens a fixed-size feature manual modal with left feature tabs, top section tabs, preserved tab state, preserved scroll position, localized Japanese/English content, real GUI captures that open in a larger image-only lightbox, operation-specific keyboard/mouse SVG diagrams, right-side table-of-contents buttons that scroll the matching manual entry to the content-pane top and highlight it on focus/hover, active-language GUI-label wording, one use-case line per feature entry, and bullet explanations for parameter/dropdown item effects. The Manual header contains only the title and close control; the previous descriptive subtitle is omitted. The bottom of the preview pane shows the motion timeline only while the Animation/アニメ tab is active. The timeline lists animated objects and their start/duration segments, exposes left and right segment handles for start/end edits, lets users drag a segment bar to move start and end together, can collapse for extra preview space, includes a Reset button for playback position, draws faint repeated segments for loop-enabled later cycles, and includes a top-edge vertical resize handle while preserving the default expanded height.

## Legal And Service Footer

The bottom footer is a service-information surface rather than an editor status bar. It uses a three-part layout: Manual, Privacy Policy, Terms, and X contact with the official X logo on the left; centered `© Sunmax Engineering`; and GitHub Issues with a GitHub icon on the right. Privacy Policy and Terms open in taller modals and switch their body text with the current display language. Static fallback pages remain served from `public/privacy-policy.html` and `public/terms.html` under the GitHub Pages base path without adding a backend.

The Layers, Colors, Registered templates, Assets image, and Assets group object lists use visible resize handles. Dragging a handle changes the list height, and Arrow Up/Down on the focused handle adjusts the height in keyboard-accessible steps. List rows keep minimum usable heights so dense image imports or group-object rows do not collapse their action controls.

Controls that cannot affect the current edit target are disabled instead of accepting inert input. Examples include single-line text line height, outline or stroke colors when stroke width is `0`, image asset switching when there is only one asset, and palette application when no selected text or shape layer can receive the color.

The Adjust tab exposes reset buttons for selected-layer rotation and opacity. Reset rotation sets `rotation` to `0`; reset opacity sets `opacity` to `1`.

## Quick Add

Layers includes collapsible quick-add controls for:

- Basic text object.
- Basic shape object.
- Basic line object.
- Headline text object.
- Subtitle text object.
- Badge shape.
- Divider bar shape.
- Selected image asset as an image object.

Each quick add inserts an editable object, selects it, and keeps the canvas state immediately exportable.

## Generators

The Templates tab exposes four generator entry buttons: schedule, standard thumbnail, vertical thumbnail, and stream waiting screen. The previous bundled default-template catalog is no longer shown in the current GUI after these generators are available. Browser-local templates remain separate named snapshots saved in localStorage, and loading or deleting one uses the existing confirmation dialog pattern.

The beta schedule generator opens in a modal and accepts:

- Schedule type: monthly or weekly.
- Canvas orientation: landscape `1280x720`, portrait `1080x1920`, or the current canvas size.
- Date inputs: browser calendar-style month/date inputs, weekly start day, Sunday/Monday week start for monthly grids, weekday language, and date format (`day` or `month/day`).
- Style inputs: title, the same font family choices exposed by Adjust, font weight, separate title/weekday/date/plan font-size sliders, card/line grid style, corner radius, stroke width, background color, cell color, accent color, text color, and adjacent-month date visibility.
- Schedule density inputs: one uniform action count for every day, or individual counts for all seven days in weekly schedules.
- Output behavior inputs: whether the generated objects should share group metadata.
- Persistence inputs: Generate objects saves the generator settings before replacing objects, and Save settings stores the settings without generating.

The modal shows a lightweight pre-generation preview that reflects the date labels, weekday language, action counts, colors, font, and grid style. On desktop it uses a wider four-column layout so the preview remains beside the input groups instead of increasing vertical height. Generating a schedule replaces the current Canvas object list with editable text and shape objects, applies the selected output size, selects the top generated object, updates the template-name draft, refreshes the internally stored CSV and HTML layout text, and uses a badge label tied to the schedule range (`JUNE`/`6月` for monthly schedules, `WEEK`/`週` for weekly schedules). The modal displays a beta notice because generated date/layout results may still need manual adjustment before export.

Fresh schedule generator settings default to a weekly portrait canvas with one action slot per day. Saved generator settings still restore the user's last explicitly saved choices.

The image generators use the same modal tone, layout, color picker, font choices, live preview, Generate objects action, and Save settings action. Each image generator provides five placement patterns. Their Grid / text section groups controls into Common, Title, Subtitle, and Label sections covering shared font family/weight, letter spacing, common corner radius, text sizes, stroke widths, and alignment. Letter spacing accepts `0` through both slider and number input, and number-step increments from negative values move normally toward `0`. Title, Subtitle, and Label slider controls are paired in two columns on desktop to keep the modal height compact. Standard, schedule, and stream waiting landscape previews use wider preview columns; vertical thumbnail and schedule portrait previews preserve the generated portrait aspect ratio while using narrower preview columns to avoid excessive right whitespace. Generator action buttons sit under the preview and align to the preview/modal lower edge. The Tone selector changes generated visual treatment for standard, vertical, and stream waiting layouts. Animation controls are only shown for stream waiting screens because standard and vertical thumbnail exports are static.

- Standard thumbnail: creates a 1280x720 editable thumbnail layout for general video thumbnails.
- Vertical thumbnail: creates a 1080x1920 editable portrait thumbnail layout for short-form videos.
- Stream waiting screen: creates a 1920x1080 animated livestream waiting screen with title, subtitle, label, accent shapes, optional sample image atmosphere, and looped animation metadata.

Generator settings are stored in localStorage under `thumbnail-generator.generatorSettings.v1.*` keys. The saved settings are separate from edit state and browser-local named templates.

## OBS Preview

The Output menu can open an OBS preview window. The child window is opened with popup/no-toolbar feature flags where the browser permits them, displays the animated canvas, draws without editor controls or selection handles, stretches the canvas to the preview viewport to avoid document letterboxing, and runs a `requestAnimationFrame` loop capped to approximately 30fps. It requests fullscreen after opening, retries fullscreen when the preview is clicked or `F`/`Enter` is pressed, and sizes the popup viewport to the current output aspect ratio when browser APIs allow it. A small preview-only control overlay provides Play/Pause, Reset, and Hide actions; `P` toggles Play/Pause, `R` resets playback, and `H` toggles that overlay for clean OBS capture. Browser security rules still decide whether a normal browser window can hide OS/browser chrome; true frame removal depends on fullscreen permission or the OBS capture mode. It uses the parent editor's latest browser-local layer, asset, output setting, and custom font state. Browser Source URLs, cloud scene hosting, and video export are out of scope for this MVP.

## Brand Kit

The brand kit is stored in browser `localStorage` under `thumbnail-generator.brandKit.v1`. It stores:

- Channel name.
- Primary color.
- Accent color.
- Brand font.
- Shadow/outline color.
- Optional logo asset key.

Brand kit setup controls are hidden from Templates in the current GUI, and Colors-side Brand kit registration buttons are also hidden. The storage model and application helpers remain available for existing saved data and internal compatibility.

## Quality Checks

The model layer can evaluate rule-based warnings for validation and future UI use:

- Many layers.
- 4K-size export.
- Large saved edit-state estimate.
- Long text that may be hard to read on mobile.
- Low text/background contrast when there is no outline.
- Visible layers close to platform safe-area edges.
- Hidden important layers such as title, headline, logo, brand, CTA, date, or text.
- Large image assets that may increase memory or browser storage use.

Warnings are advisory and do not block export. The visible bottom footer is reserved for service/legal links rather than warning chips.

## Font Choices

Text layers use a predefined font dropdown so common thumbnail fonts can be selected without typing CSS font-family values.

The predefined options are declared in `src/lib/fonts.ts`. The dropdown includes local/system fallback stacks plus hosted Google Fonts options loaded from `index.html`: Anton, Bangers, Bebas Neue, Dela Gothic One, DotGothic16, Luckiest Guy, M PLUS Rounded 1c, Mochiy Pop One, Montserrat, Noto Sans JP, Oswald, Permanent Marker, Playfair Display, Poppins, Rampart One, Roboto Condensed, Yusei Magic, and Zen Kaku Gothic New. Additional values can enter the layer model through CSV import, HTML import, saved templates, or browser-local custom font import.

Text `writingMode` defaults to `horizontal`. `vertical` draws each line as a vertical column and is reflected in preview, layout export, saved templates, edit state, and thumbnail export.

## Custom Fonts

Custom fonts are stored in browser `localStorage` under `thumbnail-generator.customFonts.v1`. A custom font entry stores:

- Font id.
- Display name.
- Generated FontFace family.
- Source file name.
- Data URL.
- Format: `woff2`, `woff`, `truetype`, or `opentype`.
- Created timestamp.

Users can import `.woff2`, `.woff`, `.ttf`, or `.otf` files from the Adjust tab while a text layer is selected. The app loads the file through the browser FontFace API, adds it to the font dropdown, and applies it immediately to the selected text layer. Unsupported formats or load failures are stored in the editor status state for diagnostics.

Export waits for `document.fonts.ready` before drawing so custom fonts are reflected in PNG, JPEG, and WebP output.

## YouTube Thumbnail Import

The YouTube thumbnail import helper accepts a YouTube URL or 11-character video id, but the current Assets GUI hides the YouTube URL controls. The browser extracts ids from `youtube.com/watch?v=...`, `youtu.be/...`, `/shorts/...`, `/embed/...`, and `/live/...` forms. It tries thumbnail candidates from highest to lowest quality:

- `maxresdefault.jpg`
- `sddefault.jpg`
- `hqdefault.jpg`
- `mqdefault.jpg`
- `default.jpg`

The first successful image response is converted to a data URL image asset and inserted as an editable image layer. This keeps export compatible with the browser-only canvas path and does not require a backend proxy.

## Preview Zoom And Pan

The canvas preview keeps a user-controlled zoom value. Preset or output size changes do not automatically recompute zoom. Users can select Fit canvas to calculate a one-time fit zoom from the visible canvas stage and the document aspect ratio; the action also recenters the output canvas in the preview, including cases where the fitted frame is wider than the visible workbench. Users can pan the preview manually with the Pan button, Space-drag, Alt-drag, or right-button drag.

Mouse-wheel movement over the preview zooms in and out around the pointer location and can exceed 100% up to the editor maximum. The preview workbench hides browser scrollbars and uses internal pan offsets so oversized canvases remain navigable without visible scrollbars, matching the canvas workspace behavior of tools such as Photoshop and Illustrator.

The edit preview includes dynamic padding around the document. Padding expands to include visible off-canvas layer bounds and selection handles. Export rendering does not use this edit padding, so downloaded PNG/JPEG/WebP files remain clipped to the configured output width and height.

## Localization

The app supports English and Japanese UI labels. Initial language is detected from `navigator.languages`/`navigator.language`; tags beginning with `ja` use Japanese, tags beginning with `en` use English, and unsupported tags fall back to English. The top toolbar language selector can switch language during the session.

## Theme

The app supports `system`, `light`, and `dark` theme modes from the top-right toolbar. The selected mode is stored in browser `localStorage` under `thumbnail-generator.theme.v1`. `system` follows `prefers-color-scheme`; `light` and `dark` force the corresponding app theme. The resolved theme is applied to the document and app shell through `data-theme` so static GitHub Pages output remains browser-only.

## Registered Templates

Registered templates are saved in browser `localStorage` under a repository-specific key. A template stores:

- Template id and user-provided name.
- Saved timestamp.
- Output settings.
- Layer list.
- Imported image assets, including data URLs when the browser storage quota allows it.
- Generated CSV and HTML layout text.

Multiple templates can be saved, loaded, and deleted.

Saving a template always creates a new saved entry, so repeated saves with the same display name are preserved.

## Color Palette

The color palette is stored in browser `localStorage` under `thumbnail-generator.colorPalette.v1`. A registered palette entry stores:

- Palette id.
- User-provided display name.
- Hex color value.
- Opacity alpha.
- Legacy apply target: `fill` or `stroke`, retained only for old saved data compatibility.

Legacy stored entries that only include `id` and `value` are read as Fill entries with generated names.

Registered colors can be applied to:

- Text fill color.
- Text outline color.
- Shape fill color.
- Shape stroke color.

Palette entries can be selected back into the Colors editor, updated in place, and reordered. Applying a registered color through its Fill or Stroke row button also applies that entry's opacity to supported text and shape layers. Legacy stored `groupName` values are ignored so old localStorage records load as plain single-color rows without rendering color group UI.

Saved palette sets are stored separately under `thumbnail-generator.savedColorPalettes.v1`. A saved palette set stores:

- Palette id.
- Display name.
- Pattern mode is now grouped by principle and uses stored keys:
  - Order principle: identity, analogous, intermediate, diod, opponent, split-complementary, triad, tetrad, pentad, hexad, rectangular.
  - Proximity principle: complex-harmony, natural-harmony.
  - Similarity principle: dominant-color, tone-on-tone, dominant-tone, tone-in-tone, tonal-color, camaieu, faux-camaieu.
  - Clarity principle: tricolor, bicolor.
- Legacy aliases are normalized for compatibility: complementary→opponent, split→split-complementary, square→tetrad, compound→complex-harmony, shades→natural-harmony, monochromatic→tonal-color.
- Base color.
- Generated color list.
- Created timestamp.

The palette maker can save the currently displayed pattern as one multi-color palette set. Saved palette rows display all colors in the set, each color has Fill and Stroke application buttons for the current text/shape selection, and saved palette rows can be reordered.

The Colors tab also provides an Adobe-style color exploration surface: a drag-capable color wheel with generated-color points, large palette bars below the wheel with HEX labels, an embedded `@uiw/react-color` Sketch-style HEX/RGB/alpha editor, and recent-color swatches derived from the current draft, registered colors, and saved palettes. The old wheel-side color strip is not rendered; the canonical color list appears below the palette maker. Selecting a wheel point only selects that point and does not change the base color. Dragging a point treats that point as the intended color, derives the matching base color for the active palette pattern, and regenerates the other points in the same scheme. The base color can also change through explicit base controls such as the wheel background, palette bars, Sketch-style controls, recent colors, or Set selected as base. Saved multi-color palettes and registered single-color rows can each be collapsed or expanded.

## Edit State Storage

The current edit state is stored in browser `localStorage` under `thumbnail-generator.editState.v1`. The autosave preference is stored separately under `thumbnail-generator.editState.preferences.v1`.

A saved edit state stores:

- Schema version.
- Saved timestamp.
- Output settings.
- Layer list.
- Imported image assets, including data URLs when browser storage quota allows it.
- Current CSV and HTML layout text.
- Current template-name draft.

The saved edit state is separate from named templates. Manual Save state overwrites this one work-in-progress slot. When Autosave current edit state is enabled, editor changes are saved after a short debounce. Reloading the app restores the saved edit state when one exists.

The top-right edit-state icon cluster supports edit-state JSON export, JSON import, and explicit saved-state deletion while the current thumbnail remains visible. Autosave remains a text-labeled checkbox in the same cluster. Large snapshots show a backup warning before users rely on browser storage alone. Save failures include recovery guidance to export JSON, delete old browser data, or remove large image/font assets.

## Image Lab

The Image Lab modal workspace opens from an imported asset row in the Assets tab. Local image import is handled from the Assets tab, and the modal processes the selected image in the browser to create a processed image asset plus a new image object. Supported operations:

- Chroma-key transparency with key color and tolerance.
- Rectangular cutout, with the crop rectangle set by dragging on the preview or by sliders.
- Circular/elliptical cutout, with the ellipse bounds set by dragging on the preview or by sliders.
- Polygon/free cutout by placing three or more points.
- Rectangular and circular/elliptical cutout selections can be moved or resized after creation by dragging preview handles.
- Polygon/free cutout points can be dragged after placement and Alt-clicked to delete a point.
- Image Lab preview zooms with the mouse wheel and pans with right-button drag. Right-click does not add polygon/free-selection points. Selection outlines and handles are drawn with layered dark, light, and accent strokes so they remain visible across bright, dark, and saturated image areas.
- Rectangular and circular/elliptical selections expose corner and side handles. Corner handles preserve the selected range aspect ratio while resizing; side handles resize that side freely.

Processing outputs PNG data URLs and remains browser-only. The previous separate Drag mode was removed because Rect drag selection covers the same rectangular workflow without duplicating modes.

The modal workspace provides a larger preview canvas than the sidebar, plus a header-level processed image add button that includes the selected source name, close button, backdrop dismissal, and Escape-key dismissal. Source changes stay outside the modal so Image Lab does not duplicate import controls. Chroma-key settings sit beside the position and size controls, while the processed image add action stays separated in the modal header. On narrow screens the workspace becomes a single-column modal to avoid horizontal overflow.

## Slider Controls

Numeric controls use sliders with paired number inputs where precision is useful. This includes layer position, size, rotation, opacity, text size, line height, strokes, image effects, output size, and Image Lab crop/chroma parameters.
