# Feature Overview

This page is the quick feature index for users and reviewers.

## Canvas Editing

- Select layers from the preview or Layers tab.
- Drag selected layers on the canvas to move them.
- Drag movement records undo/redo history only at the confirmed start and end positions.
- Drag corner handles to resize one selected layer.
- Drag the top rotation handle to rotate one selected layer.
- Click blank preview space to clear selection.
- Ctrl, Meta, or Shift click adds or removes layers from a multi-selection.

## Multi-Selection

- Move selected editable layers together by dragging on the canvas.
- Use Layers alignment controls to align one layer to the canvas or multiple layers to the selection bounds.
- Use Adjust relative edit controls to apply live Move X, Move Y, and Rotation delta changes.
- Use Match angle to first selected to copy the first selected editable layer's rotation to the other selected editable layers.
- Group selected layers from Layers, rename the group, ungroup it, and select grouped rows or grouped preview objects as a multi-selection.
- Edit one grouped layer individually from the Layers row without ungrouping.
- Fit selected image or shape layers to the canvas from Layers.
- Use Delete, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y when focus is outside text fields and modals.

## Layout Import And Export

- Use Layouts to generate CSV and HTML text from the current canvas.
- Paste CSV rows and select Apply CSV to replace the current layer list.
- Paste HTML-like markup with `data-layer` attributes and select Apply HTML to replace the current layer list.
- Export the rendered thumbnail as PNG, JPEG, or WebP from the top toolbar.

## Browser Storage

- Load bundled default templates for creator live, product review, tutorial, and portrait-short starting layouts.
- Use Templates to save named browser-local templates.
- Use Edit state to save the current work-in-progress state without creating a named template.
- Enable Autosave current edit state to save the active editor state after changes.
- Reloading the app restores the saved edit state when one exists.
- Browser storage is local to the current browser profile and can be removed by clearing site data.

## Image And Text Tools

- Import local image files from Assets.
- Import a YouTube video thumbnail from Assets with a YouTube URL or video id.
- Select an imported asset, add it directly as an image layer, or open it in Image Lab.
- Use Image Lab for chroma key, rectangle, circle, polygon, and drag-range cutouts.
- Re-edit Image Lab rectangle/circle selections with preview handles and drag polygon points after placement.
- Add text, line, headline, subtitle, shape, badge, divider, and selected image layers from Assets.
- Choose solid, dotted, dashed, or wave line styles from Adjust after selecting a line layer.
- Select a text layer to change font, size, fill, outline, line height, kerning, and alignment.
- Select hosted Google Fonts options from the font dropdown and switch text between horizontal and vertical writing.
- Vertical text selection bounds follow the visible vertical columns instead of the previous horizontal text box.
- Use Fit text to box to choose the largest font size that fits the text layer bounds.
- Import browser-local WOFF2, WOFF, TTF, or OTF font files from Adjust while a text layer is selected.
- Use Adjust reset buttons to return selected-layer rotation to 0 degrees and opacity to 100%.
- Controls that do not affect the current layer state are disabled, such as single-line text line height.

## Color Palette

- Register, edit, and delete named single colors in Colors.
- Explore colors with an Adobe-style drag-capable color wheel, generated palette bars, synchronized HEX/RGB slider inputs, and recent-color swatches.
- Select a color-wheel point without changing the base color, drag one point without moving other points, and explicitly set a selected point as the base color when needed.
- Set palette opacity.
- Apply each saved single color directly as Fill or Stroke to selected text and shape layers.
- Preview graphical palette patterns from the draft color and opacity.
- Save the currently displayed pattern as one multi-color palette set and apply each saved-palette color as Fill or Stroke.
- Resize the Colors list area when reviewing many saved swatches.
