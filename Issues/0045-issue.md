# グループ内オブジェクトの個別選択と編集

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

Layersのグループ機能で、グループ内の各オブジェクトのパラメータを個別に変更できるようにする。グループ選択中でもLayersのGUIから内部オブジェクトを選択でき、個別選択中は調整タブで対象オブジェクトを編集できる必要がある。

## Acceptance Criteria

- [x] グループ選択中に、LayersのGUIでグループ内の個別オブジェクトを選択できる。
- [x] 個別オブジェクト選択中に、調整タブで対象オブジェクトのパラメータを編集できる。
- [x] 編集内容がキャンバス表示、レイヤー状態、エクスポート結果に反映される。
- [x] グループ全体選択とグループ内個別選択の状態がGUI上で区別できる。
- [x] 既存のグループ単位の選択・編集操作が壊れていない。

## Completion Evidence

Implemented grouped-row individual selection for single-layer Adjust editing without ungrouping.

- `npm test`: pass (21 files, 64 tests).
- `npm run build`: pass.
- Browser runtime gate: Playwright fallback pass at `http://127.0.0.1:4180/thumbnail-generator/` after Browser plugin returned `Browser is not available: iab`.
- Runtime exercised CSV import, HTML import, text editing, Google Fonts selection, vertical writing, signed edge blur, grouped-row individual editing, saved Square palette set application, YouTube thumbnail import, WebP export, and mobile no-overflow.
- Evidence screenshots: `docs/assets/runtime-final-open-p2-20260607-desktop.png`, `docs/assets/runtime-final-open-p2-20260607-mobile.png`.

## Notes

-

## Codex Sessions

- 2026-06-07T05:38:03.408Z `codex-session-20260607053803-17mwsj` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=high; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T053803Z.md)
