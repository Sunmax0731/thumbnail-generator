# Thumbnail Generator

Static browser app for creating video thumbnails for YouTube, NicoNico, Twitch, and similar platforms.

The app lets creators compose thumbnail layouts from imported images, CSV rows, or HTML-like layout markup, then export the rendered result as PNG, JPEG, or WebP at a selected resolution and aspect ratio. It is designed for GitHub Pages and does not require a backend.

## Current MVP

- Canvas-based thumbnail preview and export.
- Image import with position, size, rotation, opacity, and effects.
- Text layers with font size, font family, color, rotation, and outline stroke.
- Shape layers with fill/stroke, size, and rotation.
- CSV layout importer.
- HTML layout importer using `data-layer` attributes.
- Resolution presets for common video platforms and custom output size.
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
- [docs/qcds-evaluation.md](docs/qcds-evaluation.md): QCDS score and rationale.
- [docs/release-checklist.md](docs/release-checklist.md): release readiness checklist.
- `release/thumbnail-generator-docs.zip`: packaged docs artifact.

## Browser Runtime Gate

Latest local gate:

- URL: `http://127.0.0.1:4173/thumbnail-generator/`
- Browser: Playwright headless Chromium. Browser plugin fallback reason: in-app Browser returned `Browser is not available: iab`.
- Passed: nonblank canvas, primary UI visible, CSV import, HTML import, inspector edit, image import, WebP export download, desktop viewport, mobile viewport, and mobile canvas viewport.

Latest remote deploy:

- GitHub Pages workflow: pass.
- Published URL returned HTTP 200.
