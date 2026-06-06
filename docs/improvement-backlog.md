# Improvement Backlog

The P2 work-item backlog is closed. These follow-up candidates are taskized for later planning and are not required for the current release gate.

## P3 Cross-Browser Verification

- Goal: verify the static app in Firefox, Edge, and Safari where available.
- QCDS: Quality, Satisfaction
- Acceptance:
  - CSV import, HTML import, layer editing, edit-state restore, and WebP or supported export path are manually checked in each target browser.
  - Any browser-specific limitation is documented with reproduction steps.

## P3 Real-Device Mobile Editing

- Goal: verify touch interactions on at least one physical phone or tablet.
- QCDS: Quality, Satisfaction
- Acceptance:
  - Canvas selection, drag move, Image Lab drag cutout, tabs, and export controls are usable without horizontal overflow.
  - Findings include device, OS, browser, and viewport notes.

## P4 Storage Quota Guardrail

- Goal: warn users before saving very large browser-local assets.
- QCDS: Quality, Cost, Satisfaction
- Acceptance:
  - Custom font import, edit-state save, template save, and autosave estimate payload size before writing localStorage.
  - UI shows a clear warning when a write is likely to exceed quota.
  - Existing smaller saves remain one-click.

## P4 Saved State Management

- Goal: let users clear the saved edit state intentionally.
- QCDS: Satisfaction
- Acceptance:
  - Edit state section has a clear saved state action with confirmation.
  - Clearing saved state does not remove named templates, colors, or custom fonts.
  - Reload after clearing starts from the sample state.
