# Thumbnail Generator

Thumbnail Generator is a static browser app for making video thumbnails for YouTube, NicoNico, Twitch, and similar platforms. It runs entirely in the browser, supports Japanese and English UI labels, and exports finished thumbnails as PNG, JPEG, or WebP.

Published app: <https://sunmax0731.github.io/thumbnail-generator/>

Repository: <https://github.com/Sunmax0731/thumbnail-generator>

## What You Can Do

- Compose thumbnails with image, text, and shape layers.
- Add line layers from Quick Add with solid, dotted, dashed, or wave strokes.
- Import local images and edit their position, size, rotation, opacity, and simple effects.
- Import a YouTube video thumbnail from a YouTube URL or video id and edit it as an image layer.
- Adjust layer blur, signed inner/outer edge blur, stroke/outline blur participation, corner radius, fill/stroke opacity, and text kerning.
- Select imported assets to add them as image layers or open them directly in Image Lab.
- Use Image Lab for chroma key, rectangle, circle, and editable polygon cutouts.
- Edit layers directly on the preview canvas with drag move, resize handles, and a rotation handle; drag undo/redo returns between confirmed start and end positions.
- Select multiple layers, move or rotate them together, align them, or match angles to the first selected layer.
- Group selected layers, rename groups, ungroup them, select grouped rows or grouped preview objects as a multi-selection, edit one grouped row individually from Layers, and fit selected image/shape layers to the canvas.
- Use Delete, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y shortcuts outside text fields and modals.
- Paste CSV rows or HTML-like markup with `data-layer` attributes to replace the layout.
- Generate CSV and HTML layout text from the current thumbnail.
- Save a browser-local work-in-progress state, enable autosave, and store named templates in `localStorage`.
- Load bundled default templates for livestream, review, tutorial, and portrait-short use cases.
- Register, edit, group, preview, and apply named Fill or Stroke colors in the browser-local palette, including opacity, Adobe-style color wheel and palette bars, HEX/RGB synchronized input, recent colors, saved palette sets, grouped harmony suggestions, and palette-level Fill/Stroke application buttons.
- Select bundled Google Fonts options or import WOFF2, WOFF, TTF, or OTF fonts for text layers.
- Switch text layers between horizontal and vertical writing, with vertical selection bounds following the visible text area.
- Export to common video presets or custom output sizes.

See [docs/features.md](docs/features.md) for the feature index and [docs/user-guide.md](docs/user-guide.md) for step-by-step usage.

## Use The Published App

Open <https://sunmax0731.github.io/thumbnail-generator/> in a modern desktop or mobile browser. No account, server, or upload is required. Images, templates, edit state, colors, and imported fonts stay in the current browser profile unless you export a thumbnail or clear site data.

## Run Locally

Install Node.js, then run:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. For a production-style local check:

```powershell
npm test
npm run build
npm run preview
```

To package the documentation artifact:

```powershell
npm run docs:zip
```

The built `dist/` output is static and can be served by GitHub Pages or any static file host.

## Report Bugs Or Requests

Please report bugs, usability issues, and improvement requests through GitHub Issues:

<https://github.com/Sunmax0731/thumbnail-generator/issues>

Useful reports include the browser name/version, viewport or device, what you imported, the steps to reproduce, and the expected result.

## Documentation

- [docs/requirements.md](docs/requirements.md): accepted product requirements.
- [docs/specification.md](docs/specification.md): layer model, CSV schema, HTML schema, export behavior, storage, and Image Lab details.
- [docs/design.md](docs/design.md): editor layout, visual tokens, and responsive behavior.
- [docs/features.md](docs/features.md): user-facing feature overview.
- [docs/user-guide.md](docs/user-guide.md): manual usage guide.
- [docs/test-plan.md](docs/test-plan.md): automated and browser runtime validation plan and results.
- [docs/qcds-evaluation.md](docs/qcds-evaluation.md): Quality, Cost, Delivery, and Satisfaction evaluation.
- [docs/codex-work-dashboard-qcds.md](docs/codex-work-dashboard-qcds.md): final Codex Work Dashboard re-evaluation evidence.
- [docs/release-checklist.md](docs/release-checklist.md): release readiness checklist.
- [TODO.md](TODO.md): local waterfall task contract.
- [Issues/](Issues/): local issue backlog used before or alongside GitHub Issues.
