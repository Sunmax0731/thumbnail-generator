# TODO

Waterfall task contract for the initial `thumbnail-generator` implementation.

## 1. Requirements

- [x] Confirm platform root is `D:\AI\WebApp`.
- [x] Start new repo at `D:\AI\WebApp\thumbnail-generator`.
- [x] Create public GitHub remote and configure `origin`.
- [x] Define browser-only static app constraints.
- [x] Define required layout inputs: CSV and HTML.
- [x] Define required output: selected resolution/aspect ratio image export.

## 2. Specification

- [x] Document layer model for image, text, and shape.
- [x] Document CSV schema.
- [x] Document HTML `data-layer` schema.
- [x] Document export presets and custom output controls.
- [x] Document image effects supported in MVP.

## 3. Design

- [x] Generate and save primary UI concept.
- [x] Translate concept into implementation tokens and layout.
- [x] Document responsive behavior.

## 4. Implementation

- [x] Scaffold React + Vite static app.
- [x] Implement layer model and sample state.
- [x] Implement CSV parser and HTML parser.
- [x] Implement canvas renderer and export helpers.
- [x] Implement image import and image effects.
- [x] Implement editor UI, layer list, inspector, output controls, and import panels.
- [x] Implement responsive layout.

## 5. Verification

- [x] Add automated tests for parsers and export settings.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run browser runtime gate for desktop.
- [x] Run browser runtime gate for mobile viewport.
- [x] Exercise CSV import, HTML import, layer edit, image import, and export.

## 6. Release Preparation

- [x] Update README, AGENTS, SKILL, and docs to match implementation.
- [x] Create/update QCDS evaluation and strict metrics JSON.
- [x] Complete release checklist.
- [x] Create docs ZIP.
- [x] Commit and push if validation passes.

## 7. Direct Editing and Templates

- [x] Add direct canvas move, resize, and rotate controls for the selected layer.
- [x] Add drag-and-drop layer order editing in the Layers panel.
- [x] Change text font editing from free text to a dropdown list.
- [x] Generate CSV and HTML layout text from the current canvas state.
- [x] Save generated layouts as named browser-local templates.
- [x] Support multiple saved templates with load and delete controls.
- [x] Validate new interactions with automated tests and browser runtime gate.

## 8. Multi-Select, Palette, Locking, and Image Lab

- [x] Add multi-layer selection from canvas and Layers panel.
- [x] Add alignment controls for multi-selection and canvas alignment for single selection.
- [x] Add browser-local color palette registration and quick color application to text and shape layers.
- [x] Render selection resize and rotation handles outside the canvas document bounds without clipping.
- [x] Add layer selectable/editable lock toggle and exclude locked layers from canvas selection and inspector edits.
- [x] Confirm named templates continue to support multiple saved entries after model changes.
- [x] Add Image Lab for imported-image processing.
- [x] Implement chroma-key transparency.
- [x] Implement rectangular and circular image cutouts.
- [x] Implement polygon/free cutout by placing points.
- [x] Implement mouse-drag range cutout.
- [x] Add sliders for numeric controls with practical min/max bounds.
- [x] Validate new interactions with automated tests and browser runtime gate.

## 9. Image Lab Workspace Modal

- [x] Move Image Lab processing out of the sidebar tab into a larger modal workspace.
- [x] Keep the sidebar as the Image Lab launcher and image import context.
- [x] Provide close controls, backdrop/Escape dismissal, and responsive modal layout.
- [x] Increase the Image Lab preview workspace for precise crop, polygon, and chroma-key work.
- [x] Validate the modal workspace with automated tests and browser runtime gate.

## 10. Image Lab Drag Selection and UI/UX Refresh

- [x] Make Rect and Circle cutout modes directly selectable by dragging on the Image Lab preview.
- [x] Keep Drag mode compatible with existing rectangular drag-range processing.
- [x] Reorganize the left sidebar into clearer Assets, Layouts, and Templates sections.
- [x] Reorganize the right inspector into clearer Layers, Adjust, and Colors sections.
- [x] Update design/spec/test/QCDS docs for the refreshed information architecture.
- [x] Validate desktop and mobile layout, Image Lab Rect/Circle drag selection, and existing primary workflows.

## Work Items

- [x] [P2] [Phase:05-test] Layers削除とColors/Adjust改善 [Issue](Issues/0001-layers-colors-adjust.md) [QCDS:Quality,Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] Colorsタブ表示領域の縦拡張 [Issue](Issues/0002-colors.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] プレビュー選択で重なり順を考慮する [Issue](Issues/0003-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] Preset変更時のキャンバス表示範囲適応 [Issue](Issues/0004-preset.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 任意フォント追加機能の実装 [Issue](Issues/0005-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 改善要望対応とQCDS評価 [Issue](Issues/0006-qcds.md) [QCDS:Quality,Cost,Delivery,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] プレビュー空白クリックで選択解除 [Issue](Issues/0007-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 複数選択時の相対位置・回転編集 [Issue](Issues/0008-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] 日英表示切り替え対応 [Issue](Issues/0009-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] キャンバス外要素の表示対応 [Issue](Issues/0010-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] 文字列を設定範囲いっぱいに表示する機能追加 [Issue](Issues/0011-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] 回転ハンドルの操作性改善 [Issue](Issues/0012-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 複数選択の移動・回転をリアルタイム反映 [Issue](Issues/0013-issue.md) [QCDS:Quality,Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 複数選択の移動・回転をリアルタイム反映 [Issue](Issues/0014-issue.md) [QCDS:Quality,Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 文字揃えを3択ボタン化 [Issue](Issues/0015-3.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] LayersとColorsの表示領域を可変化する [Issue](Issues/0016-layers-colors.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 現在の編集状態を保存する機能を追加してください。 [Issue](Issues/0017-issue.md) [QCDS:Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 編集状態の保存と自動保存切り替えを追加 [Issue](Issues/0018-issue.md) [QCDS:Quality,Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 複数選択時の角度合わせ機能 [Issue](Issues/0019-issue.md) [QCDS:Quality,Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 機能一覧と使い方ドキュメント作成 [Issue](Issues/0020-issue.md) [QCDS:Quality,Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] サムネイル作成ツール改善タスク化 [Issue](Issues/0021-issue.md) [QCDS:Quality,Cost,Delivery,Satisfaction] [Status:closed]
- [x] [P2] [Phase:06-release] READMEを利用者向け内容に更新する [Issue](Issues/0022-readme.md) [QCDS:Quality,Cost,Delivery,Satisfaction] [Status:closed]
- [x] [P2] [Phase:05-test] Codex Work DashboardのQCDS再評価と改善 [Issue](Issues/0023-codex-work-dashboard-qcds.md) [QCDS:Quality,Cost,Delivery,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] 改行後の文字列編集で白画面になる不具合修正 [Issue](Issues/0024-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] デフォルトテンプレートの拡充 [Issue](Issues/0025-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] 影響しない編集項目のグレーアウト制御 [Issue](Issues/0026-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] Image Labの画像選択と切り抜き編集改善 [Issue](Issues/0027-image-lab.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 左ペインのクイック追加拡充 [Issue](Issues/0028-issue.md) [QCDS:Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] Adjustタブに回転・不透明度リセットを追加 [Issue](Issues/0029-adjust.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] Layer項目に線・ぼかし・縁ぼかし・角丸を追加 [Issue](Issues/0030-layer.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:05-test] サムネイル編集ショートカットキー追加 [Issue](Issues/0031-issue.md) [QCDS:Quality,Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] ImageLab範囲編集とドラッグ削除 [Issue](Issues/0032-imagelab.md) [QCDS:Quality,Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 文字列編集にカーニング機能を追加 [Issue](Issues/0033-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] Layersにグループ機能を追加 [Issue](Issues/0034-layers.md) [QCDS:Quality,Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] Layers下部にキャンバスサイズ合わせ機能を追加 [Issue](Issues/0035-layers.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] Colors登録色の選択編集機能を追加 [Issue](Issues/0036-colors.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] Colors機能のグループ設定と配色支援を強化 [Issue](Issues/0037-colors.md) [QCDS:Quality,Cost,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 線機能をクイック追加へ統合 [Issue](Issues/0038-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:05-test] グループ追加と選択表示の修正 [Issue](Issues/0039-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:05-test] グループ追加と選択表示の修正 [Issue](Issues/0040-issue.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:03-design] Colorsのカラーパレット作成UI改善 [Issue](Issues/0041-colors-ui.md) [QCDS:Quality,Satisfaction] [Status:closed]
- [x] [P2] [Phase:04-implementation] 移動操作のUNDO/REDO履歴を確定位置のみ記録する [Issue](Issues/0042-undo-redo.md) [QCDS:Quality,Satisfaction] [Status:closed]
