# Issues

このディレクトリは、GitHub Issue を使わない場面でも Issue 駆動で作業単位を管理するためのローカル backlog です。

## File Rule

- 1 Issue につき 1 Markdown ファイルを作成します。
- ファイル名は `0001-short-title.md` のように連番と短い slug を使います。
- `Status` は `open`、`in-progress`、`blocked`、`closed` のいずれかにします。
- `Priority` は `P0` から `P4` を使います。
- 具体作業も原則として Issue の Acceptance Criteria に集約します。既存互換が必要な場合だけ `Tasks/*.md` を `Tasks:` でリンクします。

## Template

```markdown
# Issue title

- Status: open
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: YYYY-MM-DD
- QCDS: Quality, Delivery
- Tasks: 

## Context

背景と目的。

## Acceptance Criteria

- [ ] 完了条件。

## Notes

- 
```
