# Requirements

## Goal

Create a static web service for making video thumbnails for YouTube, NicoNico, Twitch, and similar platforms.

## Functional Requirements

- Import local image files from the Assets tab and use them as editable thumbnail layers.
- Keep browser-only YouTube video thumbnail import helpers available, while the current GUI hides the YouTube URL import controls.
- Select imported image assets, add the selected asset as a layer, and open the selected asset in Image Lab from its asset row.
- Configure image size, position, rotation, opacity, and simple effects.
- Add text layers with string content, font size, font family, fill color, rotation, and outline stroke.
- Select expanded hosted Google Fonts options from the font dropdown for text layers.
- Switch text layers between horizontal and vertical writing mode.
- Resize and select vertical text with the same configured display bounds used by horizontal text, while preserving vertical column rendering.
- Adjust text layer kerning/letter spacing.
- Fit text layer font size to the configured layer bounds from the GUI.
- Import browser-local custom font files for text layers.
- Add common text, shape, line, headline, subtitle, badge, divider, and selected-asset image layers through expanded quick-add controls in the left-panel Layers tab.
- Add simple shapes with fill color, stroke color, size, position, rotation, and shape kinds for rectangle, ellipse, triangle, diamond, pentagon, hexagon, star, and line.
- Add line layers and edit line style as solid, dotted, dashed, or wave.
- Adjust layer blur, edge blur, and corner radius where applicable, including rounded polygon corners for non-rect shape kinds.
- Adjust text/shape fill and stroke alpha through a draggable popup single-color picker opened from Fill and Stroke color displays.
- Clear the current selection by clicking non-layer blank space in the preview or the preview area outside the output frame.
- Edit selected layer groups with live relative X/Y movement and relative rotation deltas.
- Group selected layers, rename groups, ungroup them, and select a group as a multi-selection.
- Select one grouped layer individually from the Layers panel for single-layer adjustment without ungrouping.
- Select a group from either Layers or the preview by choosing one editable grouped member.
- Fit selected image or shape layers to the current canvas size from Layers.
- Match multiple selected editable layer angles to the first selected editable layer.
- Save the current edit state in browser storage, restore it after reload, and enable or disable autosave.
- Load 38 bundled default templates, with five entries each for YouTube, Shorts, stream, and cutout use cases, eight schedule entries for yearly, monthly, weekly, and daily layouts, and ten animated eyecatch/waiting templates, without depending on localStorage.
- Filter bundled templates by use case, show compact template previews before loading, and resize the Default templates and Browser templates list areas.
- Provide a beta schedule generator in Templates that creates monthly or weekly editable schedule layer sets from calendar date inputs, Sunday/Monday week-start settings, weekday language, date format, uniform or per-day action counts, canvas orientation, grid style, Adjust-shared font choices, separate title/weekday/date/plan font-size sliders, color, corner radius, line-width, pre-generation preview, month-aware badge labels, and generated-layer grouping controls.
- Configure one or more per-layer animation sets with easings.net-style easing choices, selected-object Motion preview, easing graph, disabled direction controls when an animation type does not use movement, and a popup-style OBS preview window without editor controls or selection handles.
- Keep the left panel focused on Templates, Layers, and Assets by hiding the Layouts tab, removing the guided creation strip, and hiding the preview-pane Generated layout section while retaining CSV/HTML text for edit-state and template compatibility.
- Keep browser-local brand kit data compatible with saved states while hiding Brand kit setup controls from Templates and hiding Colors-side Brand kit registration buttons.
- Show advisory quality warnings for text length, low contrast, hidden important layers, safe-area edges, heavy assets, large storage, many layers, and 4K export.
- Export, import, and delete browser-local edit-state JSON for backup and recovery.
- Show a GitHub Issues path for bug reports and feature requests.
- Show browser-only privacy/storage guidance inside the app without requiring a Templates service section.
- Select text alignment with direct Left, Center, and Right buttons.
- Keep the preview frame fixed to the output document area while preserving clipped document-only export and user-controlled zoom.
- Make the direct rotation handle visually recognizable through cursor and handle states.
- Switch major UI labels between Japanese and English, auto-selecting from browser/OS language when supported and falling back clearly when unsupported.
- Preserve CSV and HTML-like layout text in saved edit states and templates.
- Export the composed thumbnail to PNG, JPEG, or WebP at selected resolution and aspect ratio.
- Provide common presets and custom output dimensions from the preview header.
- Confirm before applying a template that replaces the current layer state, and apply the template's canvas aspect ratio automatically.
- Keep preview zoom user-controlled when presets or output sizes change, and provide manual Fit canvas plus pan controls for navigating large or tall canvases.
- Resize the Layers, Colors, Default templates, and Browser templates list areas while preserving core editor controls.
- Delete the final remaining layer when requested, leaving the canvas with zero layer objects.
- Delete registered/imported image assets from Assets, and remove any image layers that reference the deleted asset.
- Disable controls that do not affect the current selected layer or selected state.
- Reset selected layer rotation to `0` degrees from the Adjust tab.
- Evenly distribute three or more selected layers horizontally or vertically from the Layers alignment controls.
- Use common editing shortcuts outside text fields and modals: Delete, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y.
- Edit registered single colors, apply each saved single color directly as Fill or Stroke, set palette opacity, and preview palette patterns.
- Use an Adobe-style visual color palette with selectable and drag-editable linked color-wheel points, a palette-pattern dropdown to the left of the wheel, explicit base-color controls, large palette bars, `@uiw/react-color` Sketch-style HEX/RGB/alpha input, and recent-color reuse.
- Save the currently previewed palette pattern as one browser-local multi-color palette set and apply individual saved-palette colors as Fill or Stroke.
- Use signed edge blur values to choose inner or outer edge blur, and optionally include text/shape strokes in the blur source.
- Treat canvas drag movement as one undo/redo history step from drag start to drag completion, not as intermediate pointer positions.

## Non-Functional Requirements

- Static GitHub Pages compatible app.
- Browser-only operation with no backend.
- YouTube thumbnail import must remain browser-only and must not require a server proxy.
- The app must render nonblank in Chrome or a headless browser.
- Japanese and English UI labels must not overflow or overlap in the main editor viewport.
- Primary operations must be verifiable through local automated and manual tests.
- Documentation and implementation must stay aligned.

## Out of Scope for MVP

- Server-side rendering or cloud storage.
- Authentication or team collaboration.
- Paid font hosting.
- Full Photoshop-style image editing.
