# Colorsタブでグループとパレットを明確に区別

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

Colorsタブの色管理機能で、グループとパレットの意味が混同されないようにする。グループは2色の線色と塗り色をセットとして扱う機能、パレットは複数の色を参照できる機能として、UI表示・操作・内部表現で明示的に区別する。

## Acceptance Criteria

- [x] Colorsタブ上でグループとパレットが別機能として識別できる表示になっている。
- [x] グループは2色の線色と塗り色のセットとして作成・編集・参照できる。
- [x] パレットは複数色を参照するための機能として作成・編集・参照できる。
- [x] 既存のColorsタブ操作でグループとパレットの名称や説明が混同されない。

## Notes

- Closed 2026-06-07. The UI separates `Color groups: Fill + Stroke`, `Multi-color palettes`, and `Registered single colors` with distinct row actions.
- Evidence: Playwright runtime gate verified group count before delete `1`, after delete `0`, saved palette rows `1`, and registered swatch rows `6`.

## Codex Sessions

- 2026-06-07T07:43:08.082Z `codex-session-20260607074308-ggvvmp` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=high; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T074308Z.md)
