# Manual Improvement Plan

This note defines the target shape for a more usable in-app operation manual.

## Goals

- Help first-time users finish one thumbnail without reading every feature page.
- Help repeat users find a specific operation quickly.
- Keep screenshots current with the actual UI and avoid generic illustrations for feature access.
- Separate workflow guidance from detailed reference material.

## Recommended Manual Structure

1. Quick start
   - Pick a template.
   - Replace text and images.
   - Adjust position, size, and color.
   - Check preview and export.

2. Workflow guides
   - Create a standard thumbnail.
   - Create a vertical thumbnail.
   - Create a schedule layout.
   - Import and process images with Image Lab.
   - Add animation and check OBS preview.
   - Back up and restore work.

3. Feature reference
   - Templates.
   - Layers and canvas object list.
   - Assets.
   - Adjust.
   - Colors.
   - Animation.
   - Timeline.
   - Preview.
   - Output and OBS preview.
   - Edit state and settings.

4. Shortcut and mouse operation reference
   - Keyboard shortcuts grouped by intent: delete, copy, paste, duplicate, undo, redo.
   - Mouse operations grouped by surface: canvas selection, object transform, preview pan/zoom, timeline edits, Image Lab edits.

5. Troubleshooting
   - Export does not look as expected.
   - A selected object cannot be edited.
   - Imported images or fonts are too large.
   - Browser storage is full.
   - OBS capture still shows browser chrome.

## Per-Topic Page Template

Each topic should use the same small structure:

- What it is for.
- Where to open it.
- Before you start.
- Step-by-step operation.
- What success looks like.
- Common mistakes or limits.
- Related features.

## Visual Rules

- Use real UI captures for feature access and operation context.
- Use cropped captures rather than full-window screenshots unless the full layout matters.
- Add callouts only when they point to a specific button, tab, or control.
- Use SVG only for abstract operations such as keyboard shortcuts, mouse gestures, and drag direction.
- Keep every image clickable for a larger view.

## Implementation Notes

- Keep the Overview tab short and task-oriented.
- Move long parameter explanations into feature reference pages.
- Prefer one direct workflow per page over broad feature lists.
- Add a simple search/filter field before adding more categories.
- Treat screenshots as versioned manual assets and refresh them when visible UI labels or layout change.
