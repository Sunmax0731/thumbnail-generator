# User Guide

## Start

Run the app locally:

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal. For production validation after `npm run build`, use:

```powershell
npm run preview
```

## Editor Layout

- Language: use the top toolbar selector to switch between Japanese and English. On first load, the app uses Japanese or English when the browser/OS language matches those languages; unsupported languages fall back to English.
- Assets: import image files, import a YouTube thumbnail by URL/video id, select imported assets, add image/text/shape/line starter layers, open Image Lab for the selected asset, and restore the sample template.
- Layouts: edit generated CSV/HTML layout text and apply CSV or HTML imports.
- Templates: load bundled default templates, save or restore the current edit state, enable autosave, and save/load/delete browser-local templates.
- Layers: reorder, lock, hide/show, select, align, duplicate, delete layers, group layers, fit selected image/shape layers to the canvas, and resize the list area with the handle below the list.
- Adjust: edit the selected layer's position, size, rotation, opacity, layer blur, signed edge blur, stroke/outline blur participation, corner radius, text, font, text writing mode, text kerning, text alignment, line style, fill/stroke opacity, shape, and image effects.
- Colors: register and edit named single colors, explore colors with a drag-capable linked color wheel and generated palette bars, use synchronized HEX/RGB sliders and number inputs, reuse recent colors, preview and save multi-color palette patterns, set opacity, apply registered single colors or saved-palette colors as Fill or Stroke to selected text or shape layers, and resize the color list area with the handle below the list.

## Import Layouts

Use the Layouts tab to paste CSV or HTML definitions, then select Apply CSV or Apply HTML. CSV and HTML import replace the current layer list when valid layers are found. Image references should match imported asset names/keys or the bundled `sample-bg` asset.

## Edit The Canvas

- Click a visible editable layer in the preview to select it.
- Click blank preview space to clear the current selection.
- If layers overlap, the frontmost visible editable layer is selected.
- Drag inside the selected layer to move it.
- Drag movement uses one undo/redo step for the confirmed start and end positions.
- Drag a corner handle to resize it.
- Drag the top rotation handle to rotate it. The rotation handle shows a rotate mark and changes to a grab cursor on hover.
- Use Ctrl, Meta, or Shift while selecting to build a multi-selection.
- With multiple layers selected, open Adjust and use Relative edit to move all selected layers by the same X/Y delta or rotate each selected layer by the same degree delta. Changes apply live as you edit the values; there is no Apply button.
- With multiple layers selected, use Match angle to first selected to set every selected editable layer to the first selected editable layer's rotation.
- Use Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y for copy, paste, cut, duplicate, undo, and redo when focus is outside text fields and modals.
- Press Delete or Backspace while a layer is selected to open the layer delete confirmation dialog.
- Open Layers to group multiple selected layers, rename the group, or ungroup it. Selecting one grouped row or one grouped preview object selects the editable members of that group.
- For a grouped row, use the small pointer button to select only that layer. Adjust then edits that one grouped object while the group metadata remains intact.
- Use Fit to canvas in Layers to set selected image or shape layers to `x=0`, `y=0`, and the current output width/height.
- Layers can extend outside the document while editing; the preview expands its edit-only padding so overhanging content and handles remain visible. Exported images still include only the configured canvas size.
- In Adjust, use Reset rotation to return the selected layer to `0` degrees and Reset opacity to return it to `100%`.
- Disabled controls are intentionally inactive because they do not affect the current target. For example, Line height is disabled until a text layer contains multiple lines.

## Quick Add And Assets

Use Assets to add common starter layers quickly:

- Text and Shape add basic editable layers.
- Line adds an editable line layer; select it and open Adjust to choose solid, dotted, dashed, or wave.
- Headline, Subtitle, Badge, and Divider add pre-sized thumbnail components.
- Select an imported asset row, then use its add button to place that image as a layer.
- Paste a YouTube URL or 11-character video id into YouTube URL and select Import thumbnail to add that video thumbnail as an editable image layer.
- Use the scissors button on an asset row to open that image directly in Image Lab.

## Default Templates

Open Templates and choose a bundled default template to replace the current canvas with a complete starting layout. The shipped templates cover 10 practical starts: Creator Live, Product Review, Tutorial Steps, Shorts Quote, Breaking News, Versus Comparison, Gaming Highlight, Podcast Guest, Event Countdown, and Minimal Launch. Browser templates remain separate named snapshots saved in localStorage.

## Save Current Edit State

Open Templates and use Edit state:

- Save state stores the current output settings, layers, image assets, CSV/HTML text, and template-name draft in browser localStorage.
- Restore state reloads the saved work-in-progress state.
- Autosave current edit state saves editor changes after a short delay while the toggle is on.

This edit state is a single recovery slot. Browser templates remain separate named snapshots.

## Text Alignment

Select a text layer, open Adjust, and choose Left, Center, or Right from the three alignment buttons. The selected alignment stays highlighted.

## Fit Text

1. Select a text layer.
2. Open Adjust.
3. Select Fit text to box.

The app picks the largest font size that fits the layer width and height while respecting line height and stroke width.

## Add Custom Fonts

1. Select a text layer.
2. Open the Adjust tab.
3. Use Add font and choose a `.woff2`, `.woff`, `.ttf`, or `.otf` file.
4. The imported font is saved in browser localStorage and appears in the font dropdown with `(custom)`.

When a text layer is selected during import, the new font is applied to that layer immediately. If a font file is unsupported or cannot be loaded, the status bar shows the import or load failure.

## Google Fonts And Vertical Text

Select a text layer, open Adjust, and use Font to choose hosted Google Fonts options such as Anton, Bangers, Bebas Neue, Noto Sans JP, Oswald, or Roboto Condensed. Use Writing mode to switch the selected text layer between Horizontal and Vertical. Vertical text is rendered in the preview and export path and is saved through CSV/HTML, templates, and edit state. When a vertical text layer is selected, the selection frame, hit testing, handles, and edit padding follow the rendered vertical columns.

## Edge Blur

Select a layer and open Adjust. Edge blur accepts signed values: `0` disables it, positive values create an outer blur, and negative values create an inner blur. For text and shape layers, Blur stroke controls whether outlines/strokes participate in the blur source or remain sharp.

## Presets And Export

Select an output preset from the top toolbar. Tall presets such as Shorts automatically reduce the preview zoom so the whole canvas fits the visible stage. Use PNG, JPG, WebP, or Export to download the rendered thumbnail.

## Image Lab

Open Image Lab from Assets or from an asset row. The modal supports chroma key, rectangle/circle drag cutouts, and polygon cutout points. Rectangle and circle selections can be moved or resized by dragging the preview handles after selection. Polygon points can be dragged after placement, and Alt-clicking a point removes it. Images imported inside Image Lab become the active edit target immediately. Processed results are added as image assets and inserted as editable image layers.

## Color Palette

Open Colors to select an existing single-color swatch row for editing. Update changes the selected palette entry in browser storage. Use Opacity to store the alpha value applied when that color is used. Each registered swatch row has Fill and Stroke buttons, so the same saved single color can be applied directly to either style of the selected text or shape layer.

Use the palette maker preview to check the current draft color, opacity, and companion colors before saving. Selecting a color-wheel point only selects that point; it does not change the base color. Dragging one point treats that point as the intended color and regenerates the other points in the same pattern. Change the base color explicitly with the wheel background, HEX/RGB sliders, recent colors, palette bars, or Set selected as base. Pattern chooses Analogous, Complement, Split, Triad, Square, Compound, Shades, or Monochrome. Save palette stores the currently displayed colors as one multi-color palette set. Each saved-palette color has Fill and Stroke buttons.

## Browser Storage

The app stores the current edit state, autosave preference, templates, color palette entries, saved palette sets, and custom fonts in localStorage. Clearing site data removes those browser-local entries. Large imported fonts and image-heavy saved states can consume more browser storage than templates or colors.
