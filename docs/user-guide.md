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
- Templates: generate schedule layouts, standard thumbnails, vertical thumbnails, or stream waiting screens, and save/load/delete browser-local templates.
- Layers: use collapsible Quick Add, reorder, lock, hide/show, select, align, evenly distribute, duplicate, delete, group layers, and resize the list area with the handle below the list.
- Assets: review imported assets, add a selected asset as an image layer, open Image Lab from an imported asset row, or delete an imported asset.
- Preview pane export: download PNG, JPG, or WebP beside the current canvas. On desktop, Export and Edit state sit side by side, and each section stacks its action buttons vertically.
- Preview pane Edit state: save or restore the current edit state, enable autosave, export/import JSON, and delete the saved work-in-progress slot while the canvas remains visible.
- The preview header contains the output preset, width, and height controls. The preview Output section contains PNG/JPG/WebP export buttons.
- Adjust: edit the selected layer's position, size, rotation, layer blur, signed edge blur, stroke/outline blur participation, corner radius, shadow, pseudo-3D X/Y rotation, bevel, text, font, text writing mode, text kerning, text alignment, line style, Fill/Stroke color and alpha through a draggable popup single-color picker, shape, and image effects.
- Colors: register and edit named single colors, explore colors with a drag-capable linked color wheel and generated palette bars below the wheel, choose the palette pattern from the dropdown beside the wheel, use `@uiw/react-color` Sketch-style HEX/RGB/alpha input, reuse recent colors, preview and save multi-color palette patterns, reorder saved palettes and registered colors by dragging rows, collapse saved palettes and registered colors, set opacity, apply registered single colors or saved-palette colors as Fill or Stroke to selected text or shape layers, and resize the color list area with the handle below the list.
- Motion: assign multiple ordered motion sets, preview the selected object, and inspect the easing graph for OBS preview playback.

## Layout Compatibility

CSV and HTML-like layout text remain in browser edit states and saved templates for compatibility. The GUI no longer shows a Generated layout editor in the preview pane.

## Edit The Canvas

- Click a visible editable layer in the preview to select it.
- Click blank preview space or the preview area outside the output frame to clear the current selection.
- If layers overlap, the frontmost visible editable layer is selected.
- Drag inside the selected layer to move it.
- Drag movement uses one undo/redo step for the confirmed start and end positions.
- Drag a corner handle to resize it.
- Drag the top rotation handle to rotate it. The rotation handle shows a rotate mark and changes to a grab cursor on hover.
- Use Ctrl, Meta, or Shift while selecting to build a multi-selection.
- With multiple layers selected, open Adjust and use Relative edit to move all selected layers by the same X/Y delta or rotate each selected layer by the same degree delta. Changes apply live as you edit the values; there is no Apply button.
- With multiple layers selected, use Match angle to first selected to set every selected editable layer to the first selected editable layer's rotation.
- With three or more layers selected, use Distribute H or Distribute V in Layers to space layer centers evenly.
- Use Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y for copy, paste, cut, duplicate, undo, and redo when focus is outside text fields and modals.
- Press Delete or Backspace while a layer is selected to open the layer delete confirmation dialog.
- Open Layers to group multiple selected layers, rename the group, or ungroup it. Selecting one grouped row or one grouped preview object selects the editable members of that group.
- For a grouped row, use the small pointer button to select only that layer. Adjust then edits that one grouped object while the group metadata remains intact.
- Use Fit to canvas in Adjust to set selected image or shape layers to `x=0`, `y=0`, and the current output width/height.
- Use the Pan button, Space-drag, or Alt-drag to move around a zoomed or tall preview. Preset and output-size changes keep the current zoom until you select Fit canvas.
- Layers can extend outside the document while editing; the preview keeps the output frame and zoom stable instead of stretching around off-canvas content. Exported images still include only the configured canvas size.
- In Adjust, use Reset rotation to return the selected layer to `0` degrees.
- Disabled controls are intentionally inactive because they do not affect the current target. For example, Line height is disabled until a text layer contains multiple lines.

## Quick Add And Assets

Use Quick Add at the top of Layers to add common starter layers quickly:

- Text and Shape add basic editable layers.
- Line adds an editable line layer; select it and open Adjust to choose solid, dotted, dashed, or wave.
- Headline, Subtitle, Badge, and Divider add pre-sized thumbnail components.
- Select an imported asset row in Assets, then use its add button or the selected-image button in Layers Quick Add to place that image as a layer.
- Delete an imported asset from Assets when it is no longer needed. Any image layer that uses that asset is removed at the same time.
- YouTube thumbnail import remains browser-only internally, but the current GUI hides the YouTube URL controls.
- Use the scissors button on an asset row to open that image directly in Image Lab.

## Generators And Browser Templates

Open Templates and choose one of the generator buttons. **Generate schedule** creates monthly or weekly editable schedule layers. **Standard thumbnail**, **Vertical thumbnail**, and **Stream waiting** create editable image layouts. The previous bundled default-template list is no longer shown in the current GUI. Browser templates remain separate named snapshots saved in localStorage.

Loading a browser template asks for confirmation before the current layers and canvas size are replaced. Deleting a browser template also opens the same confirmation modal style used by other destructive actions. Use the tag field before saving when you want to classify a browser template; existing tags appear as suggestions, and free-form tags are accepted. Use the tag filter dropdown to show only templates with one saved tag. Drag the resize handle under Browser templates to change how much vertical space the list uses.

Use **Generate schedule** to choose monthly or weekly schedule, canvas orientation, month/date from the browser calendar-style input, Sunday or Monday week start, weekday language, date format, title, the same font list used by Adjust, title/weekday/date/plan size sliders, grid style, corner radius, line width, colors, and whether generated layers should be grouped. Schedule landscape preview is widened on desktop, and portrait preview keeps the generated portrait ratio. Use **Standard thumbnail** for a general 1280x720 video thumbnail and **Vertical thumbnail** for a 1080x1920 short-form thumbnail. Use **Stream waiting** when you need an animated waiting screen layer set for Motion/OBS preview. Each image generator has five placement patterns. Its Grid / text controls are grouped into Common, Title, Subtitle, and Label sections covering font family/weight, letter spacing, common corner radius, font sizes, stroke widths, and text alignment; desktop modals place paired sliders side by side to reduce height. Letter spacing can be set to `0` from the number field or slider. The Tone selector updates the preview for all three image generators, while the animation checkbox is shown only for Stream waiting. The modals also provide content, color, image-slot, grouping, preview, **Generate layers**, and **Save settings** controls. **Generate layers** saves the generator settings before replacing the current layer list, updating canvas size where needed, and refreshing the internal CSV/HTML layout text used by edit state and templates. **Save settings** stores only the modal settings so they are restored after reload without changing the current canvas.

## Brand Kit

Brand kit setup controls are hidden from Templates. Existing browser-local brand kit data remains compatible with saved state. Open Colors to send the current palette preview color, a saved-palette color, or a registered single-color row into the Brand kit Primary, Accent, or Shadow slot.

## Save Current Edit State

Use Edit state in the preview pane:

- Save state stores the current output settings, layers, image assets, CSV/HTML text, and template-name draft in browser localStorage.
- Restore state reloads the saved work-in-progress state.
- Export state downloads the work-in-progress as JSON for backup or transfer.
- Import state reads a previously exported JSON state file.
- Delete saved state clears only the saved browser work-in-progress slot; the current open canvas remains.
- Autosave current edit state saves editor changes after a short delay while the toggle is on.

This edit state is a single recovery slot. Browser templates remain separate named snapshots.

Large image-heavy states can exceed browser storage limits. When the app estimates a large saved state or a save fails, export state JSON and remove old browser data or large imported assets before relying on localStorage.

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

Select a text layer, open Adjust, and use Font to choose hosted Google Fonts options such as Anton, Bebas Neue, Dela Gothic One, M PLUS Rounded 1c, Mochiy Pop One, Montserrat, Noto Sans JP, Poppins, Rampart One, or Zen Kaku Gothic New. Use Writing mode to switch the selected text layer between Horizontal and Vertical. Vertical text is rendered in the preview and export path and is saved through CSV/HTML, templates, and edit state. When a vertical text layer is selected, the selection frame, hit testing, and resize handles use the configured display bounds, so preview handles and Adjust width/height edits resize the range like horizontal text.

## Edge Blur

Select a layer and open Adjust. Edge blur accepts signed values: `0` disables it, positive values create an outer blur, and negative values create an inner blur. For text and shape layers, Blur stroke controls whether outlines/strokes participate in the blur source or remain sharp.

## Shadow, 3D Rotation, And Bevel

Select a layer and open Adjust. Shadow controls set color, opacity, blur, distance, and direction. 3D rotation changes the layer plane on X and Y axes while preserving export compatibility. Bevel adds a highlight/lowlight overlay to image, text, and shape layers.

## Presets And Export

Select an output preset from the top toolbar. The preview keeps the current zoom when presets or output sizes change. Select Fit canvas when you want a one-time fit calculation, or pan the preview with Pan, Space-drag, or Alt-drag. Use PNG, JPG, or WebP beside Edit state in the preview pane to download the rendered thumbnail directly in that format at maximum quality.

The status bar can show quality warning chips while you work. Check these before export for long text, low contrast, hidden important layers, edge-safe-area risk, many layers, large image assets, 4K output, or large browser-storage estimates.

## Motion And OBS Preview

1. Select a layer.
2. Open Motion.
3. Choose Fade, Slide, Pop, Pulse, Blink, Drift, Zoom, Spin, Sway, Shake, or Breathe for the active motion set.
4. Adjust start time, duration, easings.net-style easing, direction, distance, and loop behavior. Direction is disabled for animation types that do not use movement.
5. Add additional motion sets when one object needs multiple animation behaviors.
6. Use the selected-object preview and easing graph to check motion timing.
7. Select Open OBS preview in the canvas toolbar.

The OBS preview opens a popup-style browser window that contains only the animated canvas on a black background. It does not draw editor controls or selection handles, and the app requests fullscreen where the browser permits it. Capture that window in OBS with Window Capture. Browser and OBS settings still decide whether OS or browser chrome is capturable. Static PNG/JPG/WebP export still renders the base layer state, not an animation frame.

## Image Lab

Open Image Lab from the scissors button on an imported asset row. The modal starts with no selected cutout range. Choose rectangle, circle, or polygon only when you want to crop; chroma key can also process the whole selected asset. Rectangle and circle selections can be moved or resized by dragging the preview handles after selection. Polygon points can be dragged after placement, and Alt-clicking a point removes it. Import images from the Assets tab before opening Image Lab; the modal focuses on processing the selected asset. The processed-layer creation button is in the modal header, and chroma-key settings sit beside the position and size controls. Processed results are added as image assets and inserted as editable image layers.

## Color Palette

Open Colors to select an existing single-color swatch row for editing. Update changes the selected palette entry in browser storage. Use Opacity to store the alpha value applied when that color is used. Each registered swatch row has Fill and Stroke buttons, so the same saved single color can be applied directly to either style of the selected text or shape layer.

Use the palette maker preview to check the current draft color, opacity, and companion colors before saving. Selecting a color-wheel point only selects that point; it does not change the base color. Dragging one point treats that point as the intended color and regenerates the other points in the same pattern. Change the base color explicitly with the wheel background, `@uiw/react-color` Sketch-style HEX/RGB/alpha controls, recent colors, palette bars below the wheel, or Set selected as base.

The palette pattern selection uses two dropdowns. Select a principle first (Order, Proximity, Similarity, Clarity), then choose one pattern that belongs to that principle. The active pattern list includes:

- Order: Identity, Analogous, Intermediate, Diod, Opponent, Split-complementary, Triad, Tetrad, Pentad, Hexad, Rectangular.
- Proximity: Complex-harmony, Natural-harmony.
- Similarity: Dominant-color, Tone-on-tone, Dominant-tone, Tone-in-tone, Tonal-color, Camaieu, Faux-camaieu.
- Clarity: Tricolor, Bicolor.

Save palette stores the currently displayed colors as one multi-color palette set. Each saved-palette color has Fill and Stroke buttons, and saved palettes plus registered single colors can collapse when you need more vertical space. Drag a row handle in either saved palettes or registered single colors to reorder the browser-local list.

When a text or shape layer is selected in Adjust, click the Fill or Stroke color display to open the draggable popup Sketch-style single-color picker. Drag the popup header to move it while comparing colors on the canvas. Apply color writes both color and alpha to that style. The older separate Fill opacity and Stroke opacity sliders are intentionally removed.

Shape layers support Rect, Ellipse, Triangle, Diamond, Pentagon, Hexagon, Star, and Line. Corner radius rounds Rect and polygon shape corners; Line remains controlled by stroke width and line style.

## Browser Storage

The app stores the current edit state, autosave preference, templates, brand kit, color palette entries, saved palette sets, and custom fonts in localStorage. Clearing site data removes those browser-local entries. Large imported fonts and image-heavy saved states can consume more browser storage than templates or colors.

## Service And Privacy

Use the Report issue link in the app header to open GitHub Issues:

<https://github.com/Sunmax0731/thumbnail-generator/issues>

The app is browser-only. Imported images, fonts, edit state, templates, brand kit, colors, and saved palettes stay in the current browser profile unless you export a thumbnail, CSV/HTML layout, edit-state JSON, or clear site data.
