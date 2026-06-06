# 日英表示切り替え対応

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-06
- Closed: 2026-06-06
- QCDS: Quality, Satisfaction

## Context

サムネイル生成 WebApp で日本語表示と英語表示をユーザーが切り替えられるようにする。初期表示言語はブラウザまたは OS の言語設定を参照し、対応言語に合わせて自動選択する。既存 UI の操作性を保ちつつ、未対応言語の場合のフォールバックも明確にする。

## Acceptance Criteria

- [x] UI 上で日本語と英語の表示を切り替えられる。
- [x] 初回表示時にブラウザまたは OS の言語設定から日本語または英語が自動選択される。
- [x] 未対応言語設定の場合は既定のフォールバック言語で表示される。
- [x] 主要 UI 文言が日英それぞれで破綻なく表示される。

## Implementation Notes

- `src/lib/i18n.ts` に `en` / `ja` 辞書、言語検出、未対応言語の英語フォールバックを追加した。
- トップツールバー、左右パネル、Image Lab、ステータスメトリクスの主要UI文言を翻訳対象にした。
- 表示言語セレクトをトップツールバーに追加した。

## Evidence

- `npm test`: pass. 17 test files, 44 tests.
- `npm run build`: pass.
- Runtime gate: 初期表示で日本語UIを確認し、英語へ切り替えて主要UIと後続操作を検証した。
- Screenshot: `docs/assets/runtime-p2-work-items-japanese.png`

## Notes

- Closed in the P2 work-items pass.

## Codex Sessions

- 2026-06-06T14:46:42.466Z `codex-session-20260606144642-2av7le` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260606T144642Z.md)
