import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Layers,
  RotateCw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { fontLabelFor, fontOptions } from "../lib/fonts";
import type { ImageAsset, ImageEffects, ShapeKind, TextAlign, ThumbnailLayer } from "../lib/types";

interface InspectorPanelProps {
  assets: ImageAsset[];
  layers: ThumbnailLayer[];
  selectedId: string;
  onSelect: (id: string) => void;
  onUpdateLayer: (id: string, updater: (layer: ThumbnailLayer) => ThumbnailLayer) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onReorderLayer: (draggedId: string, targetId: string) => void;
}

export function InspectorPanel({
  assets,
  layers,
  selectedId,
  onSelect,
  onUpdateLayer,
  onDelete,
  onDuplicate,
  onMove,
  onReorderLayer,
}: InspectorPanelProps) {
  const selected = layers.find((layer) => layer.id === selectedId) ?? layers.at(-1);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  return (
    <aside className="side-panel inspector-panel" aria-label="Layer inspector">
      <section className="panel-section layer-section">
        <div className="section-heading">
          <Layers size={16} />
          <h2>Layers</h2>
        </div>
        <div className="layer-list" aria-label="Layer list">
          {[...layers].reverse().map((layer) => (
            <button
              key={layer.id}
              type="button"
              draggable
              className={`layer-row ${layer.id === selected?.id ? "selected" : ""} ${
                draggingId === layer.id ? "dragging" : ""
              }`}
              onClick={() => onSelect(layer.id)}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", layer.id);
                setDraggingId(layer.id);
                onSelect(layer.id);
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
              {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          ))}
        </div>
      </section>

      {selected ? (
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
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={selected.visible}
                onChange={(event) =>
                  onUpdateLayer(selected.id, (layer) => ({ ...layer, visible: event.currentTarget.checked }))
                }
              />
              Visible
            </label>
            <div className="field-grid two">
              <NumberInput label="X" value={selected.x} onChange={(value) => updateNumber(selected, "x", value, onUpdateLayer)} />
              <NumberInput label="Y" value={selected.y} onChange={(value) => updateNumber(selected, "y", value, onUpdateLayer)} />
              <NumberInput
                label="Width"
                value={selected.width}
                onChange={(value) => updateNumber(selected, "width", value, onUpdateLayer)}
              />
              <NumberInput
                label="Height"
                value={selected.height}
                onChange={(value) => updateNumber(selected, "height", value, onUpdateLayer)}
              />
            </div>
            <label className="range-field">
              <span>
                <RotateCw size={14} /> Rotation {Math.round(selected.rotation)} deg
              </span>
              <input
                type="range"
                min={-180}
                max={180}
                value={selected.rotation}
                onChange={(event) =>
                  updateNumber(selected, "rotation", Number.parseFloat(event.currentTarget.value), onUpdateLayer)
                }
              />
            </label>
            <label className="range-field">
              <span>Opacity {selected.opacity.toFixed(2)}</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={selected.opacity}
                onChange={(event) =>
                  updateNumber(selected, "opacity", Number.parseFloat(event.currentTarget.value), onUpdateLayer)
                }
              />
            </label>

            {selected.type === "image" && (
              <ImageControls selected={selected} assets={assets} onUpdateLayer={onUpdateLayer} />
            )}
            {selected.type === "text" && <TextControls selected={selected} onUpdateLayer={onUpdateLayer} />}
            {selected.type === "shape" && <ShapeControls selected={selected} onUpdateLayer={onUpdateLayer} />}
          </div>
        </section>
      ) : null}
    </aside>
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
        <EffectInput selected={selected} effect="grayscale" label="Gray" max={1} step={0.05} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="blur" label="Blur" max={24} step={1} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="brightness" label="Bright" max={180} step={1} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="contrast" label="Contrast" max={180} step={1} onUpdateLayer={onUpdateLayer} />
        <EffectInput selected={selected} effect="mosaic" label="Mosaic" max={48} step={1} onUpdateLayer={onUpdateLayer} />
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
        <NumberInput
          label="Font size"
          value={selected.fontSize}
          onChange={(value) => onUpdateLayer(selected.id, (layer) => ({ ...layer, fontSize: value }))}
        />
        <NumberInput
          label="Stroke"
          value={selected.strokeWidth}
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
      <label className="field">
        <span>Align</span>
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
        <NumberInput
          label="Stroke width"
          value={selected.strokeWidth}
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
  max,
  step,
  onUpdateLayer,
}: {
  selected: Extract<ThumbnailLayer, { type: "image" }>;
  effect: keyof ImageEffects;
  label: string;
  max: number;
  step: number;
  onUpdateLayer: InspectorPanelProps["onUpdateLayer"];
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        min={0}
        max={max}
        step={step}
        value={selected.effects[effect]}
        onChange={(event) =>
          onUpdateLayer(selected.id, (layer) =>
            layer.type === "image"
              ? {
                  ...layer,
                  effects: { ...layer.effects, [effect]: Number.parseFloat(event.currentTarget.value) || 0 },
                }
              : layer,
          )
        }
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" value={round(value)} onChange={(event) => onChange(Number.parseFloat(event.target.value) || 0)} />
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

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
