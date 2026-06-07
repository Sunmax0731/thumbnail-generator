# Adjustタブに回転・不透明度リセットを追加

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- Closed: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

Adjust タブで回転と不透明度を個別にデフォルト値へ戻せるようにする。デフォルト値は回転 0 度、不透明度 100% とする。

## Acceptance Criteria

- [x] Adjust タブに回転を 0 度へ戻すリセットボタンが追加されている。
- [x] Adjust タブに不透明度を 100% へ戻すリセットボタンが追加されている。
- [x] 各リセットボタンを押すと対象レイヤーの値が即座にデフォルト値へ戻る。
- [x] リセット後の表示と内部状態が一致し、エクスポート結果にも反映される。

## Resolution

- Adjust の rotation と opacity slider/number 入力の横に reset button を追加した。
- Reset rotation は `rotation: 0`、Reset opacity は `opacity: 1` を selected layer に適用する。

## Evidence

- `npm test`: pass, 20 files, 53 tests.
- `npm run build`: pass.
- Browser runtime gate: Reset rotation and Reset opacity controls pass.
- Screenshots: `docs/assets/runtime-backlog-20260607-desktop.png`, `docs/assets/runtime-backlog-20260607-mobile.png`.

## Notes

- Follow-up issue is not required.
