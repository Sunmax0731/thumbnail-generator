# 文字列を設定範囲いっぱいに表示する機能追加

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-06
- Closed: 2026-06-06
- QCDS: Quality, Satisfaction

## Context

サムネイル編集時の文字列レイヤーについて、指定された設定範囲内を最大限使って表示できる機能を追加する。既存 GUI から利用できるように、ユーザーがボタン操作でこの表示調整にアクセスできる必要がある。

## Acceptance Criteria

- [x] 文字列レイヤーに対して、設定範囲いっぱいに収まる表示調整機能を実行できる。
- [x] 機能へアクセスするためのボタンが既存 UI 上に追加されている。
- [x] ボタン操作後、文字列が設定範囲内からはみ出さず、可能な限り大きく表示される。
- [x] 既存の文字列編集やレイヤー編集の挙動が壊れていないことを確認できる。

## Implementation Notes

- Text レイヤー選択時の Adjust タブに Fit text to box ボタンを追加した。
- `src/lib/textFit.ts` でテキスト幅・行高・ストロークを考慮して最大フォントサイズを二分探索する。

## Evidence

- `npm test`: pass. 17 test files, 44 tests.
- `npm run build`: pass.
- Runtime gate: `Main title` の Font size が `104` から `142` へ拡大し、ボックス内に収まることを確認した。

## Notes

- Closed in the P2 work-items pass.

## Codex Sessions

- 2026-06-06T14:46:42.466Z `codex-session-20260606144642-2av7le` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260606T144642Z.md)
