# 複数選択時の角度合わせ機能

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-06
- Closed: 2026-06-07
- QCDS: Quality, Cost, Satisfaction
- Tasks:
  - [TODO.md](../TODO.md)

## Context

複数選択時に、選択した一方の項目の角度を基準として、他の選択項目の角度を簡単に揃えられるようにする。

## Acceptance Criteria

- [x] 複数選択で 2 つ以上の編集可能レイヤーが選ばれている場合、Adjust タブから角度合わせを実行できる。
- [x] 角度合わせを実行すると、最初に選択した編集可能レイヤーの角度が基準になり、他の選択レイヤーの角度が同じ値になる。
- [x] 対象が不足している場合は操作できない、または分かりやすく無効になる。
- [x] 既存の単体編集、相対移動、相対回転には影響しない。

## Evidence

- Added `matchSelectedLayerRotation` and unit coverage.
- Runtime gate: `Main title` and `Subtitle` were selected, Match angle to first selected was run, and generated CSV showed both rotations as `-3`.
- `npm test`: pass, 19 files / 51 tests.
- `npm run build`: pass.
