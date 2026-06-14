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

- Window settings: use the upper-right Language selector to switch between Japanese and English, and use the adjacent Theme selector to choose System, Light, or Dark. System follows the browser or OS color-scheme preference. On first load, the app uses Japanese or English when the browser/OS language matches those languages; unsupported languages fall back to English.
- Templates: generate schedule layouts, standard thumbnails, vertical thumbnails, or stream waiting screens, and save/load/delete browser-local Registered templates.
- Layers: use collapsible Quick Add, the Canvas object list, reorder, lock, hide/show, select, align, evenly distribute, duplicate, delete, group objects, and resize the list area with the handle below the list.
- Assets: import files or a folder, assign and edit image tags, filter images and group objects separately by tag, review imported assets, add a selected asset as an image object, reuse group objects, edit group object tags, open Image Lab from an imported asset row, or delete imported assets and group objects.
- Output: use the preview-header Output button to choose JPG, PNG, WebP, or OBS preview.
- Edit state: use the top-right icon cluster to save/restore the current edit state, export/import JSON, and delete the saved work-in-progress slot. Autosave remains text-labeled beside those icons.
- The preview header contains the output preset, width, height, Output, pan, and zoom controls. The preview bottom shows the motion timeline only while アニメ is open.
- Adjust: edit the selected object's collapsible Common settings and type-specific settings, including position, size, rotation, object blur, signed edge blur, stroke/outline blur participation, corner radius, shadow enable/parameters, pseudo-3D X/Y rotation, signed bevel, text, font, text writing mode, text kerning, text alignment, line style, Fill/Stroke color and alpha through a draggable popup single-color picker, shape, and image effects.
- Colors: register and edit named single colors, explore colors with a drag-capable linked color wheel and generated palette bars below the wheel, choose the palette pattern from the dropdown beside the wheel, use `@uiw/react-color` Sketch-style HEX/RGB/alpha input, reuse recent colors, preview and save multi-color palette patterns, reorder saved palettes and registered colors by dragging rows, collapse saved palettes and registered colors, set opacity, apply registered single colors or saved-palette colors as Fill or Stroke to selected text or shape objects, and resize the color list area with the handle below the list.
- アニメ: assign multiple ordered motion sets, apply presets, split movement motions from non-moving effects, preview the selected object, show or hide the easing graph, and edit animated objects in the アニメ-only bottom timeline for OBS preview playback.

- Timeline Play/Pause previews animation directly in the editor. Reset returns the editor preview position to the beginning. Playback starts paused/editable; while playing, the object list, inspector, timeline timing edits, and preview canvas edits are locked, and the timeline playhead shows the current playback position. Loop-enabled rows show faint repeated timeline segments after the first cycle without moving the editable handles.
- Manual: use the Manual button beside Issue reporting to open a fixed-size reference modal. The left tabs choose feature areas, the top tabs choose sections, and the modal remembers the last tabs and scroll position after closing.

## Layout Compatibility

CSV and HTML-like layout text remain in browser edit states and saved templates for compatibility. The GUI no longer shows a Generated layout editor in the preview pane.

## Edit The Canvas

- Click a visible editable object in the preview to select it.
- Click blank preview space or the preview area outside the output frame to clear the current selection.
- If objects overlap, the frontmost visible editable object is selected.
- Drag inside the selected object to move it.
- Drag movement uses one undo/redo step for the confirmed start and end positions.
- Drag a corner handle to resize it.
- Drag the top rotation handle to rotate it. The rotation handle shows a rotate mark and changes to a grab cursor on hover.
- Use Ctrl, Meta, or Shift while selecting to build a multi-selection.
- With multiple objects selected, open Adjust and use Relative edit to move all selected objects by the same X/Y delta or rotate each selected object by the same degree delta. Changes apply live as you edit the values; there is no Apply button.
- With multiple objects selected, use Match angle to first selected to set every selected editable object to the first selected editable object's rotation.
- With three or more objects selected, use Distribute H or Distribute V in Layers to space object centers evenly.
- Use Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y for copy, paste, cut, duplicate, undo, and redo when focus is outside text fields and modals.
- Press Delete or Backspace while an object is selected to open the object delete confirmation dialog.
- Hold Ctrl while pressing a delete button to skip delete confirmation where that delete action normally asks for confirmation.
- Open Layers to group multiple selected objects, rename the group, or ungroup it. Selecting one grouped row or one grouped preview object selects the editable members of that group.
- For a grouped row, use the small pointer button to select only that object. Adjust then edits that one grouped object while the group metadata remains intact.
- While one group is selected, use the group section's asset registration button to save that group as a tagged group object. Reuse it later from Assets.
- Use Fit to canvas in Adjust to set selected image or shape objects to `x=0`, `y=0`, and the current output width/height.
- Use the mouse wheel to zoom the preview beyond 100%. Use the Pan button, Space-drag, Alt-drag, or right-drag to move around a zoomed or tall preview without relying on visible scrollbars. Preset and output-size changes keep the current zoom until you select Fit canvas.
- Objects can extend outside the document while editing; the preview keeps the output frame and zoom stable instead of stretching around off-canvas content. Outside-frame portions are dimmed so they are easy to identify, and exported images still include only the configured canvas size.
- Middle-button drag on the preview range-selects objects inside the dragged rectangle. Hold Shift while middle-dragging to add the range to the current selection, or Ctrl while middle-dragging to remove the range from the current selection.
- In Adjust, use Reset rotation to return the selected object to `0` degrees.
- Disabled controls are intentionally inactive because they do not affect the current target. For example, Line height is disabled until a text object contains multiple lines.

## Quick Add And Assets

Use Quick Add at the top of Layers to add common starter objects quickly:

- Text and Shape add basic editable objects.
- Line adds an editable line object; select it and open Adjust to choose solid, dotted, dashed, or wave.
- Headline, Subtitle, Badge, and Divider add pre-sized thumbnail components.
- Import image files or an image folder from Assets. Before imported images appear in the list, assign zero or more tags. Tags can be typed freely, entered as comma-separated values, or chosen from existing tag suggestions. If text remains in the tag input when you press Register assets, that text is also saved as a tag.
- Edit tags later from each image or group object row. Use the image tag filter and group-object tag filter independently to narrow those sections.
- Select an imported asset row in Assets, then use its add button or the selected-image button in Layers Quick Add to place that image as an object.
- Delete an imported asset from Assets when it is no longer needed. Any image object that uses that asset is removed at the same time. Delete group objects from Assets when the reusable preset is no longer needed.
- YouTube thumbnail import remains browser-only internally, but the current GUI hides the YouTube URL controls.
- Use the scissors button on an asset row to open that image directly in Image Lab.

## Generators And Registered Templates

Open Templates and choose one of the generator buttons. **Generate schedule** creates monthly or weekly editable schedule objects. **Standard thumbnail**, **Vertical thumbnail**, and **Stream waiting** create editable image layouts. The previous bundled default-template list is no longer shown in the current GUI. Registered templates remain separate named snapshots saved in localStorage.

Loading a registered template asks for confirmation before the current objects and canvas size are replaced. Deleting a registered template also opens the same confirmation modal style used by other destructive actions. Use the tag field before saving when you want to classify a registered template; existing tags appear as suggestions, and free-form tags are accepted. Use the tag filter dropdown to show only templates with one saved tag. Drag the resize handle under Registered templates to change how much vertical space the list uses.

Use **Generate schedule** to choose monthly or weekly schedule, canvas orientation, month/date from the browser calendar-style input, Sunday or Monday week start, weekday language, date format, title, the same font list used by Adjust, title/weekday/date/plan size sliders, grid style, corner radius, line width, colors, and whether generated objects should be grouped. Schedule landscape preview is widened on desktop, and portrait preview keeps the generated portrait ratio. Use **Standard thumbnail** for a general 1280x720 video thumbnail and **Vertical thumbnail** for a 1080x1920 short-form thumbnail. Use **Stream waiting** when you need an animated waiting screen object set for アニメ/OBS preview. Each image generator has five placement patterns. Its Grid / text controls are grouped into Common, Title, Subtitle, and Label sections covering font family/weight, letter spacing, common corner radius, font sizes, stroke widths, and text alignment; desktop modals place paired sliders side by side to reduce height. Letter spacing can be set to `0` from the number field or slider. The Tone selector updates the preview for all three image generators, while the animation checkbox is shown only for Stream waiting. The modals also provide content, color, image-slot, grouping, preview, **Generate objects**, and **Save settings** controls. **Generate objects** saves the generator settings before replacing the current canvas object list, updating canvas size where needed, and refreshing the internal CSV/HTML layout text used by edit state and templates. **Save settings** stores only the modal settings so they are restored after reload without changing the current canvas.

## Brand Kit

Brand kit setup controls are hidden from Templates. Existing browser-local brand kit data remains compatible with saved state. Open Colors to send the current palette preview color, a saved-palette color, or a registered single-color row into the Brand kit Primary, Accent, or Shadow slot.

## Save Current Edit State

Use the Edit state icons in the top-right toolbar:

- Save state stores the current output settings, canvas objects, image assets, CSV/HTML text, and template-name draft in browser localStorage.
- Restore state reloads the saved work-in-progress state.
- Export state downloads the work-in-progress as JSON for backup or transfer.
- Import state reads a previously exported JSON state file.
- Delete saved state clears only the saved browser work-in-progress slot; the current open canvas remains.
- Autosave current edit state saves editor changes after a short delay while the toggle is on.

This edit state is a single recovery slot. Browser templates remain separate named snapshots.

Large image-heavy states can exceed browser storage limits. When the app estimates a large saved state or a save fails, export state JSON and remove old browser data or large imported assets before relying on localStorage.

## Text Alignment

Select a text object, open Adjust, and choose Left, Center, or Right from the three alignment buttons. The selected alignment stays highlighted.

## Fit Text

1. Select a text object.
2. Open Adjust.
3. Select Fit text to box.

The app picks the largest font size that fits the object width and height while respecting line height and stroke width.

## Add Custom Fonts

1. Select a text object.
2. Open the Adjust tab.
3. Use Add font and choose a `.woff2`, `.woff`, `.ttf`, or `.otf` file.
4. The imported font is saved in browser localStorage and appears in the font dropdown with `(custom)`.

When a text object is selected during import, the new font is applied to that object immediately. If a font file is unsupported or cannot be loaded, the status bar shows the import or load failure.

## Google Fonts And Vertical Text

Select a text object, open Adjust, and use Font to choose hosted Google Fonts options such as Anton, Bebas Neue, Dela Gothic One, M PLUS Rounded 1c, Mochiy Pop One, Montserrat, Noto Sans JP, Poppins, Rampart One, or Zen Kaku Gothic New. Use Writing mode to switch the selected text object between Horizontal and Vertical. Vertical text is rendered in the preview and export path and is saved through CSV/HTML, templates, and edit state. When a vertical text object is selected, the selection frame, hit testing, and resize handles use the configured display bounds, so preview handles and Adjust width/height edits resize the range like horizontal text.

## Edge Blur

Select an object and open Adjust. Edge blur accepts signed values: `0` disables it, positive values create an outer blur, and negative values create an inner blur. For text and shape objects, Blur stroke controls whether outlines/strokes participate in the blur source or remain sharp.

## Shadow, 3D Rotation, And Bevel

Select an object and open Adjust. Shadow controls set color, opacity, blur, distance, and direction. 3D rotation changes the object plane on X and Y axes while preserving export compatibility. Bevel adds a highlight/lowlight overlay to image, text, and shape objects.

## Presets And Export

Select an output preset from the top toolbar. The preview keeps the current zoom when presets or output sizes change. Select Fit canvas when you want a one-time fit calculation, or pan the preview with Pan, Space-drag, or Alt-drag. Use the Output menu in the preview header to download JPG, PNG, or WebP at maximum quality, or to open the OBS preview.

The status bar can show quality warning chips while you work. Check these before export for long text, low contrast, hidden important objects, edge-safe-area risk, many objects, large image assets, 4K output, or large browser-storage estimates.

## アニメ And OBS Preview

1. Select an object.
2. Open アニメ.
3. Choose a preset, or use the Motion dropdown for movement choices such as Slide, Drift, or Shake.
4. Use the Glow / effects dropdown for non-moving/effect choices such as Fade, Pop, Pulse, Blink, Zoom, Spin, Sway, Breathe, Glow pulse, Blur in, or Shine.
5. Adjust start time, duration, easings.net-style easing, direction, distance, and loop behavior. Direction is disabled for animation types that do not use movement.
6. Use Text-only motion for Typewriter, Line reveal, or Text wave only when a text object is selected.
7. Tune Effect intensity for Glow pulse, Blur in, or Shine. The intensity control is greyed out for choices that cannot use it.
8. Add additional motion sets when one object needs multiple animation behaviors.
9. Use the selected-object preview and the easing graph toggle while checking motion.
10. Open アニメ to show the bottom timeline. Collapse it when you need more preview space, drag a segment's left or right handle to edit start/end, drag the segment body to move both together, and drag the timeline top-edge resize handle to change its height. Loop-enabled motions show faint repeated segments after the first cycle while keeping the editable handles in their original positions.
11. Select OBS preview from the Output menu.

The OBS preview opens a popup-style browser window that contains only the animated canvas plus a small operation overlay. It does not draw editor controls or selection handles, stretches the canvas to the preview viewport to avoid black document letterboxing, and requests fullscreen where the browser permits it. Use Play/Pause and Reset while checking motion, or press `P` for Play/Pause and `R` for Reset. Click Hide to remove the overlay for capture, and press `H` in the OBS preview window to show or hide it again. If browser chrome remains visible, click the preview window or press `F` or `Enter` to retry fullscreen before capturing it in OBS. Browser and OBS settings still decide whether OS/browser chrome is capturable. Static PNG/JPG/WebP export still renders the base object state, not an animation frame.

## Image Lab

Open Image Lab from the scissors button on an imported asset row. The modal starts with no selected cutout range. Choose rectangle, circle, or polygon only when you want to crop; chroma key can also process the whole selected asset. Use the mouse wheel to zoom and right-drag to pan the Image Lab preview. Rectangle and circle selections can be moved or resized by dragging the eight high-contrast preview handles after selection; corner handles preserve aspect ratio and side handles resize freely. Polygon points can be dragged after placement, Alt-clicking a point removes it, and right-click does not add a point. Import images from the Assets tab before opening Image Lab; the modal focuses on processing the selected asset. The processed image add button is in the modal header and includes the selected asset name, and chroma-key settings sit beside the position and size controls. Processed results are added as image assets and inserted as editable image objects.

## Color Palette

Open Colors to select an existing single-color swatch row for editing. Update changes the selected palette entry in browser storage. Use Opacity to store the alpha value applied when that color is used. Each registered swatch row has Fill and Stroke buttons, so the same saved single color can be applied directly to either style of the selected text or shape object.

Use the palette maker preview to check the current draft color, opacity, and companion colors before saving. Selecting a color-wheel point only selects that point; it does not change the base color. Dragging one point treats that point as the intended color and regenerates the other points in the same pattern. Change the base color explicitly with the wheel background, `@uiw/react-color` Sketch-style HEX/RGB/alpha controls, recent colors, palette bars below the wheel, or Set selected as base.

The palette pattern selection uses two dropdowns. Select a principle first (Order, Proximity, Similarity, Clarity), then choose one pattern that belongs to that principle. The active pattern list includes:

- Order: Identity, Analogous, Intermediate, Diod, Opponent, Split-complementary, Triad, Tetrad, Pentad, Hexad, Rectangular.
- Proximity: Complex-harmony, Natural-harmony.
- Similarity: Dominant-color, Tone-on-tone, Dominant-tone, Tone-in-tone, Tonal-color, Camaieu, Faux-camaieu.
- Clarity: Tricolor, Bicolor.

Save palette stores the currently displayed colors as one multi-color palette set. Each saved-palette color has Fill and Stroke buttons, and saved palettes plus registered single colors can collapse when you need more vertical space. Drag a row handle in either saved palettes or registered single colors to reorder the browser-local list.

When a text or shape object is selected in Adjust, click the Fill or Stroke color display to open the draggable popup Sketch-style single-color picker. Drag the popup header to move it while comparing colors on the canvas. Apply color writes both color and alpha to that style. The older separate Fill opacity and Stroke opacity sliders are intentionally removed.

Shape objects support Rect, Ellipse, Triangle, Diamond, Pentagon, Hexagon, Star, and Line. Corner radius rounds Rect and polygon shape corners; Line remains controlled by stroke width and line style.

## Browser Storage

The app stores the current edit state, autosave preference, templates, brand kit, color palette entries, saved palette sets, and custom fonts in localStorage. Clearing site data removes those browser-local entries. Large imported fonts and image-heavy saved states can consume more browser storage than templates or colors.

## PWA And Extension Integration

Browsers that support installation can install サムネいる？ from the address-bar install action or browser menu. The PWA metadata and service worker are static files, so the app continues to work as a normal browser page if installation or service worker registration is unavailable.

Chrome extensions can integrate through the page bridge channel `thumbnail-generator.extension.v1`. The supported commands are `ping`, `getSnapshot`, and `applySnapshot`; `applySnapshot` accepts the same edit-state JSON schema used by the in-app import/export controls.

## Service And Privacy

Use the Report issue link in the app header to open GitHub Issues:

<https://github.com/Sunmax0731/thumbnail-generator/issues>

The app is browser-only. Imported images, fonts, edit state, templates, brand kit, colors, and saved palettes stay in the current browser profile unless you export a thumbnail, CSV/HTML layout, edit-state JSON, or clear site data.
