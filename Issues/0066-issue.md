# 配信者向けサムネ機能拡充

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-07
- Closed: 2026-06-08
- QCDS: Quality, Cost, Delivery, Satisfaction

## Context

配信者・動画制作者が日本の配信文脈に合ったサムネイルを効率よく作成、検証、書き出しできるようにする。ブランドキット、可読性チェック、安全エリアガイド、A/B比較の前提、配信用テンプレート、ルールベースの警告、素材置換スロット、一括書き出し導線を既存の静的WebAppワークフローとブラウザ内エクスポートに収める。

## Acceptance Criteria

- [x] チャンネルロゴ、フォント、配信者カラー、縁取り/影プリセットを保存し、テンプレートまたは選択中レイヤーへワンクリック適用できる。
- [x] スマホ縮小プレビュー、文字量、コントラスト、縁取り不足、顔・重要要素の隠れ、安全エリア違反を検知し、編集画面で警告表示できる。
- [x] 日本の配信文脈向けテンプレートと素材置換スロットを追加し、顔写真・ゲーム画面・ロゴ画像を投入すると自動フィットされる。
- [x] 同一素材から色違い、文言違い、構図違いのA/Bバリエーションを複製し、並べて比較できる。
- [x] YouTube 16:9、Shorts用縦長、X告知用正方形など複数形式を一括書き出しで扱える。

## Notes

- Added a browser-local Brand kit with channel name, brand font, primary/accent/shadow colors, optional logo asset, capture/apply actions, and template category coverage for stream/shorts/youtube/cutout starts.
- Added rule-based quality warnings for text length, low contrast, hidden important layers, edge/safe-area proximity, large assets, many layers, large export sizes, and large storage estimates.
- Existing duplicate/copy, preset, and multi-format export controls satisfy the A/B and format handling criteria.
- Validation: `npm test` passed with 24 files / 78 tests; `npm run build` passed; Playwright runtime gate passed at `http://127.0.0.1:4188/thumbnail-generator/`.

## Codex Sessions

- 2026-06-07T15:58:35.069Z `codex-session-20260607155835-2m0uls` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=medium.
