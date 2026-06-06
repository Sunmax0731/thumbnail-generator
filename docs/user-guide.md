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

- Assets: import image files, open Image Lab, add text/shape layers, and restore the sample template.
- Layouts: edit generated CSV/HTML layout text and apply CSV or HTML imports.
- Templates: save, load, and delete browser-local templates.
- Layers: reorder, lock, hide/show, select, align, duplicate, and delete layers.
- Adjust: edit the selected layer's position, size, rotation, opacity, text, font, shape, and image effects.
- Colors: register named Fill or Stroke colors and apply them to selected text or shape layers.

## Import Layouts

Use the Layouts tab to paste CSV or HTML definitions, then select Apply CSV or Apply HTML. CSV and HTML import replace the current layer list when valid layers are found. Image references should match imported asset names/keys or the bundled `sample-bg` asset.

## Edit The Canvas

- Click a visible editable layer in the preview to select it.
- If layers overlap, the frontmost visible editable layer is selected.
- Drag inside the selected layer to move it.
- Drag a corner handle to resize it.
- Drag the top rotation handle to rotate it.
- Use Ctrl, Meta, or Shift while selecting to build a multi-selection.

## Add Custom Fonts

1. Select a text layer.
2. Open the Adjust tab.
3. Use Add font and choose a `.woff2`, `.woff`, `.ttf`, or `.otf` file.
4. The imported font is saved in browser localStorage and appears in the font dropdown with `(custom)`.

When a text layer is selected during import, the new font is applied to that layer immediately. If a font file is unsupported or cannot be loaded, the status bar shows the import or load failure.

## Presets And Export

Select an output preset from the top toolbar. Tall presets such as Shorts automatically reduce the preview zoom so the whole canvas fits the visible stage. Use PNG, JPG, WebP, or Export to download the rendered thumbnail.

## Image Lab

Open Image Lab from Assets. The modal supports chroma key, rectangle/circle drag cutouts, polygon cutout points, and drag-range rectangular cutouts. Processed results are added as image assets and inserted as editable image layers.

## Browser Storage

The app stores templates, color palette entries, and custom fonts in localStorage. Clearing site data removes those browser-local entries. Large imported fonts can consume more browser storage than templates or colors.
