# Layer項目に線・ぼかし・縁ぼかし・角丸を追加

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

サムネイル作成時の表現力を高めるため、Layersに追加できる項目と既存項目の編集オプションを拡張する。線レイヤー、ぼかし加工、縁ぼかし、角丸設定を追加し、既存の図形編集やレイヤー編集の操作感と整合させる。

## Acceptance Criteria

- [x] LayersでLine項目を追加でき、実線・点線・波線などの線種を選択して編集できる。
- [x] ぼかし加工レイヤーを追加でき、ぼかし範囲を図形と同様の形状指定で設定できる。
- [x] 各レイヤー項目で縁をぼかす設定を有効化し、ぼかし量を編集できる。
- [x] 各レイヤー項目で角丸設定を有効化し、R値を指定して表示とエクスポートに反映できる。
- [x] 追加した設定がレイヤー編集画面、プレビュー、画像エクスポート結果で一貫して反映される。

## Notes

- Implemented shape line layers with solid, dotted, dashed, and wave line styles.
- Added layer blur, edge blur, and corner radius model fields with CSV/HTML import/export and canvas/export rendering.
- Verified by `npm test`, `npm run build`, and Playwright runtime gate screenshots `docs/assets/runtime-open-work-items-20260607-desktop.png` and `docs/assets/runtime-open-work-items-20260607-mobile.png`.

## Codex Sessions

- 2026-06-07T03:44:53.818Z `codex-session-20260607034453-q1nvj5` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T034453Z.md)
