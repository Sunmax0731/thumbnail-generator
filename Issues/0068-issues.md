# Issues導線と正式サービス表示の追加

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-07
- Closed: 2026-06-08
- QCDS: Quality, Delivery, Satisfaction

## Context

ユーザーが不具合報告や要望を送れる導線として、ページ内の適切な場所にGitHub Issuesへのリンクを表示する。あわせて、正式なサービスとして必要なプライバシーポリシー相当の表示をページ内に追加し、利用者が確認しやすい状態にする。

## Acceptance Criteria

- [x] ページ内の適切な場所にGitHub Issuesへのリンクが表示され、不具合報告・要望送信用であることが分かる文言になっている。
- [x] GitHub Issuesリンクが正しいURLに遷移する。
- [x] ページ内にプライバシーポリシー等の正式サービスに必要な表示または導線が追加されている。
- [x] 追加した表示が既存UIのレイアウトを崩さず、主要な操作の邪魔にならない。

## Notes

- Added a compact top-toolbar `Report issue` link and a Templates-section service block linking to `https://github.com/Sunmax0731/thumbnail-generator/issues`.
- Added browser-only privacy/storage notice explaining that images, fonts, templates, colors, and edit state stay in the browser unless exported or site data is cleared.
- Validation: Playwright runtime gate confirmed the issue URL and privacy notice were visible without desktop/mobile overflow.

## Codex Sessions

- 2026-06-07T15:58:35.069Z `codex-session-20260607155835-2m0uls` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=medium.
