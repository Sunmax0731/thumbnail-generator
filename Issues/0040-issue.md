# グループ追加と選択表示の修正

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 05-test
- Created: 2026-06-07
- Closed: 2026-06-07
- QCDS: Quality, Satisfaction
- Tasks: `TODO.md`

## Context

`Issues/0039-issue.md` と同じグループ追加・選択表示の重複 work item。グループ選択 helper、Preview 選択、Layers folder-like 表示の修正で同時に解消する。

## Acceptance Criteria

- [x] 1 つ目のグループ作成後も、追加のグループを正常に作成できる。
- [x] Layers 上で grouped row を選ぶと、その group の editable members がまとまって選択される。
- [x] Preview 上で grouped layer を選ぶと、その所属 group が multi-selection として選択される。
- [x] Layers 上で group row が folder-like に判別しやすく表示される。
- [x] グループ化後に Layers の順序が変わっても、グループ構造と選択操作が維持される。

## Verification

- Added `selectLayerIdsForLayer` tests for grouped non-additive and additive selection.
- `npm test`: pass. 20 files, 59 tests.
- `npm run build`: pass.
- Runtime gate created two groups and verified Preview group selection.
- Evidence: `docs/assets/runtime-final-p2-20260607-desktop.png`, `docs/assets/runtime-final-p2-20260607-mobile.png`.

## Notes

- Closed as the duplicate local Issue for the same group-selection fix tracked in `Issues/0039-issue.md`.
