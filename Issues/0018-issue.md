# 編集状態の保存と自動保存切り替えを追加

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

作業中のレイアウト、画像、レイヤー設定が失われないように、編集状態の保存と自動保存 ON/OFF を追加する。

## Acceptance Criteria

- [x] 編集状態を保存する操作と保存処理が実装されている。
- [x] 保存済みの編集状態を再読み込み後に復元できる。
- [x] 自動保存の ON/OFF を切り替える UI がある。
- [x] 自動保存 ON 時は編集後に状態が保存される。
- [x] 自動保存 OFF 時はユーザー操作なしに保存しない。

## Evidence

- Templates タブに Edit state セクション、Save state、Restore state、Autosave current edit state を追加。
- Runtime gate: autosave ON 後に `New text` レイヤー追加が localStorage に保存され、reload 後に復元された。
- `npm test`: pass, 19 files / 51 tests.
- `npm run build`: pass.
