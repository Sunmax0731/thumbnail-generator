# Image Labの画像選択と切り抜き編集改善

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-07
- Closed: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

Image Lab の画像取り込み、Layers 追加、切り抜き範囲編集の操作性を改善する。インポート済み画像を Image Lab 経由に限定せず Layers へ追加でき、左ペインから選択した画像を Image Lab の編集対象にできるようにする。

## Acceptance Criteria

- [x] Image Lab 以外からインポートした画像も、そのまま Layers に追加できる。
- [x] 左ペインのインポート画像一覧で画像を選択して Image Lab を開くと、その画像が編集対象として表示される。
- [x] Image Lab 上で画像を読み込むと、素材ドロップダウンで再選択しなくてもその画像が編集対象として表示される。
- [x] 切り抜き範囲の選択 UI から重複している Drag 項目が整理され、矩形など既存項目と競合しない。
- [x] 矩形、円、自由ポイント指定の切り抜き範囲を選択後、画像上のドラッグ操作でサイズ、位置、ポイントを変更できる。

## Resolution

- 画像 import を「素材追加」と「素材から image layer 追加」に分けた。
- 左ペインの asset row に選択、image layer 追加、Image Lab で編集する操作を追加した。
- Image Lab に `initialAssetKey` と Image Lab 専用 import callback を追加し、選択済み素材または Lab 内で読み込んだ素材が即座に編集対象になるようにした。
- 既存の Rect/Ellipse/Drag drag selection と polygon point editing は維持した。

## Evidence

- `npm test`: pass, 20 files, 53 tests.
- `npm run build`: pass.
- Browser runtime gate: asset row image-layer insertion, selected asset Image Lab open, Rect drag selection, processed layer creation pass.
- Screenshots: `docs/assets/runtime-backlog-20260607-desktop.png`, `docs/assets/runtime-backlog-20260607-mobile.png`.

## Notes

- Follow-up issue is not required.
