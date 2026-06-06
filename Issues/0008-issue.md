# 複数選択時の相対位置・回転編集

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-06
- Closed: 2026-06-06
- QCDS: Quality, Satisfaction

## Context

サムネイル編集画面で複数レイヤーを選択している状態でも、位置と回転を編集できるようにする。編集値は絶対値で上書きするのではなく、各レイヤーの現在位置や角度を基準にした相対移動・相対回転として適用する。

## Acceptance Criteria

- [x] 複数選択状態でも位置編集 UI または操作から選択中レイヤー全体を移動できる
- [x] 複数選択状態での位置変更は各レイヤーの現在位置を基準に同じ差分として適用される
- [x] 複数選択状態でも回転編集 UI または操作から選択中レイヤー全体を回転できる
- [x] 複数選択状態での回転変更は各レイヤーの現在角度を基準に同じ差分として適用される
- [x] 単一選択時の既存の位置・回転編集挙動が維持される

## Implementation Notes

- 複数選択時の Adjust タブに Relative edit を追加した。
- Move X / Move Y は全選択レイヤーへ同一の座標差分を適用し、Rotation delta は各レイヤーの現在角度へ同一差分を加算する。
- `src/lib/layerTransform.ts` に相対変換ヘルパーを追加し、ロック中レイヤーを変更しないこともテストした。

## Evidence

- `npm test`: pass. 17 test files, 44 tests.
- `npm run build`: pass.
- Runtime gate: `Main title` と `Subtitle` に Move `12,-8` と Rotation `+15` を適用し、生成CSVで `Main title,90,74,...,12` と `Subtitle,103,524,...,13` を確認した。

## Notes

- Closed in the P2 work-items pass.

## Codex Sessions

- 2026-06-06T14:46:42.466Z `codex-session-20260606144642-2av7le` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260606T144642Z.md)
