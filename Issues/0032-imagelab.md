# ImageLab範囲編集とドラッグ削除

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Cost, Satisfaction

## Context

ImageLab機能で、一度選択した範囲を画像上のハンドルから再編集できるようにする。四角、円、自由選択のすべてで有効にする。既存のドラッグ機能は四角範囲選択と操作が重複しているため削除し、編集操作の混乱を減らす。

## Acceptance Criteria

- [x] 四角範囲選択後、画像上のハンドル操作で選択範囲の位置またはサイズを変更できる。
- [x] 円範囲選択後、画像上のハンドル操作で選択範囲の位置またはサイズを変更できる。
- [x] 自由選択後、画像上のハンドル操作で選択範囲を再編集できる。
- [x] 既存のドラッグ機能がUIおよび操作フローから削除され、四角範囲選択と重複しない。
- [x] 範囲編集後の状態がImageLabのプレビューおよび後続処理に正しく反映される。

## Notes

- Removed the separate Drag mode from Image Lab.
- Rect and Circle selections can be moved or resized through preview handles; Polygon points can be dragged and Alt-clicked for deletion.
- Verified Rect handle editing and processed layer creation in the Playwright runtime gate.

## Codex Sessions

- 2026-06-07T03:44:53.818Z `codex-session-20260607034453-q1nvj5` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T034453Z.md)
