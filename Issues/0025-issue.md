# デフォルトテンプレートの拡充

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

ブラウザ上でサムネイルを作成する際、用途に近い初期レイアウトを選べるように、複数のデフォルトテンプレートを追加する。

## Acceptance Criteria

- [x] 主要な利用シーンを複数検討し、追加するテンプレート一覧と用途が整理されている。
- [x] ユースケースに沿った名前のデフォルトテンプレートが追加されている。
- [x] 追加テンプレートが既存のテンプレート選択 UI から利用できる。
- [x] 各テンプレートでレイヤー構成、文字、画像素材などの初期値が用途に合っている。
- [x] 既存テンプレートの動作や読み込みに回帰がない。

## Resolution

- `src/lib/defaultTemplates.ts` を追加し、Creator Live, Product Review, Tutorial Steps, Shorts Quote の 4 件を提供した。
- Templates タブに bundled default templates の一覧を追加し、読み込み時に settings/layers/CSV/HTML/template name を同期するよう実装した。
- `src/lib/defaultTemplates.test.ts` でテンプレート数、用途 ID、CSV/HTML 出力可能性を検証した。

## Evidence

- `npm test`: pass, 20 files, 53 tests.
- `npm run build`: pass.
- Browser runtime gate: Product Review default template load pass.
- Screenshots: `docs/assets/runtime-backlog-20260607-desktop.png`, `docs/assets/runtime-backlog-20260607-mobile.png`.

## Notes

- Follow-up issue is not required.
