# Colorsタブの単色適用UI改善

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

Colorsタブでは、登録済みの単色一覧から選択中オブジェクトへ直接色を反映したい。塗り色や線色を別途登録する操作は不要とし、カラーパレット機能内での線や塗りの選択UIを廃止する。登録済み単色に対して塗りボタンまたは線ボタンを押すだけで、選択中オブジェクトの該当スタイルへ適用できる状態を目指す。

## Acceptance Criteria

- [x] Colorsタブの登録済み単色一覧に、各色を選択中オブジェクトの塗りへ適用する操作が用意されている。
- [x] Colorsタブの登録済み単色一覧に、各色を選択中オブジェクトの線へ適用する操作が用意されている。
- [x] カラーパレット機能から線色や塗り色を登録・選択するUIが削除されている。
- [x] 選択中オブジェクトがない場合の操作が既存UI方針に沿って安全に扱われ、例外や画面崩れが発生しない。

## Notes

- Implemented per-row Fill and Stroke buttons for registered single colors.
- Verified by `npm test`, `npm run build`, and Playwright headless Chromium runtime gate on 2026-06-07.

## Codex Sessions

- 2026-06-07T09:16:31.236Z `codex-session-20260607091631-6sykd2` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=high; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T091631Z.md)
