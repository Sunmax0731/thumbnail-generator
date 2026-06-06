# Preset変更時のキャンバス表示範囲適応

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

Presetで画面サイズを変更したとき、Shortsなど縦方向に長い設定でもキャンバス全体が初期表示範囲内に収まるようにする。アスペクト比とキャンバス高さ・幅に応じて表示倍率を自動調整する。

## Acceptance Criteria

- [x] Shortsプリセット選択時でもキャンバス全体が初期表示範囲内に収まる。
- [x] プリセット変更時にアスペクト比、高さ、幅に応じてズームまたは表示領域が自動調整される。
- [x] 既存のキャンバス編集操作と画像エクスポート結果に不要な変更が発生しないことを確認する。

## Implementation Notes

- `src/lib/canvasFit.ts`にビューポート高とキャンバス比率からズームを計算する純粋関数を追加した。
- `CanvasStage`で`ResizeObserver`を使い、プリセット変更や表示領域変更時にフィット倍率を再計算する。
- デスクトップではエディタシェルをビューポート高に固定し、キャンバス領域がページ全体を押し広げないようにした。タブレット・モバイルでは従来通りスクロール可能に戻す。

## Evidence

- `npm test`: pass. 13 test files, 35 tests.
- `src/lib/canvasFit.test.ts`: portraitプリセットは既定ズームより小さくなり、landscapeは高さに余裕があれば既定フィットを維持することを確認。
- Runtime gate: pass. `portrait` preset `1080x1920`でキャンバスフレーム `380.796875x635.46875`、表示領域 `724x680.0625`、ズーム `56%`。
- Evidence screenshot: `docs/assets/runtime-work-items-preset.png`.

## Remaining Work

- None.

## Codex Sessions

- 2026-06-06T14:14:27.298Z `codex-session-20260606141427-sjqjbx` - All Work Items; access=danger-full-access; model=gpt-5.5; intelligence=xhigh.
