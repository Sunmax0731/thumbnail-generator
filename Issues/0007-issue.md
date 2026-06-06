# プレビュー空白クリックで選択解除

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

プレビュー画面でレイヤーや操作対象ではない場所をクリックしたとき、現在の選択状態が残るとユーザーが選択解除できず操作意図と合わない。クリック対象が選択可能要素ではない場合は、既存の選択を解除する挙動を追加する。

## Acceptance Criteria

- [x] プレビュー画面内の選択可能要素ではない場所をクリックすると、現在選択中のレイヤーや要素が未選択状態になる。
- [x] 選択可能なレイヤーや要素をクリックした場合は、従来どおり対象が選択される。
- [x] 選択解除後、編集パネルや選択ハイライトなどの UI 表示が未選択状態と整合する。

## Implementation Notes

- 初期選択は維持しつつ、ユーザー操作による空選択状態を許可した。
- プレビューの空白クリックで `selectedIds` を空にし、ステージタイトルと Adjust パネルが未選択状態へ同期するようにした。

## Evidence

- `npm test`: pass. 17 test files, 44 tests.
- `npm run build`: pass.
- Runtime gate: blank preview click changed the stage selection label to `None`; selectable layer click still selected the target layer.

## Notes

- Closed in the P2 work-items pass.

## Codex Sessions

- 2026-06-06T14:46:42.466Z `codex-session-20260606144642-2av7le` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260606T144642Z.md)
