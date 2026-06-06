# プレビュー選択で重なり順を考慮する

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

プレビュー上で重なったレイヤーを選択するとき、表示上もっとも前面にあるレイヤーが選択されるようにする。選択済みレイヤーのリサイズ・回転ハンドルは引き続き操作できる必要がある。

## Acceptance Criteria

- [x] プレビュー上で複数要素が重なっている位置を選択した場合、表示上もっとも前面の要素が選択される。
- [x] 重なり順を変更した後も、最新の表示順に基づいて選択対象が決まる。
- [x] 既存の単一要素選択やレイヤー編集操作が壊れていないことを確認できる。

## Implementation Notes

- `src/lib/hitTest.ts`に`pickLayerInteractionAt`を追加し、通常のボディクリックは表示順のヒットテストに通すようにした。
- 選択済みレイヤーのリサイズ・回転ハンドルはボディ選択より優先し、直接編集操作を維持した。
- `src/App.tsx`のキャンバスポインター処理を新しいヒットテストヘルパーに切り替えた。

## Evidence

- `npm test`: pass. 13 test files, 35 tests.
- `src/lib/hitTest.test.ts`: overlapping boundsで前面レイヤーを選ぶこと、選択済み背面レイヤーのボディクリックが前面レイヤーに解決されること、リサイズハンドルが有効なことを確認。
- Runtime gate: pass. CSVで`Bottom box`と`Top box`を重ね、`Bottom box`選択中に重なり位置をクリックして`Top box`が選択された。

## Remaining Work

- None.

## Codex Sessions

- 2026-06-06T14:14:27.298Z `codex-session-20260606141427-sjqjbx` - All Work Items; access=danger-full-access; model=gpt-5.5; intelligence=xhigh.
