# Layers削除とColors/Adjust改善

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 05-test
- Created: 2026-06-06
- Closed: 2026-06-06
- QCDS: Quality, Cost, Satisfaction

## Context

Layers操作、Colorsパレット登録、Adjustタブの入力体験を改善する。Layer削除はDeleteキーと削除ボタンの両方から実行できるようにし、削除ボタンでは誤操作防止の確認モーダルを表示する。ColorsではStrokeに加えてFill対象と名前登録を扱い、Adjustでは重複表示をなくして入力フォームに集約する。

## Acceptance Criteria

- [x] Layersの項目選択中にDeleteキーを押すと、対象項目が削除され、選択状態と表示が破綻しない。
- [x] Layersの各項目で表示/非表示切り替えボタン、ロック/アンロックボタンの並びに削除ボタンが表示される。
- [x] 削除ボタン押下時に確認モーダルが表示され、確定で削除、キャンセルで削除されない。
- [x] Colorsタブのカラーパレット登録でStrokeまたはFillを選択でき、Fill選択時は塗りつぶし色を変更できる。
- [x] Colorsタブのカラーパレット登録で名前を入力・保存でき、Adjustタブでは各パラメータの重複表示がなくなり入力フォームのみで編集できる。

## Implementation Notes

- Layers行に削除ボタンを追加し、削除ボタンとAdjustタブの削除操作は確認モーダル経由にした。
- Layers行にフォーカスした状態でDelete/Backspaceを押すと、編集可能な対象レイヤーを直接削除する。
- 削除後の選択復元は`src/lib/layerOperations.ts`に分離し、削除済み・ロック中レイヤーを選択し続けないようにした。
- Colors登録は名前、hex値、Fill/Stroke対象を保存する形式に拡張し、旧`{id,value}`形式のlocalStorageも読み込めるようにした。
- Adjustタブのスライダーラベルから数値の重複表示を外し、range/number入力欄だけで値を編集する表示にした。

## Evidence

- `npm test`: pass。10 test files、26 tests。
- `npm run build`: pass。
- Browser plugin: `Browser is not available: iab` のためPlaywright headless Chromiumへフォールバック。
- Runtime gate: pass。`http://127.0.0.1:4173/thumbnail-generator/`でnonblank canvas、主要UI、CSV/HTML import、layer edit、Deleteキー削除、削除モーダルcancel/confirm、named Fill/Stroke palette登録・適用、Adjust重複表示なし、WebP export、desktop/mobileを確認。
- Evidence screenshots:
  - `docs/assets/runtime-layers-colors-adjust-desktop.png`
  - `docs/assets/runtime-layer-delete-modal.png`
  - `docs/assets/runtime-layers-colors-adjust-after.png`
  - `docs/assets/runtime-layers-colors-adjust-mobile.png`

## Remaining Work

- なし。

## Codex Sessions

- 2026-06-06T13:23:34.025Z `codex-session-20260606132334-tre75w` - Work Item: Layers削除とColors/Adjust改善 (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260606T132334Z.md)
