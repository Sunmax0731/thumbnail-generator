# Colors機能のグループ設定と配色支援を強化

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Cost, Satisfaction

## Context

サムネイル編集のColors機能を強化し、塗りと線の同時設定、透明度指定、Adobe Colorのカラーホイールに近い配色支援を追加する。参考: https://color.adobe.com/jp/create/color-wheel 。既存GUI指定に従い、優先度はP2、種別はfeature、工程は実装フェーズとする。

## Acceptance Criteria

- [x] 色グループを選択すると、1クリックで対象レイヤーの塗り色と線色を同時に適用できる。
- [x] 塗り色と線色のそれぞれに透明度を設定でき、編集画面とエクスポート結果に反映される。
- [x] 基準色から類似色、補色、分割補色、トライアドの配色候補を生成して選択できる。
- [x] 既存の単色指定フローを壊さず、従来の色編集操作も継続して利用できる。
- [x] Colors機能の主要操作についてUI上で状態が分かり、設定変更後のプレビューが即時更新される。

## Notes

- Added palette group names, palette opacity, group one-click apply, and harmony generation for analogous, complementary, split-complementary, and triad suggestions.
- Added text/shape fill and stroke opacity model fields with canvas/export rendering and CSV/HTML persistence.
- Existing single-color apply remains available from each swatch row.
- Verified by color palette unit tests and the Playwright runtime gate.

## Codex Sessions

- 2026-06-07T03:44:53.818Z `codex-session-20260607034453-q1nvj5` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T034453Z.md)
