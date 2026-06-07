# 文字列編集にカーニング機能を追加

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

サムネイル内の文字列編集機能で、文字間隔を調整できるカーニング設定を追加する。既存の文字編集 UI とレイヤー編集フローに組み込み、プレビューと書き出し結果で同じ見た目になることを重視する。

## Acceptance Criteria

- [x] 文字列レイヤーの編集 UI からカーニング値を変更できる。
- [x] カーニング設定がキャンバス上のプレビューに即時反映される。
- [x] HTML/CSV 取り込み後の文字列レイヤーでもカーニングを設定できる。
- [x] 画像エクスポート時に設定したカーニングが出力結果へ反映される。

## Notes

- Added text `letterSpacing` support in Adjust, canvas rendering, text fit measurement, CSV import, HTML import, CSV export, and HTML export.
- Verified through parser/export/text-fit unit tests and production runtime export gate.

## Codex Sessions

- 2026-06-07T03:44:53.818Z `codex-session-20260607034453-q1nvj5` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T034453Z.md)
