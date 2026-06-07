# 縁ぼかしの方向制御と文字対応

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

縁ぼかし機能の挙動を、値の符号で内側・外側を制御できる形に修正する。現状は線なしでは外側のみ、線ありでは内側と外側の両方にぼかしが発生しており、輪郭自体もぼけず影のように見える。図形だけでなく文字の輪郭にも同等のぼかし表現を追加する。

## Acceptance Criteria

- [x] 縁ぼかしのデフォルト値が0になり、0では不要な縁ぼかしが発生しない。
- [x] 縁ぼかし値がマイナスの場合は内側、プラスの場合は外側にぼかしが発生し、線の有無で方向が変わらない。
- [x] 輪郭をぼかすかどうかをON/OFFで切り替えられ、OFF時は輪郭が不自然な影のように表示されない。
- [x] 文字レイヤーでも輪郭ぼかしを設定でき、プレビューとエクスポート結果に反映される。

## Completion Evidence

Implemented signed inner/outer edge blur, Blur stroke toggle, and text-layer edge blur rendering/export.

- `npm test`: pass (21 files, 64 tests).
- `npm run build`: pass.
- Browser runtime gate: Playwright fallback pass at `http://127.0.0.1:4180/thumbnail-generator/` after Browser plugin returned `Browser is not available: iab`.
- Runtime exercised CSV import, HTML import, text editing, Google Fonts selection, vertical writing, signed edge blur, grouped-row individual editing, saved Square palette set application, YouTube thumbnail import, WebP export, and mobile no-overflow.
- Evidence screenshots: `docs/assets/runtime-final-open-p2-20260607-desktop.png`, `docs/assets/runtime-final-open-p2-20260607-mobile.png`.

## Notes

-

## Codex Sessions

- 2026-06-07T05:38:03.408Z `codex-session-20260607053803-17mwsj` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=high; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T053803Z.md)
