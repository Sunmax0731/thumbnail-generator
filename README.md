# Thumbnail Generator

Static browser app for creating video thumbnails for YouTube, NicoNico, Twitch, and similar platforms.

The app lets creators compose thumbnail layouts from imported images, CSV rows, or HTML-like layout markup, then export the rendered result as PNG, JPEG, or WebP at a selected resolution and aspect ratio. It is designed for GitHub Pages and does not require a backend.

## Current MVP

- Canvas-based thumbnail preview and export.
- Direct canvas editing for the selected layer: drag move, corner resize, and rotation handle.
- Multi-layer selection, group movement, and alignment controls. Single-layer alignment targets the canvas.
- Selection handles render in preview padding outside the thumbnail document area.
- Left sidebar is organized by Assets, Layouts, and Templates task tabs.
- Right inspector is organized by Layers, Adjust, and Colors task tabs.
- Image import with position, size, rotation, opacity, and effects.
- Image Lab modal workspace for chroma-key transparency and rectangle, circle, polygon, or drag-range cutouts. Rect and circle areas can be set by dragging on the preview.
- Text layers with font size, font dropdown, color, rotation, and outline stroke.
- Shape layers with fill/stroke, size, and rotation.
- Browser-local color palette with quick apply for text, shape fill, and stroke/outline colors.
- Named browser-local color palette entries with Fill/Stroke targets.
- Custom WOFF2/WOFF/TTF/OTF font import for text layers, stored in browser localStorage.
- Layer visibility, selectable/editable lock controls, Delete-key removal, and delete confirmation.
- Preview hit testing selects the frontmost visible editable layer when layers overlap.
- CSV layout importer.
- HTML layout importer using `data-layer` attributes.
- Generated CSV/HTML layout text from the current canvas state.
- Named browser-local templates stored in `localStorage`, with load and delete controls.
- Drag-and-drop layer ordering in the Layers panel.
- Resolution presets for common video platforms and custom output size.
- Tall presets such as Shorts automatically fit the full canvas into the visible preview stage.
- Browser-only static deployment.

## Local Workflow

```powershell
npm install
npm run dev
npm test
npm run build
npm run docs:zip
```

The Vite build output is static and can be served from GitHub Pages. The repository includes `.github/workflows/pages.yml`, which runs `npm ci`, `npm test`, `npm run build`, and deploys `dist/` when `main` or `codex/thumbnail-generator-static-app` is pushed.

Published Pages URL: `https://sunmax0731.github.io/thumbnail-generator/`

## Repository Docs

- [TODO.md](TODO.md): waterfall task contract and completion checklist.
- [docs/requirements.md](docs/requirements.md): accepted requirements.
- [docs/specification.md](docs/specification.md): CSV/HTML schema and feature specification.
- [docs/design.md](docs/design.md): UI design basis and concept reference.
- [docs/test-plan.md](docs/test-plan.md): automated and manual verification plan.
- [docs/user-guide.md](docs/user-guide.md): manual usage guide for creators and reviewers.
- [docs/qcds-evaluation.md](docs/qcds-evaluation.md): QCDS score and rationale.
- [docs/release-checklist.md](docs/release-checklist.md): release readiness checklist.
- `release/thumbnail-generator-docs.zip`: packaged docs artifact.

## Browser Runtime Gate

Latest local gate:

- URL: `http://127.0.0.1:4173/thumbnail-generator/`
- Browser: Playwright headless Chromium. Browser plugin fallback reason: in-app Browser returned `Browser is not available: iab`.
- Passed: nonblank canvas, primary UI visible, left task tabs, right inspector tabs, CSV import, HTML import, inspector edit, direct canvas move/resize/rotate, z-order-aware preview selection, multi-select alignment, single-layer canvas alignment, Colors tab vertical expansion, named Fill/Stroke palette registration/apply, custom TTF font import/load/apply/storage, portrait preset fit at 56% zoom, layer lock, layer Delete-key removal, delete confirmation modal cancel/confirm, layer drag-and-drop ordering, Adjust controls without duplicate numeric readouts, multiple named template saves, Image Lab modal workspace with Rect/Circle drag selection and chroma key, image import, WebP export download, desktop viewport, mobile viewport, and mobile canvas viewport.
- Latest work-item screenshots:
  - `docs/assets/runtime-work-items-font.png`
  - `docs/assets/runtime-work-items-colors.png`
  - `docs/assets/runtime-work-items-preset.png`
  - `docs/assets/runtime-work-items-mobile.png`

Latest remote deploy:

- GitHub Pages workflow: pass.
- Published URL returned HTTP 200.
