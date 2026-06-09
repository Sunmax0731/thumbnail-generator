import { useEffect, useState, type ReactNode } from "react";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Folder,
  GripHorizontal,
  GripVertical,
  ImagePlus,
  Layers,
  Lock,
  MousePointer2,
  Shapes,
  Trash2,
  Type,
  Unlock,
} from "lucide-react";
import type { AlignmentMode } from "../lib/alignment";
import type { Translator } from "../lib/i18n";
import type { ThumbnailLayer } from "../lib/types";

export interface LayerPanelProps {
  layers: ThumbnailLayer[];
  selectedIds: string[];
  selectedAssetKey: string;
  onSelect: (id: string, additive?: boolean) => void;
  onSelectIndividual: (id: string) => void;
  onDelete: (id: string) => void;
  onReorderLayer: (draggedId: string, targetId: string) => void;
  onToggleVisible: (id: string) => void;
  onToggleSelectable: (id: string) => void;
  onAddText: () => void;
  onAddShape: () => void;
  onAddLineLayer: () => void;
  onAddQuickLayer: (kind: "headline" | "subtitle" | "badge" | "divider") => void;
  onAddImageAssetLayer: (key: string) => void;
  onAlignSelection: (mode: AlignmentMode) => void;
  onCreateGroup: (name: string) => void;
  onRenameGroup: (groupId: string, name: string) => void;
  onUngroup: (groupId: string) => void;
  t: Translator;
}

export function LayerPanel({
  layers,
  selectedIds,
  selectedAssetKey,
  onSelect,
  onSelectIndividual,
  onDelete,
  onReorderLayer,
  onToggleVisible,
  onToggleSelectable,
  onAddText,
  onAddShape,
  onAddLineLayer,
  onAddQuickLayer,
  onAddImageAssetLayer,
  onAlignSelection,
  onCreateGroup,
  onRenameGroup,
  onUngroup,
  t,
}: LayerPanelProps) {
  const selectedLayers = layers.filter((layer) => selectedIds.includes(layer.id) && layer.selectable);
  const selectedGroupIds = Array.from(new Set(selectedLayers.map((layer) => layer.groupId).filter(Boolean))) as string[];
  const activeGroupId = selectedGroupIds.length === 1 ? selectedGroupIds[0] : undefined;
  const activeGroupName = activeGroupId
    ? selectedLayers.find((layer) => layer.groupId === activeGroupId)?.groupName ?? "Layer group"
    : "";
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [layerListHeight, setLayerListHeight] = useState(360);
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(true);
  const [isLayerListExpanded, setIsLayerListExpanded] = useState(true);
  const deleteCandidate = deleteCandidateId ? layers.find((layer) => layer.id === deleteCandidateId) : undefined;

  return (
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
            <button
              type="button"
              className="secondary-button icon-text"
              onClick={() => onAddImageAssetLayer(selectedAssetKey)}
              disabled={!selectedAssetKey}
            >
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
    </>
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
      <label className="field">
        <span>{t("inspector.groupName")}</span>
        <input type="text" value={draft} onChange={(event) => setDraft(event.currentTarget.value)} />
      </label>
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
        <p>{t("inspector.deleteCopy", { name: layer.name })}</p>
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

function clampPanelHeight(value: number): number {
  return Math.min(720, Math.max(220, Math.round(value)));
}
