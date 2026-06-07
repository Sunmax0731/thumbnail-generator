# カラーパレット操作性のブラッシュアップ

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

カラーパレット機能は改善が進んでいるが、カラーホイール上のハンドル操作時にベースカラーや他の色が意図せず切り替わる挙動が残っている。ハンドルの選択とドラッグを明確に分け、意図した色編集だけが発生するように操作性を改善する。あわせてRGB値をスライダーで編集できるようにする。

## Acceptance Criteria

- [x] カラーホイール上のハンドルを選択しても、ベースカラーや他の色が自動で切り替わらない。
- [x] ベースカラーを変更するための明示的な操作またはUIが実装されている。
- [x] ハンドルの選択とドラッグが区別され、選択だけではハンドル位置が変化しない。
- [x] ハンドルをドラッグした場合のみ対象ハンドルの色または位置が更新され、他の色は意図せず変更されない。
- [x] RGB各値をスライダーで編集でき、編集結果がカラーパレット表示に反映される。

## Notes

- Implemented in `src/components/InspectorPanel.tsx` and `src/styles.css`.
- Verified by `npm test`, `npm run build`, and Playwright headless Chromium runtime gate on 2026-06-07.

## Codex Sessions

- 2026-06-07T09:16:31.236Z `codex-session-20260607091631-6sykd2` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=high; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T091631Z.md)
