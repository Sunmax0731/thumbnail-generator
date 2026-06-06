# LayersとColorsの表示領域を可変化する

- Status: closed
- Priority: P2
- Type: feature
- Source: local
- Draft source: codex-cli
- Phase: 03-design
- Created: 2026-06-06
- Closed: 2026-06-07
- QCDS: Quality, Satisfaction

## Context

Layersの表示項目領域が高さ方向に不足しているため、利用者が見やすい高さへ変更できるようにする。ColorsもLayersと同様のリスト表示に統一し、表示領域の高さを任意に調整できるようにして、編集時の使いやすさを改善する。

## Acceptance Criteria

- [x] Layersの表示項目領域が現在より高さ方向に広がり、一覧を確認しやすくなっている。
- [x] 利用者がLayersの表示領域の高さを任意に変更できる。
- [x] Colorsの色リストがLayersと同様の表示方法で表示される。
- [x] 利用者がColorsの表示領域の高さを任意に変更できる。
- [x] 表示領域を変更しても主要UI、レイヤー編集、色編集、エクスポート導線が崩れない。

## Notes

- Layers and Colors now use explicit resize handles with `ns-resize` cursor and Arrow Up/Down keyboard support.
- The Layers list default height is taller, and the Colors list uses layer-like row containers for saved color entries.
- Runtime gate resized Layers from `360` to `432` and Colors from `320` to `392`, then verified no desktop or mobile horizontal overflow.

## Codex Sessions

- 2026-06-06T15:17:05.403Z `codex-session-20260606151705-598rxz` - All Work Items (VS Code Codex handoff); access=danger-full-access; model=gpt-5.5; intelligence=xhigh; [prompt](c:/Users/gkkjh/AppData/Roaming/Code/User/workspaceStorage/57ceaa8249d2f65368a0891ad39aa21f/sunmax0731.codex-friendly-project-starter/first-prompt-20260606T151705Z.md)
