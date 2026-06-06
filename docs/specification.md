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
- `align`: `left`, `center`, or `right`
- `lineHeight`

## Shape Layers

Shape layers include:

- `shape`: `rect`, `ellipse`, or `triangle`
- `fill`
- `strokeColor`
- `strokeWidth`

## CSV Layout Schema

CSV rows support the following columns:

```text
type,name,x,y,width,height,rotation,opacity,text,fontSize,fontFamily,fontWeight,color,strokeColor,strokeWidth,align,lineHeight,shape,fill,effect,image
```

Rules:

- `type` is required.
- Missing numbers fall back to safe defaults.
- `effect` accepts semicolon-separated values such as `grayscale=1;blur=4;mosaic=12`.
- `image` references an imported image name/key or a bundled sample key.
- Quoted CSV fields are supported.

## HTML Layout Schema

HTML layout import reads elements with `data-layer`.

Examples:

```html
<div data-layer="text" data-name="Title" data-x="80" data-y="90" data-width="900" data-height="150" data-font-size="96" data-color="#ffffff" data-stroke-color="#111827" data-stroke-width="10">LIVE TONIGHT</div>
<img data-layer="image" data-name="Hero" data-image="sample-bg" data-x="0" data-y="0" data-width="1280" data-height="720" data-effect="contrast=112;brightness=96" />
<div data-layer="shape" data-shape="rect" data-x="72" data-y="590" data-width="760" data-height="86" data-fill="#ff3d5a"></div>
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
- Inspector numeric fields remain the source of precise values.
- When multiple visible editable layers overlap under the pointer, body clicks select the frontmost layer in the current render order.
- Resize and rotation handles for the selected layer keep priority over body hit testing so direct editing remains reachable.

## Alignment

Alignment controls support left, center, right, top, middle, and bottom:

- With one selected layer, alignment targets the full canvas/output area.
- With multiple selected layers, alignment targets the selected group bounds.

## Layer Ordering

The Layers panel displays the topmost layer first. Dragging a row in the list changes the canvas stacking order.

Layer rows also include:

- Visibility toggle.
- Selectable/editable lock toggle. Locked layers render and can be reordered, but cannot be selected or edited until unlocked.
- Delete button. Button deletion opens a confirmation dialog; keyboard Delete/Backspace on a focused editable layer row removes that row directly and moves selection to another selectable layer when needed.

## Editor Information Architecture

The left sidebar is grouped by task:

- Assets: local image import, Image Lab launch, imported asset list, text/shape creation, and sample restoration.
- Layouts: generated CSV/HTML text, CSV import, and HTML import.
- Templates: browser-local template naming, saving, loading, and deletion.

The right inspector is grouped by task:

- Layers: layer ordering, visibility, selectable/editable lock, and alignment.
- Adjust: selected layer properties such as position, size, rotation, opacity, text, shape, and image effects. Numeric values are edited in the paired range/number inputs and are not repeated as separate readouts in the labels.
- Colors: browser-local color palette registration and quick application with saved names and Fill/Stroke targets.

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

## Image Lab

The Image Lab modal workspace opens from the Images section in the sidebar. It processes imported or bundled images in the browser and creates a processed image asset plus a new image layer. Supported operations:

- Chroma-key transparency with key color and tolerance.
- Rectangular cutout, with the crop rectangle set by dragging on the preview or by sliders.
- Circular/elliptical cutout, with the ellipse bounds set by dragging on the preview or by sliders.
- Polygon/free cutout by placing three or more points.
- Drag-range rectangular cutout.

Processing outputs PNG data URLs and remains browser-only.

The modal workspace provides a larger preview canvas than the sidebar, plus close button, backdrop dismissal, and Escape-key dismissal. On narrow screens the workspace becomes a single-column modal to avoid horizontal overflow.

## Slider Controls

Numeric controls use sliders with paired number inputs where precision is useful. This includes layer position, size, rotation, opacity, text size, line height, strokes, image effects, output size, and Image Lab crop/chroma parameters.
