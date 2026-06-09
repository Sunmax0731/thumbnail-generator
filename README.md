# Thumbnail Generator

Thumbnail Generator is a static browser app for making video thumbnails for YouTube, NicoNico, Twitch, and similar platforms. It runs entirely in the browser, supports Japanese and English UI labels, and exports finished thumbnails as PNG, JPEG, or WebP.

Published app: <https://sunmax0731.github.io/thumbnail-generator/>

Repository: <https://github.com/Sunmax0731/thumbnail-generator>

## What You Can Do

- Compose thumbnails with image, text, and shape layers, including rectangle, ellipse, triangle, diamond, pentagon, hexagon, star, and line shapes.
- Add line layers from Quick Add with solid, dotted, dashed, or wave strokes.
- Import local images and edit their position, size, rotation, opacity, and simple effects.
- Import a YouTube video thumbnail from a YouTube URL or video id and edit it as an image layer.
- Adjust layer blur, signed inner/outer edge blur, stroke/outline blur participation, polygon corner radius, fill/stroke color alpha, and text kerning.
- Select imported assets to add them as image layers or open them directly in Image Lab from each asset row.
- Use Image Lab for chroma key, rectangle, circle, and editable polygon cutouts.
- Edit layers directly on the preview canvas with drag move, resize handles, and a rotation handle; drag undo/redo returns between confirmed start and end positions.
- Select multiple layers, move or rotate them together, align or evenly distribute them, or match angles to the first selected layer.
- Group selected layers, rename groups, ungroup them, select grouped rows or grouped preview objects as a multi-selection, edit one grouped row individually from Layers, and fit selected image/shape layers to the canvas.
- Use Delete, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+D, Ctrl+Z, and Ctrl+Y shortcuts outside text fields and modals.
- Paste CSV rows or HTML-like markup with `data-layer` attributes from the preview-pane Layout I/O section to replace the layout.
- Generate CSV and HTML layout text from the current thumbnail.
- Save a browser-local work-in-progress state, enable autosave, and store named templates in `localStorage`.
- Load 38 bundled default templates, with five starts each for YouTube, Shorts, stream, and cutout use cases, eight schedule starts, and ten animated eyecatch/waiting starts.
- Filter bundled templates by YouTube, Shorts, stream, cutout, schedule, or motion use case.
- Add layer animation presets from Motion, choose easings.net-style easing curves, preview the selected object and easing graph, and open a popup-style OBS preview window that loops only the current canvas without editor controls or selection handles.
- Keep browser-local brand color data compatible with saved states while Brand kit setup and Colors-side brand registration buttons stay hidden.
- See rule-based quality warnings for long text, low contrast, hidden important layers, safe-area edges, large storage snapshots, heavy assets, many layers, and 4K export.
- Export, import, or delete the browser-local edit state JSON for backup and recovery from the preview pane.
- Register, edit, preview, delete, collapse, and apply named browser-local single colors with per-row Fill and Stroke buttons, including opacity, drag-capable Adobe-style linked color wheel handles, a palette-pattern dropdown beside the wheel, palette bars below the wheel, `@uiw/react-color` Sketch-style HEX/RGB/alpha input, recent colors, collapsible saved multi-color palette sets, and palette-level Fill/Stroke application buttons.
- Open a compact single-color picker from Adjust Fill and Stroke color displays, including alpha selection, instead of using separate fill/stroke opacity sliders.
- Select expanded bundled Google Fonts options or import WOFF2, WOFF, TTF, or OTF fonts for text layers.
- Switch text layers between horizontal and vertical writing, with vertical text bounds resized from the preview or Adjust tab like horizontal text.
- Export to common video presets or custom output sizes.
- Pan the preview manually with the Pan button, Space-drag, or Alt-drag while zoom remains user-controlled until Fit canvas is selected.

See [docs/features.md](docs/features.md) for the feature index, [docs/user-guide.md](docs/user-guide.md) for step-by-step usage, and [docs/screenshot-guide.md](docs/screenshot-guide.md) for screenshot-based feature walkthroughs.

## Use The Published App

Open <https://sunmax0731.github.io/thumbnail-generator/> in a modern desktop or mobile browser. No account, server, or upload is required. Images, templates, edit state, brand kit, colors, and imported fonts stay in the current browser profile unless you export a thumbnail, layout, edit-state JSON, or clear site data.

Use the in-app GitHub Issues link to report bugs, usability issues, and feature requests. The app does not upload browser-local image, font, template, palette, brand, or edit-state data.

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
- [docs/screenshot-guide.md](docs/screenshot-guide.md): screenshot-based feature guide and use-case walkthroughs.
- [docs/test-plan.md](docs/test-plan.md): automated and browser runtime validation plan and results.
- [docs/qcds-evaluation.md](docs/qcds-evaluation.md): Quality, Cost, Delivery, and Satisfaction evaluation.
- [docs/qcds-code-starter-summary.md](docs/qcds-code-starter-summary.md): VS Code Code Starter-facing QCDS display summary.
- [docs/codex-work-dashboard-qcds.md](docs/codex-work-dashboard-qcds.md): final Codex Work Dashboard re-evaluation evidence.
- [docs/release-checklist.md](docs/release-checklist.md): release readiness checklist.
- [TODO.md](TODO.md): local waterfall task contract.
- [Issues/](Issues/): local issue backlog used before or alongside GitHub Issues.
