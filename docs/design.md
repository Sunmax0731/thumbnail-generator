# Design

## Concept Source

Primary UI concept: `docs/assets/ui-concept.png`

The concept uses a functional editor as the first screen:

- Left input rail for image, CSV, HTML, and template operations.
- Center canvas workbench with thumbnail preview.
- Top toolbar for output size and direct format-specific export actions.
- Right inspector for layer order and selected layer properties.
- Bottom status row for validation, zoom, and export state.
- Image Lab opens as a modal workspace from the left rail for precise image cutout work.

## Information Architecture Refresh

The editor keeps the established three-column structure, but dense controls are grouped into task tabs:

- Left rail: Templates, Layers, and Assets. The previous Layouts tab and preview-pane Generated layout section are hidden from the GUI; CSV/HTML text remains part of edit-state and template compatibility.
- Right rail: Adjust, Colors, and Motion.
- Top toolbar: app identity plus top-right language and theme selectors.
- Preview header: output preset, width, and height controls beside the canvas tools.
- Image Lab modal: the selected asset is handed off from the asset row; cutout mode, preview, crop sliders, inline chroma key settings, and processed-layer creation stay in the modal workspace.

This keeps the first viewport focused on the current editing task while retaining one-click access to layout text, template storage, layer ordering, layer adjustment, and color registration.

The Layers, Colors, Default templates, and Browser templates lists use visible vertical resize handles so users can allocate more panel height to the list they are reviewing. Colors uses layer-like rows for named Fill/Stroke entries, so palette entries scan consistently with layer rows. The Adjust tab keeps custom font import adjacent to the text font dropdown so font addition and selection remain one workflow.

The Adjust tab changes by selection scope: a single selected layer shows absolute layer properties grouped with common layer controls first, then Text, Shape, or Image-specific controls below. Multiple selected layers show live relative movement, live relative rotation, and angle matching to the first selected layer. Text alignment is a direct three-button control for Left, Center, and Right. This avoids implying that group editing overwrites each layer with one absolute value except for the explicit Match angle action.

The Assets tab contains local image import and the imported media list. Imported assets are selectable rows with direct actions for adding an image layer, opening the asset in Image Lab, or deleting the asset. Deleting an asset also removes image layers that reference it. The YouTube URL import UI is hidden while browser-only helper code remains available.

The Layers tab starts with collapsible Quick Add for common text, shape, line, headline, subtitle, badge, divider, and selected-image starters. The layer list is also collapsible and keeps ordering, visibility, lock, and delete actions. Group controls reuse the existing multi-selection mental model: grouped rows show a folder-like marker and compact group pill, selecting a grouped row or a grouped preview object selects all editable group members, and rename/ungroup actions stay near the layer list rather than adding a separate hierarchy tree. Grouped rows also include a small individual-edit pointer button and a compact badge when only one grouped member is selected, so single-object adjustment is distinct from whole-group selection. Alignment controls include horizontal and vertical even distribution, while Fit to canvas sits in Adjust near position and size controls.

The Templates tab separates bundled default templates and Browser templates as named reusable snapshots. Both template lists can be resized independently. Loading a template asks for localized confirmation in the same modal style used for layer deletion before replacing the current canvas, automatically applies the template's output aspect ratio, and auto-fits the preview zoom so the new canvas is not clipped. Deleting a browser template uses the same confirmation modal pattern before removing the saved snapshot. A beta schedule generator sits inside the Default templates section because it creates a full monthly or weekly template-like layer set rather than one quick layer; its modal gathers calendar date, week-start, weekday language, date format, canvas orientation, grid, Adjust-shared font choices, separate title/weekday/date/plan size sliders, color, corner radius, line-width, action-count, grouping, and live preview inputs before generating editable layers. The schedule modal expands horizontally into date, style, color, and preview columns on desktop so additional controls do not make the dialog unnecessarily tall. Edit state and export actions live in the preview pane so save, restore, JSON backup, autosave, and file output controls stay visible beside the current thumbnail instead of being hidden behind a left-panel tab. Export and Edit state sit side by side when the preview pane is wide enough and stack by preview width in the three-panel editor, each section keeps its action buttons horizontal with equal button width, and the autosave checkbox remains a separate edit-state row.

The previous guided start strip is removed from the left panel. Template filters use `All`, `YouTube`, `Shorts`, `Stream`, `Cutout`, `Schedule`, and `Motion` labels so creators can quickly narrow the 38 bundled starts, including eight schedule starts for yearly/monthly/weekly/daily layouts and ten animated eyecatch/waiting layouts.

Brand kit setup controls are hidden from Templates. Browser-local brand kit data remains compatible with existing saved state, and Colors no longer exposes Primary, Accent, or Shadow registration actions so palette exploration stays focused on thumbnail colors.

Inspector controls use disabled states when an input cannot affect the current layer state, keeping inert settings visually distinct without hiding the surrounding workflow. The Adjust tab exposes advanced but compact layer appearance controls for layer blur, signed inner/outer edge blur, optional stroke/outline blur participation, corner radius, text writing mode, text kerning, line style, and Fill/Stroke color buttons. Those color buttons open a draggable popup Sketch-style single-color picker with alpha, so color editing does not expand the Adjust tab and separate fill/stroke opacity sliders are not duplicated. The Motion tab keeps animation controls separate from static layer adjustment, shows the selected object and easing graph, lets one object hold multiple ordered motion sets, and disables direction/distance where the selected animation type cannot use movement.

The Colors tab treats registered single colors as editable rows. Selecting a row loads it into the editor, Update writes it back, and each registered row exposes direct Fill and Stroke apply buttons for the current text/shape selection. The Fill button is text-labeled, while legacy row names such as `Fill #10b6d7` are displayed without the target prefix so the color code is easier to scan. Saved multi-color palette rows use the same row rhythm, show only each palette color code instead of `Color 1`-style labels, and keep palette deletion at the palette header. Both saved palettes and registered single colors can collapse and can be reordered by dragging their rows. The palette maker shows an Adobe-style color exploration area with the palette-pattern dropdown to the left of the wheel, selectable and drag-editable linked color wheel points, explicit base-color controls, large palette bars below the wheel, recent colors, and an embedded `@uiw/react-color` Sketch-style base-color editor for HEX/RGB/alpha adjustments. The previous wheel-side color strip is removed so the color overview is concentrated below the wheel. Selecting a point is non-destructive; dragging a point updates the whole palette pattern around that intended color. Users can save the displayed pattern as a palette-level set, then apply any saved-palette color as Fill or Stroke without replacing the single-swatch workflow.

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

The theme selector supports System, Light, and Dark. System resolves from `prefers-color-scheme`, while Light and Dark are stored in browser `localStorage` and applied through `data-theme`.

## Responsive Behavior

- Desktop: three-column editor with canvas centered.
- Tablet/mobile: stack tools above the canvas and inspector below it.
- Mobile: place the canvas workbench before the left and right panels so the first scroll position prioritizes the thumbnail being edited.
- Image Lab modal uses a two-column workspace on desktop and a single-column workspace on mobile.
- Left and right task tabs remain visible at the top of their panels and collapse without horizontal overflow on mobile.
- Canvas preserves aspect ratio and never overlaps controls.
- The preview frame stays fixed to the output document instead of stretching around off-canvas layers.
- Preset changes keep the current user zoom. Users can choose Fit canvas explicitly or pan the preview with Pan, Space-drag, or Alt-drag. When a layer is dragged outside the document, the zoom scale and output frame remain stable instead of auto-shrinking to fit the new overflow.
- Text and controls must not overflow their containers.

## Concept Fidelity Ledger

- Copy: implemented app name, CSV/HTML layout controls, layer list, inspector, resolution controls, and export controls. The generated concept included Japanese sample thumbnail text; implementation uses English sample copy for UTF-8-safe docs/code and browser verification.
- Layout: implemented the same left input rail, center canvas, right layer/inspector, top export toolbar, and bottom status structure, with task tabs added to reduce always-visible control density.
- Palette: implemented white panels, light gray workbench, cyan selected states, and coral export/action accents.
- Container model: implemented compact tool panels with 8px or smaller radii and no marketing hero page.
- Interaction: concept showed editor controls; implementation adds Assets-tab file import, hidden-but-retained YouTube thumbnail helper support, selected asset insertion and deletion, left-panel collapsible Layers Quick Add with line layers, collapsible layer list, final-layer deletion, 38 bundled default templates including Schedule and Motion with modal confirmation before applying, independently resizable Default and Browser template lists, preview-pane edit state and export controls, preview-header output size controls, manual Fit canvas plus pan, stable output-frame preview with outside-frame deselection, layer edits, signed inner/outer edge blur with text/stroke control, polygon corner radius, blank-click deselection, live multi-layer relative movement/rotation, layer grouping, individual grouped-row editing, fit selected layers to canvas from Adjust, alignment with even distribution, keyboard edit shortcuts, multi-layer angle matching, saved edit state with autosave, canvas selection, Image Lab modal processing with selected asset row handoff and optional Rect/Circle/Polygon selections, text fit-to-box, text kerning, horizontal/vertical text writing mode, text alignment buttons, disabled inert inspector controls, Adjust color buttons with draggable popup single-color picker, multiple Motion animation sets with selected-object preview and easing graph, popup-style OBS preview playback, editable single-color rows with direct Fill/Stroke apply buttons, palette rows aligned to single-color rows, collapsible saved multi-color palette sets, drag-capable palette maker preview, resizable inspector lists, expanded shape kinds, Google Fonts dropdown options, Google Analytics tracking for GitHub Pages, and PNG/JPEG/WebP export.
- Selection fidelity: vertical text uses the configured layer box for selection, hit testing, and resize handles so width/height edits behave like horizontal text.
- Follow-up improvements: implementation now selects the frontmost overlapping layer on preview body clicks, selects grouped preview objects as multi-selections, records canvas drag history only at confirmed positions, lets users resize Layers and Colors list areas, keeps preview zoom user-controlled across preset changes, lets users pan the preview manually, lets users add browser-local custom fonts from the Adjust tab, shows off-canvas layers during editing, and supports Japanese/English UI switching.
