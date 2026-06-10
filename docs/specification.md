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

Rendering applies each animation entry in order as a temporary draw-time transform. The stored layer position, size, rotation, and opacity are not mutated by playback.

## Image Layers

Image layers include:

- `imageKey`: imported image key or known sample asset key.
- `effects.grayscale`: `0` to `1`.
- `effects.blur`: CSS filter pixels.
- `effects.brightness`: percent, where `100` is unchanged.
- `effects.contrast`: percent, where `100` is unchanged.
- `effects.mosaic`: pixel block size. `0` disables mosaic.

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

## CSV Layout Schema

CSV rows support the following columns:

```text
type,name,x,y,width,height,rotation,opacity,visible,selectable,groupId,groupName,layerBlur,edgeBlur,edgeBlurStroke,cornerRadius,animationType,animationStartMs,animationDurationMs,animationEasing,animationLoop,animationDirection,animationDistance,text,fontSize,fontFamily,fontWeight,color,fillOpacity,strokeColor,strokeWidth,strokeOpacity,align,writingMode,lineHeight,letterSpacing,shape,fill,lineStyle,effect,image
```

Rules:

- `type` is required.
- Missing numbers fall back to safe defaults.
- `effect` accepts semicolon-separated values such as `grayscale=1;blur=4;mosaic=12`.
- `image` references an imported image name/key or a bundled sample key.
- `letterSpacing`, `fillOpacity`, `strokeOpacity`, `layerBlur`, `edgeBlur`, `edgeBlurStroke`, `cornerRadius`, `groupId`, `groupName`, `writingMode`, `lineStyle`, and animation columns are optional and fall back to safe defaults.
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
<div data-layer="text" data-animation-type="breathe" data-animation-duration-ms="1200" data-animation-easing="easeInOutSine" data-animation-direction="none" data-animation-loop="true">MOTION</div>
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
- Vertical text selection, hit testing, resize handles, and Adjust width/height edits use the configured layer display bounds so preview resizing behaves like horizontal text. Edit padding still accounts for the rendered vertical columns after text, font size, line height, letter spacing, alignment, or line-break changes.

## Keyboard Shortcuts

Global editor shortcuts are active when focus is outside text fields, select controls, and modals:

- Delete or Backspace opens the same layer delete confirmation flow used by layer-row delete buttons.
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

- Group selected layers, rename the selected group, and ungroup it.
- Alignment and distribution controls. Fit selected image/shape layers to the canvas is exposed from Adjust near position and size editing.
- Deleting the final remaining layer is allowed; the editor may intentionally show a zero-layer canvas.

## Editor Information Architecture

The left sidebar is grouped by task in this order:

- Templates: bundled default templates plus browser-local template naming, saving, loading, deletion, and independent list resizing. Applying a template asks for confirmation, then replaces the current layer state and applies the template output aspect ratio.
- Layers: collapsible quick add, collapsible layer ordering, visibility, selectable/editable lock, alignment, and even distribution.
- Assets: local image import, imported asset list, selected asset image-layer insertion, Image Lab launch from imported asset rows, and asset deletion. Deleting an asset also removes image layers that reference it.
- The previous left-panel Layouts tab and preview-pane Generated layout section are hidden from the GUI. CSV/HTML text remains part of edit-state and template compatibility.
- The previous guided creation strip is removed from the left panel.

The right inspector is grouped by task:

- Adjust: selected layer properties such as position, size, rotation, layer blur, edge blur, corner radius, text, shape, Fill/Stroke color, and image effects. Common layer controls are grouped at the top, and Text, Shape, or Image-only controls are grouped below them. Numeric values are edited in the paired range/number inputs and are not repeated as separate readouts in the labels. Text alignment is edited with direct Left, Center, and Right buttons. Fill and Stroke color displays open a draggable popup Sketch-style single-color picker with alpha, so color editing does not expand the Adjust tab and separate fill/stroke opacity sliders are not duplicated.
- Colors: browser-local single-color registration, saved multi-color palettes, graphical palette maker preview, and quick application with per-row Fill/Stroke buttons. Saved single colors are displayed in list rows similar to layer rows. Registered single-color Fill buttons display the word `Fill`, legacy `Fill`/`Stroke` prefixes are hidden from row names, and saved multi-color palette rows show HEX values without `Color 1`-style labels. Registered single colors and saved multi-color palettes can both be reordered by dragging rows, and the new order is written back to browser storage.
- Motion: ordered motion sets for the selected layer, selected-object preview, easing graph, start time, duration, easing, direction, distance, and loop behavior for OBS preview playback.

The Layers, Colors, Default templates, and Browser templates lists use visible resize handles. Dragging a handle changes the list height, and Arrow Up/Down on the focused handle adjusts the height in keyboard-accessible steps.

Controls that cannot affect the current edit target are disabled instead of accepting inert input. Examples include single-line text line height, outline or stroke colors when stroke width is `0`, image asset switching when there is only one asset, and palette application when no selected text or shape layer can receive the color.

The Adjust tab exposes reset buttons for selected-layer rotation and opacity. Reset rotation sets `rotation` to `0`; reset opacity sets `opacity` to `1`.

## Quick Add

Layers includes collapsible quick-add controls for:

- Basic text layer.
- Basic shape layer.
- Basic line layer.
- Headline text layer.
- Subtitle text layer.
- Badge shape.
- Divider bar shape.
- Selected image asset as an image layer.

Each quick add inserts an editable layer, selects it, and keeps the canvas state immediately exportable.

## Default Templates

Bundled default templates are static browser assets, not localStorage records. Loading one first shows a localized confirmation dialog, then replaces the current output settings, layer list, generated CSV, generated HTML, and template name draft. The template's output aspect ratio is applied automatically, and the preview zoom auto-fits so portrait or square starts are not clipped in the visible preview area. Browser-local templates use the same confirmation style when applied or deleted. The current shipped set contains 38 practical layouts built only from supported image, text, shape, and line layers:

- YouTube: Product Review, Tutorial Steps, Versus Comparison, Podcast Guest, Before After Reveal.
- Shorts: Shorts Quote, Vertical Tip, Reaction Clip, Daily Vlog, Fitness Challenge.
- Stream: Creator Live, Breaking News, Gaming Highlight, Event Countdown, Music Premiere.
- Cutout: Minimal Launch, Profile Cutout, Product Cutout, Food Cutout, Fashion Cutout.
- Schedule: Yearly Schedule Landscape, Yearly Schedule Portrait, Monthly Schedule Landscape, Monthly Schedule Portrait, Weekly Schedule Landscape, Weekly Schedule Portrait, Daily Schedule Landscape, Daily Schedule Portrait.
- Motion: Animated Eyecatch Neon Pulse, Animated Eyecatch Pop Title, Animated Eyecatch News Flash, Animated Eyecatch Countdown, Animated Eyecatch Product Reveal, Animated Waiting Stream Start, Animated Waiting Chat Lobby, Animated Waiting Countdown, Animated Waiting Calm Screen, Animated Waiting Game Room.

Each bundled template also carries browser-rendered catalog metadata:

- Category: `youtube`, `shorts`, `stream`, `cutout`, `schedule`, or `motion`.
- Preview colors: three representative swatches used by the compact template preview.
- Output size badge: shown in the template row so users can distinguish 16:9, square, and portrait starts before loading.

The left panel no longer shows a guided start strip. Template filters remain the primary way to narrow bundled starts by `All`, `YouTube`, `Shorts`, `Stream`, `Cutout`, `Schedule`, and `Motion`.

The Templates tab also exposes a beta schedule generator. The generator opens in a modal and accepts:

- Schedule type: monthly or weekly.
- Canvas orientation: landscape `1280x720`, portrait `1080x1920`, or the current canvas size.
- Date inputs: browser calendar-style month/date inputs, weekly start day, Sunday/Monday week start for monthly grids, weekday language, and date format (`day` or `month/day`).
- Style inputs: title, font family, font weight, font size, card/line grid style, corner radius, stroke width, background color, cell color, accent color, text color, and adjacent-month date visibility.
- Schedule density inputs: one uniform action count for every day, or individual counts for all seven days in weekly schedules.
- Output behavior inputs: whether the generated layers should share group metadata.

The modal shows a lightweight pre-generation preview that reflects the date labels, weekday language, action counts, colors, font, and grid style. Generating a schedule replaces the current layer list with editable text and shape layers, applies the selected output size, selects the top generated layer, updates the template-name draft, and refreshes the internally stored CSV and HTML layout text. The modal displays a beta notice because generated date/layout results may still need manual adjustment before export.

## OBS Preview

The canvas toolbar can open an OBS preview window. The child window is opened with popup/no-toolbar feature flags where the browser permits them, displays only a canvas on a black background, draws without editor controls or selection handles, and runs a `requestAnimationFrame` loop capped to approximately 30fps. It also requests fullscreen after opening; browser and OBS capture settings ultimately decide whether OS or browser chrome is captured. It uses the parent editor's latest browser-local layer, asset, output setting, and custom font state. Browser Source URLs, cloud scene hosting, and video export are out of scope for this MVP.

## Brand Kit

The brand kit is stored in browser `localStorage` under `thumbnail-generator.brandKit.v1`. It stores:

- Channel name.
- Primary color.
- Accent color.
- Brand font.
- Shadow/outline color.
- Optional logo asset key.

Brand kit setup controls are hidden from Templates in the current GUI. The storage model and application helpers remain available for existing saved data and internal compatibility.

Colors can register the current palette draft, saved palette colors, or registered single-color rows into the Brand kit primary, accent, or shadow/outline color slots without leaving the Colors tab.

## Quality Warnings

The status bar can show rule-based warnings while editing:

- Many layers.
- 4K-size export.
- Large saved edit-state estimate.
- Long text that may be hard to read on mobile.
- Low text/background contrast when there is no outline.
- Visible layers close to platform safe-area edges.
- Hidden important layers such as title, headline, logo, brand, CTA, date, or text.
- Large image assets that may increase memory or browser storage use.

Warnings are advisory and do not block export.

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

Users can import `.woff2`, `.woff`, `.ttf`, or `.otf` files from the Adjust tab while a text layer is selected. The app loads the file through the browser FontFace API, adds it to the font dropdown, and applies it immediately to the selected text layer. Unsupported formats or load failures are reported in the status bar.

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

The canvas preview keeps a user-controlled zoom value. Preset or output size changes do not automatically recompute zoom. Users can select Fit canvas to calculate a one-time fit zoom from the visible canvas stage and the document aspect ratio, or pan the scrollable preview manually with the Pan button, Space-drag, or Alt-drag.

The edit preview includes dynamic padding around the document. Padding expands to include visible off-canvas layer bounds and selection handles. Export rendering does not use this edit padding, so downloaded PNG/JPEG/WebP files remain clipped to the configured output width and height.

## Localization

The app supports English and Japanese UI labels. Initial language is detected from `navigator.languages`/`navigator.language`; tags beginning with `ja` use Japanese, tags beginning with `en` use English, and unsupported tags fall back to English. The top toolbar language selector can switch language during the session.

## Theme

The app supports `system`, `light`, and `dark` theme modes from the top-right toolbar. The selected mode is stored in browser `localStorage` under `thumbnail-generator.theme.v1`. `system` follows `prefers-color-scheme`; `light` and `dark` force the corresponding app theme. The resolved theme is applied to the document and app shell through `data-theme` so static GitHub Pages output remains browser-only.

## Browser Templates

Templates are saved in browser `localStorage` under a repository-specific key. A template stores:

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
- Pattern mode: analogous, complementary, split, triad, square, compound, shades, or monochromatic.
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

The canvas preview pane contains the edit-state section. It supports edit-state JSON export, JSON import, and explicit saved-state deletion while the current thumbnail remains visible. Large snapshots show a backup warning before users rely on browser storage alone. Save failures include recovery guidance to export JSON, delete old browser data, or remove large image/font assets.

## Image Lab

The Image Lab modal workspace opens from an imported asset row in the Assets tab. Local image import is handled from the Assets tab, and the modal processes the selected image in the browser to create a processed image asset plus a new image layer. Supported operations:

- Chroma-key transparency with key color and tolerance.
- Rectangular cutout, with the crop rectangle set by dragging on the preview or by sliders.
- Circular/elliptical cutout, with the ellipse bounds set by dragging on the preview or by sliders.
- Polygon/free cutout by placing three or more points.
- Rectangular and circular/elliptical cutout selections can be moved or resized after creation by dragging preview handles.
- Polygon/free cutout points can be dragged after placement and Alt-clicked to delete a point.

Processing outputs PNG data URLs and remains browser-only. The previous separate Drag mode was removed because Rect drag selection covers the same rectangular workflow without duplicating modes.

The modal workspace provides a larger preview canvas than the sidebar, plus a header-level processed-layer creation button, close button, backdrop dismissal, and Escape-key dismissal. Source changes stay outside the modal so Image Lab does not duplicate import controls. Chroma-key settings sit beside the position and size controls, while the processed-layer creation action stays separated in the modal header. On narrow screens the workspace becomes a single-column modal to avoid horizontal overflow.

## Slider Controls

Numeric controls use sliders with paired number inputs where precision is useful. This includes layer position, size, rotation, opacity, text size, line height, strokes, image effects, output size, and Image Lab crop/chroma parameters.
