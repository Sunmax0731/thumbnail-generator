# 現在の編集状態を保存する機能を追加してください。

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-06
- Closed: 2026-06-07
- QCDS: Satisfaction
- Tasks:
  - [TODO.md](../TODO.md)

## Context

現在のサムネイル編集状態を、名前付きテンプレートとは別の作業中スナップショットとして保存できるようにする。

## Acceptance Criteria

- [x] 現在の編集状態を手動保存できる。
- [x] 保存済み編集状態をブラウザ再読み込み後に復元できる。
- [x] 保存状態は出力設定、レイヤー、画像素材、CSV/HTML テキスト、テンプレート名ドラフトを含む。
- [x] 仕様、使い方、テスト、QCDS 証跡が更新されている。

## Evidence

- Implemented `thumbnail-generator.editState.v1` localStorage snapshot.
- `npm test`: pass, 19 files / 51 tests.
- `npm run build`: pass.
- Runtime gate: Save state wrote localStorage and reload restored the saved layer list.
