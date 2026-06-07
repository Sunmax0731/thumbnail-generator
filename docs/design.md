# Design

## Concept Source

Primary UI concept: `docs/assets/ui-concept.png`

The concept uses a functional editor as the first screen:

- Left input rail for image, CSV, HTML, and template operations.
- Center canvas workbench with thumbnail preview.
- Top toolbar for output size and export format.
- Right inspector for layer order and selected layer properties.
- Bottom status row for validation, zoom, and export state.
- Image Lab opens as a modal workspace from the left rail for precise image cutout work.

## Information Architecture Refresh

The editor keeps the established three-column structure, but dense controls are grouped into task tabs:

- Left rail: Assets, Layouts, and Templates.
- Right rail: Layers, Adjust, and Colors.
- Top toolbar: output settings, export actions, and a compact language selector.
- Image Lab modal: Image source and chroma key stay in the side column; cutout mode, preview, and crop sliders stay in the main workspace.

This keeps the first viewport focused on the current editing task while retaining one-click access to layout text, template storage, layer ordering, layer adjustment, and color registration.

The Layers and Colors tabs use visible vertical resize handles so users can allocate more inspector height to the list they are reviewing. Colors uses layer-like rows for named Fill/Stroke entries, so palette entries scan consistently with layer rows. The Adjust tab keeps custom font import adjacent to the text font dropdown so font addition and selection remain one workflow.

The Adjust tab changes by selection scope: a single selected layer shows absolute layer properties, while multiple selected layers show live relative movement, live relative rotation, and angle matching to the first selected layer. Text alignment is a direct three-button control for Left, Center, and Right. This avoids implying that group editing overwrites each layer with one absolute value except for the explicit Match angle action.

The Assets tab keeps quick creation work close to media import. Imported assets are selectable rows with direct actions for adding an image layer or opening the asset in Image Lab. A compact YouTube URL field imports a video thumbnail into the same asset list and immediately creates an editable image layer. Quick Add includes common text, shape, and line starters so frequent layer creation does not require detailed inspector setup first.

The Layers tab keeps layer-list actions below the list: Fit to canvas and group controls. Group controls reuse the existing multi-selection mental model: grouped rows show a folder-like marker and compact group pill, selecting a grouped row or a grouped preview object selects all editable group members, and rename/ungroup actions stay near the layer list rather than adding a separate hierarchy tree. Grouped rows also include a small individual-edit pointer button and a compact badge when only one grouped member is selected, so single-object adjustment is distinct from whole-group selection.

The Templates tab separates three concepts: bundled default templates for immediate use-case starts, Edit state as one work-in-progress save slot with an autosave toggle, and Browser templates as named reusable snapshots. This keeps fast recovery close to templates without making every autosave into a template entry.

The Templates tab now also includes a compact guided start strip, template category filters, miniature preview swatches, and output-size badges. The flow keeps beginner work in a short path: choose a template, add or replace an image, add a title, apply brand styling, then generate/export layout text. Template filters use `All`, `YouTube`, `Shorts`, `Stream`, and `Cutout` labels so creators can quickly narrow the 10 bundled starts.

The Brand kit section lives in Templates because it is reusable project setup, not one-off layer editing. It stores channel name, brand font, primary/accent/shadow colors, and an optional logo asset. Capture style and Apply kit are explicit actions so users can either derive a kit from the current thumbnail or apply a saved kit to selected layers.

Inspector controls use disabled states when an input cannot affect the current layer state, keeping inert settings visually distinct without hiding the surrounding workflow. The Adjust tab exposes advanced but compact layer appearance controls for layer blur, signed inner/outer edge blur, optional stroke/outline blur participation, corner radius, text writing mode, text kerning, line style, and fill/stroke opacity.

The Colors tab treats registered single colors as editable rows. Selecting a row loads it into the editor, Update writes it back, and each registered row exposes direct Fill and Stroke apply buttons for the current text/shape selection. Saved multi-color palette rows stay visually separate from the single-color list. The palette maker shows an Adobe-style color exploration area with selectable and drag-editable linked color wheel points, explicit base-color controls, large palette bars, HEX/RGB synchronized slider and number inputs, recent colors, and a full-width opacity control. RGB channel controls stack as full-width rows so the slider tracks remain precise in the compact inspector. Selecting a point is non-destructive; dragging a point updates the whole palette pattern around that intended color. Users can save the displayed pattern as a palette-level set, then apply any saved-palette color as Fill or Stroke without replacing the single-swatch workflow.

The status bar can show compact warning chips for long text, low contrast, hidden important layers, edge-safe-area risk, heavy assets, many layers, 4K output, and large storage estimates. These warnings are intentionally advisory and sit beside the status message without blocking the export controls.

## UI Principles

- Build the actual editor, not a landing page.
- Keep panels compact and readable for repeated production use.
- Use white panels on a light gray workbench with high-contrast text.
- Use cyan and coral accents sparingly for selected state and export actions.
- Keep border radii at 8px or less.
- Avoid nested cards and decorative backgrounds.
- Keep controls stable across desktop and mobile.

## Implementation Tokens

- Background: `#edf2f6`
- Panel: `#ffffff`
- Workbench: `#dfe7ee`
- Text: `#152033`
- Muted text: `#647286`
- Accent: `#10b6d7`
- Export/action: `#ff4f5f`
- Warning/highlight: `#ffd166`
- Borders: `#d8e0e7`
- Radius: 6px controls, 8px panels/canvas
- Typography: system sans for app chrome; user-selected canvas fonts for thumbnail text

## Responsive Behavior

- Desktop: three-column editor with canvas centered.
- Tablet/mobile: stack tools above the canvas and inspector below it.
- Mobile: place the canvas workbench before the left and right panels so the first scroll position prioritizes the thumbnail being edited.
- Image Lab modal uses a two-column workspace on desktop and a single-column workspace on mobile.
- Left and right task tabs remain visible at the top of their panels and collapse without horizontal overflow on mobile.
- Canvas preserves aspect ratio and never overlaps controls.
- Canvas edit padding can expand when layers extend beyond the document bounds; the padded area uses a subtle checker pattern to distinguish edit-only space from exported content.
- Preset changes recompute preview fit so tall documents such as Shorts fit inside the desktop canvas stage without expanding the whole app shell.
- Text and controls must not overflow their containers.

## Concept Fidelity Ledger

- Copy: implemented app name, CSV/HTML layout controls, layer list, inspector, resolution controls, and export controls. The generated concept included Japanese sample thumbnail text; implementation uses English sample copy for UTF-8-safe docs/code and browser verification.
- Layout: implemented the same left input rail, center canvas, right layer/inspector, top export toolbar, and bottom status structure, with task tabs added to reduce always-visible control density.
- Palette: implemented white panels, light gray workbench, cyan selected states, and coral export/action accents.
- Container model: implemented compact tool panels with 8px or smaller radii and no marketing hero page.
- Interaction: concept showed editor controls; implementation adds working CSV/HTML import, file import, YouTube thumbnail import, selected asset insertion, expanded quick add with line layers, 10 bundled default templates, layer edits, signed inner/outer edge blur with text/stroke control, corner radius, blank-click deselection, live multi-layer relative movement/rotation, layer grouping, individual grouped-row editing, fit selected layers to canvas, keyboard edit shortcuts, multi-layer angle matching, saved edit state with autosave, canvas selection, Image Lab modal processing with selected asset handoff and editable Rect/Circle/Polygon selections, text fit-to-box, text kerning, horizontal/vertical text writing mode, text alignment buttons, disabled inert inspector controls, Adjust reset buttons, editable single-color rows with direct Fill/Stroke apply buttons, saved multi-color palette sets, drag-capable palette maker preview, resizable inspector lists, Google Fonts dropdown options, and PNG/JPEG/WebP export.
- Selection fidelity: vertical text uses rendered visual bounds for selection, hit testing, handles, and preview padding, while horizontal text and non-text layers retain their configured layer boxes.
- Follow-up improvements: implementation now selects the frontmost overlapping layer on preview body clicks, selects grouped preview objects as multi-selections, records canvas drag history only at confirmed positions, lets users resize Layers and Colors list areas, fits tall presets in the visible stage, lets users add browser-local custom fonts from the Adjust tab, shows off-canvas layers during editing, and supports Japanese/English UI switching.
