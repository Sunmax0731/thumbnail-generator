# Requirements

## Goal

Create a static web service for making video thumbnails for YouTube, NicoNico, Twitch, and similar platforms.

## Functional Requirements

- Import local image files and use them as editable thumbnail layers.
- Configure image size, position, rotation, opacity, and simple effects.
- Add text layers with string content, font size, font family, fill color, rotation, and outline stroke.
- Fit text layer font size to the configured layer bounds from the GUI.
- Import browser-local custom font files for text layers.
- Add simple shapes with fill color, stroke color, size, position, and rotation.
- Clear the current selection by clicking non-layer blank space in the preview.
- Edit selected layer groups with relative X/Y movement and relative rotation deltas.
- Show layer overflow outside the document bounds during editing while preserving clipped document-only export.
- Make the direct rotation handle visually recognizable through cursor and handle states.
- Switch major UI labels between Japanese and English, auto-selecting from browser/OS language when supported and falling back clearly when unsupported.
- Define or replace layouts from CSV.
- Define or replace layouts from HTML-like markup.
- Export the composed thumbnail to PNG, JPEG, or WebP at selected resolution and aspect ratio.
- Provide common presets and custom output dimensions.
- Automatically fit the preview when preset aspect ratio changes would otherwise push the canvas outside the visible stage.

## Non-Functional Requirements

- Static GitHub Pages compatible app.
- Browser-only operation with no backend.
- The app must render nonblank in Chrome or a headless browser.
- Japanese and English UI labels must not overflow or overlap in the main editor viewport.
- Primary operations must be verifiable through local automated and manual tests.
- Documentation and implementation must stay aligned.

## Out of Scope for MVP

- Server-side rendering or cloud storage.
- Authentication or team collaboration.
- Paid font hosting.
- Full Photoshop-style image editing.
