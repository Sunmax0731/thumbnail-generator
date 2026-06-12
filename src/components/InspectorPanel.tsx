import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent as ReactDragEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { Sketch, hexToHsva } from "@uiw/react-color";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  ChevronDown,
  ChevronRight,
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
  ImagePlus,
  Layers,
  Lock,
  MousePointer2,
  Move,
  Palette,
  Play,
  RotateCcw,
  RotateCw,
  Shapes,
  SlidersHorizontal,
  Trash2,
  Type,
  Unlock,
  Upload,
  X,
} from "lucide-react";
import type { AlignmentMode } from "../lib/alignment";
import { acceptedFontFileTypes } from "../lib/customFonts";
import { easingOptions, evaluateEasing } from "../lib/easings";
import { animationTypeUsesDirection } from "../lib/animation";
import { fontLabelFor, type FontOption } from "../lib/fonts";
import { defaultAnimation, normalizeAnimations } from "../lib/layerFactory";
import { renderThumbnailToCanvas } from "../lib/renderCanvas";
import {
  derivePaletteBaseFromSchemeColor,
  generatePaletteSchemeColors,
  hexToRgbChannels,
  paletteModesByPrinciple,
  palettePrinciples,
  type PalettePrinciple,
  normalizeColor,
  parseRgbColorInput,
  rgbChannelsToHex,
  type HarmonyMode,
  type PaletteColor,
  type PaletteTarget,
  resolveHarmonyMode,
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
  LayerAnimationDirection,
  LayerAnimationEasing,
  LayerAnimationType,
  LineStyle,
  OutputSettings,
  ShapeKind,
  TextAlign,
  TextWritingMode,
  ThumbnailLayer,
} from "../lib/types";

type InspectorSection = "layers" | "edit" | "colors" | "motion";
type LayerColorTarget = "textFill" | "textStroke" | "shapeFill" | "shapeStroke";

interface LayerColorPickerState {
  layerId: string;
  target: LayerColorTarget;
  label: string;
  color: string;
  alpha: number;
}

interface InspectorPanelProps {
  assets: ImageAsset[];
  layers: ThumbnailLayer[];
  selectedIds: string[];
  settings: OutputSettings;
  paletteColors: PaletteColor[];
  paletteDraft: string;
  paletteNameDraft: string;
  paletteAlphaDraft: number;
  paletteModeDraft: HarmonyMode;
  palettePrincipleDraft: PalettePrinciple;
  selectedPaletteColorId: string | null;
  savedColorPalettes: SavedColorPalette[];
  fontOptions: FontOption[];
  onPaletteDraftChange: (value: string) => void;
  onPaletteNameDraftChange: (value: string) => void;
  onPaletteAlphaDraftChange: (value: number) => void;
  onPaletteModeDraftChange: (value: HarmonyMode) => void;
  onPalettePrincipleDraftChange: (value: PalettePrinciple) => void;
  onSelectPaletteColor: (id: string) => void;
  onAddPaletteColor: () => void;
  onUpdatePaletteColor: () => void;
  onDeletePaletteColor: (id: string) => void;
  onSaveCurrentColorPalette: (colors?: string[]) => void;
  onDeleteSavedColorPalette: (id: string) => void;
  onReorderPaletteColor: (draggedId: string, targetId: string) => void;
  onReorderSavedColorPalette: (draggedId: string, targetId: string) => void;
  onApplyPaletteColor: (color: string, target: PaletteTarget, alpha?: number) => void;
  onSelect: (id: string, additive?: boolean) => void;
  onSelectIndividual: (id: string) => void;
  onUpdateLayer: (id: string, updater: (layer: ThumbnailLayer) => ThumbnailLayer) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onReorderLayer: (draggedId: string, targetId: string) => void;
  onToggleVisible: (id: string) => void;
  onToggleSelectable: (id: string) => void;
  selectedAssetKey: string;
  onAddText: () => void;
  onAddShape: () => void;
  onAddLineLayer: () => void;
  onAddQuickLayer: (kind: "headline" | "subtitle" | "badge" | "divider") => void;
  onAddImageAssetLayer: (key: string) => void;
  onResetTemplate: () => void;
  onAlignSelection: (mode: AlignmentMode) => void;
  onTransformSelection: (transform: RelativeLayerTransform) => void;
  onMatchSelectionRotation: () => void;
  onCreateGroup: (name: string) => void;
  onRenameGroup: (groupId: string, name: string) => void;
  onUngroup: (groupId: string) => void;
  onFitSelectedToCanvas: () => void;
  onCustomFontFiles: (files: FileList | null) => void;
  onFitTextToBounds: (id: string) => void;
  onOpenImageColorPalette: () => void;
  isExtractingImagePalette: boolean;
  hasSelectedImageLayer: boolean;
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
  paletteAlphaDraft,
  paletteModeDraft,
  palettePrincipleDraft,
  selectedPaletteColorId,
  savedColorPalettes,
  fontOptions,
  onPaletteDraftChange,
  onPaletteNameDraftChange,
  onPaletteAlphaDraftChange,
  onPaletteModeDraftChange,
  onPalettePrincipleDraftChange,
  onSelectPaletteColor,
  onAddPaletteColor,
  onUpdatePaletteColor,
  onDeletePaletteColor,
  onSaveCurrentColorPalette,
  onDeleteSavedColorPalette,
  onReorderPaletteColor,
  onReorderSavedColorPalette,
  onApplyPaletteColor,
  onSelect,
  onSelectIndividual,
  onUpdateLayer,
  onDelete,
  onDuplicate,
  onMove,
  onReorderLayer,
  onToggleVisible,
  onToggleSelectable,
  selectedAssetKey,
  onAddText,
  onAddShape,
  onAddLineLayer,
  onAddQuickLayer,
  onAddImageAssetLayer,
  onResetTemplate,
  onAlignSelection,
  onTransformSelection,
  onMatchSelectionRotation,
  onCreateGroup,
  onRenameGroup,
  onUngroup,
  onFitSelectedToCanvas,
  onCustomFontFiles,
  onFitTextToBounds,
  onOpenImageColorPalette,
  isExtractingImagePalette,
  hasSelectedImageLayer,
  t,
}: InspectorPanelProps) {
  const selectedLayers = layers.filter((layer) => selectedIds.includes(layer.id) && layer.selectable);
  const selected = selectedLayers.length === 1 ? selectedLayers[0] : undefined;
  const paletteCompatibleCount = selectedLayers.filter((layer) => layer.type === "text" || layer.type === "shape").length;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<InspectorSection>("edit");
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [relativeTransform, setRelativeTransform] = useState(emptyLiveRelativeTransformState);
  const [layerListHeight, setLayerListHeight] = useState(360);
  const [colorListHeight, setColorListHeight] = useState(320);
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(true);
  const [isLayerListExpanded, setIsLayerListExpanded] = useState(true);
  const [layerColorPicker, setLayerColorPicker] = useState<LayerColorPickerState | null>(null);
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
      if (document.querySelector(".confirm-backdrop, .image-lab-backdrop, .layer-color-popup")) return;
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

  const openLayerColorPicker = (state: LayerColorPickerState) => {
    setLayerColorPicker(state);
  };

  const applyLayerColorPicker = (color: string, alpha: number) => {
    const target = layerColorPicker;
    if (!target) return;
    onUpdateLayer(target.layerId, (layer) => {
      if (target.target === "textFill" && layer.type === "text") return { ...layer, color, fillOpacity: alpha };
      if (target.target === "textStroke" && layer.type === "text") return { ...layer, strokeColor: color, strokeOpacity: alpha };
      if (target.target === "shapeFill" && layer.type === "shape") return { ...layer, fill: color, fillOpacity: alpha };
      if (target.target === "shapeStroke" && layer.type === "shape") return { ...layer, strokeColor: color, strokeOpacity: alpha };
      return layer;
    });
    setLayerColorPicker(null);
  };

  return (
    <aside className="side-panel inspector-panel" aria-label={t("inspector.aria")}>
      <div className="panel-tabs inspector-tabs" role="tablist" aria-label={t("inspector.tabs")}>
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
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "motion"}
          className={activeSection === "motion" ? "selected" : ""}
          onClick={() => setActiveSection("motion")}
        >
          <Play size={15} /> {t("inspector.motion")}
        </button>
      </div>

      {activeSection === "layers" ? (
        <>
          <section className="panel-section quick-add-section">
            <button
              type="button"
              className="collapsible-heading"
              aria-expanded={isQuickAddExpanded}
              onClick={() => setIsQuickAddExpanded((current) => !current)}
            >
              {isQuickAddExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>{t("left.quickLayers")}</span>
            </button>
            {isQuickAddExpanded ? (
              <>
                <div className="button-grid">
                  <button type="button" className="secondary-button icon-text" onClick={onAddText}>
                    <Type size={16} /> {t("left.text")}
                  </button>
                  <button type="button" className="secondary-button icon-text" onClick={onAddShape}>
                    <Shapes size={16} /> {t("left.shape")}
                  </button>
                  <button type="button" className="secondary-button icon-text" onClick={onAddLineLayer}>
                    <GripHorizontal size={16} /> {t("left.line")}
                  </button>
                  <button type="button" className="secondary-button icon-text" onClick={() => onAddImageAssetLayer(selectedAssetKey)} disabled={!selectedAssetKey}>
                    <ImagePlus size={16} /> {t("left.addAssetLayer")}
                  </button>
                  <button type="button" className="secondary-button icon-text" onClick={() => onAddQuickLayer("headline")}>
                    <Type size={16} /> {t("left.headline")}
                  </button>
                  <button type="button" className="secondary-button icon-text" onClick={() => onAddQuickLayer("subtitle")}>
                    <Type size={16} /> {t("left.subtitle")}
                  </button>
                  <button type="button" className="secondary-button icon-text" onClick={() => onAddQuickLayer("badge")}>
                    <Shapes size={16} /> {t("left.badge")}
                  </button>
                  <button type="button" className="secondary-button icon-text" onClick={() => onAddQuickLayer("divider")}>
                    <Shapes size={16} /> {t("left.divider")}
                  </button>
                </div>
                <button type="button" className="ghost-button wide-button" onClick={onResetTemplate}>
                  {t("left.restoreSample")}
                </button>
              </>
            ) : null}
          </section>

          <section className="panel-section layer-section">
            <button
              type="button"
              className="collapsible-heading"
              aria-expanded={isLayerListExpanded}
              onClick={() => setIsLayerListExpanded((current) => !current)}
            >
              {isLayerListExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>{t("inspector.layers")}</span>
              <span className="section-count">{layers.length}</span>
            </button>
            {isLayerListExpanded ? (
              <>
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
              </>
            ) : null}
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
              <AlignButton
                label={t("inspector.distributeHorizontal")}
                mode="distribute-horizontal"
                onAlignSelection={onAlignSelection}
                disabled={selectedLayers.length < 3}
              >
                <GripHorizontal size={16} />
              </AlignButton>
              <AlignButton
                label={t("inspector.distributeVertical")}
                mode="distribute-vertical"
                onAlignSelection={onAlignSelection}
                disabled={selectedLayers.length < 3}
              >
                <GripVertical size={16} />
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
          alphaDraft={paletteAlphaDraft}
          modeDraft={paletteModeDraft}
          principleDraft={palettePrincipleDraft}
          selectedColorId={selectedPaletteColorId}
          savedPalettes={savedColorPalettes}
          selectedCount={paletteCompatibleCount}
          onDraftChange={onPaletteDraftChange}
          onNameDraftChange={onPaletteNameDraftChange}
          onAlphaDraftChange={onPaletteAlphaDraftChange}
          onModeDraftChange={onPaletteModeDraftChange}
          onPrincipleDraftChange={onPalettePrincipleDraftChange}
          onSelectColor={onSelectPaletteColor}
          onAdd={onAddPaletteColor}
          onUpdate={onUpdatePaletteColor}
          onDelete={onDeletePaletteColor}
          onSavePalette={onSaveCurrentColorPalette}
          onDeleteSavedPalette={onDeleteSavedColorPalette}
          onReorderColor={onReorderPaletteColor}
          onReorderSavedPalette={onReorderSavedColorPalette}
          onApply={onApplyPaletteColor}
          listHeight={colorListHeight}
          onResizeList={(delta) => setColorListHeight((height) => clampPanelHeight(height + delta))}
          t={t}
          onOpenImageColorPalette={onOpenImageColorPalette}
          isExtractingImagePalette={isExtractingImagePalette}
          hasSelectedImageLayer={hasSelectedImageLayer}
        />
      ) : null}

      {activeSection === "motion" ? (
        selected ? (
          <MotionControls selected={selected} assets={assets} settings={settings} onUpdateLayer={onUpdateLayer} t={t} />
        ) : (
          <section className="panel-section">
            <div className="section-heading">
              <Play size={16} />
              <h2>{t("inspector.motionSettings")}</h2>
            </div>
            <p className="selection-note">{t("inspector.noEditableSelection")}</p>
          </section>
        )
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
              <CollapsibleControlGroup title={t("inspector.layerControls")}>
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
                {selected.type === "image" || selected.type === "shape" ? (
                  <button type="button" className="secondary-button icon-text wide-button" onClick={onFitSelectedToCanvas}>
                    <Move size={16} /> {t("inspector.fitToCanvas")}
                  </button>
                ) : null}
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
                <div className="field-grid two compact-adjust-grid">
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
                      onChange={(event) => {
                        const edgeBlurStroke = event.currentTarget.checked;
                        onUpdateLayer(selected.id, (layer) => ({ ...layer, edgeBlurStroke }));
                      }}
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
                <DecorationControls selected={selected} onUpdateLayer={onUpdateLayer} t={t} />
              </CollapsibleControlGroup>

              {selected.type === "image" && (
                <CollapsibleControlGroup title={t("inspector.imageControls")}>
                  <ImageControls selected={selected} assets={assets} onUpdateLayer={onUpdateLayer} t={t} />
                </CollapsibleControlGroup>
              )}
              {selected.type === "text" && (
                <CollapsibleControlGroup title={t("inspector.textControls")}>
                  <TextControls
                    selected={selected}
                    fontOptions={fontOptions}
                    onUpdateLayer={onUpdateLayer}
                    onCustomFontFiles={onCustomFontFiles}
                    onFitTextToBounds={onFitTextToBounds}
                    onOpenColorPicker={openLayerColorPicker}
                    t={t}
                  />
                </CollapsibleControlGroup>
              )}
              {selected.type === "shape" && (
                <CollapsibleControlGroup title={t("inspector.shapeControls")}>
                  <ShapeControls selected={selected} onUpdateLayer={onUpdateLayer} onOpenColorPicker={openLayerColorPicker} t={t} />
                </CollapsibleControlGroup>
              )}
            </div>
          </section>
        ) : selectedLayers.length > 1 ? (
          <GroupTransformControls
            selectedCount={selectedLayers.length}
            canvasFitEligibleCount={canvasFitEligibleCount}
            moveX={relativeTransform.moveX}
            moveY={relativeTransform.moveY}
            rotation={relativeTransform.rotation}
            onMoveXChange={(value) => updateLiveRelativeTransform("moveX", value)}
            onMoveYChange={(value) => updateLiveRelativeTransform("moveY", value)}
            onRotationChange={(value) => updateLiveRelativeTransform("rotation", value)}
            onMatchRotation={onMatchSelectionRotation}
            onFitSelectedToCanvas={onFitSelectedToCanvas}
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
      {layerColorPicker ? (
        <LayerColorPickerDialog
          state={layerColorPicker}
          onApply={applyLayerColorPicker}
          onClose={() => setLayerColorPicker(null)}
          t={t}
        />
      ) : null}
    </aside>
  );
}

function DecorationControls({
  selected,
  onUpdateLayer,
  t,
}: {
  selected: ThumbnailLayer;
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
  t: Translator;
}) {
  const shadowEnabled = selected.shadowOpacity > 0;

  return (
    <div className="field-stack compact-decoration-controls">
      <div className="field-grid two compact-adjust-grid">
        <SliderNumberInput
          label={t("inspector.rotateX")}
          value={selected.rotateX}
          min={-75}
          max={75}
          step={1}
          suffix="deg"
          onChange={(value) => updateNumber(selected, "rotateX", value, onUpdateLayer)}
        />
        <SliderNumberInput
          label={t("inspector.rotateY")}
          value={selected.rotateY}
          min={-75}
          max={75}
          step={1}
          suffix="deg"
          onChange={(value) => updateNumber(selected, "rotateY", value, onUpdateLayer)}
        />
        <SliderNumberInput
          label={t("inspector.bevelSize")}
          value={selected.bevelSize}
          min={-48}
          max={48}
          step={1}
          onChange={(value) => updateNumber(selected, "bevelSize", value, onUpdateLayer)}
        />
        <SliderNumberInput
          label={t("inspector.bevelOpacity")}
          value={selected.bevelOpacity}
          min={0}
          max={1}
          step={0.05}
          decimals={2}
          onChange={(value) => updateNumber(selected, "bevelOpacity", value, onUpdateLayer)}
        />
      </div>
      <label className="checkbox-row inline-checkbox">
        <input
          type="checkbox"
          checked={shadowEnabled}
          onChange={(event) => {
            const checked = event.currentTarget.checked;
            onUpdateLayer(selected.id, (layer) => ({
              ...layer,
              shadowOpacity: checked ? Math.max(layer.shadowOpacity, 0.45) : 0,
              shadowBlur: checked ? Math.max(layer.shadowBlur, 18) : layer.shadowBlur,
              shadowDistance: checked ? Math.max(layer.shadowDistance, 18) : layer.shadowDistance,
            }));
          }}
        />
        <span>{t("inspector.shadowEnabled")}</span>
      </label>
      {shadowEnabled ? (
        <>
          <label className="field">
            <span>{t("inspector.shadowColor")}</span>
            <input
              type="color"
              value={normalizeColorInput(selected.shadowColor)}
              onChange={(event) => {
                const shadowColor = event.currentTarget.value;
                onUpdateLayer(selected.id, (layer) => ({ ...layer, shadowColor }));
              }}
            />
          </label>
          <div className="field-grid two compact-adjust-grid">
            <SliderNumberInput
              label={t("inspector.shadowOpacity")}
              value={selected.shadowOpacity}
              min={0}
              max={1}
              step={0.05}
              decimals={2}
              onChange={(value) => updateNumber(selected, "shadowOpacity", value, onUpdateLayer)}
            />
            <SliderNumberInput
              label={t("inspector.shadowBlur")}
              value={selected.shadowBlur}
              min={0}
              max={96}
              step={1}
              onChange={(value) => updateNumber(selected, "shadowBlur", value, onUpdateLayer)}
            />
            <SliderNumberInput
              label={t("inspector.shadowDistance")}
              value={selected.shadowDistance}
              min={0}
              max={240}
              step={1}
              onChange={(value) => updateNumber(selected, "shadowDistance", value, onUpdateLayer)}
            />
            <SliderNumberInput
              label={t("inspector.shadowAngle")}
              value={selected.shadowAngle}
              min={-180}
              max={180}
              step={1}
              suffix="deg"
              onChange={(value) => updateNumber(selected, "shadowAngle", value, onUpdateLayer)}
            />
          </div>
        </>
      ) : null}
    </div>
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

function CollapsibleControlGroup({ title, children }: { title: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="control-group">
      <button
        type="button"
        className="control-group-heading"
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        <span>{title}</span>
      </button>
      {expanded ? <div className="control-group-body">{children}</div> : null}
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
  alphaDraft,
  modeDraft,
  principleDraft,
  selectedColorId,
  savedPalettes,
  selectedCount,
  listHeight,
  onDraftChange,
  onNameDraftChange,
  onAlphaDraftChange,
  onModeDraftChange,
  onPrincipleDraftChange,
  onSelectColor,
  onAdd,
  onUpdate,
  onDelete,
  onSavePalette,
  onDeleteSavedPalette,
  onReorderColor,
  onReorderSavedPalette,
  onApply,
  onResizeList,
  onOpenImageColorPalette,
  isExtractingImagePalette,
  hasSelectedImageLayer,
  t,
}: {
  colors: PaletteColor[];
  draft: string;
  nameDraft: string;
  alphaDraft: number;
  modeDraft: HarmonyMode;
  principleDraft: PalettePrinciple;
  selectedColorId: string | null;
  savedPalettes: SavedColorPalette[];
  selectedCount: number;
  listHeight: number;
  onDraftChange: (value: string) => void;
  onNameDraftChange: (value: string) => void;
  onAlphaDraftChange: (value: number) => void;
  onModeDraftChange: (value: HarmonyMode) => void;
  onPrincipleDraftChange: (value: PalettePrinciple) => void;
  onSelectColor: (id: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: (id: string) => void;
  onSavePalette: (colors?: string[]) => void;
  onDeleteSavedPalette: (id: string) => void;
  onReorderColor: (draggedId: string, targetId: string) => void;
  onReorderSavedPalette: (draggedId: string, targetId: string) => void;
  onApply: (color: string, target: PaletteTarget, alpha?: number) => void;
  onResizeList: (deltaY: number) => void;
  onOpenImageColorPalette: () => void;
  isExtractingImagePalette: boolean;
  hasSelectedImageLayer: boolean;
  t: Translator;
}) {
  const [activePointIndex, setActivePointIndex] = useState(0);
  const [draggingPointIndex, setDraggingPointIndex] = useState<number | null>(null);
  const [savedPalettesExpanded, setSavedPalettesExpanded] = useState(true);
  const [paletteRegisterExpanded, setPaletteRegisterExpanded] = useState(true);
  const [registeredColorsExpanded, setRegisteredColorsExpanded] = useState(true);
  const resolvedModeDraft = resolveHarmonyMode(modeDraft);
  const patternModes = paletteModesByPrinciple[principleDraft] ?? paletteModesByPrinciple.order;
  const activeMode = patternModes.includes(modeDraft)
    ? modeDraft
    : patternModes.includes(resolvedModeDraft)
      ? resolvedModeDraft
      : patternModes[0];
  const previewBaseColor = normalizeColor(draft) ?? "#000000";
  const previewColors = generatePaletteSchemeColors(previewBaseColor, activeMode);
  const sketchColor = { ...hexToHsva(previewBaseColor), a: alphaDraft };

  useEffect(() => {
    if (activePointIndex >= previewColors.length) setActivePointIndex(0);
  }, [activePointIndex, previewColors.length]);

  useEffect(() => {
    if (activeMode !== modeDraft) onModeDraftChange(activeMode);
  }, [activeMode, modeDraft, onModeDraftChange]);

  const setBaseDraft = (value: string, options: { preserveActivePoint?: boolean } = {}) => {
    const normalized = normalizeColor(value) ?? parseRgbColorInput(value);
    onDraftChange(normalized ?? value);
    if (!options.preserveActivePoint) setActivePointIndex(0);
  };

  const updateLinkedPreviewPoint = (index: number, color: string) => {
    const linkedBase = derivePaletteBaseFromSchemeColor(color, index, activeMode);
    if (linkedBase) onDraftChange(linkedBase);
    setActivePointIndex(index);
  };

  const startPaletteDrag = (event: ReactDragEvent<HTMLElement>, kind: "saved" | "single", id: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `${kind}:${id}`);
  };

  const dropPaletteDrag = (event: ReactDragEvent<HTMLElement>, kind: "saved" | "single", targetId: string) => {
    event.preventDefault();
    const [dragKind, draggedId] = event.dataTransfer.getData("text/plain").split(":");
    if (dragKind !== kind || !draggedId) return;
    if (kind === "saved") onReorderSavedPalette(draggedId, targetId);
    else onReorderColor(draggedId, targetId);
  };

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
          <label className="field palette-target-field palette-wheel-pattern-field">
            <span>{t("inspector.palettePrinciple")}</span>
            <select
              value={principleDraft}
              onChange={(event) => {
                onPrincipleDraftChange(event.currentTarget.value as PalettePrinciple);
              }}
            >
              {palettePrinciples.map((principle) => (
                <option key={principle} value={principle}>
                  {t(palettePrincipleLabelKey(principle))}
                </option>
              ))}
            </select>
          </label>
          <label className="field palette-target-field palette-wheel-pattern-field">
            <span>{t("inspector.palettePattern")}</span>
            <select
              value={activeMode}
              onChange={(event) => {
                setActivePointIndex(0);
                onModeDraftChange(event.currentTarget.value as HarmonyMode);
              }}
            >
              {patternModes.map((mode) => (
                <option key={mode} value={mode}>
                  {t(harmonyLabelKey(mode))}
                </option>
              ))}
            </select>
          </label>
          <div
            className="palette-wheel"
            aria-label={t("inspector.paletteScheme")}
            onPointerDown={(event) => {
              if (event.target !== event.currentTarget) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              setDraggingPointIndex(-1);
              setBaseDraft(colorFromWheelPointer(event, event.currentTarget));
            }}
            onPointerMove={(event) => {
              if ((event.buttons & 1) !== 1 || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
              const color = colorFromWheelPointer(event, event.currentTarget);
              if (draggingPointIndex === null) return;
              if (draggingPointIndex === -1) {
                setBaseDraft(color);
              } else {
                updateLinkedPreviewPoint(draggingPointIndex, color);
              }
            }}
            onPointerUp={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              setDraggingPointIndex(null);
            }}
            onPointerCancel={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              setDraggingPointIndex(null);
            }}
          >
            {previewColors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                type="button"
                className={`palette-wheel-point ${index === 0 ? "base" : ""} ${activePointIndex === index ? "selected" : ""}`}
                style={{ ...wheelPointStyle(color, activeMode), background: color }}
                title={color}
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const wheel = event.currentTarget.parentElement;
                  if (!wheel) return;
                  wheel.setPointerCapture(event.pointerId);
                  setDraggingPointIndex(index);
                  setActivePointIndex(index);
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setActivePointIndex(index);
                }}
              />
            ))}
          </div>
        </div>
        <div className="palette-spectrum-bars" aria-label={t("inspector.paletteScheme")}>
          {previewColors.map((color, index) => (
            <button
              key={`bar-${color}-${index}`}
              type="button"
              style={{ background: color, color: readableTextColor(color) }}
              aria-label={color}
              onClick={() => setBaseDraft(color)}
            >
            </button>
          ))}
        </div>
        <div className="palette-register">
          <label className="field palette-name-field">
            <span>{t("inspector.paletteName")}</span>
            <input type="text" value={nameDraft} onChange={(event) => onNameDraftChange(event.currentTarget.value)} />
          </label>
          <button
            type="button"
            className="palette-subheading collapsible-subheading"
            aria-expanded={paletteRegisterExpanded}
            onClick={() => setPaletteRegisterExpanded((current) => !current)}
          >
            {paletteRegisterExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span>{t("inspector.paletteMaker")}</span>
          </button>
          {paletteRegisterExpanded ? (
            <div className="palette-register-picker" aria-label={`${t("inspector.paletteColor")} ${t("inspector.paletteHex")}`}>
              <div className="uiw-color-picker-panel">
                <Sketch
                  color={sketchColor}
                  onChange={(color) => {
                    setBaseDraft(color.hex);
                    onAlphaDraftChange(color.hsva.a);
                  }}
                />
              </div>
            </div>
          ) : null}
          <div className="palette-actions">
            <button type="button" className="secondary-button" onClick={onAdd}>
              {t("inspector.addColor")}
            </button>
            <button type="button" className="secondary-button" disabled={!selectedColorId} onClick={onUpdate}>
              {t("inspector.updateColor")}
            </button>
            <button type="button" className="secondary-button" onClick={() => onSavePalette(previewColors)}>
              {t("inspector.savePalette")}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onOpenImageColorPalette}
              disabled={isExtractingImagePalette || !hasSelectedImageLayer}
            >
              {isExtractingImagePalette ? t("inspector.extractingPaletteFromImage") : t("inspector.extractPaletteFromImage")}
            </button>
          </div>
        </div>
      </div>
      {savedPalettes.length > 0 ? (
        <div className="saved-palette-list" aria-label={t("inspector.savedPalettes")}>
          <button
            type="button"
            className="palette-subheading collapsible-subheading"
            aria-expanded={savedPalettesExpanded}
            onClick={() => setSavedPalettesExpanded((current) => !current)}
          >
            {savedPalettesExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span>{t("inspector.savedPalettes")}</span>
          </button>
          {savedPalettesExpanded ? savedPalettes.map((palette) => (
            <div
              className="saved-palette-row reorderable-row"
              key={palette.id}
              draggable
              onDragStart={(event) => startPaletteDrag(event, "saved", palette.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => dropPaletteDrag(event, "saved", palette.id)}
            >
              <div className="saved-palette-header">
                <span className="reorder-handle" title={t("inspector.reorderPalette")}>
                  <GripVertical size={14} />
                </span>
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
                  <div className="saved-palette-color palette-color-row" key={`${palette.id}-${color}-${index}`}>
                    <span className="saved-palette-swatch" style={{ background: color }} />
                    <button
                      type="button"
                      className="ghost-button swatch-apply-button"
                      disabled={selectedCount === 0}
                      aria-label={t("inspector.applyColor", { name: color, target: t("inspector.fill") })}
                      title={t("inspector.applyColor", { name: color, target: t("inspector.fill") })}
                      onClick={() => onApply(color, "fill")}
                    >
                      {t("inspector.fill")}
                    </button>
                    <button
                      type="button"
                      className="ghost-button swatch-apply-button"
                      disabled={selectedCount === 0}
                      onClick={() => onApply(color, "stroke")}
                    >
                      {t("inspector.stroke")}
                    </button>
                    <div className="swatch-meta">
                      <span className="swatch-value">{color}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )) : null}
        </div>
      ) : null}
      <button
        type="button"
        className="palette-subheading collapsible-subheading"
        aria-expanded={registeredColorsExpanded}
        onClick={() => setRegisteredColorsExpanded((current) => !current)}
      >
        {registeredColorsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span>{t("inspector.registeredColors")}</span>
      </button>
      {registeredColorsExpanded ? (
        <>
          <div className="swatch-grid" aria-label={t("inspector.registeredColors")} style={{ height: listHeight }}>
            {colors.map((color) => (
              <div
                className={`swatch-row reorderable-row ${selectedColorId === color.id ? "selected" : ""}`}
                key={color.id}
                draggable
                onDragStart={(event) => startPaletteDrag(event, "single", color.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => dropPaletteDrag(event, "single", color.id)}
              >
                <span className="reorder-handle" title={t("inspector.reorderColor")}>
                  <GripVertical size={14} />
                </span>
                <button
                  type="button"
                  className="swatch"
                  aria-label={color.name}
                  title={color.name}
                  style={{ background: color.value }}
                  onClick={() => onSelectColor(color.id)}
                />
                <button
                  type="button"
                  className="ghost-button swatch-apply-button"
                  disabled={selectedCount === 0}
                  aria-label={t("inspector.applyColor", { name: color.name, target: t("inspector.fill") })}
                  title={t("inspector.applyColor", { name: color.name, target: t("inspector.fill") })}
                  onClick={() => onApply(color.value, "fill", color.alpha)}
                >
                  {t("inspector.fill")}
                </button>
                <button
                  type="button"
                  className="ghost-button swatch-apply-button"
                  disabled={selectedCount === 0}
                  onClick={() => onApply(color.value, "stroke", color.alpha)}
                >
                  {t("inspector.stroke")}
                </button>
                <div className="swatch-meta">
                  <button type="button" className="swatch-edit-button" onClick={() => onSelectColor(color.id)}>
                    <span className="swatch-name">{paletteColorDisplayName(color)}</span>
                    <span className="swatch-value">{Math.round(color.alpha * 100)}%</span>
                  </button>
                </div>
                <button
                  type="button"
                  className="mini-icon-button danger"
                  title={t("inspector.deleteColor", { name: color.name })}
                  onClick={() => onDelete(color.id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          <ResizeHandle label={t("inspector.resizeColorList")} onResize={onResizeList} />
        </>
      ) : null}
    </section>
  );
}

function GroupTransformControls({
  selectedCount,
  canvasFitEligibleCount,
  moveX,
  moveY,
  rotation,
  onMoveXChange,
  onMoveYChange,
  onRotationChange,
  onMatchRotation,
  onFitSelectedToCanvas,
  t,
}: {
  selectedCount: number;
  canvasFitEligibleCount: number;
  moveX: number;
  moveY: number;
  rotation: number;
  onMoveXChange: (value: number) => void;
  onMoveYChange: (value: number) => void;
  onRotationChange: (value: number) => void;
  onMatchRotation: () => void;
  onFitSelectedToCanvas: () => void;
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
        <button
          type="button"
          className="secondary-button icon-text wide-button"
          disabled={canvasFitEligibleCount === 0}
          onClick={onFitSelectedToCanvas}
        >
          <Move size={16} /> {t("inspector.fitToCanvas")}
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

function paletteColorDisplayName(color: PaletteColor): string {
  const cleaned = color.name.replace(/^(Fill|Stroke)\s+(#[0-9a-f]{3,8})$/i, "$2").trim();
  return cleaned || color.value;
}

function wheelPointStyle(color: string, mode: HarmonyMode): { left: string; top: string } {
  const channels = hexToRgbChannels(color);
  if (!channels) return { left: "50%", top: "50%" };
  const hsl = rgbToHsl(channels.r, channels.g, channels.b);
  const angle = ((hsl.h - 90) * Math.PI) / 180;
  const resolvedMode = resolveHarmonyMode(mode);
  const isSimilarityMode = paletteModesByPrinciple.similarity.includes(resolvedMode);
  const similarityLightnessGain =
    resolvedMode === "tone-on-tone"
      ? 38
      : resolvedMode === "dominant-color" || resolvedMode === "camaieu" || resolvedMode === "faux-camaieu"
        ? 18
        : 24;
  const lightnessRadiusBias = isSimilarityMode ? (hsl.l - 0.5) * similarityLightnessGain : 0;
  const radius = Math.min(56, Math.max(8, 12 + hsl.s * 30 + lightnessRadiusBias));
  return {
    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
  };
}

function colorFromWheelPointer(event: ReactPointerEvent<HTMLElement>, element: HTMLElement): string {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  const distance = Math.sqrt(x * x + y * y);
  const hue = normalizeHue((Math.atan2(y, x) * 180) / Math.PI + 90);
  const saturation = clampUnit((distance - rect.width * 0.08) / (rect.width * 0.42));
  return hslToHex(hue, saturation, 0.52);
}

function readableTextColor(color: string): string {
  const channels = hexToRgbChannels(color);
  if (!channels) return "#152033";
  const luminance = (channels.r * 299 + channels.g * 587 + channels.b * 114) / 1000;
  return luminance > 145 ? "#152033" : "#ffffff";
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const h =
    max === red
      ? ((green - blue) / delta + (green < blue ? 6 : 0)) * 60
      : max === green
        ? ((blue - red) / delta + 2) * 60
        : ((red - green) / delta + 4) * 60;
  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [red, green, blue] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return rgbChannelsToHex((red + m) * 255, (green + m) * 255, (blue + m) * 255);
}

function normalizeHue(value: number): number {
  return ((value % 360) + 360) % 360;
}

function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function harmonyLabelKey(mode: HarmonyMode) {
  const keys: Record<HarmonyMode, Parameters<Translator>[0]> = {
    identity: "inspector.harmony.identity",
    analogous: "inspector.harmony.analogous",
    intermediate: "inspector.harmony.intermediate",
    diod: "inspector.harmony.diod",
    opponent: "inspector.harmony.opponent",
    "split-complementary": "inspector.harmony.split-complementary",
    triad: "inspector.harmony.triad",
    tetrad: "inspector.harmony.tetrad",
    pentad: "inspector.harmony.pentad",
    hexad: "inspector.harmony.hexad",
    rectangular: "inspector.harmony.rectangular",
    "complex-harmony": "inspector.harmony.complex-harmony",
    "natural-harmony": "inspector.harmony.natural-harmony",
    "dominant-color": "inspector.harmony.dominant-color",
    "tone-on-tone": "inspector.harmony.tone-on-tone",
    "dominant-tone": "inspector.harmony.dominant-tone",
    "tone-in-tone": "inspector.harmony.tone-in-tone",
    "tonal-color": "inspector.harmony.tonal-color",
    camaieu: "inspector.harmony.camaieu",
    "faux-camaieu": "inspector.harmony.faux-camaieu",
    tricolor: "inspector.harmony.tricolor",
    bicolor: "inspector.harmony.bicolor",
    complementary: "inspector.harmony.opponent",
    split: "inspector.harmony.split-complementary",
    square: "inspector.harmony.rectangular",
    compound: "inspector.harmony.complex-harmony",
    shades: "inspector.harmony.natural-harmony",
    monochromatic: "inspector.harmony.tonal-color",
  };
  return keys[mode];
}

function palettePrincipleLabelKey(principle: PalettePrinciple): Parameters<Translator>[0] {
  const keys: Record<PalettePrinciple, Parameters<Translator>[0]> = {
    order: "inspector.palettePrinciple.order",
    proximity: "inspector.palettePrinciple.proximity",
    similarity: "inspector.palettePrinciple.similarity",
    clarity: "inspector.palettePrinciple.clarity",
  };
  return keys[principle];
}

const animationTypes: LayerAnimationType[] = [
  "none",
  "fade",
  "slide",
  "pop",
  "pulse",
  "blink",
  "drift",
  "zoom",
  "spin",
  "sway",
  "shake",
  "breathe",
];
const animationDirections: LayerAnimationDirection[] = ["none", "left", "right", "up", "down"];

const animationTypeLabels: Record<LayerAnimationType, Parameters<Translator>[0]> = {
  none: "inspector.animationNone",
  fade: "inspector.animationFade",
  slide: "inspector.animationSlide",
  pop: "inspector.animationPop",
  pulse: "inspector.animationPulse",
  blink: "inspector.animationBlink",
  drift: "inspector.animationDrift",
  zoom: "inspector.animationZoom",
  spin: "inspector.animationSpin",
  sway: "inspector.animationSway",
  shake: "inspector.animationShake",
  breathe: "inspector.animationBreathe",
};

const animationDirectionLabels: Record<LayerAnimationDirection, Parameters<Translator>[0]> = {
  none: "inspector.directionNone",
  left: "inspector.directionLeft",
  right: "inspector.directionRight",
  up: "inspector.directionUp",
  down: "inspector.directionDown",
};

function isKeyboardInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select")) || target.isContentEditable;
}

function MotionControls({
  selected,
  assets,
  settings,
  onUpdateLayer,
  t,
}: {
  selected: ThumbnailLayer;
  assets: ImageAsset[];
  settings: OutputSettings;
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
  t: Translator;
}) {
  const savedAnimations = useMemo(() => normalizeAnimations(selected.animations, selected.animation), [selected.animation, selected.animations]);
  const editableAnimations = savedAnimations.length > 0 ? savedAnimations : [defaultAnimation];
  const [activeMotionIndex, setActiveMotionIndex] = useState(0);
  const activeAnimation = editableAnimations[Math.min(activeMotionIndex, editableAnimations.length - 1)] ?? defaultAnimation;
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewProgress, setPreviewProgress] = useState(0);

  useEffect(() => {
    if (activeMotionIndex >= editableAnimations.length) setActiveMotionIndex(Math.max(0, editableAnimations.length - 1));
  }, [activeMotionIndex, editableAnimations.length]);

  const saveAnimations = (nextAnimations: Array<Partial<typeof defaultAnimation>>) => {
    const normalized = normalizeAnimations(nextAnimations);
    onUpdateLayer(selected.id, (layer) => ({
      ...layer,
      animation: normalized[0],
      animations: normalized.length > 0 ? normalized : undefined,
    }));
  };

  const updateAnimation = (partial: Partial<typeof defaultAnimation>) => {
    const type = (partial.type ?? activeAnimation.type) as LayerAnimationType;
    const nextAnimation = {
      ...activeAnimation,
      ...partial,
      direction: animationTypeUsesDirection(type) ? (partial.direction ?? activeAnimation.direction) : "none",
    };
    saveAnimations(editableAnimations.map((animation, index) => (index === activeMotionIndex ? nextAnimation : animation)));
  };

  const addMotion = () => {
    const nextAnimation = { ...defaultAnimation, type: "fade" as LayerAnimationType };
    saveAnimations([...savedAnimations, nextAnimation]);
    setActiveMotionIndex(savedAnimations.length);
  };

  const removeMotion = () => {
    if (savedAnimations.length === 0) return;
    saveAnimations(savedAnimations.filter((_, index) => index !== activeMotionIndex));
    setActiveMotionIndex(Math.max(0, activeMotionIndex - 1));
  };

  const hasAnimation = activeAnimation.type !== "none";
  const directionSupported = animationTypeUsesDirection(activeAnimation.type);
  const directionDisabled = !hasAnimation || !directionSupported;
  const directionIsNone = directionDisabled || activeAnimation.direction === "none";
  const duration = Math.max(100, activeAnimation.durationMs);
  const sceneDuration = Math.max(
    1000,
    ...savedAnimations.map((animation) => animation.startMs + Math.max(100, animation.durationMs)),
    activeAnimation.startMs + duration,
  );
  const previewSettings = useMemo<OutputSettings>(
    () => ({
      ...settings,
      presetId: "custom",
      width: 320,
      height: 180,
      background: "#111827",
    }),
    [settings],
  );
  const previewSource = useMemo(
    () => ({
      ...selected,
      animation: savedAnimations[0],
      animations: savedAnimations.length > 0 ? savedAnimations : undefined,
    }),
    [savedAnimations, selected],
  );
  const previewLayer = useMemo(
    () => scaleLayerForMotionPreview(previewSource, previewSettings.width, previewSettings.height),
    [previewSettings.height, previewSettings.width, previewSource],
  );

  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    const startTime = performance.now();
    const render = async () => {
      if (cancelled) return;
      const elapsed = (performance.now() - startTime) % sceneDuration;
      setPreviewProgress(Math.min(1, Math.max(0, (elapsed - activeAnimation.startMs) / duration)));
      if (previewCanvasRef.current) {
        await renderThumbnailToCanvas(previewCanvasRef.current, [previewLayer], assets, previewSettings, {
          animationTimeMs: elapsed,
          sceneDurationMs: sceneDuration,
        });
      }
      frame = window.requestAnimationFrame(render);
    };
    void render();
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [
    activeAnimation.direction,
    activeAnimation.distance,
    activeAnimation.durationMs,
    activeAnimation.easing,
    activeAnimation.loop,
    activeAnimation.startMs,
    activeAnimation.type,
    assets,
    duration,
    previewLayer,
    previewSettings,
    sceneDuration,
  ]);

  return (
    <section className="panel-section motion-section">
      <div className="section-heading">
        <Play size={16} />
        <h2>{t("inspector.motionSettings")}</h2>
      </div>
      <div className="motion-preview-grid" aria-label={t("inspector.motionPreview")}>
        <div className="motion-object-preview">
          <canvas ref={previewCanvasRef} width={320} height={180} />
        </div>
        <EasingGraph easing={activeAnimation.easing} progress={previewProgress} t={t} />
      </div>
      <div className="motion-sequence-list" aria-label={t("inspector.motionSequence")}>
        {editableAnimations.map((animation, index) => (
          <button
            key={`${animation.type}-${animation.startMs}-${index}`}
            type="button"
            className={index === activeMotionIndex ? "selected" : ""}
            onClick={() => setActiveMotionIndex(index)}
          >
            <span>{index + 1}</span>
            <strong>{t(animationTypeLabels[animation.type])}</strong>
          </button>
        ))}
      </div>
      <div className="motion-sequence-actions">
        <button type="button" className="secondary-button icon-text" onClick={addMotion}>
          <Copy size={15} /> {t("inspector.addMotion")}
        </button>
        <button type="button" className="ghost-button danger-text icon-text" disabled={savedAnimations.length === 0} onClick={removeMotion}>
          <Trash2 size={15} /> {t("inspector.removeMotion")}
        </button>
      </div>
      <label className="field">
        <span>{t("inspector.animationType")}</span>
        <select
          value={activeAnimation.type}
          onChange={(event) => updateAnimation({ type: event.currentTarget.value as LayerAnimationType })}
        >
          {animationTypes.map((type) => (
            <option key={type} value={type}>
              {t(animationTypeLabels[type])}
            </option>
          ))}
        </select>
      </label>
      <div className="field-grid two">
        <SliderNumberInput
          label={t("inspector.animationStart")}
          value={activeAnimation.startMs}
          min={0}
          max={10000}
          step={100}
          suffix="ms"
          disabled={!hasAnimation}
          onChange={(value) => updateAnimation({ startMs: value })}
        />
        <SliderNumberInput
          label={t("inspector.animationDuration")}
          value={activeAnimation.durationMs}
          min={100}
          max={10000}
          step={100}
          suffix="ms"
          disabled={!hasAnimation}
          onChange={(value) => updateAnimation({ durationMs: value })}
        />
      </div>
      <label className={`field ${!hasAnimation ? "field-disabled" : ""}`}>
        <span>{t("inspector.animationEasing")}</span>
        <select
          value={activeAnimation.easing}
          disabled={!hasAnimation}
          onChange={(event) => updateAnimation({ easing: event.currentTarget.value as LayerAnimationEasing })}
        >
          {easingOptions.map((easing) => (
            <option key={easing} value={easing}>
              {easing}
            </option>
          ))}
        </select>
      </label>
      <div className="field-grid two">
        <label className={`field ${directionDisabled ? "field-disabled" : ""}`}>
          <span>{t("inspector.animationDirection")}</span>
          <select
            value={directionSupported ? activeAnimation.direction : "none"}
            disabled={directionDisabled}
            onChange={(event) => updateAnimation({ direction: event.currentTarget.value as LayerAnimationDirection })}
          >
            {animationDirections.map((direction) => (
              <option key={direction} value={direction}>
                {t(animationDirectionLabels[direction])}
              </option>
            ))}
          </select>
        </label>
        <SliderNumberInput
          label={t("inspector.animationDistance")}
          value={activeAnimation.distance}
          min={0}
          max={800}
          step={10}
          disabled={!hasAnimation || directionIsNone}
          onChange={(value) => updateAnimation({ distance: value })}
        />
      </div>
      <label className={`checkbox-row inline-checkbox ${!hasAnimation ? "field-disabled" : ""}`}>
        <input
          type="checkbox"
          checked={activeAnimation.loop}
          disabled={!hasAnimation}
          onChange={(event) => updateAnimation({ loop: event.currentTarget.checked })}
        />
        <span>{t("inspector.animationLoop")}</span>
      </label>
    </section>
  );
}

function EasingGraph({ easing, progress, t }: { easing: LayerAnimationEasing; progress: number; t: Translator }) {
  const width = 260;
  const height = 150;
  const padding = 18;
  const yMin = -0.25;
  const yMax = 1.25;
  const points = Array.from({ length: 61 }, (_, index) => {
    const x = index / 60;
    return graphPoint(x, evaluateEasing(x, easing), width, height, padding, yMin, yMax);
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  const linearPath = [graphPoint(0, 0, width, height, padding, yMin, yMax), graphPoint(1, 1, width, height, padding, yMin, yMax)]
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
  const active = graphPoint(progress, evaluateEasing(progress, easing), width, height, padding, yMin, yMax);
  return (
    <div className="motion-easing-graph">
      <div className="motion-preview-heading">
        <span>{t("inspector.easingGraph")}</span>
        <strong>{easing}</strong>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${t("inspector.easingGraph")}: ${easing}`}>
        <rect x="0" y="0" width={width} height={height} rx="8" />
        <path className="motion-graph-grid" d={`M ${padding} ${height - padding} H ${width - padding} M ${padding} ${padding} V ${height - padding}`} />
        <path className="motion-graph-linear" d={linearPath} />
        <path className="motion-graph-curve" d={path} />
        <circle className="motion-graph-dot" cx={active.x} cy={active.y} r="5" />
      </svg>
    </div>
  );
}

function graphPoint(
  progress: number,
  value: number,
  width: number,
  height: number,
  padding: number,
  yMin: number,
  yMax: number,
): { x: number; y: number } {
  const clampedValue = Math.min(yMax, Math.max(yMin, value));
  return {
    x: padding + progress * (width - padding * 2),
    y: height - padding - ((clampedValue - yMin) / (yMax - yMin)) * (height - padding * 2),
  };
}

function scaleLayerForMotionPreview(layer: ThumbnailLayer, canvasWidth: number, canvasHeight: number): ThumbnailLayer {
  const scale = Math.min(1.35, (canvasWidth * 0.68) / Math.max(1, layer.width), (canvasHeight * 0.62) / Math.max(1, layer.height));
  const scaledAnimations = normalizeAnimations(layer.animations, layer.animation).map((animation) => ({
    ...animation,
    distance: animation.distance * scale,
  }));
  const base = {
    ...layer,
    x: (canvasWidth - layer.width * scale) / 2,
    y: (canvasHeight - layer.height * scale) / 2,
    width: layer.width * scale,
    height: layer.height * scale,
    layerBlur: layer.layerBlur * scale,
    edgeBlur: layer.edgeBlur * scale,
    cornerRadius: layer.cornerRadius * scale,
    animation: scaledAnimations[0],
    animations: scaledAnimations.length > 0 ? scaledAnimations : undefined,
  };
  if (layer.type === "text") {
    return {
      ...base,
      type: "text",
      text: layer.text,
      fontSize: layer.fontSize * scale,
      fontFamily: layer.fontFamily,
      fontWeight: layer.fontWeight,
      color: layer.color,
      strokeColor: layer.strokeColor,
      strokeWidth: layer.strokeWidth * scale,
      strokeOpacity: layer.strokeOpacity,
      align: layer.align,
      writingMode: layer.writingMode,
      lineHeight: layer.lineHeight,
      letterSpacing: layer.letterSpacing * scale,
      fillOpacity: layer.fillOpacity,
    };
  }
  if (layer.type === "shape") {
    return {
      ...base,
      type: "shape",
      shape: layer.shape,
      fill: layer.fill,
      fillOpacity: layer.fillOpacity,
      strokeColor: layer.strokeColor,
      strokeWidth: layer.strokeWidth * scale,
      strokeOpacity: layer.strokeOpacity,
      lineStyle: layer.lineStyle,
    };
  }
  return {
    ...base,
    type: "image",
    imageKey: layer.imageKey,
    effects: { ...layer.effects, blur: layer.effects.blur * scale, mosaic: layer.effects.mosaic * scale },
  };
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
  onOpenColorPicker,
  t,
}: {
  selected: Extract<ThumbnailLayer, { type: "text" }>;
  fontOptions: FontOption[];
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
  onCustomFontFiles: InspectorPanelProps["onCustomFontFiles"];
  onFitTextToBounds: InspectorPanelProps["onFitTextToBounds"];
  onOpenColorPicker: (state: LayerColorPickerState) => void;
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
          {fontOptions.map((option, index) => (
            <option key={`${option.value}-${index}`} value={option.value}>
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
        <ColorEditButton
          label={t("inspector.fill")}
          color={selected.color}
          alpha={selected.fillOpacity}
          onClick={() =>
            onOpenColorPicker({
              layerId: selected.id,
              target: "textFill",
              label: t("inspector.fill"),
              color: selected.color,
              alpha: selected.fillOpacity,
            })
          }
        />
        <ColorEditButton
          label={t("inspector.outline")}
          color={selected.strokeColor}
          alpha={selected.strokeOpacity}
          disabled={selected.strokeWidth <= 0}
          onClick={() =>
            onOpenColorPicker({
              layerId: selected.id,
              target: "textStroke",
              label: t("inspector.outline"),
              color: selected.strokeColor,
              alpha: selected.strokeOpacity,
            })
          }
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
  onOpenColorPicker,
  t,
}: {
  selected: Extract<ThumbnailLayer, { type: "shape" }>;
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
  onOpenColorPicker: (state: LayerColorPickerState) => void;
  t: Translator;
}) {
  return (
    <>
      <SliderNumberInput
        label={t("inspector.strokeWidth")}
        value={selected.strokeWidth}
        min={0}
        max={48}
        step={1}
        onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeWidth: value }))}
      />
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
          <option value="diamond">{t("inspector.diamond")}</option>
          <option value="pentagon">{t("inspector.pentagon")}</option>
          <option value="hexagon">{t("inspector.hexagon")}</option>
          <option value="star">{t("inspector.star")}</option>
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
        <ColorEditButton
          label={t("inspector.fill")}
          color={selected.fill}
          alpha={selected.fillOpacity}
          disabled={selected.shape === "line"}
          onClick={() =>
            onOpenColorPicker({
              layerId: selected.id,
              target: "shapeFill",
              label: t("inspector.fill"),
              color: selected.fill,
              alpha: selected.fillOpacity,
            })
          }
        />
        <ColorEditButton
          label={t("inspector.stroke")}
          color={selected.strokeColor}
          alpha={selected.strokeOpacity}
          disabled={selected.strokeWidth <= 0}
          onClick={() =>
            onOpenColorPicker({
              layerId: selected.id,
              target: "shapeStroke",
              label: t("inspector.stroke"),
              color: selected.strokeColor,
              alpha: selected.strokeOpacity,
            })
          }
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

function ColorEditButton({
  label,
  color,
  alpha,
  disabled = false,
  onClick,
}: {
  label: string;
  color: string;
  alpha: number;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`field color-edit-field ${disabled ? "field-disabled" : ""}`}>
      <span>{label}</span>
      <button type="button" className="color-edit-button" disabled={disabled} onClick={onClick}>
        <span className="color-edit-swatch" style={{ background: color }} />
        <span className="color-edit-value">
          {color} / {Math.round(alpha * 100)}%
        </span>
      </button>
    </div>
  );
}

function LayerColorPickerDialog({
  state,
  onApply,
  onClose,
  t,
}: {
  state: LayerColorPickerState;
  onApply: (color: string, alpha: number) => void;
  onClose: () => void;
  t: Translator;
}) {
  const [draft, setDraft] = useState(normalizeColor(state.color) ?? "#000000");
  const [alpha, setAlpha] = useState(clampUnit(state.alpha));
  const [position, setPosition] = useState(() => getInitialColorPopupPosition());
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);
  const sketchColor = { ...hexToHsva(normalizeColor(draft) ?? "#000000"), a: alpha };

  useEffect(() => {
    setDraft(normalizeColor(state.color) ?? "#000000");
    setAlpha(clampUnit(state.alpha));
    setPosition(getInitialColorPopupPosition());
  }, [state]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const setBaseDraft = (value: string) => {
    const normalized = normalizeColor(value) ?? parseRgbColorInput(value);
    setDraft(normalized ?? value);
  };

  const beginDrag = (event: ReactPointerEvent<HTMLElement>) => {
    event.preventDefault();
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: position.x,
      y: position.y,
    };
    const handlePointerMove = (moveEvent: PointerEvent) => {
      const active = dragStartRef.current;
      if (!active) return;
      setPosition({
        x: clampPopupPosition(active.x + moveEvent.clientX - active.pointerX, window.innerWidth, 360),
        y: clampPopupPosition(active.y + moveEvent.clientY - active.pointerY, window.innerHeight, 392),
      });
    };
    const handlePointerUp = () => {
      dragStartRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <section
      className="layer-color-popup"
      role="dialog"
      aria-modal="false"
      aria-labelledby="layer-color-picker-title"
      style={{ left: position.x, top: position.y }}
    >
      <div className="layer-color-popup-header" onPointerDown={beginDrag}>
        <div className="modal-title-block">
          <h2 id="layer-color-picker-title">{state.label}</h2>
          <p>{t("inspector.paletteColor")}</p>
        </div>
        <button type="button" className="icon-button modal-close" aria-label={t("inspector.cancel")} onPointerDown={(event) => event.stopPropagation()} onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="layer-color-picker">
        <div className="uiw-color-picker-panel" aria-label={`${t("inspector.paletteColor")} ${t("inspector.paletteHex")}`}>
          <Sketch
            color={sketchColor}
            onChange={(color) => {
              setBaseDraft(color.hex);
              setAlpha(color.hsva.a);
            }}
          />
        </div>
      </div>
      <div className="confirm-actions">
        <button type="button" className="secondary-button" onClick={onClose}>
          {t("inspector.cancel")}
        </button>
        <button type="button" className="primary-button" onClick={() => onApply(normalizeColor(draft) ?? "#000000", alpha)}>
          {t("inspector.applyColorChoice")}
        </button>
      </div>
    </section>
  );
}

function updateNumber(
  selected: ThumbnailLayer,
  key:
    | "x"
    | "y"
    | "width"
    | "height"
    | "rotation"
    | "opacity"
    | "layerBlur"
    | "edgeBlur"
    | "cornerRadius"
    | "shadowOpacity"
    | "shadowBlur"
    | "shadowDistance"
    | "shadowAngle"
    | "rotateX"
    | "rotateY"
    | "bevelSize"
    | "bevelOpacity",
  value: number,
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"],
) {
  onUpdateLayer(selected.id, (layer) => ({ ...layer, [key]: value }));
}

function normalizeColorInput(value: string): string {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";
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

function clampPopupPosition(value: number, viewportSize: number, popupSize: number): number {
  return Math.min(Math.max(12, Math.round(value)), Math.max(12, viewportSize - popupSize - 12));
}

function getInitialColorPopupPosition(): { x: number; y: number } {
  if (typeof window === "undefined") return { x: 24, y: 96 };
  return {
    x: Math.max(16, window.innerWidth - 390),
    y: Math.max(78, Math.min(window.innerHeight - 420, 128)),
  };
}
