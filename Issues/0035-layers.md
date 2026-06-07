# Layers下部にキャンバスサイズ合わせ機能を追加

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

サムネイル編集画面で、画像や図形レイヤーをキャンバスサイズに合わせて配置・拡大縮小できる操作を追加する。配置場所はLayersセクション下部とし、既存GUI入力で指定されたfeature/P2/実装フェーズを尊重する。

## Acceptance Criteria

- [x] Layersセクション下部に、選択中の画像または図形をキャンバスサイズに合わせる操作が表示される
- [x] 操作実行時に対象レイヤーのサイズと位置がキャンバス境界に合うよう更新される
- [x] 画像レイヤーと図形レイヤーの両方で機能し、既存のレイヤー編集操作と競合しない
- [x] 対象レイヤー未選択または非対応レイヤー選択時の無効状態がUI上で分かる

## Notes

- Added Fit to canvas action under Layers; it applies x=0, y=0, width=canvas width, and height=canvas height to selected image/shape layers.
- The button is disabled when no selected editable image/shape layer exists.
- Verified in the Playwright runtime gate.

## Codex Sessions

- 2026-06-07T03:44:53.818Z `codex-session-20260607034453-q1nvj5` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260607T034453Z.md)
