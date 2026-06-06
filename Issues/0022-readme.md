# READMEを利用者向け内容に更新する

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 06-release
- Created: 2026-06-06
- QCDS: Quality, Cost, Delivery, Satisfaction

## Context

本リポジトリのREADMEを、開発者のローカル環境に依存した記載ではなく、利用者が機能、公開ページ、ローカル実行方法、不具合報告先を理解できる内容へ更新する。対象リポジトリは https://github.com/Sunmax0731/thumbnail-generator で、公開ページは https://sunmax0731.github.io/thumbnail-generator/ として案内する。

## Acceptance Criteria

- [x] READMEに機能一覧と各機能の説明、または説明ドキュメントへのリンクが記載されている。
- [x] READMEに不具合や改善要望はGitHub Issuesへ報告してほしい旨が記載されている。
- [x] READMEに公開ページ https://sunmax0731.github.io/thumbnail-generator/ への案内が記載されている。
- [x] READMEに利用者自身のローカル環境でアプリを動作させる方法が記載されている。
- [x] READMEから現在動作させているディレクトリなど、作成者の環境に依存する情報が削除されている。

## Notes

- Closed on 2026-06-07.
- Updated `README.md` around the published app, repository URL, main features, local run commands, GitHub Issues reporting path, browser-local data behavior, and documentation links.
- Synchronized QCDS evidence in `docs/qcds-evaluation.md`, `docs/qcds-strict-metrics.json`, and `docs/codex-work-dashboard-qcds.md`.
- Validation passed with `npm test`, `npm run build`, Playwright headless Chromium runtime gate, and docs packaging.

## Codex Sessions

- 2026-06-06T16:09:58.838Z `codex-session-20260606160958-1sfh29` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260606T160958Z.md)
