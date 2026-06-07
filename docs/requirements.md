# Requirements

## Goal

Create a static web service for making video thumbnails for YouTube, NicoNico, Twitch, and similar platforms.

## Functional Requirements

- Import local image files and use them as editable thumbnail layers.
- Import YouTube video thumbnails by URL or video id and use them as editable image layers.
- Select imported image assets, add the selected asset as a layer, and open the selected asset in Image Lab.
- Configure image size, position, rotation, opacity, and simple effects.
- Add text layers with string content, font size, font family, fill color, rotation, and outline stroke.
- Select hosted Google Fonts options from the font dropdown for text layers.
- Switch text layers between horizontal and vertical writing mode.
- Show vertical text selection bounds from the rendered vertical text area instead of the old horizontal layer box.
- Adjust text layer kerning/letter spacing.
- Fit text layer font size to the configured layer bounds from the GUI.
- Import browser-local custom font files for text layers.
- Add common text, shape, and line layers through expanded quick-add controls.
- Add simple shapes with fill color, stroke color, size, position, and rotation.
- Add line layers and edit line style as solid, dotted, dashed, or wave.
- Adjust layer blur, edge blur, and corner radius where applicable.
- Adjust text/shape fill and stroke opacity independently.
- Clear the current selection by clicking non-layer blank space in the preview.
- Edit selected layer groups with live relative X/Y movement and relative rotation deltas.
- Group selected layers, rename groups, ungroup them, and select a group as a multi-selection.
- Select one grouped layer individually from the Layers panel for single-layer adjustment without ungrouping.
- Select a group from either Layers or the preview by choosing one editable grouped member.
- Fit selected image or shape layers to the current canvas size from Layers.
- Match multiple selected editable layer angles to the first selected editable layer.
- Save the current edit state in browser storage, restore it after reload, and enable or disable autosave.
- Load bundled default templates for common thumbnail use cases without depending on localStorage.
- Select text alignment with direct Left, Center, and Right buttons.
- Show layer overflow outside the document bounds during editing while preserving clipped document-only export.
- Make the direct rotation handle visually recognizable through cursor and handle states.
- Switch major UI labels between Japanese and English, auto-selecting from browser/OS language when supported and falling back clearly when unsupported.
- Define or replace layouts from CSV.
- Define or replace layouts from HTML-like markup.
- Export the composed thumbnail to PNG, JPEG, or WebP at selected resolution and aspect ratio.
- Provide common presets and custom output dimensions.
- Automatically fit the preview when preset aspect ratio changes would otherwise push the canvas outside the visible stage.
- Resize the Layers and Colors list areas in the inspector while preserving core editor controls.
- Disable controls that do not affect the current selected layer or selected state.
- Reset selected layer rotation to `0` degrees and opacity to `100%` from the Adjust tab.
- Use common editing shortcuts outside text fields and modals: Delete, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y.
- Edit registered single colors, apply each saved single color directly as Fill or Stroke, set palette opacity, and preview palette patterns.
- Use an Adobe-style visual color palette with selectable and drag-editable linked color-wheel points, explicit base-color controls, large palette bars, HEX/RGB synchronized input with sliders, and recent-color reuse.
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
