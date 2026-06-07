# Colorsのカラーパレット作成UI改善

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-07
- Closed: 2026-06-07
- QCDS: Quality, Satisfaction
- Tasks: `TODO.md`

## Context

Colors の登録 UI は一覧型 swatch editor としては機能していたが、透明度や group を含む palette 作成の視認性が弱かった。既存の swatch list 操作を残しつつ、色パターンを視覚的に作成できる palette maker を追加する。

## Acceptance Criteria

- [x] 透明度編集 UI が見やすくなり、入力欄やラベルが狭い列で重なりにくい。
- [x] グラフィカルに色パターンを作成できる palette maker が利用できる。
- [x] 生成した color palette は既存の登録色一覧とは別に、group block としてまとまって表示される。
- [x] 既存の list 型 Colors 操作、登録、更新、削除、個別適用は引き続き利用できる。

## Verification

- Runtime gate verified `Palette maker`, generated a `QA palette` triad, and confirmed the generated group block displayed at least 3 swatches together.
- `npm test`: pass. 20 files, 59 tests.
- `npm run build`: pass.
- Evidence: `docs/assets/runtime-final-p2-20260607-desktop.png`, `docs/assets/runtime-final-p2-20260607-mobile.png`.

## Notes

- Harmony generation now includes the base color in the generated group and assigns a fallback group name when the group field is empty.
