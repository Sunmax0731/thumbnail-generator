# Feature Overview

This page is the quick feature index for users and reviewers.

## Canvas Editing

- Select objects from the preview or the left-panel Layers tab.
- Drag selected objects on the canvas to move them.
- Drag movement records undo/redo history only at the confirmed start and end positions.
- Drag corner handles to resize one selected object.
- Drag the top rotation handle to rotate one selected object.
- Pan the preview manually with the Pan button, Space-drag, or Alt-drag without changing zoom.
- Click blank preview space or the preview area outside the output frame to clear selection.
- Middle-button drag on the preview creates a range selection. Shift+middle drag adds objects in the range, and Ctrl+middle drag removes objects in the range from the current selection.
- Keep objects visible when they sit outside the output frame; outside-frame portions are dimmed so they are recognizable as out of bounds.
- Ctrl, Meta, or Shift click adds or removes objects from a multi-selection.

## Multi-Selection

- Move selected editable objects together by dragging on the canvas.
- Use Layers alignment controls to align one object to the canvas or multiple objects to the selection bounds.
- Use Layers distribution controls to space three or more selected objects evenly horizontally or vertically.
- Delete the final remaining object when you need a fully empty canvas.
- Use Adjust relative edit controls to apply live Move X, Move Y, and Rotation delta changes.
- Use Match angle to first selected to copy the first selected editable object's rotation to the other selected editable objects.
- Group selected objects from Layers, rename the group, ungroup it, and select grouped rows or grouped preview objects as a multi-selection.
- Edit one grouped object individually from the Layers row without ungrouping.
- Register a selected group as a reusable tagged group object, edit its tags, delete it, and add it back from Assets.
- Fit selected image or shape objects to the canvas from Adjust.
- Use Delete, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y when focus is outside text fields and modals.

## Layout Import And Export

- CSV and HTML layout text remain part of browser edit-state and template compatibility.
- Export the rendered thumbnail as PNG, JPEG, or WebP from the preview-header Output menu at maximum quality.
- Use localized preview-header presets for common output sizes, including Japanese labels for horizontal YouTube, Full HD, Twitch, square, portrait short, and custom sizes.
- Use the same Output menu to open OBS preview. The separate OBS window renders the animated canvas without editor panels or handles, and its Play/Pause, Reset, and Hide controls follow the active language.

## Browser Storage

- Generate beta monthly or weekly schedule templates from the Templates tab with calendar date input, pre-generation preview, per-day or uniform action counts, weekday language, date format, canvas orientation, grid style, the same font choices as Adjust, separate title/weekday/date/plan size sliders, color, corner radius, line width, generated-object grouping settings, month-aware badge labels, and reload-persistent settings. Schedule landscape previews are wider on desktop, and portrait previews keep the generated portrait ratio.
- Generate standard thumbnails, vertical thumbnails, and stream waiting screens from Templates. Each image generator has five placement patterns plus content, grouped Grid / text controls, color, preview, Generate objects, and Save settings controls. Standard and stream waiting previews are wider on desktop, vertical previews keep the generated 9:16 aspect ratio, letter spacing accepts `0`, common corner radius lives in Common controls, preview action buttons stay within the preview pane, and animation controls appear only for stream waiting screens.
- Use Save settings in generator modals to persist settings without generating; Generate objects also saves settings before replacing the current canvas objects.
- Resize the Registered templates list area from the Templates tab.
- Use Templates to save named browser-local Registered templates with optional tags, choose existing tags from suggestions while typing, and filter saved templates by tag from a dropdown.
- Use the top-right edit-state icon cluster to save the current work-in-progress state without creating a named template.
- Export, import, or delete edit-state JSON for backup and recovery.
- Enable Autosave current edit state to save the active editor state after changes.
- Reloading the app restores the saved edit state when one exists.
- Browser storage is local to the current browser profile and can be removed by clearing site data.

## Brand Kit And Quality Warnings

- Keep browser-local brand kit data compatible with existing saved state.
- Keep Brand kit setup and Colors-side Brand kit registration buttons hidden.
- Show advisory warning chips for long text, low contrast, hidden important objects, safe-area edges, many objects, large image assets, large storage estimates, and 4K export.
- Link to GitHub Issues from the app for bug reports and feature requests.
- Open the fixed-size in-app manual from the Manual button beside Issue reporting, then use left category tabs, top section tabs, and the right-side contents. The manual preserves the last viewed tabs and scroll position after closing, follows the active Japanese/English GUI labels, and explains parameter/dropdown item effects plus call paths such as Output menu to OBS preview, Colors to image extraction, and multi-selection to relative editing.

## Image And Text Tools

- Import local image files or a folder of image files from the Assets tab.
- Assign multiple tags before images are registered, including a typed draft tag when Register assets is pressed, edit tags later, and filter image assets by tag.
- Use the Assets tab as the imported-image and group-object list, with per-image add, Image Lab, tag edit, and delete actions, plus separate group-object tag filtering, tag edit, and delete actions.
- YouTube thumbnail import helpers remain browser-only, while the current GUI hides the YouTube URL controls.
- Select an imported asset, add it directly as an image object, or open it in Image Lab from the asset row.
- Use Image Lab for chroma key, rectangle, circle, polygon, and drag-range cutouts, with mouse-wheel zoom and right-drag pan.
- Re-edit Image Lab rectangle/circle selections with eight high-contrast preview handles, preserving aspect ratio from corner handles and allowing free side-handle resizing; drag polygon points after placement without right-click adding new points.
- Add text, line, headline, subtitle, shape, badge, divider, and selected image objects from the collapsible Quick Add section in Layers.
- Choose solid, dotted, dashed, or wave line styles from Adjust after selecting a line object. Wave lines render as smooth visible waves in preview and export.
- Choose Rect, Ellipse, Triangle, Diamond, Pentagon, Hexagon, Star, or Line for shape objects.
- Select a text object to change font, size, fill, outline, line height, kerning, and alignment.
- Click Fill or Stroke color displays in Adjust to open a draggable popup Sketch-style single-color picker with alpha.
- Select expanded hosted Google Fonts options from the font dropdown and switch text between horizontal and vertical writing.
- Vertical text display bounds can be resized from the preview handles or Adjust width/height controls like horizontal text.
- Use Fit text to box to choose the largest font size that fits the text object bounds.
- Import browser-local WOFF2, WOFF, TTF, or OTF font files from Adjust while a text object is selected.
- Use collapsible Adjust sections for Common settings and type-specific settings. Decoration controls include pseudo-3D X/Y rotation, signed bevel, and shadow parameters that appear only when shadow is enabled.
- Controls that do not affect the current object state are disabled, such as single-line text line height.

## アニメ And OBS Preview

- Open アニメ to assign one or more motion sets to the selected object.
- Apply motion presets for common entrance, ticker, neon, pop, type-on, and background-breathe behaviors.
- Use the Motion dropdown for movement presets such as Slide, Drift, and Shake, and the Glow / effects dropdown for non-moving animation/effect choices such as Fade, Pop, Pulse, Blink, Zoom, Spin, Sway, Breathe, Glow pulse, Blur in, and Shine.
- Set animation start time, duration, easings.net-style easing, direction, distance, and loop behavior.
- Use text-only Typewriter, Line reveal, or Text wave motion only when a text object is selected.
- Adjust effect intensity for Glow pulse, Blur in, or Shine; the control is greyed out for choices that cannot use intensity.
- Review the selected-object Motion preview and show or hide the easing graph before opening the OBS preview.
- Direction is enabled only for Slide, Drift, and Shake. Distance is greyed out when the selected motion does not use direction or direction is None.
- Open アニメ to show the bottom timeline. Collapse it when you need more preview space, drag a segment's left or right handle to edit start/end, drag the segment body to move both together, and drag the timeline top-edge resize handle to change its height. Loop-enabled animations also show faint repeated segments after the first loop while preserving the editable handle positions.
- Use the bottom timeline Play/Pause and Reset buttons for editor-preview playback. Playback defaults to paused/editable; while playing, object rows, inspector controls, timeline edits, canvas edits, and preview selection are locked, and the timeline playhead shows the current playback position.
- Open OBS preview from the Output menu to show the current animated canvas in a popup-style fullscreen-capable window without editor controls or selection handles.
- Capture the OBS preview window in OBS with Window Capture for browser-only live display. The preview stretches the canvas to the viewport to avoid black document letterboxing, retries fullscreen on preview click or `F`/`Enter`, provides Play/Pause and Reset controls, uses `P` for Play/Pause, `R` for Reset, hides the control overlay from its Hide button, toggles it again with `H`, and browser/OBS settings still decide whether OS/browser chrome is capturable.

## Color Palette

- Register, edit, and delete named single colors in Colors.
- Explore colors with an Adobe-style drag-capable linked color wheel, a palette-pattern dropdown beside the wheel, generated palette bars below the wheel, `@uiw/react-color` Sketch-style HEX/RGB/alpha input, and recent-color swatches.
- Select a color-wheel point without changing the base color, drag one point to regenerate the other points in the same palette pattern, and explicitly set a selected point as the base color when needed.
- Set palette opacity.
- Apply each saved single color directly as Fill or Stroke to selected text and shape objects.
- Preview graphical palette patterns from the draft color and opacity.
- Save the currently displayed pattern as one multi-color palette set and apply each saved-palette color as Fill or Stroke from rows that show the color code.
- Drag saved multi-color palettes or registered single-color rows to reorder browser-local color storage.
- Collapse or expand saved multi-color palettes and registered single colors.
- Resize the Colors list area when reviewing many saved swatches.

## Window Settings

- Switch display language from the upper-right toolbar controls.
- Choose System, Light, or Dark theme beside the language selector. System follows the browser or OS color-scheme preference.

## PWA And Extension Integration

- Install サムネいる？ from browsers that expose a PWA install action for the GitHub Pages app.
- Use the service worker app-shell cache for faster repeat loads; the app still runs when service worker registration is unavailable.
- Chrome extension content scripts can use the `thumbnail-generator.extension.v1` page bridge to `ping`, read the current edit-state snapshot, or apply a valid edit-state snapshot.
