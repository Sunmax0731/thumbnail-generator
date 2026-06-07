# 影響しない編集項目のグレーアウト制御

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-07
- Closed: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

現在の選択レイヤーや状態に影響しない編集項目が操作可能に見えると、ユーザーが無効な設定を変更できるように誤認する。該当しない項目はグレーアウトして編集不可にする。

## Acceptance Criteria

- [x] 文字列が単一行のときの行高など、表示結果に影響しない項目がグレーアウト表示になる。
- [x] グレーアウトされた項目はクリック、入力、キーボード操作で編集できない。
- [x] 複数行など項目が有効になる条件に戻ると、該当項目が再び編集可能になる。
- [x] 無効化状態が既存のレイヤー編集 UI の見た目と操作感に整合している。

## Resolution

- `SliderNumberInput` と `ColorInput` に disabled 状態を追加した。
- 単一行テキストの Line height、線幅 0 の outline/stroke color、画像が 1 件だけの image key 切替、適用対象がない palette application を無効化した。
- Playwright runtime gate で単一行時の Line height disabled と、複数行入力後の enabled 切替を確認した。

## Evidence

- `npm test`: pass, 20 files, 53 tests.
- `npm run build`: pass.
- Browser runtime gate: disabled inert controls pass.
- Screenshots: `docs/assets/runtime-backlog-20260607-desktop.png`, `docs/assets/runtime-backlog-20260607-mobile.png`.

## Notes

- Follow-up issue is not required.
