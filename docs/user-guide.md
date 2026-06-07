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
- Assets: import image files, select imported assets, add image/text/shape starter layers, open Image Lab for the selected asset, and restore the sample template.
- Layouts: edit generated CSV/HTML layout text and apply CSV or HTML imports.
- Templates: load bundled default templates, save or restore the current edit state, enable autosave, and save/load/delete browser-local templates.
- Layers: reorder, lock, hide/show, select, align, duplicate, delete layers, and resize the list area with the handle below the list.
- Adjust: edit the selected layer's position, size, rotation, opacity, text, font, text alignment, shape, and image effects.
- Colors: register named Fill or Stroke colors, apply them to selected text or shape layers, and resize the color list area with the handle below the list.

## Import Layouts

Use the Layouts tab to paste CSV or HTML definitions, then select Apply CSV or Apply HTML. CSV and HTML import replace the current layer list when valid layers are found. Image references should match imported asset names/keys or the bundled `sample-bg` asset.

## Edit The Canvas

- Click a visible editable layer in the preview to select it.
- Click blank preview space to clear the current selection.
- If layers overlap, the frontmost visible editable layer is selected.
- Drag inside the selected layer to move it.
- Drag a corner handle to resize it.
- Drag the top rotation handle to rotate it. The rotation handle shows a rotate mark and changes to a grab cursor on hover.
- Use Ctrl, Meta, or Shift while selecting to build a multi-selection.
- With multiple layers selected, open Adjust and use Relative edit to move all selected layers by the same X/Y delta or rotate each selected layer by the same degree delta. Changes apply live as you edit the values; there is no Apply button.
- With multiple layers selected, use Match angle to first selected to set every selected editable layer to the first selected editable layer's rotation.
- Layers can extend outside the document while editing; the preview expands its edit-only padding so overhanging content and handles remain visible. Exported images still include only the configured canvas size.
- In Adjust, use Reset rotation to return the selected layer to `0` degrees and Reset opacity to return it to `100%`.
- Disabled controls are intentionally inactive because they do not affect the current target. For example, Line height is disabled until a text layer contains multiple lines.

## Quick Add And Assets

Use Assets to add common starter layers quickly:

- Text and Shape add basic editable layers.
- Headline, Subtitle, Badge, and Divider add pre-sized thumbnail components.
- Select an imported asset row, then use its add button to place that image as a layer.
- Use the scissors button on an asset row to open that image directly in Image Lab.

## Default Templates

Open Templates and choose a bundled default template to replace the current canvas with a complete starting layout. The shipped templates cover creator live, product review, tutorial steps, and portrait-short quote thumbnails. Browser templates remain separate named snapshots saved in localStorage.

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

## Presets And Export

Select an output preset from the top toolbar. Tall presets such as Shorts automatically reduce the preview zoom so the whole canvas fits the visible stage. Use PNG, JPG, WebP, or Export to download the rendered thumbnail.

## Image Lab

Open Image Lab from Assets or from an asset row. The modal supports chroma key, rectangle/circle drag cutouts, polygon cutout points, and drag-range rectangular cutouts. Images imported inside Image Lab become the active edit target immediately. Processed results are added as image assets and inserted as editable image layers.

## Browser Storage

The app stores the current edit state, autosave preference, templates, color palette entries, and custom fonts in localStorage. Clearing site data removes those browser-local entries. Large imported fonts and image-heavy saved states can consume more browser storage than templates or colors.
