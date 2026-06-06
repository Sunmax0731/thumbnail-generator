# Issues

This directory is the local backlog for work that is tracked without GitHub Issues.

## File Rule

- Use one Markdown file per issue.
- Name files with a numeric prefix and short slug, such as `0001-short-title.md`.
- `Status` must be one of `open`, `in-progress`, `blocked`, or `closed`.
- `Priority` must be one of `P0`, `P1`, `P2`, `P3`, or `P4`.
- Put concrete work and completion criteria in each issue's Acceptance Criteria.
- When task-level files are needed, link them from `Tasks:`.

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

Background and goal.

## Acceptance Criteria

- [ ] Completion condition.

## Notes

-
```
