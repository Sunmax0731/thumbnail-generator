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
- `cornerRadius`: rounded corner radius for image layers and rectangular shape layers.
- `animation`: optional per-layer animation settings used by Motion and OBS preview. Static PNG/JPEG/WebP export ignores animation time and renders the base layer state.

## Layer Animation

Layer animation is optional metadata on existing image, text, and shape layers. It does not add a new layer type.

- `type`: `none`, `fade`, `slide`, `pop`, `pulse`, `blink`, or `drift`.
- `startMs`: start time in milliseconds.
- `durationMs`: animation duration in milliseconds.
- `easing`: `linear`, `easeIn`, `easeOut`, or `easeInOut`.
- `loop`: whether the animation repeats.
- `direction`: `left`, `right`, `up`, or `down` for slide and drift.
- `distance`: movement distance in output pixels for slide and drift.

Rendering applies animation as a temporary draw-time transform. The stored layer position, size, rotation, and opacity are not mutated by playback.

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

- `shape`: `rect`, `ellipse`, `triangle`, or `line`
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
<div data-layer="shape" data-shape="line" data-line-style="wave" data-stroke-width="12" data-stroke-color="#ffffff"></div>
<div data-layer="text" data-writing-mode="vertical" data-edge-blur="-8" data-edge-blur-stroke="true">VERT</div>
<div data-layer="text" data-animation-type="fade" data-animation-duration-ms="900" data-animation-loop="true">MOTION</div>
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
- Handles are rendered in preview padding, so controls remain visible even when they extend outside the thumbnail document bounds.
- Ctrl/Meta/Shift click toggles layers into or out of a multi-selection.
- Dragging a selected layer in a multi-selection moves the selected group.
- The Adjust tab exposes live Relative edit controls for multi-selection. Move X and Move Y apply coordinate deltas to each selected editable layer as the control value changes. Rotation delta adds the same degree delta to each selected editable layer's current rotation as the control value changes. The UI tracks incremental deltas, so changing a live value from `12` to `5` applies `-7` rather than another absolute `5`.
- The Adjust tab also exposes Match angle to first selected when multiple editable layers are selected. The first selected editable layer is the reference; every other selected editable layer receives that exact rotation value. Locked layers remain unchanged.
- Inspector numeric fields remain the source of precise values.
- When multiple visible editable layers overlap under the pointer, body clicks select the frontmost layer in the current render order.
- Clicking preview space that is not a selectable layer or active handle clears the current selection.
- Resize and rotation handles for the selected layer keep priority over body hit testing so direct editing remains reachable.
- The rotation handle is drawn as a distinct circular control with a rotate glyph. Hover and drag states use stronger contrast, and the cursor changes to a grab/grabbing affordance.
- Editing preview padding grows from visible layer bounds so layer content and handles extending outside the document remain visible and hit-testable.
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

## Layer Ordering

The Layers panel displays the topmost layer first. Dragging a row in the list changes the canvas stacking order.

Layer rows also include:

- Visibility toggle.
- Selectable/editable lock toggle. Locked layers render and can be reordered, but cannot be selected or edited until unlocked.
- Delete button. Button deletion and keyboard Delete/Backspace on a focused editable layer row open the same confirmation dialog before removing the layer.
- Group metadata. Grouped rows show a folder-like group marker plus the group name, and selecting one grouped layer selects all editable members of that group.
- Grouped rows also expose an individual-edit button. This selects only that row's layer, marks it as an individual grouped selection, and lets Adjust edit that one layer without removing the group metadata.

The Layers tab also includes:

- Fit selected image/shape layers to the canvas.
- Group selected layers, rename the selected group, and ungroup it.

## Editor Information Architecture

The left sidebar is grouped by task:

- Assets: local image import, Image Lab launch for the selected asset, imported asset list, selected asset image-layer insertion, expanded quick text/shape/line creation, and sample restoration.
- Layouts: generated CSV/HTML text, CSV import, and HTML import.
- Templates: bundled default templates, brand kit controls, and browser-local template naming, saving, loading, and deletion.

The right inspector is grouped by task:

- Layers: layer ordering, visibility, selectable/editable lock, and alignment.
- Adjust: selected layer properties such as position, size, rotation, opacity, text, shape, and image effects. Numeric values are edited in the paired range/number inputs and are not repeated as separate readouts in the labels. Text alignment is edited with direct Left, Center, and Right buttons.
- Colors: browser-local single-color registration, saved multi-color palettes, graphical palette maker preview, and quick application with per-row Fill/Stroke buttons. Saved single colors are displayed in list rows similar to layer rows.
- Motion: selected-layer animation type, start time, duration, easing, direction, distance, and loop behavior for OBS preview playback.

The Layers list and Colors list use visible resize handles. Dragging a handle changes the list height, and Arrow Up/Down on the focused handle adjusts the height in keyboard-accessible steps.

Controls that cannot affect the current edit target are disabled instead of accepting inert input. Examples include single-line text line height, outline or stroke colors when stroke width is `0`, image asset switching when there is only one asset, and palette application when no selected text or shape layer can receive the color.

The Adjust tab exposes reset buttons for selected-layer rotation and opacity. Reset rotation sets `rotation` to `0`; reset opacity sets `opacity` to `1`.

## Quick Add

Assets includes quick-add controls for:

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

Bundled default templates are static browser assets, not localStorage records. Loading one replaces the current output settings, layer list, generated CSV, generated HTML, and template name draft. The current shipped set contains 26 practical layouts built only from supported image, text, shape, and line layers:

- YouTube: Product Review, Tutorial Steps, Versus Comparison, Podcast Guest, Before After Reveal.
- Shorts: Shorts Quote, Vertical Tip, Reaction Clip, Daily Vlog, Fitness Challenge.
- Stream: Creator Live, Breaking News, Gaming Highlight, Event Countdown, Music Premiere.
- Cutout: Minimal Launch, Profile Cutout, Product Cutout, Food Cutout, Fashion Cutout.
- Schedule: Yearly Schedule Landscape, Yearly Schedule Portrait, Monthly Schedule Landscape, Monthly Schedule Portrait, Daily Schedule Landscape, Daily Schedule Portrait.

Each bundled template also carries browser-rendered catalog metadata:

- Category: `youtube`, `shorts`, `stream`, `cutout`, or `schedule`.
- Preview colors: three representative swatches used by the compact template preview.
- Output size badge: shown in the template row so users can distinguish 16:9, square, and portrait starts before loading.

The left panel keeps a guided start strip visible above the active task tab for Template, Image, Title, Brand, and Layout actions. These controls route to existing browser-only editor actions and do not create server state.

## OBS Preview

The canvas toolbar can open an OBS preview window. The child window displays only a canvas on a black background, draws without editor selection handles or preview padding, and runs a `requestAnimationFrame` loop capped to approximately 30fps. It uses the parent editor's latest browser-local layer, asset, output setting, and custom font state. OBS users can capture this separate window with Window Capture. Browser Source URLs, cloud scene hosting, and video export are out of scope for this MVP.

## Brand Kit

The brand kit is stored in browser `localStorage` under `thumbnail-generator.brandKit.v1`. It stores:

- Channel name.
- Primary color.
- Accent color.
- Brand font.
- Shadow/outline color.
- Optional logo asset key.

Capture style reads the current canvas text/shape styles into the kit. Apply kit updates selected editable text and shape layers with the kit font/colors; when no compatible layer is selected it targets all editable text/shape layers. If a logo asset is selected in the kit, applying the kit inserts that asset as an editable image layer.

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

Assets accepts a YouTube URL or 11-character video id. The browser extracts ids from `youtube.com/watch?v=...`, `youtu.be/...`, `/shorts/...`, `/embed/...`, and `/live/...` forms. It tries thumbnail candidates from highest to lowest quality:

- `maxresdefault.jpg`
- `sddefault.jpg`
- `hqdefault.jpg`
- `mqdefault.jpg`
- `default.jpg`

The first successful image response is converted to a data URL image asset and inserted as an editable image layer. This keeps export compatible with the browser-only canvas path and does not require a backend proxy.

## Preview Fit

The canvas preview keeps a user-controlled zoom value, but preset or output size changes recompute a fit zoom from the visible canvas stage and the document aspect ratio. Tall presets such as Shorts shrink the preview so the complete document and preview padding fit inside the desktop stage instead of forcing the editor shell to grow vertically.

The edit preview includes dynamic padding around the document. Padding expands to include visible off-canvas layer bounds and selection handles. Export rendering does not use this edit padding, so downloaded PNG/JPEG/WebP files remain clipped to the configured output width and height.

## Localization

The app supports English and Japanese UI labels. Initial language is detected from `navigator.languages`/`navigator.language`; tags beginning with `ja` use Japanese, tags beginning with `en` use English, and unsupported tags fall back to English. The top toolbar language selector can switch language during the session.

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

Palette entries can be selected back into the Colors editor and updated in place. Applying a registered color through its Fill or Stroke row button also applies that entry's opacity to supported text and shape layers. Legacy stored `groupName` values are ignored so old localStorage records load as plain single-color rows without rendering color group UI.

Saved palette sets are stored separately under `thumbnail-generator.savedColorPalettes.v1`. A saved palette set stores:

- Palette id.
- Display name.
- Pattern mode: analogous, complementary, split, triad, square, compound, shades, or monochromatic.
- Base color.
- Generated color list.
- Created timestamp.

The palette maker can save the currently displayed pattern as one multi-color palette set. Saved palette rows display all colors in the set, and each color has Fill and Stroke application buttons for the current text/shape selection.

The Colors tab also provides an Adobe-style color exploration surface: a drag-capable color wheel with generated-color points, large palette bars with HEX labels, synchronized HEX and RGB slider/number inputs, and recent-color swatches derived from the current draft, registered colors, and saved palettes. Selecting a wheel point only selects that point and does not change the base color. Dragging a point treats that point as the intended color, derives the matching base color for the active palette pattern, and regenerates the other points in the same scheme. The base color can also change through explicit base controls such as the wheel background, palette bars, HEX/RGB controls, recent colors, or Set selected as base.

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

The Image Lab modal workspace opens from the Images section in the sidebar. It processes imported or bundled images in the browser and creates a processed image asset plus a new image layer. Supported operations:

- Chroma-key transparency with key color and tolerance.
- Rectangular cutout, with the crop rectangle set by dragging on the preview or by sliders.
- Circular/elliptical cutout, with the ellipse bounds set by dragging on the preview or by sliders.
- Polygon/free cutout by placing three or more points.
- Rectangular and circular/elliptical cutout selections can be moved or resized after creation by dragging preview handles.
- Polygon/free cutout points can be dragged after placement and Alt-clicked to delete a point.

Processing outputs PNG data URLs and remains browser-only. The previous separate Drag mode was removed because Rect drag selection covers the same rectangular workflow without duplicating modes.

The modal workspace provides a larger preview canvas than the sidebar, plus close button, backdrop dismissal, and Escape-key dismissal. The left asset list can open Image Lab with the selected asset already active. Images imported inside Image Lab become the active processing target without requiring a second dropdown selection. On narrow screens the workspace becomes a single-column modal to avoid horizontal overflow.

## Slider Controls

Numeric controls use sliders with paired number inputs where precision is useful. This includes layer position, size, rotation, opacity, text size, line height, strokes, image effects, output size, and Image Lab crop/chroma parameters.
