# カラーパレットハンドル変更時の配色連動復元

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

Colorsタブのカラーホイールでは、ハンドルを選択しただけではベースカラーを変更しない操作性を維持しつつ、ハンドルをドラッグして色変更した場合は配色スキーム全体が連動して更新される必要がある。前回の単独ハンドル更新で失われた、ハンドル変更時に他の色も変わる挙動を復元する。

## Acceptance Criteria

- [x] カラーホイール上のハンドルを選択してもベースカラーは変更されない。
- [x] ハンドルをドラッグすると、対象ハンドルの色に合わせてベースカラーが逆算される。
- [x] ハンドルをドラッグすると、同じ配色スキーム内の他の色も連動して再生成される。
- [x] 保存済みマルチカラーパレットは、連動更新後の表示色を保存できる。
- [x] Colorsタブの単色 Fill/Stroke 直接適用とグループ機能削除は維持される。

## Notes

- Implemented in `src/lib/colorPalette.ts` and `src/components/InspectorPanel.tsx`.
- Verified by `npm test`, `npm run build`, and Playwright headless Chromium runtime gate on 2026-06-07.
