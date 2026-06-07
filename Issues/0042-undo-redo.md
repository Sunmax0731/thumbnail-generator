# 移動操作のUNDO/REDO履歴を確定位置のみ記録する

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- Closed: 2026-06-07
- QCDS: Quality, Satisfaction
- Tasks: `TODO.md`

## Context

Canvas drag move 中の pointermove ごとに layer history が記録されると、Ctrl+Z が移動途中の中間座標へ戻ってしまう。drag 開始前と pointerup 後の確定位置のみを 1 つの undo/redo 単位として扱う。

## Acceptance Criteria

- [x] Layer/element drag move は、drag 開始前の位置と drag 完了後の位置だけを history に記録する。
- [x] Ctrl+Z を 1 回実行すると、移動途中の中間座標ではなく drag 開始前の位置へ戻る。
- [x] Ctrl+Y を 1 回実行すると、drag 完了後の確定位置へ戻る。
- [x] 複数回の drag move は、それぞれの確定移動単位で undo/redo できる。

## Verification

- Runtime gate dragged a Badge layer from X `922` to X `1012`.
- Ctrl+Z returned X to `922`; Ctrl+Y restored X to `1012`.
- `npm test`: pass. 20 files, 59 tests.
- `npm run build`: pass.
- Evidence: `docs/assets/runtime-final-p2-20260607-desktop.png`, `docs/assets/runtime-final-p2-20260607-mobile.png`.

## Notes

- Pointermove layer updates are suppressed from automatic history recording; pointerup commits a single history snapshot when the final layer state differs from the drag start state.
