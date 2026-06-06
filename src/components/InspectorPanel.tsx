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
  Palette,
  RotateCw,
  SlidersHorizontal,
  Trash2,
  Unlock,
} from "lucide-react";
import type { AlignmentMode } from "../lib/alignment";
import { fontLabelFor, fontOptions } from "../lib/fonts";
import type { PaletteColor } from "../lib/colorPalette";
import type { ImageAsset, ImageEffects, OutputSettings, ShapeKind, TextAlign, ThumbnailLayer } from "../lib/types";

type PaletteApplyTarget = "primary" | "stroke";
type InspectorSection = "layers" | "edit" | "colors";

interface InspectorPanelProps {
  assets: ImageAsset[];
  layers: ThumbnailLayer[];
  selectedIds: string[];
  settings: OutputSettings;
  paletteColors: PaletteColor[];
  paletteDraft: string;
  onPaletteDraftChange: (value: string) => void;
  onAddPaletteColor: () => void;
  onDeletePaletteColor: (id: string) => void;
  onApplyPaletteColor: (color: string, target: PaletteApplyTarget) => void;
  onSelect: (id: string, additive?: boolean) => void;
  onUpdateLayer: (id: string, updater: (layer: ThumbnailLayer) => ThumbnailLayer) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onReorderLayer: (draggedId: string, targetId: string) => void;
  onToggleVisible: (id: string) => void;
  onToggleSelectable: (id: string) => void;
  onAlignSelection: (mode: AlignmentMode) => void;
}

export function InspectorPanel({
  assets,
  layers,
  selectedIds,
  settings,
  paletteColors,
  paletteDraft,
  onPaletteDraftChange,
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
}: InspectorPanelProps) {
  const selectedLayers = layers.filter((layer) => selectedIds.includes(layer.id) && layer.selectable);
  const selected = selectedLayers.length === 1 ? selectedLayers[0] : undefined;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<InspectorSection>("layers");

  return (
    <aside className="side-panel inspector-panel" aria-label="Layer inspector">
      <div className="panel-tabs inspector-tabs" role="tablist" aria-label="Inspector sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "layers"}
          className={activeSection === "layers" ? "selected" : ""}
          onClick={() => setActiveSection("layers")}
        >
          <Layers size={15} /> Layers
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "edit"}
          className={activeSection === "edit" ? "selected" : ""}
          onClick={() => setActiveSection("edit")}
        >
          <SlidersHorizontal size={15} /> Adjust
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "colors"}
          className={activeSection === "colors" ? "selected" : ""}
          onClick={() => setActiveSection("colors")}
        >
          <Palette size={15} /> Colors
        </button>
      </div>

      {activeSection === "layers" ? (
        <>
          <section className="panel-section layer-section">
            <div className="section-heading">
              <Layers size={16} />
              <h2>Layers</h2>
              <span className="section-count">{layers.length}</span>
            </div>
            <div className="layer-list" aria-label="Layer list">
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
                    if (event.key === "Enter" || event.key === " ") onSelect(layer.id, event.ctrlKey || event.metaKey || event.shiftKey);
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
                    title={layer.visible ? "Hide layer" : "Show layer"}
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
                    title={layer.selectable ? "Lock selection and editing" : "Unlock selection and editing"}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleSelectable(layer.id);
                    }}
                  >
                    {layer.selectable ? <Unlock size={14} /> : <Lock size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="panel-section">
            <div className="section-heading">
              <AlignHorizontalJustifyCenter size={16} />
              <h2>Align</h2>
            </div>
            <p className="selection-note">
              {selectedLayers.length === 0
                ? "No editable layer selected."
                : selectedLayers.length === 1
                  ? "Single layer aligns to the canvas."
                  : `${selectedLayers.length} layers align to the selection bounds.`}
            </p>
            <div className="align-grid" aria-label="Alignment controls">
              <AlignButton label="Left" mode="left" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignHorizontalJustifyStart size={16} />
              </AlignButton>
              <AlignButton label="Center" mode="center" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignHorizontalJustifyCenter size={16} />
              </AlignButton>
              <AlignButton label="Right" mode="right" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignHorizontalJustifyEnd size={16} />
              </AlignButton>
              <AlignButton label="Top" mode="top" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignVerticalJustifyStart size={16} />
              </AlignButton>
              <AlignButton label="Middle" mode="middle" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
                <AlignVerticalJustifyCenter size={16} />
              </AlignButton>
              <AlignButton label="Bottom" mode="bottom" onAlignSelection={onAlignSelection} disabled={selectedLayers.length === 0}>
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
          selectedCount={selectedLayers.length}
          onDraftChange={onPaletteDraftChange}
          onAdd={onAddPaletteColor}
          onDelete={onDeletePaletteColor}
          onApply={onApplyPaletteColor}
        />
      ) : null}

      {activeSection === "edit" ? (
        selected ? (
        <section className="panel-section inspector-section">
          <div className="section-heading">
            <SlidersHorizontal size={16} />
            <h2>Inspector</h2>
          </div>
          <div className="inspector-actions">
            <button className="icon-button" type="button" title="Move layer up" onClick={() => onMove(selected.id, 1)}>
              <ArrowUp size={16} />
            </button>
            <button className="icon-button" type="button" title="Move layer down" onClick={() => onMove(selected.id, -1)}>
              <ArrowDown size={16} />
            </button>
            <button className="icon-button" type="button" title="Duplicate layer" onClick={() => onDuplicate(selected.id)}>
              <Copy size={16} />
            </button>
            <button className="icon-button danger" type="button" title="Delete layer" onClick={() => onDelete(selected.id)}>
              <Trash2 size={16} />
            </button>
          </div>

          <div className="field-stack">
            <TextInput
              label="Name"
              value={selected.name}
              onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, name: value }))}
            />
            <div className="field-grid two">
              <SliderNumberInput
                label="X"
                value={selected.x}
                min={-settings.width}
                max={settings.width * 2}
                step={1}
                onChange={(value) => updateNumber(selected, "x", value, onUpdateLayer)}
              />
              <SliderNumberInput
                label="Y"
                value={selected.y}
                min={-settings.height}
                max={settings.height * 2}
                step={1}
                onChange={(value) => updateNumber(selected, "y", value, onUpdateLayer)}
              />
              <SliderNumberInput
                label="Width"
                value={selected.width}
                min={16}
                max={settings.width * 2}
                step={1}
                onChange={(value) => updateNumber(selected, "width", value, onUpdateLayer)}
              />
              <SliderNumberInput
                label="Height"
                value={selected.height}
                min={16}
                max={settings.height * 2}
                step={1}
                onChange={(value) => updateNumber(selected, "height", value, onUpdateLayer)}
              />
            </div>
            <SliderNumberInput
              label="Rotation"
              value={selected.rotation}
              min={-180}
              max={180}
              step={1}
              icon={<RotateCw size={14} />}
              suffix="deg"
              onChange={(value) => updateNumber(selected, "rotation", value, onUpdateLayer)}
            />
            <SliderNumberInput
              label="Opacity"
              value={selected.opacity}
              min={0}
              max={1}
              step={0.01}
              decimals={2}
              onChange={(value) => updateNumber(selected, "opacity", value, onUpdateLayer)}
            />

            {selected.type === "image" && (
              <ImageControls selected={selected} assets={assets} onUpdateLayer={onUpdateLayer} />
            )}
            {selected.type === "text" && <TextControls selected={selected} onUpdateLayer={onUpdateLayer} />}
            {selected.type === "shape" && <ShapeControls selected={selected} onUpdateLayer={onUpdateLayer} />}
          </div>
        </section>
        ) : (
          <section className="panel-section inspector-section">
            <div className="section-heading">
              <SlidersHorizontal size={16} />
              <h2>Inspector</h2>
            </div>
            <p className="empty-note">No editable layer selected.</p>
          </section>
        )
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
  selectedCount,
  onDraftChange,
  onAdd,
  onDelete,
  onApply,
}: {
  colors: PaletteColor[];
  draft: string;
  selectedCount: number;
  onDraftChange: (value: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onApply: (color: string, target: PaletteApplyTarget) => void;
}) {
  return (
    <section className="panel-section palette-section">
      <div className="section-heading">
        <SlidersHorizontal size={16} />
        <h2>Color palette</h2>
      </div>
      <div className="palette-register">
        <label className="field color-field">
          <span>Register</span>
          <input type="color" value={draft} onChange={(event) => onDraftChange(event.currentTarget.value)} />
          <input type="text" value={draft} onChange={(event) => onDraftChange(event.currentTarget.value)} />
        </label>
        <button type="button" className="secondary-button" onClick={onAdd}>
          Add
        </button>
      </div>
      <div className="swatch-grid" aria-label="Registered colors">
        {colors.map((color) => (
          <div className="swatch-row" key={color.id}>
            <button
              type="button"
              className="swatch"
              title={`Apply ${color.value}`}
              style={{ background: color.value }}
              disabled={selectedCount === 0}
              onClick={() => onApply(color.value, "primary")}
            />
            <button type="button" className="ghost-button" disabled={selectedCount === 0} onClick={() => onApply(color.value, "stroke")}>
              Stroke
            </button>
            <button type="button" className="mini-icon-button danger" title={`Delete ${color.value}`} onClick={() => onDelete(color.id)}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ImageControls({
  selected,
  assets,
  onUpdateLayer,
}: {
  selected: Extract<ThumbnailLayer, { type: "image" }>;
  assets: ImageAsset[];
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
}) {
  return (
    <>
      <label className="field">
        <span>Image key</span>
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
        <EffectInput selected={selected} effect="grayscale" label="Gray" min={0} max={1} step={0.05} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="blur" label="Blur" min={0} max={24} step={1} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="brightness" label="Bright" min={0} max={180} step={1} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="contrast" label="Contrast" min={0} max={180} step={1} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="mosaic" label="Mosaic" min={0} max={48} step={1} onUpdateLayer={onUpdateLayer} />
      </div>
    </>
  );
}

function TextControls({
  selected,
  onUpdateLayer,
}: {
  selected: Extract<ThumbnailLayer, { type: "text" }>;
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
}) {
  return (
    <>
      <label className="field">
        <span>Text</span>
        <textarea
          className="mini-textarea"
          value={selected.text}
          onChange={(event) => onUpdateLayer(selected.id, (layer) => ({ ...layer, text: event.currentTarget.value }))}
        />
      </label>
      <div className="field-grid two">
        <SliderNumberInput
          label="Font size"
          value={selected.fontSize}
          min={8}
          max={240}
          step={1}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, fontSize: value }))}
        />
        <SliderNumberInput
          label="Stroke"
          value={selected.strokeWidth}
          min={0}
          max={48}
          step={1}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeWidth: value }))}
        />
      </div>
      <label className="field">
        <span>Font</span>
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
      <div className="field-grid two">
        <ColorInput
          label="Fill"
          value={selected.color}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, color: value }))}
        />
        <ColorInput
          label="Outline"
          value={selected.strokeColor}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeColor: value }))}
        />
      </div>
      <SliderNumberInput
        label="Line height"
        value={selected.lineHeight}
        min={0.5}
        max={2}
        step={0.01}
        decimals={2}
        onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, lineHeight: value }))}
      />
      <label className="field">
        <span>Text align</span>
        <select
          value={selected.align}
          onChange={(event) =>
            onUpdateLayer(selected.id, (layer) => ({ ...layer, align: event.target.value as TextAlign }))
          }
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
    </>
  );
}

function ShapeControls({
  selected,
  onUpdateLayer,
}: {
  selected: Extract<ThumbnailLayer, { type: "shape" }>;
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
}) {
  return (
    <>
      <label className="field">
        <span>Shape</span>
        <select
          value={selected.shape}
          onChange={(event) =>
            onUpdateLayer(selected.id, (layer) => ({ ...layer, shape: event.target.value as ShapeKind }))
          }
        >
          <option value="rect">Rect</option>
          <option value="ellipse">Ellipse</option>
          <option value="triangle">Triangle</option>
        </select>
      </label>
      <div className="field-grid two">
        <ColorInput
          label="Fill"
          value={selected.fill}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, fill: value }))}
        />
        <ColorInput
          label="Stroke"
          value={selected.strokeColor}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, strokeColor: value }))}
        />
        <SliderNumberInput
          label="Stroke width"
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
        {label} {rounded}
        {suffix}
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
