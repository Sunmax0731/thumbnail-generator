# 複数選択の移動・回転をリアルタイム反映

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-06
- Closed: 2026-06-07
- QCDS: Quality, Cost, Satisfaction

## Context

複数選択状態での移動・回転操作を、適用ボタンで確定する方式ではなく、操作中にリアルタイムで反映される方式へ変更する。レイヤー編集の手数を減らし、複数要素の調整結果を即座に確認できるようにする。

## Acceptance Criteria

- [x] 複数選択中に移動値を変更すると、選択中の全レイヤーへ即時に移動が反映される
- [x] 複数選択中に回転値を変更すると、選択中の全レイヤーへ即時に回転が反映される
- [x] 適用ボタンを押さなくてもキャンバスまたはプレビュー表示が更新される
- [x] 単一選択時および未選択時の既存の移動・回転操作が壊れていない

## Notes

- Duplicate work contract with `Issues/0013-issue.md`; both are closed by the same implementation.
- `src/components/InspectorPanel.tsx` now applies relative movement and rotation from slider/number changes immediately, without Apply buttons.
- `src/lib/liveRelativeTransform.ts` tracks incremental deltas so changing a live control from `12` to `5` applies `-7`, not a second absolute move.
- Runtime gate generated CSV showed `Main title` at `90,74` with rotation `12` and `Subtitle` at `103,524` with rotation `13` after live Move `12,-8` and Rotation `+15`.

## Codex Sessions

- 2026-06-06T15:17:05.403Z `codex-session-20260606151705-598rxz` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260606T151705Z.md)
