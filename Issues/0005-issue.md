# 任意フォント追加機能の実装

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-06
- Closed: 2026-06-06
- QCDS: Quality, Satisfaction

## Context

サムネイル作成時に利用者が任意のフォントを追加して選択できるようにする。現在のフォント値がどのデータソースから生まれるかを整理し、追加したフォントがプレビューと画像エクスポート結果へ反映される必要がある。

## Acceptance Criteria

- [x] 現在のフォント値の参照元が確認され、実装判断に必要な形で整理されている。
- [x] 利用者が任意のフォントを追加でき、追加したフォントをレイヤーのフォント選択で使用できる。
- [x] 追加フォントを使用した状態でプレビューと画像エクスポートに正しく反映される。
- [x] 未対応形式や読み込み失敗時に利用者が原因を判断できるエラー表示がある。

## Implementation Notes

- 既存フォントは`src/lib/fonts.ts`の定義済みドロップダウン値、CSV/HTML importの`fontFamily`、テンプレート内のレイヤー値から参照される。
- `src/lib/customFonts.ts`を追加し、WOFF2/WOFF/TTF/OTFをdata URLとして読み込み、`thumbnail-generator.customFonts.v1`に保存する。
- FontFace APIで追加フォントを読み込み、テキストレイヤーのフォントドロップダウンに`(custom)`付きで表示する。
- テキストレイヤー選択中にフォントを追加した場合、追加したフォントをそのレイヤーへ即時適用する。
- Export時は`document.fonts.ready`を待ってからCanvasへ描画し、プレビューと画像出力のフォント反映を揃えた。
- 未対応形式やFontFace読み込み失敗はステータスバーに`Font import failed`または`Font load failed`として表示する。

## Evidence

- `npm test`: pass. 13 test files, 35 tests.
- `src/lib/customFonts.test.ts`: 対応形式判定、表示名のサニタイズ、ドロップダウンoption生成、localStorage読み込み、重複排除を確認。
- Runtime gate: pass. `C:/Windows/Fonts/AGENCYB.TTF`を追加し、選択値が`TGFont-...`になり、localStorage保存数`1`、`document.fonts.check(...) === true`を確認。
- Export path: pass. 追加フォント導入後のWebP export downloadを確認。
- Evidence screenshot: `docs/assets/runtime-work-items-font.png`.

## Remaining Work

- None.

## Codex Sessions

- 2026-06-06T14:14:27.298Z `codex-session-20260606141427-sjqjbx` - All Work Items; access=danger-full-access; model=gpt-5.5; intelligence=xhigh.
