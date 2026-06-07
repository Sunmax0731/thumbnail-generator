# Layersにグループ機能を追加

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Cost, Satisfaction

## Context

Layers上で複数の項目をまとめて扱えるグループ機能を追加する。グループ選択時は複数選択と同等にグループ内項目を一括選択でき、ユーザーがグループ名を設定できるようにする。あわせて、レイヤー管理の使いやすさと保守性を高める追加機能を検討して実装する。

## Acceptance Criteria

- [x] Layersで複数項目をグループ化できる。
- [x] グループを選択すると、グループ内のすべての項目が複数選択と同等の状態で選択される。
- [x] グループ名を設定・変更でき、Layers上に反映される。
- [x] グループ解除、折りたたみ表示、グループ単位の移動など有用な追加機能を検討し、実装した内容を確認できる。
- [x] 既存のレイヤー編集、CSV/HTML import、export 動作がグループ機能追加後も破綻しない。

## Notes

- Added group id/name fields to layers with CSV/HTML import/export persistence.
- Implemented group creation, rename, ungroup, group pill display, and group selection as multi-selection.
- Folded display was considered but not implemented for this scope because group selection, rename, ungroup, and existing multi-layer movement cover the high-value workflow without changing layer ordering semantics.
- Verified group creation and row display in the Playwright runtime gate.

## Codex Sessions

- 2026-06-07T03:44:53.818Z `codex-session-20260607034453-q1nvj5` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T034453Z.md)
