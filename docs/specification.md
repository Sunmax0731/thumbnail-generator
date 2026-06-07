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
- `edgeBlur`: soft edge/shadow blur amount.
- `cornerRadius`: rounded corner radius for image layers and rectangular shape layers.

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
- `lineHeight`
- `letterSpacing`: additional spacing between rendered characters.
- `fillOpacity`

Text layers can run a Fit text to box action. The action measures each line with the selected font, line height, and stroke width, then chooses the largest integer font size that fits within the layer width and height.

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
type,name,x,y,width,height,rotation,opacity,visible,selectable,groupId,groupName,layerBlur,edgeBlur,cornerRadius,text,fontSize,fontFamily,fontWeight,color,fillOpacity,strokeColor,strokeWidth,strokeOpacity,align,lineHeight,letterSpacing,shape,fill,lineStyle,effect,image
```

Rules:

- `type` is required.
- Missing numbers fall back to safe defaults.
- `effect` accepts semicolon-separated values such as `grayscale=1;blur=4;mosaic=12`.
- `image` references an imported image name/key or a bundled sample key.
- `letterSpacing`, `fillOpacity`, `strokeOpacity`, `layerBlur`, `edgeBlur`, `cornerRadius`, `groupId`, `groupName`, and `lineStyle` are optional and fall back to safe defaults.
- Quoted CSV fields are supported.

## HTML Layout Schema

HTML layout import reads elements with `data-layer`.

Examples:

```html
<div data-layer="text" data-name="Title" data-x="80" data-y="90" data-width="900" data-height="150" data-font-size="96" data-color="#ffffff" data-stroke-color="#111827" data-stroke-width="10">LIVE TONIGHT</div>
<img data-layer="image" data-name="Hero" data-image="sample-bg" data-x="0" data-y="0" data-width="1280" data-height="720" data-effect="contrast=112;brightness=96" />
<div data-layer="shape" data-shape="rect" data-x="72" data-y="590" data-width="760" data-height="86" data-fill="#ff3d5a"></div>
<div data-layer="shape" data-shape="line" data-line-style="wave" data-stroke-width="12" data-stroke-color="#ffffff"></div>
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

## Keyboard Shortcuts

Global editor shortcuts are active when focus is outside text fields, select controls, and modals:

- Delete or Backspace opens the same layer delete confirmation flow used by layer-row delete buttons.
- Ctrl+C copies selected editable layers to the internal editor clipboard.
- Ctrl+V pastes copied layers as offset independent copies.
- Ctrl+X cuts selected editable layers when at least one layer remains.
- Ctrl+D duplicates selected editable layers.
- Ctrl+Z and Ctrl+Y undo and redo layer-list edits.

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
- Group metadata. Grouped rows show the group name, and selecting one grouped layer selects all editable members of that group.

The Layers tab also includes:

- Add line layer.
- Fit selected image/shape layers to the canvas.
- Group selected layers, rename the selected group, and ungroup it.

## Editor Information Architecture

The left sidebar is grouped by task:

- Assets: local image import, Image Lab launch for the selected asset, imported asset list, selected asset image-layer insertion, expanded quick text/shape creation, and sample restoration.
- Layouts: generated CSV/HTML text, CSV import, and HTML import.
- Templates: edit-state controls, bundled default templates, and browser-local template naming, saving, loading, and deletion.

The right inspector is grouped by task:

- Layers: layer ordering, visibility, selectable/editable lock, and alignment.
- Adjust: selected layer properties such as position, size, rotation, opacity, text, shape, and image effects. Numeric values are edited in the paired range/number inputs and are not repeated as separate readouts in the labels. Text alignment is edited with direct Left, Center, and Right buttons.
- Colors: browser-local color palette registration and quick application with saved names and Fill/Stroke targets. Saved colors are displayed in list rows similar to layer rows.

The Layers list and Colors list use visible resize handles. Dragging a handle changes the list height, and Arrow Up/Down on the focused handle adjusts the height in keyboard-accessible steps.

Controls that cannot affect the current edit target are disabled instead of accepting inert input. Examples include single-line text line height, outline or stroke colors when stroke width is `0`, image asset switching when there is only one asset, and palette application when no selected text or shape layer can receive the color.

The Adjust tab exposes reset buttons for selected-layer rotation and opacity. Reset rotation sets `rotation` to `0`; reset opacity sets `opacity` to `1`.

## Quick Add

Assets includes quick-add controls for:

- Basic text layer.
- Basic shape layer.
- Headline text layer.
- Subtitle text layer.
- Badge shape.
- Divider bar shape.
- Selected image asset as an image layer.

Each quick add inserts an editable layer, selects it, and keeps the canvas state immediately exportable.

## Default Templates

Bundled default templates are static browser assets, not localStorage records. Loading one replaces the current output settings, layer list, generated CSV, generated HTML, and template name draft. The current shipped set covers creator livestream, product review, tutorial steps, and portrait-short quote layouts.

## Font Choices

Text layers use a predefined font dropdown so common thumbnail fonts can be selected without typing CSS font-family values.

The predefined options are declared in `src/lib/fonts.ts`. Additional values can enter the layer model through CSV import, HTML import, saved templates, or browser-local custom font import.

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
- Apply target: `fill` or `stroke`.

Legacy stored entries that only include `id` and `value` are read as Fill entries with generated names.

Registered colors can be applied to:

- Text fill color.
- Text outline color.
- Shape fill color.
- Shape stroke color.

Palette entries can be selected back into the Colors editor and updated in place. A palette entry stores optional `groupName` and `alpha` values. Applying a Fill or Stroke palette entry also applies that entry's opacity to supported text and shape layers.

Palette groups are derived from entries with the same group name. Applying a group sets the selected text/shape fill and stroke colors together when the group has matching Fill and Stroke entries. The palette can generate analogous, complementary, split-complementary, and triad suggestions from the current draft color.

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
