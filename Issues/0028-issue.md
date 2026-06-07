# 左ペインのクイック追加拡充

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- Closed: 2026-06-07
- QCDS: Cost, Satisfaction

## Context

左ペインのクイック追加機能を拡充し、サムネイル作成時によく使う要素や操作を少ない手順で追加できるようにする。

## Acceptance Criteria

- [x] 左ペインから追加できるクイック追加項目が拡充されている。
- [x] 追加した項目がキャンバスまたは編集対象へ正しく反映される。
- [x] 既存のクイック追加操作が退行せず利用できる。
- [x] 主要な追加パターンを手動または自動テストで確認できる。

## Resolution

- Assets の Quick layers に Headline, Subtitle, Badge, Divider を追加した。
- asset row から選択画像を image layer として追加できるようにした。
- 既存の Text/Shape 追加は維持した。

## Evidence

- `npm test`: pass, 20 files, 53 tests.
- `npm run build`: pass.
- Browser runtime gate: Headline, Badge, selected image layer addition pass.
- Screenshots: `docs/assets/runtime-backlog-20260607-desktop.png`, `docs/assets/runtime-backlog-20260607-mobile.png`.

## Notes

- Follow-up issue is not required.
