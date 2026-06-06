# 回転ハンドルの操作性改善

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

プレビュー画面の回転用ハンドルが、ドラッグで回転できる操作部であることをユーザーが直感的に理解しにくい。既存のプレビュー編集体験を保ちながら、回転可能であることが視覚状態やカーソルなどから伝わるようにする。

## Acceptance Criteria

- [x] プレビュー画面の回転ハンドルが通常時・ホバー時・ドラッグ中の状態で回転操作部として判別できる。
- [x] 回転ハンドル上のカーソルや表示が、ドラッグで回転できることを示している。
- [x] ハンドルのドラッグで選択中レイヤーを回転でき、既存の移動・リサイズ操作と競合しない。
- [x] レイヤー編集と画像エクスポートの既存フローに回帰がないことを確認できる。

## Implementation Notes

- 回転ハンドルを白地リング、ホバー/ドラッグ時のコーラル強調、回転矢印マークで描画するようにした。
- 回転ハンドル上のカーソルは `grab`、ドラッグ中は `grabbing` になる。
- 既存のリサイズハンドル優先、重なり順選択、移動操作は維持した。

## Evidence

- `npm test`: pass. 17 test files, 44 tests.
- `npm run build`: pass.
- Runtime gate: 回転ハンドル上で cursor `grab` を確認し、ドラッグ後に `Rotate complete.` の状態更新とWebP exportを確認した。

## Notes

- Closed in the P2 work-items pass.

## Codex Sessions

- 2026-06-06T14:46:42.466Z `codex-session-20260606144642-2av7le` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260606T144642Z.md)
