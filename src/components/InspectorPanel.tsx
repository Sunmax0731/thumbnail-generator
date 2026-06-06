import { useState } from "react";
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
  GripVertical,
  Layers,
  Lock,
  Move,
  Palette,
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
import type { PaletteColor, PaletteTarget } from "../lib/colorPalette";
import type { Translator } from "../lib/i18n";
import type { RelativeLayerTransform } from "../lib/layerTransform";
import type { ImageAsset, ImageEffects, OutputSettings, ShapeKind, TextAlign, ThumbnailLayer } from "../lib/types";

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
  fontOptions: FontOption[];
  onPaletteDraftChange: (value: string) => void;
  onPaletteNameDraftChange: (value: string) => void;
  onPaletteTargetDraftChange: (value: PaletteTarget) => void;
  onAddPaletteColor: () => void;
  onDeletePaletteColor: (id: string) => void;
  onApplyPaletteColor: (color: string, target: PaletteTarget) => void;
  onSelect: (id: string, additive?: boolean) => void;
  onUpdateLayer: (id: string, updater: (layer: ThumbnailLayer) => ThumbnailLayer) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onReorderLayer: (draggedId: string, targetId: string) => void;
  onToggleVisible: (id: string) => void;
  onToggleSelectable: (id: string) => void;
  onAlignSelection: (mode: AlignmentMode) => void;
  onTransformSelection: (transform: RelativeLayerTransform) => void;
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
  fontOptions,
  onPaletteDraftChange,
  onPaletteNameDraftChange,
  onPaletteTargetDraftChange,
  onAddPaletteColor,
  onDeletePaletteColor,
  onApplyPaletteColor,
  onSelect,
  onUpdateLayer,
  onDelete,
  onDuplicate,
  onMove,
  onReorderLayer,
  onToggleVisible,
  onToggleSelectable,
  onAlignSelection,
  onTransformSelection,
  onCustomFontFiles,
  onFitTextToBounds,
  t,
}: InspectorPanelProps) {
  const selectedLayers = layers.filter((layer) => selectedIds.includes(layer.id) && layer.selectable);
  const selected = selectedLayers.length === 1 ? selectedLayers[0] : undefined;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<InspectorSection>("layers");
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [relativeMoveX, setRelativeMoveX] = useState(0);
  const [relativeMoveY, setRelativeMoveY] = useState(0);
  const [relativeRotation, setRelativeRotation] = useState(0);
  const deleteCandidate = deleteCandidateId ? layers.find((layer) => layer.id === deleteCandidateId) : undefined;

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
            <div className="layer-list" aria-label={t("inspector.layerList")}>
              {[...layers].reverse().map((layer) => (
                <div
                  key={layer.id}
                  draggable
                  role="button"
                  tabIndex={0}
                  aria-disabled={!layer.selectable}
                  className={`layer-row ${selectedIds.includes(layer.id) ? "selected" : ""} ${
                    draggingId === layer.id ? "dragging" : ""
                  } ${!layer.selectable ? "locked" : ""}`}
                  onClick={(event) => onSelect(layer.id, event.ctrlKey || event.metaKey || event.shiftKey)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(layer.id, event.ctrlKey || event.metaKey || event.shiftKey);
                    }
                    if ((event.key === "Delete" || event.key === "Backspace") && layer.selectable) {
                      event.preventDefault();
                      onDelete(layer.id);
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
                  <span className={`layer-type ${layer.type}`}>{layer.type}</span>
                  <span className="layer-name">{layer.name}</span>
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
          </section>

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
          selectedCount={selectedLayers.length}
          onDraftChange={onPaletteDraftChange}
          onNameDraftChange={onPaletteNameDraftChange}
          onTargetDraftChange={onPaletteTargetDraftChange}
          onAdd={onAddPaletteColor}
          onDelete={onDeletePaletteColor}
          onApply={onApplyPaletteColor}
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
              <SliderNumberInput
                label={t("inspector.opacity")}
                value={selected.opacity}
                min={0}
                max={1}
                step={0.01}
                decimals={2}
                onChange={(value) => updateNumber(selected, "opacity", value, onUpdateLayer)}
              />

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
            moveX={relativeMoveX}
            moveY={relativeMoveY}
            rotation={relativeRotation}
            onMoveXChange={setRelativeMoveX}
            onMoveYChange={setRelativeMoveY}
            onRotationChange={setRelativeRotation}
            onApplyMove={() => {
              onTransformSelection({ deltaX: relativeMoveX, deltaY: relativeMoveY });
              setRelativeMoveX(0);
              setRelativeMoveY(0);
            }}
            onApplyRotation={() => {
              onTransformSelection({ deltaRotation: relativeRotation });
              setRelativeRotation(0);
            }}
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

function PaletteControls({
  colors,
  draft,
  nameDraft,
  targetDraft,
  selectedCount,
  onDraftChange,
  onNameDraftChange,
  onTargetDraftChange,
  onAdd,
  onDelete,
  onApply,
  t,
}: {
  colors: PaletteColor[];
  draft: string;
  nameDraft: string;
  targetDraft: PaletteTarget;
  selectedCount: number;
  onDraftChange: (value: string) => void;
  onNameDraftChange: (value: string) => void;
  onTargetDraftChange: (value: PaletteTarget) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onApply: (color: string, target: PaletteTarget) => void;
  t: Translator;
}) {
  return (
    <section className="panel-section palette-section">
      <div className="section-heading">
        <SlidersHorizontal size={16} />
        <h2>{t("inspector.palette")}</h2>
      </div>
      <div className="palette-register">
        <label className="field palette-name-field">
          <span>{t("inspector.paletteName")}</span>
          <input type="text" value={nameDraft} onChange={(event) => onNameDraftChange(event.currentTarget.value)} />
        </label>
        <label className="field color-field">
          <span>{t("inspector.paletteColor")}</span>
          <input type="color" value={draft} onChange={(event) => onDraftChange(event.currentTarget.value)} />
          <input type="text" value={draft} onChange={(event) => onDraftChange(event.currentTarget.value)} />
        </label>
        <label className="field palette-target-field">
          <span>{t("inspector.paletteTarget")}</span>
          <select value={targetDraft} onChange={(event) => onTargetDraftChange(event.currentTarget.value as PaletteTarget)}>
            <option value="fill">{t("inspector.fill")}</option>
            <option value="stroke">{t("inspector.stroke")}</option>
          </select>
        </label>
        <button type="button" className="secondary-button" onClick={onAdd}>
          {t("inspector.addColor")}
        </button>
      </div>
      <div className="swatch-grid" aria-label={t("inspector.registeredColors")}>
        {colors.map((color) => (
          <div className="swatch-row" key={color.id}>
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
              <span className="swatch-name">{color.name}</span>
              <span className="swatch-value">{color.value}</span>
            </div>
            <button type="button" className="mini-icon-button danger" title={t("inspector.deleteColor", { name: color.name })} onClick={() => onDelete(color.id)}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
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
  onApplyMove,
  onApplyRotation,
  t,
}: {
  selectedCount: number;
  moveX: number;
  moveY: number;
  rotation: number;
  onMoveXChange: (value: number) => void;
  onMoveYChange: (value: number) => void;
  onRotationChange: (value: number) => void;
  onApplyMove: () => void;
  onApplyRotation: () => void;
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
        <button type="button" className="secondary-button icon-text wide-button" onClick={onApplyMove}>
          <Move size={16} /> {t("inspector.applyMove")}
        </button>
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
        <button type="button" className="secondary-button icon-text wide-button" onClick={onApplyRotation}>
          <RotateCw size={16} /> {t("inspector.applyRotation")}
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
          onChange={(event) => onUpdateLayer(selected.id, (layer) => ({ ...layer, imageKey: event.target.value }))}
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
          onChange={(event) => onUpdateLayer(selected.id, (layer) => ({ ...layer, text: event.currentTarget.value }))}
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
      </div>
      <button type="button" className="secondary-button icon-text wide-button" onClick={() => onFitTextToBounds(selected.id)}>
        <Type size={16} /> {t("inspector.fitText")}
      </button>
      <label className="field">
        <span>{t("inspector.font")}</span>
        <select
          value={selected.fontFamily}
          onChange={(event) => onUpdateLayer(selected.id, (layer) => ({ ...layer, fontFamily: event.target.value }))}
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
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeColor: value }))}
        />
      </div>
      <SliderNumberInput
        label={t("inspector.lineHeight")}
        value={selected.lineHeight}
        min={0.5}
        max={2}
        step={0.01}
        decimals={2}
        onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, lineHeight: value }))}
      />
      <label className="field">
        <span>{t("inspector.textAlign")}</span>
        <select
          value={selected.align}
          onChange={(event) =>
            onUpdateLayer(selected.id, (layer) => ({ ...layer, align: event.target.value as TextAlign }))
          }
        >
          <option value="left">{t("inspector.left")}</option>
          <option value="center">{t("inspector.center")}</option>
          <option value="right">{t("inspector.right")}</option>
        </select>
      </label>
    </>
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
          onChange={(event) =>
            onUpdateLayer(selected.id, (layer) => ({ ...layer, shape: event.target.value as ShapeKind }))
          }
        >
          <option value="rect">{t("inspector.rect")}</option>
          <option value="ellipse">{t("inspector.ellipse")}</option>
          <option value="triangle">{t("inspector.triangle")}</option>
        </select>
      </label>
      <div className="field-grid two">
        <ColorInput
          label={t("inspector.fill")}
          value={selected.fill}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, fill: value }))}
        />
        <ColorInput
          label={t("inspector.stroke")}
          value={selected.strokeColor}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeColor: value }))}
        />
        <SliderNumberInput
          label={t("inspector.strokeWidth")}
          value={selected.strokeWidth}
          min={0}
          max={48}
          step={1}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeWidth: value }))}
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
  onChange: (value: number) => void;
}) {
  const rounded = round(value, decimals);
  return (
    <label className="range-field slider-number">
      <span>
        {icon}
        {label}
        {suffix ? <span className="field-unit"> {suffix}</span> : null}
      </span>
      <input type="range" min={min} max={max} step={step} value={rounded} onChange={(event) => onChange(Number(event.currentTarget.value))} />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={rounded}
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

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field color-field">
      <span>{label}</span>
      <input type="color" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
      <input type="text" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  );
}

function updateNumber(
  selected: ThumbnailLayer,
  key: "x" | "y" | "width" | "height" | "rotation" | "opacity",
  value: number,
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"],
) {
  onUpdateLayer(selected.id, (layer) => ({ ...layer, [key]: value }));
}

function round(value: number, decimals = 0): number {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}
