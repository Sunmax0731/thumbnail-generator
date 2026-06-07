import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  Folder,
  GripHorizontal,
  GripVertical,
  Layers,
  Lock,
  MousePointer2,
  Move,
  Palette,
  RotateCcw,
  RotateCw,
  SlidersHorizontal,
  Trash2,
  Type,
  Unlock,
  Upload,
} from "lucide-react";
import type { AlignmentMode } from "../lib/alignment";
import { acceptedFontFileTypes } from "../lib/customFonts";
import { fontLabelFor, type FontOption } from "../lib/fonts";
import {
  generatePaletteSchemeColors,
  normalizeColor,
  type HarmonyMode,
  type PaletteColor,
  type PaletteTarget,
  type SavedColorPalette,
} from "../lib/colorPalette";
import type { Translator } from "../lib/i18n";
import {
  emptyLiveRelativeTransformState,
  hasLiveRelativeTransformDelta,
  updateLiveRelativeTransformState,
  type LiveRelativeTransformAxis,
} from "../lib/liveRelativeTransform";
import type { RelativeLayerTransform } from "../lib/layerTransform";
import type {
  ImageAsset,
  ImageEffects,
  LineStyle,
  OutputSettings,
  ShapeKind,
  TextAlign,
  TextWritingMode,
  ThumbnailLayer,
} from "../lib/types";

type InspectorSection = "layers" | "edit" | "colors";

interface InspectorPanelProps {
  assets: ImageAsset[];
  layers: ThumbnailLayer[];
  selectedIds: string[];
  settings: OutputSettings;
  paletteColors: PaletteColor[];
  paletteDraft: string;
  paletteNameDraft: string;
  paletteTargetDraft: PaletteTarget;
  paletteAlphaDraft: number;
  paletteGroupDraft: string;
  paletteModeDraft: HarmonyMode;
  selectedPaletteColorId: string | null;
  savedColorPalettes: SavedColorPalette[];
  fontOptions: FontOption[];
  onPaletteDraftChange: (value: string) => void;
  onPaletteNameDraftChange: (value: string) => void;
  onPaletteTargetDraftChange: (value: PaletteTarget) => void;
  onPaletteAlphaDraftChange: (value: number) => void;
  onPaletteGroupDraftChange: (value: string) => void;
  onPaletteModeDraftChange: (value: HarmonyMode) => void;
  onSelectPaletteColor: (id: string) => void;
  onAddPaletteColor: () => void;
  onUpdatePaletteColor: () => void;
  onDeletePaletteColor: (id: string) => void;
  onSaveCurrentColorPalette: () => void;
  onDeleteSavedColorPalette: (id: string) => void;
  onApplyPaletteColor: (color: string, target: PaletteTarget) => void;
  onApplyPaletteGroup: (groupName: string) => void;
  onGeneratePaletteHarmony: (mode: HarmonyMode) => void;
  onSelect: (id: string, additive?: boolean) => void;
  onSelectIndividual: (id: string) => void;
  onUpdateLayer: (id: string, updater: (layer: ThumbnailLayer) => ThumbnailLayer) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onReorderLayer: (draggedId: string, targetId: string) => void;
  onToggleVisible: (id: string) => void;
  onToggleSelectable: (id: string) => void;
  onAlignSelection: (mode: AlignmentMode) => void;
  onTransformSelection: (transform: RelativeLayerTransform) => void;
  onMatchSelectionRotation: () => void;
  onCreateGroup: (name: string) => void;
  onRenameGroup: (groupId: string, name: string) => void;
  onUngroup: (groupId: string) => void;
  onFitSelectedToCanvas: () => void;
  onCustomFontFiles: (files: FileList | null) => void;
  onFitTextToBounds: (id: string) => void;
  t: Translator;
}

export function InspectorPanel({
  assets,
  layers,
  selectedIds,
  settings,
  paletteColors,
  paletteDraft,
  paletteNameDraft,
  paletteTargetDraft,
  paletteAlphaDraft,
  paletteGroupDraft,
  paletteModeDraft,
  selectedPaletteColorId,
  savedColorPalettes,
  fontOptions,
  onPaletteDraftChange,
  onPaletteNameDraftChange,
  onPaletteTargetDraftChange,
  onPaletteAlphaDraftChange,
  onPaletteGroupDraftChange,
  onPaletteModeDraftChange,
  onSelectPaletteColor,
  onAddPaletteColor,
  onUpdatePaletteColor,
  onDeletePaletteColor,
  onSaveCurrentColorPalette,
  onDeleteSavedColorPalette,
  onApplyPaletteColor,
  onApplyPaletteGroup,
  onGeneratePaletteHarmony,
  onSelect,
  onSelectIndividual,
  onUpdateLayer,
  onDelete,
  onDuplicate,
  onMove,
  onReorderLayer,
  onToggleVisible,
  onToggleSelectable,
  onAlignSelection,
  onTransformSelection,
  onMatchSelectionRotation,
  onCreateGroup,
  onRenameGroup,
  onUngroup,
  onFitSelectedToCanvas,
  onCustomFontFiles,
  onFitTextToBounds,
  t,
}: InspectorPanelProps) {
  const selectedLayers = layers.filter((layer) => selectedIds.includes(layer.id) && layer.selectable);
  const selected = selectedLayers.length === 1 ? selectedLayers[0] : undefined;
  const paletteCompatibleCount = selectedLayers.filter((layer) => layer.type === "text" || layer.type === "shape").length;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<InspectorSection>("layers");
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [relativeTransform, setRelativeTransform] = useState(emptyLiveRelativeTransformState);
  const [layerListHeight, setLayerListHeight] = useState(360);
  const [colorListHeight, setColorListHeight] = useState(320);
  const deleteCandidate = deleteCandidateId ? layers.find((layer) => layer.id === deleteCandidateId) : undefined;
  const selectedIdsKey = selectedIds.join("|");
  const selectedGroupIds = Array.from(new Set(selectedLayers.map((layer) => layer.groupId).filter(Boolean))) as string[];
  const activeGroupId = selectedGroupIds.length === 1 ? selectedGroupIds[0] : undefined;
  const activeGroupName = activeGroupId
    ? selectedLayers.find((layer) => layer.groupId === activeGroupId)?.groupName ?? "Layer group"
    : "";
  const canvasFitEligibleCount = selectedLayers.filter((layer) => layer.type === "image" || layer.type === "shape").length;

  useEffect(() => {
    setRelativeTransform(emptyLiveRelativeTransformState);
  }, [selectedIdsKey]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isKeyboardInputTarget(event.target)) return;
      if (document.querySelector(".confirm-backdrop, .image-lab-backdrop")) return;
      const candidate = selectedLayers[0];
      if (!candidate) return;
      event.preventDefault();
      setDeleteCandidateId(candidate.id);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLayers]);

  const updateLiveRelativeTransform = (axis: LiveRelativeTransformAxis, value: number) => {
    const { nextState, transform } = updateLiveRelativeTransformState(relativeTransform, axis, value);
    setRelativeTransform(nextState);
    if (hasLiveRelativeTransformDelta(transform)) onTransformSelection(transform);
  };

  return (
    <aside className="side-panel inspector-panel" aria-label={t("inspector.aria")}>
      <div className="panel-tabs inspector-tabs" role="tablist" aria-label={t("inspector.tabs")}>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "layers"}
          className={activeSection === "layers" ? "selected" : ""}
          onClick={() => setActiveSection("layers")}
        >
          <Layers size={15} /> {t("inspector.layers")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "edit"}
          className={activeSection === "edit" ? "selected" : ""}
          onClick={() => setActiveSection("edit")}
        >
          <SlidersHorizontal size={15} /> {t("inspector.adjust")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "colors"}
          className={activeSection === "colors" ? "selected" : ""}
          onClick={() => setActiveSection("colors")}
        >
          <Palette size={15} /> {t("inspector.colors")}
        </button>
      </div>

      {activeSection === "layers" ? (
        <>
          <section className="panel-section layer-section">
            <div className="section-heading">
              <Layers size={16} />
              <h2>{t("inspector.layers")}</h2>
              <span className="section-count">{layers.length}</span>
            </div>
            <div className="layer-list" aria-label={t("inspector.layerList")} style={{ height: layerListHeight }}>
              {[...layers].reverse().map((layer) => (
                <div
                  key={layer.id}
                  draggable
                  role="button"
                  tabIndex={0}
                  aria-disabled={!layer.selectable}
                  className={`layer-row ${selectedIds.includes(layer.id) ? "selected" : ""} ${
                    draggingId === layer.id ? "dragging" : ""
                  } ${!layer.selectable ? "locked" : ""} ${layer.groupId ? "grouped" : ""} ${
                    layer.groupId && selectedIds.length === 1 && selectedIds[0] === layer.id ? "individual-selected" : ""
                  }`}
                  onClick={(event) => onSelect(layer.id, event.ctrlKey || event.metaKey || event.shiftKey)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(layer.id, event.ctrlKey || event.metaKey || event.shiftKey);
                    }
                    if ((event.key === "Delete" || event.key === "Backspace") && layer.selectable) {
                      event.preventDefault();
                      setDeleteCandidateId(layer.id);
                    }
                  }}
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", layer.id);
                    setDraggingId(layer.id);
                    if (layer.selectable) onSelect(layer.id);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const dragged = event.dataTransfer.getData("text/plain") || draggingId;
                    if (dragged) onReorderLayer(dragged, layer.id);
                    setDraggingId(null);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                >
                  <GripVertical size={14} className="drag-grip" />
                  <span className={`layer-type ${layer.groupId ? "group" : layer.type}`}>
                    {layer.groupId ? <Folder size={13} /> : layer.type}
                  </span>
                  <span className="layer-name">
                    {layer.name}
                    {layer.groupName ? <small className="layer-group-pill">{layer.groupName}</small> : null}
                    {layer.groupId && selectedIds.length === 1 && selectedIds[0] === layer.id ? (
                      <small className="layer-solo-pill">{t("inspector.individualBadge")}</small>
                    ) : null}
                  </span>
                  {layer.groupId ? (
                    <button
                      type="button"
                      className="mini-icon-button"
                      disabled={!layer.selectable}
                      aria-label={t("inspector.selectIndividual", { name: layer.name })}
                      title={t("inspector.selectIndividualTitle")}
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectIndividual(layer.id);
                      }}
                    >
                      <MousePointer2 size={14} />
                    </button>
                  ) : (
                    <span aria-hidden="true" className="layer-row-spacer" />
                  )}
                  <button
                    type="button"
                    className="mini-icon-button"
                    aria-label={layer.visible ? t("inspector.hideLayer", { name: layer.name }) : t("inspector.showLayer", { name: layer.name })}
                    title={layer.visible ? t("inspector.hideLayerTitle") : t("inspector.showLayerTitle")}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleVisible(layer.id);
                    }}
                  >
                    {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    type="button"
                    className="mini-icon-button"
                    aria-label={layer.selectable ? t("inspector.lockLayer", { name: layer.name }) : t("inspector.unlockLayer", { name: layer.name })}
                    title={layer.selectable ? t("inspector.lockLayerTitle") : t("inspector.unlockLayerTitle")}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleSelectable(layer.id);
                    }}
                  >
                    {layer.selectable ? <Unlock size={14} /> : <Lock size={14} />}
                  </button>
                  <button
                    type="button"
                    className="mini-icon-button danger"
                    aria-label={t("inspector.deleteLayer", { name: layer.name })}
                    title={t("inspector.deleteLayerTitle")}
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeleteCandidateId(layer.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <ResizeHandle
              label={t("inspector.resizeLayerList")}
              onResize={(delta) => setLayerListHeight((height) => clampPanelHeight(height + delta))}
            />
            <div className="button-grid">
              <button
                type="button"
                className="secondary-button icon-text"
                disabled={canvasFitEligibleCount === 0}
                onClick={onFitSelectedToCanvas}
              >
                <Move size={16} /> {t("inspector.fitToCanvas")}
              </button>
            </div>
          </section>

          <LayerGroupControls
            selectedCount={selectedLayers.length}
            activeGroupId={activeGroupId}
            activeGroupName={activeGroupName}
            onCreateGroup={onCreateGroup}
            onRenameGroup={onRenameGroup}
            onUngroup={onUngroup}
            t={t}
          />

          <section className="panel-section">
            <div className="section-heading">
              <AlignHorizontalJustifyCenter size={16} />
              <h2>{t("inspector.align")}</h2>
            </div>
            <p className="selection-note">
              {selectedLayers.length === 0
                ? t("inspector.noEditableSelection")
                : selectedLayers.length === 1
                  ? t("inspector.singleAlign")
                  : t("inspector.multiAlign", { count: selectedLayers.length })}
            </p>
            <div className="align-grid" aria-label={t("inspector.alignControls")}>
              <AlignButton label={t("inspector.left")} mode="left" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignHorizontalJustifyStart size={16} />
              </AlignButton>
              <AlignButton label={t("inspector.center")} mode="center" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignHorizontalJustifyCenter size={16} />
              </AlignButton>
              <AlignButton label={t("inspector.right")} mode="right" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignHorizontalJustifyEnd size={16} />
              </AlignButton>
              <AlignButton label={t("inspector.top")} mode="top" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignVerticalJustifyStart size={16} />
              </AlignButton>
              <AlignButton label={t("inspector.middle")} mode="middle" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignVerticalJustifyCenter size={16} />
              </AlignButton>
              <AlignButton label={t("inspector.bottom")} mode="bottom" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignVerticalJustifyEnd size={16} />
              </AlignButton>
            </div>
          </section>
        </>
      ) : null}

      {activeSection === "colors" ? (
        <PaletteControls
          colors={paletteColors}
          draft={paletteDraft}
          nameDraft={paletteNameDraft}
          targetDraft={paletteTargetDraft}
          alphaDraft={paletteAlphaDraft}
          groupDraft={paletteGroupDraft}
          modeDraft={paletteModeDraft}
          selectedColorId={selectedPaletteColorId}
          savedPalettes={savedColorPalettes}
          selectedCount={paletteCompatibleCount}
          onDraftChange={onPaletteDraftChange}
          onNameDraftChange={onPaletteNameDraftChange}
          onTargetDraftChange={onPaletteTargetDraftChange}
          onAlphaDraftChange={onPaletteAlphaDraftChange}
          onGroupDraftChange={onPaletteGroupDraftChange}
          onModeDraftChange={onPaletteModeDraftChange}
          onSelectColor={onSelectPaletteColor}
          onAdd={onAddPaletteColor}
          onUpdate={onUpdatePaletteColor}
          onDelete={onDeletePaletteColor}
          onSavePalette={onSaveCurrentColorPalette}
          onDeleteSavedPalette={onDeleteSavedColorPalette}
          onApply={onApplyPaletteColor}
          onApplyGroup={onApplyPaletteGroup}
          onGenerateHarmony={onGeneratePaletteHarmony}
          listHeight={colorListHeight}
          onResizeList={(delta) => setColorListHeight((height) => clampPanelHeight(height + delta))}
          t={t}
        />
      ) : null}

      {activeSection === "edit" ? (
        selected ? (
          <section className="panel-section inspector-section">
            <div className="section-heading">
              <SlidersHorizontal size={16} />
              <h2>{t("inspector.inspector")}</h2>
            </div>
            <div className="inspector-actions">
              <button className="icon-button" type="button" title={t("inspector.moveUp")} onClick={() => onMove(selected.id, 1)}>
                <ArrowUp size={16} />
              </button>
              <button className="icon-button" type="button" title={t("inspector.moveDown")} onClick={() => onMove(selected.id, -1)}>
                <ArrowDown size={16} />
              </button>
              <button className="icon-button" type="button" title={t("inspector.duplicate")} onClick={() => onDuplicate(selected.id)}>
                <Copy size={16} />
              </button>
              <button
                className="icon-button danger"
                type="button"
                title={t("inspector.deleteLayerTitle")}
                onClick={() => setDeleteCandidateId(selected.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="field-stack">
              <TextInput
                label={t("inspector.name")}
                value={selected.name}
                onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, name: value }))}
              />
              <div className="field-grid two">
                <SliderNumberInput
                  label={t("inspector.x")}
                  value={selected.x}
                  min={-settings.width}
                  max={settings.width * 2}
                  step={1}
                  onChange={(value) => updateNumber(selected, "x", value, onUpdateLayer)}
                />
                <SliderNumberInput
                  label={t("inspector.y")}
                  value={selected.y}
                  min={-settings.height}
                  max={settings.height * 2}
                  step={1}
                  onChange={(value) => updateNumber(selected, "y", value, onUpdateLayer)}
                />
                <SliderNumberInput
                  label={t("inspector.width")}
                  value={selected.width}
                  min={16}
                  max={settings.width * 2}
                  step={1}
                  onChange={(value) => updateNumber(selected, "width", value, onUpdateLayer)}
                />
                <SliderNumberInput
                  label={t("inspector.height")}
                  value={selected.height}
                  min={16}
                  max={settings.height * 2}
                  step={1}
                  onChange={(value) => updateNumber(selected, "height", value, onUpdateLayer)}
                />
              </div>
              <div className="field-with-action">
                <SliderNumberInput
                  label={t("inspector.rotation")}
                  value={selected.rotation}
                  min={-180}
                  max={180}
                  step={1}
                  icon={<RotateCw size={14} />}
                  suffix="deg"
                  onChange={(value) => updateNumber(selected, "rotation", value, onUpdateLayer)}
                />
                <button
                  type="button"
                  className="secondary-button icon-text reset-button"
                  onClick={() => updateNumber(selected, "rotation", 0, onUpdateLayer)}
                >
                  <RotateCcw size={15} /> {t("inspector.resetRotation")}
                </button>
              </div>
              <div className="field-with-action">
                <SliderNumberInput
                  label={t("inspector.opacity")}
                  value={selected.opacity}
                  min={0}
                  max={1}
                  step={0.01}
                  decimals={2}
                  onChange={(value) => updateNumber(selected, "opacity", value, onUpdateLayer)}
                />
                <button
                  type="button"
                  className="secondary-button icon-text reset-button"
                  onClick={() => updateNumber(selected, "opacity", 1, onUpdateLayer)}
                >
                  <RotateCcw size={15} /> {t("inspector.resetOpacity")}
                </button>
              </div>
              <div className="field-grid two">
                <SliderNumberInput
                  label={t("inspector.layerBlur")}
                  value={selected.layerBlur}
                  min={0}
                  max={36}
                  step={1}
                  onChange={(value) => updateNumber(selected, "layerBlur", value, onUpdateLayer)}
                />
                <SliderNumberInput
                  label={t("inspector.edgeBlur")}
                  value={selected.edgeBlur}
                  min={-48}
                  max={48}
                  step={1}
                  onChange={(value) => updateNumber(selected, "edgeBlur", value, onUpdateLayer)}
                />
                <label
                  className={`checkbox-row inline-checkbox ${selected.type === "image" ? "field-disabled" : ""}`}
                  title={t("inspector.edgeBlurStrokeHelp")}
                >
                  <input
                    type="checkbox"
                    checked={selected.edgeBlurStroke}
                    disabled={selected.type === "image"}
                    onChange={(event) =>
                      onUpdateLayer(selected.id, (layer) => ({ ...layer, edgeBlurStroke: event.currentTarget.checked }))
                    }
                  />
                  <span>{t("inspector.edgeBlurStroke")}</span>
                </label>
                <SliderNumberInput
                  label={t("inspector.cornerRadius")}
                  value={selected.cornerRadius}
                  min={0}
                  max={Math.max(180, Math.min(selected.width, selected.height) / 2)}
                  step={1}
                  disabled={selected.type === "text"}
                  onChange={(value) => updateNumber(selected, "cornerRadius", value, onUpdateLayer)}
                />
              </div>

              {selected.type === "image" && (
                <ImageControls selected={selected} assets={assets} onUpdateLayer={onUpdateLayer} t={t} />
              )}
              {selected.type === "text" && (
                <TextControls
                  selected={selected}
                  fontOptions={fontOptions}
                  onUpdateLayer={onUpdateLayer}
                  onCustomFontFiles={onCustomFontFiles}
                  onFitTextToBounds={onFitTextToBounds}
                  t={t}
                />
              )}
              {selected.type === "shape" && <ShapeControls selected={selected} onUpdateLayer={onUpdateLayer} t={t} />}
            </div>
          </section>
        ) : selectedLayers.length > 1 ? (
          <GroupTransformControls
            selectedCount={selectedLayers.length}
            moveX={relativeTransform.moveX}
            moveY={relativeTransform.moveY}
            rotation={relativeTransform.rotation}
            onMoveXChange={(value) => updateLiveRelativeTransform("moveX", value)}
            onMoveYChange={(value) => updateLiveRelativeTransform("moveY", value)}
            onRotationChange={(value) => updateLiveRelativeTransform("rotation", value)}
            onMatchRotation={onMatchSelectionRotation}
            t={t}
          />
        ) : (
          <section className="panel-section inspector-section">
            <div className="section-heading">
              <SlidersHorizontal size={16} />
              <h2>{t("inspector.inspector")}</h2>
            </div>
            <p className="empty-note">{t("inspector.noEditableSelection")}</p>
          </section>
        )
      ) : null}
      {deleteCandidate ? (
        <DeleteLayerDialog
          layer={deleteCandidate}
          onCancel={() => setDeleteCandidateId(null)}
          onConfirm={() => {
            onDelete(deleteCandidate.id);
            setDeleteCandidateId(null);
          }}
          t={t}
        />
      ) : null}
    </aside>
  );
}

function AlignButton({
  label,
  mode,
  disabled,
  children,
  onAlignSelection,
}: {
  label: string;
  mode: AlignmentMode;
  disabled: boolean;
  children: ReactNode;
  onAlignSelection: (mode: AlignmentMode) => void;
}) {
  return (
    <button type="button" className="secondary-button icon-text" disabled={disabled} onClick={() => onAlignSelection(mode)}>
      {children}
      {label}
    </button>
  );
}

function ResizeHandle({ label, onResize }: { label: string; onResize: (deltaY: number) => void }) {
  return (
    <div
      className="panel-resize-handle"
      role="separator"
      aria-label={label}
      aria-orientation="horizontal"
      tabIndex={0}
      onPointerDown={(event) => {
        event.preventDefault();
        let lastY = event.clientY;
        const handlePointerMove = (moveEvent: PointerEvent) => {
          onResize(moveEvent.clientY - lastY);
          lastY = moveEvent.clientY;
        };
        const handlePointerUp = () => {
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerup", handlePointerUp);
        };
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          onResize(24);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          onResize(-24);
        }
      }}
    >
      <GripHorizontal size={16} />
    </div>
  );
}

function LayerGroupControls({
  selectedCount,
  activeGroupId,
  activeGroupName,
  onCreateGroup,
  onRenameGroup,
  onUngroup,
  t,
}: {
  selectedCount: number;
  activeGroupId?: string;
  activeGroupName: string;
  onCreateGroup: (name: string) => void;
  onRenameGroup: (groupId: string, name: string) => void;
  onUngroup: (groupId: string) => void;
  t: Translator;
}) {
  const [draft, setDraft] = useState(activeGroupName || "Layer group");

  useEffect(() => {
    setDraft(activeGroupName || "Layer group");
  }, [activeGroupName]);

  return (
    <section className="panel-section group-section">
      <div className="section-heading">
        <Layers size={16} />
        <h2>{t("inspector.groups")}</h2>
        <span className="section-count">{selectedCount}</span>
      </div>
      <TextInput label={t("inspector.groupName")} value={draft} onChange={setDraft} />
      <div className="button-grid">
        <button type="button" className="secondary-button" disabled={selectedCount < 2} onClick={() => onCreateGroup(draft)}>
          {t("inspector.createGroup")}
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={!activeGroupId}
          onClick={() => activeGroupId && onRenameGroup(activeGroupId, draft)}
        >
          {t("inspector.renameGroup")}
        </button>
      </div>
      <button
        type="button"
        className="ghost-button wide-button"
        disabled={!activeGroupId}
        onClick={() => activeGroupId && onUngroup(activeGroupId)}
      >
        {t("inspector.ungroup")}
      </button>
    </section>
  );
}

function PaletteControls({
  colors,
  draft,
  nameDraft,
  targetDraft,
  alphaDraft,
  groupDraft,
  modeDraft,
  selectedColorId,
  savedPalettes,
  selectedCount,
  listHeight,
  onDraftChange,
  onNameDraftChange,
  onTargetDraftChange,
  onAlphaDraftChange,
  onGroupDraftChange,
  onModeDraftChange,
  onSelectColor,
  onAdd,
  onUpdate,
  onDelete,
  onSavePalette,
  onDeleteSavedPalette,
  onApply,
  onApplyGroup,
  onGenerateHarmony,
  onResizeList,
  t,
}: {
  colors: PaletteColor[];
  draft: string;
  nameDraft: string;
  targetDraft: PaletteTarget;
  alphaDraft: number;
  groupDraft: string;
  modeDraft: HarmonyMode;
  selectedColorId: string | null;
  savedPalettes: SavedColorPalette[];
  selectedCount: number;
  listHeight: number;
  onDraftChange: (value: string) => void;
  onNameDraftChange: (value: string) => void;
  onTargetDraftChange: (value: PaletteTarget) => void;
  onAlphaDraftChange: (value: number) => void;
  onGroupDraftChange: (value: string) => void;
  onModeDraftChange: (value: HarmonyMode) => void;
  onSelectColor: (id: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: (id: string) => void;
  onSavePalette: () => void;
  onDeleteSavedPalette: (id: string) => void;
  onApply: (color: string, target: PaletteTarget) => void;
  onApplyGroup: (groupName: string) => void;
  onGenerateHarmony: (mode: HarmonyMode) => void;
  onResizeList: (deltaY: number) => void;
  t: Translator;
}) {
  const groups = groupPaletteRows(colors);
  const previewBaseColor = normalizeColor(draft) ?? "#000000";
  const previewColors = generatePaletteSchemeColors(previewBaseColor, modeDraft);
  return (
    <section className="panel-section palette-section">
      <div className="section-heading">
        <SlidersHorizontal size={16} />
        <h2>{t("inspector.palette")}</h2>
      </div>
      <div className="palette-maker">
        <div className="palette-maker-heading">
          <span>{t("inspector.paletteMaker")}</span>
          <small>{t("inspector.palettePreview")}</small>
        </div>
        <div className="palette-maker-preview">
          <span
            className="palette-wheel"
            aria-hidden="true"
            style={{ background: `conic-gradient(${previewColors.join(", ")}, ${previewColors[0]})` }}
          />
          <div className="palette-preview-strip" aria-label={t("inspector.palettePreview")}>
            {previewColors.map((color, index) => (
              <span key={`${color}-${index}`} style={{ background: color, opacity: alphaDraft }} />
            ))}
          </div>
        </div>
        <div className="palette-register">
          <label className="field palette-name-field">
            <span>{t("inspector.paletteName")}</span>
            <input type="text" value={nameDraft} onChange={(event) => onNameDraftChange(event.currentTarget.value)} />
          </label>
          <label className="field color-field">
            <span>{t("inspector.paletteColor")}</span>
            <input type="color" value={previewBaseColor} onChange={(event) => onDraftChange(event.currentTarget.value)} />
            <input type="text" value={draft} onChange={(event) => onDraftChange(event.currentTarget.value)} />
          </label>
          <label className="field palette-target-field">
            <span>{t("inspector.paletteTarget")}</span>
            <select value={targetDraft} onChange={(event) => onTargetDraftChange(event.currentTarget.value as PaletteTarget)}>
              <option value="fill">{t("inspector.fill")}</option>
              <option value="stroke">{t("inspector.stroke")}</option>
            </select>
          </label>
          <SliderNumberInput
            label={t("inspector.paletteAlpha")}
            value={alphaDraft}
            min={0}
            max={1}
            step={0.05}
            decimals={2}
            onChange={onAlphaDraftChange}
          />
          <label className="field palette-name-field">
            <span>{t("inspector.paletteGroup")}</span>
            <input type="text" value={groupDraft} onChange={(event) => onGroupDraftChange(event.currentTarget.value)} />
          </label>
          <label className="field palette-target-field">
            <span>{t("inspector.palettePattern")}</span>
            <select value={modeDraft} onChange={(event) => onModeDraftChange(event.currentTarget.value as HarmonyMode)}>
              {palettePatternModes.map((mode) => (
                <option key={mode} value={mode}>
                  {t(harmonyLabelKey(mode))}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="secondary-button" onClick={onAdd}>
            {t("inspector.addColor")}
          </button>
          <button type="button" className="secondary-button" disabled={!selectedColorId} onClick={onUpdate}>
            {t("inspector.updateColor")}
          </button>
          <button type="button" className="secondary-button wide-button palette-save-button" onClick={onSavePalette}>
            {t("inspector.savePalette")}
          </button>
        </div>
      </div>
      <div className="button-grid harmony-grid">
        {(["analogous", "complementary", "split", "triad"] as HarmonyMode[]).map((mode) => (
          <button key={mode} type="button" className="ghost-button" onClick={() => onGenerateHarmony(mode)}>
            {t(harmonyLabelKey(mode))}
          </button>
        ))}
      </div>
      {savedPalettes.length > 0 ? (
        <div className="saved-palette-list" aria-label={t("inspector.savedPalettes")}>
          {savedPalettes.map((palette) => (
            <div className="saved-palette-row" key={palette.id}>
              <div className="saved-palette-header">
                <span>{palette.name}</span>
                <small>
                  {t(harmonyLabelKey(palette.mode))} / {palette.colors.length}
                </small>
                <button
                  type="button"
                  className="mini-icon-button danger"
                  title={t("inspector.deletePalette", { name: palette.name })}
                  onClick={() => onDeleteSavedPalette(palette.id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="saved-palette-colors">
                {palette.colors.map((color, index) => (
                  <div className="saved-palette-color" key={`${palette.id}-${color}-${index}`}>
                    <span className="saved-palette-swatch" style={{ background: color }} />
                    <button type="button" className="ghost-button" disabled={selectedCount === 0} onClick={() => onApply(color, "fill")}>
                      {t("inspector.fill")}
                    </button>
                    <button type="button" className="ghost-button" disabled={selectedCount === 0} onClick={() => onApply(color, "stroke")}>
                      {t("inspector.stroke")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {groups.length > 0 ? (
        <div className="palette-group-list" aria-label={t("inspector.paletteGroups")}>
          {groups.map((group) => (
            <button
              key={group.name}
              type="button"
              className="secondary-button palette-group-button"
              disabled={selectedCount === 0}
              onClick={() => onApplyGroup(group.name)}
            >
              <span>{group.name}</span>
              <span className="palette-group-swatches">
                {group.colors.slice(0, 6).map((color) => (
                  <i key={color.id} style={{ background: color.value, opacity: color.alpha }} />
                ))}
              </span>
              <small className="palette-group-count">{group.colors.length}</small>
            </button>
          ))}
        </div>
      ) : null}
      <div className="swatch-grid" aria-label={t("inspector.registeredColors")} style={{ height: listHeight }}>
        {colors.map((color) => (
          <div className={`swatch-row ${selectedColorId === color.id ? "selected" : ""}`} key={color.id}>
            <button
              type="button"
              className="swatch"
              aria-label={t("inspector.applyColor", { name: color.name, target: paletteTargetLabel(color.target, t) })}
              title={t("inspector.applyColor", { name: color.name, target: paletteTargetLabel(color.target, t) })}
              style={{ background: color.value }}
              disabled={selectedCount === 0}
              onClick={() => onApply(color.value, color.target)}
            />
            <button
              type="button"
              className="ghost-button swatch-apply-button"
              disabled={selectedCount === 0}
              onClick={() => onApply(color.value, color.target)}
            >
              {paletteTargetLabel(color.target, t)}
            </button>
            <div className="swatch-meta">
              <button type="button" className="swatch-edit-button" onClick={() => onSelectColor(color.id)}>
                <span className="swatch-name">{color.name}</span>
                <span className="swatch-value">
                  {color.value} / {Math.round(color.alpha * 100)}%
                  {color.groupName ? ` / ${color.groupName}` : ""}
                </span>
              </button>
            </div>
            <button type="button" className="mini-icon-button danger" title={t("inspector.deleteColor", { name: color.name })} onClick={() => onDelete(color.id)}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      <ResizeHandle label={t("inspector.resizeColorList")} onResize={onResizeList} />
    </section>
  );
}

function GroupTransformControls({
  selectedCount,
  moveX,
  moveY,
  rotation,
  onMoveXChange,
  onMoveYChange,
  onRotationChange,
  onMatchRotation,
  t,
}: {
  selectedCount: number;
  moveX: number;
  moveY: number;
  rotation: number;
  onMoveXChange: (value: number) => void;
  onMoveYChange: (value: number) => void;
  onRotationChange: (value: number) => void;
  onMatchRotation: () => void;
  t: Translator;
}) {
  return (
    <section className="panel-section inspector-section">
      <div className="section-heading">
        <Move size={16} />
        <h2>{t("inspector.relativeEdit")}</h2>
        <span className="section-count">{selectedCount}</span>
      </div>
      <p className="selection-note">{t("inspector.relativeNote")}</p>
      <div className="field-stack">
        <div className="field-grid two">
          <SliderNumberInput
            label={t("inspector.moveX")}
            value={moveX}
            min={-640}
            max={640}
            step={1}
            onChange={onMoveXChange}
          />
          <SliderNumberInput
            label={t("inspector.moveY")}
            value={moveY}
            min={-640}
            max={640}
            step={1}
            onChange={onMoveYChange}
          />
        </div>
        <SliderNumberInput
          label={t("inspector.rotationDelta")}
          value={rotation}
          min={-180}
          max={180}
          step={1}
          suffix="deg"
          icon={<RotateCw size={14} />}
          onChange={onRotationChange}
        />
        <button
          type="button"
          className="secondary-button icon-text wide-button"
          disabled={selectedCount < 2}
          onClick={onMatchRotation}
        >
          <RotateCw size={16} /> {t("inspector.matchRotation")}
        </button>
      </div>
    </section>
  );
}

function DeleteLayerDialog({
  layer,
  onCancel,
  onConfirm,
  t,
}: {
  layer: ThumbnailLayer;
  onCancel: () => void;
  onConfirm: () => void;
  t: Translator;
}) {
  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-layer-title">
        <div className="modal-title-block">
          <h2 id="delete-layer-title">{t("inspector.deleteQuestion")}</h2>
        </div>
        <p>
          {t("inspector.deleteCopy", { name: layer.name })}
        </p>
        <div className="confirm-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {t("inspector.cancel")}
          </button>
          <button type="button" className="primary-button danger-button" onClick={onConfirm}>
            {t("inspector.delete")}
          </button>
        </div>
      </section>
    </div>
  );
}

function paletteTargetLabel(target: PaletteTarget, t: Translator): string {
  return target === "fill" ? t("inspector.fill") : t("inspector.stroke");
}

function harmonyLabelKey(mode: HarmonyMode) {
  const keys = {
    analogous: "inspector.harmony.analogous",
    complementary: "inspector.harmony.complementary",
    split: "inspector.harmony.split",
    triad: "inspector.harmony.triad",
    square: "inspector.harmony.square",
    compound: "inspector.harmony.compound",
    shades: "inspector.harmony.shades",
    monochromatic: "inspector.harmony.monochromatic",
  } as const;
  return keys[mode];
}

const palettePatternModes: HarmonyMode[] = [
  "analogous",
  "complementary",
  "split",
  "triad",
  "square",
  "compound",
  "shades",
  "monochromatic",
];

function groupPaletteRows(colors: PaletteColor[]): Array<{ name: string; colors: PaletteColor[]; fill?: PaletteColor; stroke?: PaletteColor }> {
  const groups = new Map<string, { name: string; colors: PaletteColor[]; fill?: PaletteColor; stroke?: PaletteColor }>();
  for (const color of colors) {
    if (!color.groupName) continue;
    const group = groups.get(color.groupName) ?? { name: color.groupName, colors: [] };
    group.colors.push(color);
    if (color.target === "fill" && !group.fill) group.fill = color;
    if (color.target === "stroke" && !group.stroke) group.stroke = color;
    groups.set(color.groupName, group);
  }
  return Array.from(groups.values());
}

function isKeyboardInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select")) || target.isContentEditable;
}

function ImageControls({
  selected,
  assets,
  onUpdateLayer,
  t,
}: {
  selected: Extract<ThumbnailLayer, { type: "image" }>;
  assets: ImageAsset[];
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
  t: Translator;
}) {
  return (
    <>
      <label className="field">
        <span>{t("inspector.imageKey")}</span>
        <select
          value={selected.imageKey}
          disabled={assets.length < 2}
          onChange={(event) => {
            const imageKey = event.currentTarget.value;
            onUpdateLayer(selected.id, (layer) => ({ ...layer, imageKey }));
          }}
        >
          {assets.map((asset) => (
            <option key={asset.key} value={asset.key}>
              {asset.name}
            </option>
          ))}
        </select>
      </label>
      <div className="field-grid two">
        <EffectInput selected={selected} effect="grayscale" label={t("inspector.gray")} min={0} max={1} step={0.05} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="blur" label={t("inspector.blur")} min={0} max={24} step={1} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="brightness" label={t("inspector.bright")} min={0} max={180} step={1} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="contrast" label={t("inspector.contrast")} min={0} max={180} step={1} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="mosaic" label={t("inspector.mosaic")} min={0} max={48} step={1} onUpdateLayer={onUpdateLayer} />
      </div>
    </>
  );
}

function TextControls({
  selected,
  fontOptions,
  onUpdateLayer,
  onCustomFontFiles,
  onFitTextToBounds,
  t,
}: {
  selected: Extract<ThumbnailLayer, { type: "text" }>;
  fontOptions: FontOption[];
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
  onCustomFontFiles: InspectorPanelProps["onCustomFontFiles"];
  onFitTextToBounds: InspectorPanelProps["onFitTextToBounds"];
  t: Translator;
}) {
  return (
    <>
      <label className="field">
        <span>{t("inspector.text")}</span>
        <textarea
          className="mini-textarea"
          value={selected.text}
          onChange={(event) => {
            const text = event.currentTarget.value;
            onUpdateLayer(selected.id, (layer) => ({ ...layer, text }));
          }}
        />
      </label>
      <div className="field-grid two">
        <SliderNumberInput
          label={t("inspector.fontSize")}
          value={selected.fontSize}
          min={8}
          max={240}
          step={1}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, fontSize: value }))}
        />
        <SliderNumberInput
          label={t("inspector.stroke")}
          value={selected.strokeWidth}
          min={0}
          max={48}
          step={1}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeWidth: value }))}
        />
        <SliderNumberInput
          label={t("inspector.kerning")}
          value={selected.letterSpacing}
          min={-8}
          max={48}
          step={1}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => (layer.type === "text" ? { ...layer, letterSpacing: value } : layer))}
        />
      </div>
      <button type="button" className="secondary-button icon-text wide-button" onClick={() => onFitTextToBounds(selected.id)}>
        <Type size={16} /> {t("inspector.fitText")}
      </button>
      <label className="field">
        <span>{t("inspector.font")}</span>
        <select
          value={selected.fontFamily}
          onChange={(event) => {
            const fontFamily = event.currentTarget.value;
            onUpdateLayer(selected.id, (layer) => ({ ...layer, fontFamily }));
          }}
        >
          {!fontOptions.some((option) => option.value === selected.fontFamily) ? (
            <option value={selected.fontFamily}>{fontLabelFor(selected.fontFamily)}</option>
          ) : null}
          {fontOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>{t("inspector.writingMode")}</span>
        <select
          value={selected.writingMode}
          onChange={(event) => {
            const writingMode = event.currentTarget.value as TextWritingMode;
            onUpdateLayer(selected.id, (layer) => (layer.type === "text" ? { ...layer, writingMode } : layer));
          }}
        >
          <option value="horizontal">{t("inspector.writingHorizontal")}</option>
          <option value="vertical">{t("inspector.writingVertical")}</option>
        </select>
      </label>
      <label className="file-drop compact-drop custom-font-drop" title="WOFF2, WOFF, TTF, or OTF">
        <Upload size={15} />
        <span>{t("inspector.addFont")}</span>
        <input
          type="file"
          accept={acceptedFontFileTypes}
          onChange={(event) => {
            onCustomFontFiles(event.currentTarget.files);
            event.currentTarget.value = "";
          }}
        />
      </label>
      <div className="field-grid two">
        <ColorInput
          label={t("inspector.fill")}
          value={selected.color}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, color: value }))}
        />
        <ColorInput
          label={t("inspector.outline")}
          value={selected.strokeColor}
          disabled={selected.strokeWidth <= 0}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeColor: value }))}
        />
        <SliderNumberInput
          label={t("inspector.fillOpacity")}
          value={selected.fillOpacity}
          min={0}
          max={1}
          step={0.05}
          decimals={2}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => (layer.type === "text" ? { ...layer, fillOpacity: value } : layer))}
        />
        <SliderNumberInput
          label={t("inspector.strokeOpacity")}
          value={selected.strokeOpacity}
          min={0}
          max={1}
          step={0.05}
          decimals={2}
          disabled={selected.strokeWidth <= 0}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => (layer.type === "text" ? { ...layer, strokeOpacity: value } : layer))}
        />
      </div>
      <SliderNumberInput
        label={t("inspector.lineHeight")}
        value={selected.lineHeight}
        min={0.5}
        max={2}
        step={0.01}
        decimals={2}
        disabled={!hasMultipleLines(selected.text)}
        onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, lineHeight: value }))}
      />
      <div className="field">
        <span>{t("inspector.textAlign")}</span>
        <div className="segmented-control text-align-control" role="radiogroup" aria-label={t("inspector.textAlign")}>
          <TextAlignButton
            align="left"
            current={selected.align}
            label={t("inspector.left")}
            onSelect={(align) => onUpdateLayer(selected.id, (layer) => ({ ...layer, align }))}
          >
            <AlignHorizontalJustifyStart size={16} />
          </TextAlignButton>
          <TextAlignButton
            align="center"
            current={selected.align}
            label={t("inspector.center")}
            onSelect={(align) => onUpdateLayer(selected.id, (layer) => ({ ...layer, align }))}
          >
            <AlignHorizontalJustifyCenter size={16} />
          </TextAlignButton>
          <TextAlignButton
            align="right"
            current={selected.align}
            label={t("inspector.right")}
            onSelect={(align) => onUpdateLayer(selected.id, (layer) => ({ ...layer, align }))}
          >
            <AlignHorizontalJustifyEnd size={16} />
          </TextAlignButton>
        </div>
      </div>
    </>
  );
}

function TextAlignButton({
  align,
  current,
  label,
  children,
  onSelect,
}: {
  align: TextAlign;
  current: TextAlign;
  label: string;
  children: ReactNode;
  onSelect: (align: TextAlign) => void;
}) {
  const selected = align === current;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={selected ? "selected" : ""}
      title={label}
      onClick={() => onSelect(align)}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

function ShapeControls({
  selected,
  onUpdateLayer,
  t,
}: {
  selected: Extract<ThumbnailLayer, { type: "shape" }>;
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
  t: Translator;
}) {
  return (
    <>
      <label className="field">
        <span>{t("inspector.shape")}</span>
        <select
          value={selected.shape}
          onChange={(event) => {
            const shape = event.currentTarget.value as ShapeKind;
            onUpdateLayer(selected.id, (layer) => ({ ...layer, shape }));
          }}
        >
          <option value="rect">{t("inspector.rect")}</option>
          <option value="ellipse">{t("inspector.ellipse")}</option>
          <option value="triangle">{t("inspector.triangle")}</option>
          <option value="line">{t("inspector.line")}</option>
        </select>
      </label>
      {selected.shape === "line" ? (
        <label className="field">
          <span>{t("inspector.lineStyle")}</span>
          <select
            value={selected.lineStyle}
            onChange={(event) => {
              const lineStyle = event.currentTarget.value as LineStyle;
              onUpdateLayer(selected.id, (layer) => (layer.type === "shape" ? { ...layer, lineStyle } : layer));
            }}
          >
            <option value="solid">{t("inspector.lineSolid")}</option>
            <option value="dotted">{t("inspector.lineDotted")}</option>
            <option value="dashed">{t("inspector.lineDashed")}</option>
            <option value="wave">{t("inspector.lineWave")}</option>
          </select>
        </label>
      ) : null}
      <div className="field-grid two">
        <ColorInput
          label={t("inspector.fill")}
          value={selected.fill}
          disabled={selected.shape === "line"}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, fill: value }))}
        />
        <ColorInput
          label={t("inspector.stroke")}
          value={selected.strokeColor}
          disabled={selected.strokeWidth <= 0}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeColor: value }))}
        />
        <SliderNumberInput
          label={t("inspector.fillOpacity")}
          value={selected.fillOpacity}
          min={0}
          max={1}
          step={0.05}
          decimals={2}
          disabled={selected.shape === "line"}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => (layer.type === "shape" ? { ...layer, fillOpacity: value } : layer))}
        />
        <SliderNumberInput
          label={t("inspector.strokeWidth")}
          value={selected.strokeWidth}
          min={0}
          max={48}
          step={1}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeWidth: value }))}
        />
        <SliderNumberInput
          label={t("inspector.strokeOpacity")}
          value={selected.strokeOpacity}
          min={0}
          max={1}
          step={0.05}
          decimals={2}
          disabled={selected.strokeWidth <= 0}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => (layer.type === "shape" ? { ...layer, strokeOpacity: value } : layer))}
        />
      </div>
    </>
  );
}

function EffectInput({
  selected,
  effect,
  label,
  min,
  max,
  step,
  onUpdateLayer,
}: {
  selected: Extract<ThumbnailLayer, { type: "image" }>;
  effect: keyof ImageEffects;
  label: string;
  min: number;
  max: number;
  step: number;
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
}) {
  return (
    <SliderNumberInput
      label={label}
      value={selected.effects[effect]}
      min={min}
      max={max}
      step={step}
      decimals={step < 1 ? 2 : 0}
      onChange={(value) =>
        onUpdateLayer(selected.id, (layer) =>
          layer.type === "image"
            ? {
                ...layer,
                effects: { ...layer.effects, [effect]: value },
              }
            : layer,
        )
      }
    />
  );
}

function SliderNumberInput({
  label,
  value,
  min,
  max,
  step,
  decimals = 0,
  suffix = "",
  icon,
  disabled = false,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  decimals?: number;
  suffix?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  const rounded = round(value, decimals);
  return (
    <label className={`range-field slider-number ${disabled ? "field-disabled" : ""}`}>
      <span>
        {icon}
        {label}
        {suffix ? <span className="field-unit"> {suffix}</span> : null}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={rounded}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={rounded}
        disabled={disabled}
        onChange={(event) => onChange(Number.parseFloat(event.currentTarget.value) || 0)}
      />
    </label>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="text" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  );
}

function ColorInput({
  label,
  value,
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className={`field color-field ${disabled ? "field-disabled" : ""}`}>
      <span>{label}</span>
      <input type="color" value={value} disabled={disabled} onChange={(event) => onChange(event.currentTarget.value)} />
      <input type="text" value={value} disabled={disabled} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  );
}

function updateNumber(
  selected: ThumbnailLayer,
  key: "x" | "y" | "width" | "height" | "rotation" | "opacity" | "layerBlur" | "edgeBlur" | "cornerRadius",
  value: number,
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"],
) {
  onUpdateLayer(selected.id, (layer) => ({ ...layer, [key]: value }));
}

function round(value: number, decimals = 0): number {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

function hasMultipleLines(value: string): boolean {
  return /\r|\n/.test(value);
}

function clampPanelHeight(value: number): number {
  return Math.min(720, Math.max(220, Math.round(value)));
}
