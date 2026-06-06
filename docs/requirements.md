# Requirements

## Goal

Create a static web service for making video thumbnails for YouTube, NicoNico, Twitch, and similar platforms.

## Functional Requirements

- Import local image files and use them as editable thumbnail layers.
- Configure image size, position, rotation, opacity, and simple effects.
- Add text layers with string content, font size, font family, fill color, rotation, and outline stroke.
- Add simple shapes with fill color, stroke color, size, position, and rotation.
- Define or replace layouts from CSV.
- Define or replace layouts from HTML-like markup.
- Export the composed thumbnail to PNG, JPEG, or WebP at selected resolution and aspect ratio.
- Provide common presets and custom output dimensions.

## Non-Functional Requirements

- Static GitHub Pages compatible app.
- Browser-only operation with no backend.
- The app must render nonblank in Chrome or a headless browser.
- Primary operations must be verifiable through local automated and manual tests.
- Documentation and implementation must stay aligned.

## Out of Scope for MVP

- Server-side rendering or cloud storage.
- Authentication or team collaboration.
- Paid font hosting.
- Full Photoshop-style image editing.

