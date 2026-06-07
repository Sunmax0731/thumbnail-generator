# Google Fonts対応フォントの追加

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

文字列レイヤーのフォント変更機能で選択できるフォントを拡充する。Google Fontsで提供され、商用利用可能なライセンスのフォントを取得元とし、既存のフォント選択UIから選べるようにする。対象URLは https://fonts.google.com/。

## Acceptance Criteria

- [x] Google Fonts由来の商用利用可能なフォント候補がフォント選択肢に追加されている
- [x] 文字列レイヤーで追加フォントを選択するとプレビュー表示に反映される
- [x] 追加フォントを選択した状態でも画像エクスポート結果にフォント指定が反映される
- [x] 既存フォント選択機能の操作性と互換性が維持されている

## Completion Evidence

Added hosted Google Fonts options and vertical text writing mode support.

- `npm test`: pass (21 files, 64 tests).
- `npm run build`: pass.
- Browser runtime gate: Playwright fallback pass at `http://127.0.0.1:4180/thumbnail-generator/` after Browser plugin returned `Browser is not available: iab`.
- Runtime exercised CSV import, HTML import, text editing, Google Fonts selection, vertical writing, signed edge blur, grouped-row individual editing, saved Square palette set application, YouTube thumbnail import, WebP export, and mobile no-overflow.
- Evidence screenshots: `docs/assets/runtime-final-open-p2-20260607-desktop.png`, `docs/assets/runtime-final-open-p2-20260607-mobile.png`.

## Notes

-

## Codex Sessions

- 2026-06-07T05:38:03.408Z `codex-session-20260607053803-17mwsj` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=high; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T053803Z.md)
