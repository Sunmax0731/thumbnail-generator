# 制作導線セクションの常時表示化

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

テンプレタブ以外の表示に切り替えると制作導線セクションが非表示になり、再度テンプレタブへ戻らないと確認できない。制作フローの参照性と操作性を改善するため、タブ状態に依存せず常時見える領域へ制作導線セクションを配置する。

## Acceptance Criteria

- [x] テンプレタブ以外を表示している状態でも制作導線セクションが確認できる。
- [x] テンプレタブへ戻らなくても制作導線の内容を参照できる。
- [x] 既存のテンプレタブ表示や主要な編集操作を妨げない配置になっている。
- [x] 画面幅が変わっても制作導線セクションと他の主要 UI が重ならない。

## Notes

- Closed on 2026-06-08. Guided start is now always visible above the left-panel task tabs on Assets, Layouts, and Templates. Runtime gate verified visibility on Layouts and Templates with no primary UI overlap.

## Codex Sessions

- 2026-06-07T20:47:49.843Z `codex-session-20260607204749-jfakwr` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=high; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T204749Z.md)
