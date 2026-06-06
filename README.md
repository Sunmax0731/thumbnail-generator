# Thumbnail Generator

Static browser app for creating video thumbnails for YouTube, NicoNico, Twitch, and similar platforms.

The app lets creators compose thumbnail layouts from imported images, CSV rows, or HTML-like layout markup, then export the rendered result as PNG, JPEG, or WebP at a selected resolution and aspect ratio. It is designed for GitHub Pages and does not require a backend.

## Current MVP

- Canvas-based thumbnail preview and export.
- Direct canvas editing for the selected layer: drag move, corner resize, and rotation handle.
- Preview blank-click deselection that clears the inspector and selection highlight.
- Multi-layer selection, group movement, live relative X/Y movement, live relative rotation, angle matching to the first selected layer, and alignment controls. Single-layer alignment targets the canvas.
- Selection handles render in preview padding outside the thumbnail document area, and off-canvas layer overflow remains visible while editing.
- Rotation handles show normal, hover, and drag states with a rotate glyph and grab cursor.
- Left sidebar is organized by Assets, Layouts, and Templates task tabs.
- Right inspector is organized by Layers, Adjust, and Colors task tabs, with resizable Layers and Colors list areas.
- UI language toggle for Japanese and English, with browser-language detection and English fallback for unsupported languages.
- Image import with position, size, rotation, opacity, and effects.
- Image Lab modal workspace for chroma-key transparency and rectangle, circle, polygon, or drag-range cutouts. Rect and circle areas can be set by dragging on the preview.
- Text layers with font size, font dropdown, color, rotation, outline stroke, and three-button text alignment.
- Text layers can be fit to their layer bounds with a one-click Fit text to box action.
- Shape layers with fill/stroke, size, and rotation.
- Current edit state can be saved in browser localStorage, restored after reload, and optionally autosaved while editing.
- Browser-local color palette with quick apply for text, shape fill, and stroke/outline colors.
- Named browser-local color palette entries with Fill/Stroke targets displayed in layer-like rows.
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
- [docs/features.md](docs/features.md): feature list and usage quick reference.
- [docs/user-guide.md](docs/user-guide.md): manual usage guide for creators and reviewers.
- [docs/improvement-backlog.md](docs/improvement-backlog.md): taskized follow-up improvement candidates.
- [docs/qcds-evaluation.md](docs/qcds-evaluation.md): QCDS score and rationale.
- [docs/release-checklist.md](docs/release-checklist.md): release readiness checklist.
- `release/thumbnail-generator-docs.zip`: packaged docs artifact.

## Browser Runtime Gate

Latest local gate:

- URL: `http://127.0.0.1:4173/thumbnail-generator/`
- Browser: Playwright headless Chromium. Browser plugin fallback reason: in-app Browser returned `Browser is not available: iab`.
- Passed: nonblank canvas, primary UI visible, saved edit state, autosave toggle, reload restore, multi-select angle matching, generated CSV evidence, CSV import, HTML import, inspector layer editing, WebP export download, desktop viewport, mobile viewport, and mobile no-overflow check.
- Latest work-item screenshots:
  - `docs/assets/runtime-edit-state-rotation-desktop.png`
  - `docs/assets/runtime-edit-state-rotation-mobile.png`

Latest remote deploy:

- GitHub Pages workflow: pass.
- Published URL returned HTTP 200.
