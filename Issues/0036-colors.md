# Colors登録色の選択編集機能を追加

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

Colors機能で、登録済みの色をユーザーが選択し、その内容を編集できるようにする。既存GUI指定に従い、実装フェーズの機能追加として扱う。

## Acceptance Criteria

- [x] Colors機能で登録済みの色一覧から対象色を選択できる
- [x] 選択した登録色の値や名称など編集対象項目を変更できる
- [x] 編集内容が既存の色管理データに反映され、再表示後も維持される
- [x] 未選択時や無効な編集値に対してUI上で破綻しない

## Notes

- Registered swatches can be selected into the draft editor and updated in place.
- Palette edit data now persists name, value, target, opacity, and group name.
- Verified by color palette unit tests and the Playwright runtime gate.

## Codex Sessions

- 2026-06-07T03:44:53.818Z `codex-session-20260607034453-q1nvj5` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T034453Z.md)
