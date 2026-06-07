# 縁ぼかし表示が反映されない

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

縁ぼかし機能で、スライダー操作や「輪郭をぼかす」のON/OFF切り替えを行ってもプレビュー表示が変化しない。GUI指定の type/phase を尊重しつつ、表示反映の不具合として動作確認と修正が必要。

## Acceptance Criteria

- [x] 縁ぼかしスライダーを変更するとプレビュー上の輪郭ぼかし量が視覚的に変化する
- [x] 「輪郭をぼかす」のON/OFF切り替えで縁ぼかしの適用有無がプレビューに反映される
- [x] 縁ぼかし設定の変更後も画像書き出し結果にプレビューと同等の効果が反映される

## Notes

- Closed 2026-06-07. Replaced the shadow-only edge blur path with offscreen outer blur and inner feathered-alpha rendering for preview and export.
- Evidence: Playwright runtime gate changed canvas hash from `3202979441` to `1322676249` after setting edge blur to `28` and enabling Blur stroke; WebP export completed.

## Codex Sessions

- 2026-06-07T07:43:08.082Z `codex-session-20260607074308-ggvvmp` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=high; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T074308Z.md)
