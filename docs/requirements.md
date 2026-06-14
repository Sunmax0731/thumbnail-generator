# Requirements

## Goal

Create a static web service named サムネいる？ in Japanese mode and ThumbNailed It? in English mode for making video thumbnails for YouTube, NicoNico, Twitch, and similar platforms. The visible title must show the tagline `Need it quick? ThumbNailed It!`.

## Functional Requirements

- Import local image files from the Assets tab and use them as editable thumbnail layers.
- Import either individual image files or all supported image files directly under a selected folder from the Assets tab.
- Assign zero or more tags before registering imported image assets, offer existing tags as suggestions, and allow image asset tags to be added or removed later.
- Filter the Assets image list by registered tags.
- Keep browser-only YouTube video thumbnail import helpers available, while the current GUI hides the YouTube URL import controls.
- Select imported image assets, add the selected asset as a layer, and open the selected asset in Image Lab from its asset row.
- Register the currently selected layer group as a reusable browser-local group object asset with tags, then add that group object back to the canvas from Assets.
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
- Render wave line style as a smooth visible wave in preview and export.
- Adjust layer blur, edge blur, and corner radius where applicable, including rounded polygon corners for non-rect shape kinds.
- Adjust per-layer decoration with an explicit shadow enable checkbox, shadow color/opacity/blur/distance/angle shown only while shadow is enabled, pseudo-3D X/Y rotation, and signed bevel amount/opacity.
- Adjust text/shape fill and stroke alpha through a draggable popup single-color picker opened from Fill and Stroke color displays.
- Clear the current selection by clicking non-layer blank space in the preview or the preview area outside the output frame.
- Edit selected layer groups with live relative X/Y movement and relative rotation deltas.
- Group selected layers, rename groups, ungroup them, and select a group as a multi-selection.
- Select one grouped layer individually from the Layers panel for single-layer adjustment without ungrouping.
- Select a group from either Layers or the preview by choosing one editable grouped member.
- Fit selected image or shape layers to the current canvas size from Layers.
- Match multiple selected editable layer angles to the first selected editable layer.
- Save the current edit state in browser storage, restore it after reload, and enable or disable autosave.
- Provide Templates-tab generators for editable schedule layouts, standard thumbnails, vertical thumbnails, and stream waiting screens.
- Keep the previous bundled default-template list out of the current GUI after generator flows are available, while browser-local named templates remain available for user snapshots.
- Save browser-local named templates with optional tags, offer existing tags as dropdown suggestions while allowing free tag input, and filter saved templates by a dropdown tag selector.
- Provide a beta schedule generator in Templates that creates monthly or weekly editable schedule layer sets from calendar date inputs, Sunday/Monday week-start settings, weekday language, date format, uniform or per-day action counts, canvas orientation, grid style, Adjust-shared font choices, separate title/weekday/date/plan font-size sliders, color, corner radius, line-width, pre-generation preview, month-aware badge labels, generated-layer grouping controls, and reload-persistent generator settings.
- Provide image generators for standard thumbnails, vertical thumbnails, and stream waiting screens with five placement patterns, editable text, shared font choices, grouped common/title/subtitle/label text controls, color, image-slot, grouping, live preview, Generate layers, and Save settings controls. Stream waiting screens include optional animation metadata.
- Keep generator modal text sliders compact, allow letter spacing to be set to `0`, keep corner radius in common generator controls, use wider landscape previews for standard thumbnail, schedule, and stream waiting generators, preserve portrait preview aspect ratios, place generator action buttons at the preview/modal lower edge, and keep portrait generator preview columns free of excessive right-side whitespace.
- Configure one or more per-layer animation sets from the right-panel Animation tab in English mode / アニメ tab in Japanese mode with easings.net-style easing choices, motion presets, selected-object preview, toggleable easing graph, disabled direction controls when an animation type does not use movement, a bottom timeline of animated layers, text-only motion controls only for selected text layers, movement and non-moving/effect dropdowns in common parameters, greyed-out effect intensity when the selected non-moving effect cannot use intensity, and a popup-style OBS preview window without editor controls or selection handles.
- Show the bottom motion timeline only while the Animation/アニメ tab is active, and let users collapse the timeline, edit animation start/end visually with segment handles, move a segment by dragging the bar, and resize the timeline section height by dragging its top-edge handle.
- Provide OBS preview-window controls for Play/Pause, Reset, and hiding/showing the control overlay for clean capture, with `P`, `R`, and `H` keyboard shortcuts.
- Keep the left panel focused on Templates, Layers, and Assets by hiding the Layouts tab, removing the guided creation strip, and hiding the preview-pane Generated layout section while retaining CSV/HTML text for edit-state and template compatibility.
- Keep browser-local brand kit data compatible with saved states while hiding Brand kit setup controls from Templates and hiding Colors-side Brand kit registration buttons.
- Keep rule-based quality warning helpers available for validation and future UI surfaces, while the bottom footer remains reserved for service/legal links.
- Export JPG, PNG, WebP, and OBS preview from one Output menu in the preview header.
- Export, import, and delete browser-local edit-state JSON for backup and recovery from compact top-right icon controls, while keeping Autosave current edit state text visible.
- Show a footer GitHub Issues path with a GitHub icon for bug reports and feature requests.
- Show browser-only privacy/storage guidance inside the app without requiring a Templates service section.
- Publish a privacy policy and terms of use from the static app, and open localized privacy and terms content from footer modals. Keep footer entries for Manual, privacy, terms, X / Twitter contact, issue reporting, and centered copyright.
- Select text alignment with direct Left, Center, and Right buttons.
- Keep the preview frame fixed to the output document area while preserving clipped document-only export and user-controlled zoom.
- Make the direct rotation handle visually recognizable through cursor and handle states.
- Switch major UI labels between Japanese and English, auto-selecting from browser/OS language when supported and falling back clearly when unsupported.
- Preserve CSV and HTML-like layout text in saved edit states and templates.
- Export the composed thumbnail to PNG, JPEG, or WebP at selected resolution and aspect ratio.
- Provide PWA install metadata and a service worker app-shell cache for supported browsers.
- Provide a Chrome-extension-friendly page bridge that lets a content script detect readiness, read the current edit-state snapshot, and apply a valid edit-state snapshot without changing the saved-state schema.
- Provide common presets and custom output dimensions from the preview header.
- Confirm before applying a template that replaces the current layer state, and apply the template's canvas aspect ratio automatically.
- Keep preview zoom user-controlled when presets or output sizes change, and provide manual Fit canvas plus pan controls for navigating large or tall canvases.
- Support preview mouse-wheel zoom beyond 100%, suppress preview scrollbars while zoomed, and allow right-drag panning even without scrollbars.
- Resize the Layers, Colors, Registered templates, Assets image, and Assets group object list areas while preserving core editor controls.
- Rename the browser-local template list label to Registered templates.
- Delete the final remaining layer when requested, leaving the canvas with zero layer objects.
- Delete registered/imported image assets from Assets, and remove any image layers that reference the deleted asset.
- Let image assets and group objects use independent tag filters in Assets, and commit typed import-tag draft text when registering imported images.
- Let Image Lab zoom with the mouse wheel and pan with right-drag like the main preview.
- Prevent right-click from adding Image Lab polygon/free-selection points.
- Show eight high-contrast handles for Image Lab rectangle and circle selections; corner handles resize with aspect ratio preserved, while side handles resize freely.
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
