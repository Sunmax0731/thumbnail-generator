# Feature Overview

This page is the quick feature index for users and reviewers.

## Canvas Editing

- Select layers from the preview or Layers tab.
- Drag selected layers on the canvas to move them.
- Drag movement records undo/redo history only at the confirmed start and end positions.
- Drag corner handles to resize one selected layer.
- Drag the top rotation handle to rotate one selected layer.
- Pan the preview manually with the Pan button, Space-drag, or Alt-drag without changing zoom.
- Click blank preview space to clear selection.
- Ctrl, Meta, or Shift click adds or removes layers from a multi-selection.

## Multi-Selection

- Move selected editable layers together by dragging on the canvas.
- Use Layers alignment controls to align one layer to the canvas or multiple layers to the selection bounds.
- Use Layers distribution controls to space three or more selected layers evenly horizontally or vertically.
- Use Adjust relative edit controls to apply live Move X, Move Y, and Rotation delta changes.
- Use Match angle to first selected to copy the first selected editable layer's rotation to the other selected editable layers.
- Group selected layers from Layers, rename the group, ungroup it, and select grouped rows or grouped preview objects as a multi-selection.
- Edit one grouped layer individually from the Layers row without ungrouping.
- Fit selected image or shape layers to the canvas from Adjust.
- Use Delete, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y when focus is outside text fields and modals.

## Layout Import And Export

- Open the preview-pane Layout I/O section to generate CSV and HTML text from the current canvas.
- Paste CSV rows and select Apply CSV to replace the current layer list.
- Paste HTML-like markup with `data-layer` attributes and select Apply HTML to replace the current layer list.
- Export the rendered thumbnail as PNG, JPEG, or WebP from the top toolbar.

## Browser Storage

- Load 38 bundled default templates, with five starts each for YouTube, Shorts, Stream, and Cutout categories, eight Schedule starts, and ten animated eyecatch/waiting starts.
- Filter bundled templates by All, YouTube, Shorts, Stream, Cutout, Schedule, or Motion, with mini preview swatches and output-size badges.
- Use Templates to save named browser-local templates.
- Use the preview-pane Edit state section to save the current work-in-progress state without creating a named template.
- Export, import, or delete edit-state JSON for backup and recovery.
- Enable Autosave current edit state to save the active editor state after changes.
- Reloading the app restores the saved edit state when one exists.
- Browser storage is local to the current browser profile and can be removed by clearing site data.

## Brand Kit And Quality Warnings

- Keep browser-local brand kit data compatible with existing saved state.
- Register Colors tab preview colors, saved palette colors, or registered single colors into Brand kit primary, accent, or shadow colors.
- Show advisory warning chips for long text, low contrast, hidden important layers, safe-area edges, many layers, large image assets, large storage estimates, and 4K export.
- Link to GitHub Issues from the app for bug reports and feature requests.

## Image And Text Tools

- Import local image files from Assets.
- Import a YouTube video thumbnail from Assets with a YouTube URL or video id.
- Select an imported asset, add it directly as an image layer, or open it in Image Lab.
- Use Image Lab for chroma key, rectangle, circle, polygon, and drag-range cutouts.
- Re-edit Image Lab rectangle/circle selections with preview handles and drag polygon points after placement.
- Add text, line, headline, subtitle, shape, badge, divider, and selected image layers from the collapsible Quick Add section in Layers.
- Choose solid, dotted, dashed, or wave line styles from Adjust after selecting a line layer.
- Select a text layer to change font, size, fill, outline, line height, kerning, and alignment.
- Select expanded hosted Google Fonts options from the font dropdown and switch text between horizontal and vertical writing.
- Vertical text display bounds can be resized from the preview handles or Adjust width/height controls like horizontal text.
- Use Fit text to box to choose the largest font size that fits the text layer bounds.
- Import browser-local WOFF2, WOFF, TTF, or OTF font files from Adjust while a text layer is selected.
- Use Adjust reset buttons to return selected-layer rotation to 0 degrees and opacity to 100%.
- Controls that do not affect the current layer state are disabled, such as single-line text line height.

## Motion And OBS Preview

- Open Motion to assign None, Fade, Slide, Pop, Pulse, Blink, Drift, Zoom, Spin, Sway, Shake, or Breathe animation to the selected layer.
- Set animation start time, duration, easings.net-style easing, direction, distance, and loop behavior.
- Review the selected-object Motion preview and easing graph before opening the OBS preview.
- Choose direction None to keep movement disabled; distance is greyed out while None is active.
- Open OBS preview from the canvas toolbar to show the current animated canvas in a separate window without selection handles.
- Capture the OBS preview window in OBS with Window Capture for browser-only live display.

## Color Palette

- Register, edit, and delete named single colors in Colors.
- Explore colors with an Adobe-style drag-capable linked color wheel, generated palette bars below the wheel, `@uiw/react-color` Sketch-style HEX/RGB/alpha input, and recent-color swatches.
- Select a color-wheel point without changing the base color, drag one point to regenerate the other points in the same palette pattern, and explicitly set a selected point as the base color when needed.
- Set palette opacity.
- Apply each saved single color directly as Fill or Stroke to selected text and shape layers.
- Preview graphical palette patterns from the draft color and opacity.
- Save the currently displayed pattern as one multi-color palette set and apply each saved-palette color as Fill or Stroke.
- Collapse or expand saved multi-color palettes and registered single colors.
- Resize the Colors list area when reviewing many saved swatches.
