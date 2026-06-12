# Feature Overview

This page is the quick feature index for users and reviewers.

## Canvas Editing

- Select layers from the preview or the left-panel Layers tab.
- Drag selected layers on the canvas to move them.
- Drag movement records undo/redo history only at the confirmed start and end positions.
- Drag corner handles to resize one selected layer.
- Drag the top rotation handle to rotate one selected layer.
- Pan the preview manually with the Pan button, Space-drag, or Alt-drag without changing zoom.
- Click blank preview space or the preview area outside the output frame to clear selection.
- Ctrl, Meta, or Shift click adds or removes layers from a multi-selection.

## Multi-Selection

- Move selected editable layers together by dragging on the canvas.
- Use Layers alignment controls to align one layer to the canvas or multiple layers to the selection bounds.
- Use Layers distribution controls to space three or more selected layers evenly horizontally or vertically.
- Delete the final remaining layer when you need a fully empty canvas.
- Use Adjust relative edit controls to apply live Move X, Move Y, and Rotation delta changes.
- Use Match angle to first selected to copy the first selected editable layer's rotation to the other selected editable layers.
- Group selected layers from Layers, rename the group, ungroup it, and select grouped rows or grouped preview objects as a multi-selection.
- Edit one grouped layer individually from the Layers row without ungrouping.
- Fit selected image or shape layers to the canvas from Adjust.
- Use Delete, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y when focus is outside text fields and modals.

## Layout Import And Export

- CSV and HTML layout text remain part of browser edit-state and template compatibility.
- Export the rendered thumbnail as PNG, JPEG, or WebP from the preview-pane export panel at maximum quality.
- Use the side-by-side preview-pane Export and Edit state sections on desktop; each section stacks its own action buttons vertically.

## Browser Storage

- Generate beta monthly or weekly schedule templates from the Templates tab with calendar date input, pre-generation preview, per-day or uniform action counts, weekday language, date format, canvas orientation, grid style, the same font choices as Adjust, separate title/weekday/date/plan size sliders, color, corner radius, line width, generated-layer grouping settings, month-aware badge labels, and reload-persistent settings. Schedule landscape previews are wider on desktop, and portrait previews keep the generated portrait ratio.
- Generate standard thumbnails, vertical thumbnails, and stream waiting screens from Templates. Each image generator has five placement patterns plus content, grouped Grid / text controls, color, preview, Generate layers, and Save settings controls. Standard and stream waiting previews are wider on desktop, vertical previews keep the generated 9:16 aspect ratio, letter spacing accepts `0`, common corner radius lives in Common controls, preview action buttons stay within the preview pane, and animation controls appear only for stream waiting screens.
- Use Save settings in generator modals to persist settings without generating; Generate layers also saves settings before replacing the current layers.
- Resize the Browser templates list area from the Templates tab.
- Use Templates to save named browser-local templates with optional tags, choose existing tags from suggestions while typing, and filter saved templates by tag from a dropdown.
- Use the preview-pane Edit state section to save the current work-in-progress state without creating a named template.
- Export, import, or delete edit-state JSON for backup and recovery.
- Enable Autosave current edit state to save the active editor state after changes.
- Reloading the app restores the saved edit state when one exists.
- Browser storage is local to the current browser profile and can be removed by clearing site data.

## Brand Kit And Quality Warnings

- Keep browser-local brand kit data compatible with existing saved state.
- Keep Brand kit setup and Colors-side Brand kit registration buttons hidden.
- Show advisory warning chips for long text, low contrast, hidden important layers, safe-area edges, many layers, large image assets, large storage estimates, and 4K export.
- Link to GitHub Issues from the app for bug reports and feature requests.

## Image And Text Tools

- Import local image files from the Assets tab.
- Use the Assets tab as the imported-image list, with per-image add, Image Lab, and delete actions.
- YouTube thumbnail import helpers remain browser-only, while the current GUI hides the YouTube URL controls.
- Select an imported asset, add it directly as an image layer, or open it in Image Lab from the asset row.
- Use Image Lab for chroma key, rectangle, circle, polygon, and drag-range cutouts.
- Re-edit Image Lab rectangle/circle selections with preview handles and drag polygon points after placement.
- Add text, line, headline, subtitle, shape, badge, divider, and selected image layers from the collapsible Quick Add section in Layers.
- Choose solid, dotted, dashed, or wave line styles from Adjust after selecting a line layer. Wave lines render as smooth visible waves in preview and export.
- Choose Rect, Ellipse, Triangle, Diamond, Pentagon, Hexagon, Star, or Line for shape layers.
- Select a text layer to change font, size, fill, outline, line height, kerning, and alignment.
- Click Fill or Stroke color displays in Adjust to open a draggable popup Sketch-style single-color picker with alpha.
- Select expanded hosted Google Fonts options from the font dropdown and switch text between horizontal and vertical writing.
- Vertical text display bounds can be resized from the preview handles or Adjust width/height controls like horizontal text.
- Use Fit text to box to choose the largest font size that fits the text layer bounds.
- Import browser-local WOFF2, WOFF, TTF, or OTF font files from Adjust while a text layer is selected.
- Use Adjust decoration controls for layer shadow, pseudo-3D X/Y rotation, and bevel, and use reset controls to return selected-layer rotation to 0 degrees.
- Controls that do not affect the current layer state are disabled, such as single-line text line height.

## Motion And OBS Preview

- Open Motion to assign one or more motion sets to the selected layer.
- Each motion set can use None, Fade, Slide, Pop, Pulse, Blink, Drift, Zoom, Spin, Sway, Shake, or Breathe.
- Set animation start time, duration, easings.net-style easing, direction, distance, and loop behavior.
- Review the selected-object Motion preview and easing graph before opening the OBS preview.
- Direction is enabled only for Slide, Drift, and Shake. Distance is greyed out when the selected motion does not use direction or direction is None.
- Open OBS preview from the canvas toolbar to show the current animated canvas in a popup-style window without editor controls or selection handles.
- Capture the OBS preview window in OBS with Window Capture for browser-only live display. Browser and OBS settings still decide whether OS/browser chrome is capturable.

## Color Palette

- Register, edit, and delete named single colors in Colors.
- Explore colors with an Adobe-style drag-capable linked color wheel, a palette-pattern dropdown beside the wheel, generated palette bars below the wheel, `@uiw/react-color` Sketch-style HEX/RGB/alpha input, and recent-color swatches.
- Select a color-wheel point without changing the base color, drag one point to regenerate the other points in the same palette pattern, and explicitly set a selected point as the base color when needed.
- Set palette opacity.
- Apply each saved single color directly as Fill or Stroke to selected text and shape layers.
- Preview graphical palette patterns from the draft color and opacity.
- Save the currently displayed pattern as one multi-color palette set and apply each saved-palette color as Fill or Stroke from rows that show the color code.
- Drag saved multi-color palettes or registered single-color rows to reorder browser-local color storage.
- Collapse or expand saved multi-color palettes and registered single colors.
- Resize the Colors list area when reviewing many saved swatches.

## Window Settings

- Switch display language from the upper-right toolbar controls.
- Choose System, Light, or Dark theme beside the language selector. System follows the browser or OS color-scheme preference.
