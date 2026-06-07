# 線機能をクイック追加へ統合

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 04-implementation
- Created: 2026-06-07
- Closed: 2026-06-07
- QCDS: Quality, Satisfaction
- Tasks: `TODO.md`

## Context

線レイヤーの追加入口が Layers タブ下部にあり、左側の Quick Add と役割が分かれていた。頻繁な作成操作を Assets のクイック追加へ統合し、Layers はレイヤー管理、整列、グループ操作に集中させる。

## Acceptance Criteria

- [x] Quick Add から線レイヤーを追加できる。
- [x] 線レイヤーは従来どおり Solid / Dotted / Dashed / Wave の線種を Adjust で編集できる。
- [x] Layers タブ下部の `Add line` ボタンは削除され、線追加の導線は Quick Add に統合されている。

## Verification

- `npm test`: pass. 20 files, 59 tests.
- `npm run build`: pass.
- Browser runtime gate: pass via Playwright headless Chromium fallback at `http://127.0.0.1:4175/thumbnail-generator/`.
- Evidence: `docs/assets/runtime-final-p2-20260607-desktop.png`, `docs/assets/runtime-final-p2-20260607-mobile.png`.

## Notes

- Browser plugin was attempted first and returned `Browser is not available: iab`; Playwright fallback was used.
