# 縦書き文字の選択範囲を表示領域に合わせる

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

縦書き文字機能で、縦書き表示に切り替えても選択対象範囲が横書き時の領域のままになっている。縦書きの実際の表示領域に合わせて選択範囲を再設定し、レイヤー編集時の操作精度と使いやすさを改善する。

## Acceptance Criteria

- [x] 縦書き文字レイヤーを選択したとき、選択範囲が縦書きの表示領域に一致または適切に包含している。
- [x] 横書き文字レイヤーの選択範囲と編集操作に既存挙動の回帰がない。
- [x] 文字数、改行、フォントサイズ、配置を変更した後も縦書きの選択範囲が再計算される。

## Completion Evidence

縦書き text レイヤー用の可視ローカル境界を追加し、選択枠、ハンドル位置、ヒットテスト、編集用 preview padding で同じ境界を使うようにした。横書き text と image/shape は従来どおり設定された layer bounds を使う。

- `npm test`: pass (22 files, 70 tests), including `layerVisualBounds`, `canvasInteraction`, `hitTest`, and `previewPadding` coverage.
- `npm run build`: pass.
- Runtime gate: Vertical writing mode selection and Blur stroke toggle were exercised without console or page errors.
- Evidence screenshots: `docs/assets/runtime-all-work-items-20260607-desktop.png`, `docs/assets/runtime-all-work-items-20260607-mobile.png`.

## Notes

-

## Codex Sessions

- 2026-06-07T06:26:48.409Z `codex-session-20260607062648-8kuikq` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=high; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T062648Z.md)
