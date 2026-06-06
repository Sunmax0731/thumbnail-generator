# Design

## Concept Source

Primary UI concept: `docs/assets/ui-concept.png`

The concept uses a functional editor as the first screen:

- Left input rail for image, CSV, HTML, and template operations.
- Center canvas workbench with thumbnail preview.
- Top toolbar for output size and export format.
- Right inspector for layer order and selected layer properties.
- Bottom status row for validation, zoom, and export state.
- Image Lab opens as a modal workspace from the left rail for precise image cutout work.

## Information Architecture Refresh

The editor keeps the established three-column structure, but dense controls are grouped into task tabs:

- Left rail: Assets, Layouts, and Templates.
- Right rail: Layers, Adjust, and Colors.
- Image Lab modal: Image source and chroma key stay in the side column; cutout mode, preview, and crop sliders stay in the main workspace.

This keeps the first viewport focused on the current editing task while retaining one-click access to layout text, template storage, layer ordering, layer adjustment, and color registration.

## UI Principles

- Build the actual editor, not a landing page.
- Keep panels compact and readable for repeated production use.
- Use white panels on a light gray workbench with high-contrast text.
- Use cyan and coral accents sparingly for selected state and export actions.
- Keep border radii at 8px or less.
- Avoid nested cards and decorative backgrounds.
- Keep controls stable across desktop and mobile.

## Implementation Tokens

- Background: `#edf2f6`
- Panel: `#ffffff`
- Workbench: `#dfe7ee`
- Text: `#152033`
- Muted text: `#647286`
- Accent: `#10b6d7`
- Export/action: `#ff4f5f`
- Warning/highlight: `#ffd166`
- Borders: `#d8e0e7`
- Radius: 6px controls, 8px panels/canvas
- Typography: system sans for app chrome; user-selected canvas fonts for thumbnail text

## Responsive Behavior

- Desktop: three-column editor with canvas centered.
- Tablet/mobile: stack tools above the canvas and inspector below it.
- Image Lab modal uses a two-column workspace on desktop and a single-column workspace on mobile.
- Left and right task tabs remain visible at the top of their panels and collapse without horizontal overflow on mobile.
- Canvas preserves aspect ratio and never overlaps controls.
- Text and controls must not overflow their containers.

## Concept Fidelity Ledger

- Copy: implemented app name, CSV/HTML layout controls, layer list, inspector, resolution controls, and export controls. The generated concept included Japanese sample thumbnail text; implementation uses English sample copy for UTF-8-safe docs/code and browser verification.
- Layout: implemented the same left input rail, center canvas, right layer/inspector, top export toolbar, and bottom status structure, with task tabs added to reduce always-visible control density.
- Palette: implemented white panels, light gray workbench, cyan selected states, and coral export/action accents.
- Container model: implemented compact tool panels with 8px or smaller radii and no marketing hero page.
- Interaction: concept showed editor controls; implementation adds working CSV/HTML import, file import, layer edits, canvas selection, Image Lab modal processing, and PNG/JPEG/WebP export.
