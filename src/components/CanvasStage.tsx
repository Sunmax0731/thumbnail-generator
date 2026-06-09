import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Code2,
  Download,
  FileText,
  FolderOpen,
  Hand,
  Maximize2,
  MonitorPlay,
  MousePointer2,
  RefreshCw,
  Save,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { calculateCanvasFitZoom } from "../lib/canvasFit";
import type { Translator } from "../lib/i18n";
import type { OutputSettings } from "../lib/types";

interface CanvasStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  settings: OutputSettings;
  layerCount: number;
  selectedLayerName: string;
  zoom: number;
  cursor: string;
  previewPadding: number;
  csvText: string;
  htmlText: string;
  autoSaveEnabled: boolean;
  savedEditStateUpdatedAt: string | null;
  onZoomChange: (zoom: number) => void;
  onPointerDown: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onCsvTextChange: (value: string) => void;
  onHtmlTextChange: (value: string) => void;
  onApplyCsv: () => void;
  onApplyHtml: () => void;
  onSyncLayoutText: () => void;
  onAutoSaveChange: (enabled: boolean) => void;
  onSaveEditState: () => void;
  onRestoreEditState: () => void;
  onExportEditState: () => void;
  onImportEditState: (file: File | null) => void;
  onDeleteEditState: () => void;
  onOpenObsPreview: () => void;
  t: Translator;
}

export function CanvasStage({
  canvasRef,
  settings,
  layerCount,
  selectedLayerName,
  zoom,
  cursor,
  previewPadding,
  csvText,
  htmlText,
  autoSaveEnabled,
  savedEditStateUpdatedAt,
  onZoomChange,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onCsvTextChange,
  onHtmlTextChange,
  onApplyCsv,
  onApplyHtml,
  onSyncLayoutText,
  onAutoSaveChange,
  onSaveEditState,
  onRestoreEditState,
  onExportEditState,
  onImportEditState,
  onDeleteEditState,
  onOpenObsPreview,
  t,
}: CanvasStageProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const panDrag = useRef<{ target: HTMLElement; clientX: number; clientY: number; scrollLeft: number; scrollTop: number } | null>(null);
  const [isPanMode, setIsPanMode] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePanning, setIsSpacePanning] = useState(false);
  const [isLayoutIoExpanded, setIsLayoutIoExpanded] = useState(false);
  const fitCanvas = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const styles = window.getComputedStyle(container);
    const horizontalPadding = cssPixels(styles.paddingLeft) + cssPixels(styles.paddingRight);
    const verticalPadding = cssPixels(styles.paddingTop) + cssPixels(styles.paddingBottom);
    onZoomChange(
      calculateCanvasFitZoom({
        containerWidth: container.clientWidth - horizontalPadding,
        containerHeight: container.clientHeight - verticalPadding,
        documentWidth: settings.width,
        documentHeight: settings.height,
        previewPadding,
      }),
    );
  }, [onZoomChange, previewPadding, settings.height, settings.width]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !isKeyboardInputTarget(event.target)) setIsSpacePanning(true);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") setIsSpacePanning(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const beginPan = (event: React.PointerEvent<HTMLElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    panDrag.current = {
      target: event.currentTarget,
      clientX: event.clientX,
      clientY: event.clientY,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
    };
    setIsPanning(true);
  };

  const continuePan = (event: React.PointerEvent<HTMLElement>) => {
    const active = panDrag.current;
    const container = scrollRef.current;
    if (!active || !container) return false;
    event.preventDefault();
    container.scrollLeft = active.scrollLeft - (event.clientX - active.clientX);
    container.scrollTop = active.scrollTop - (event.clientY - active.clientY);
    return true;
  };

  const endPan = (event: React.PointerEvent<HTMLElement>) => {
    const active = panDrag.current;
    if (!active) return false;
    if (active.target.hasPointerCapture(event.pointerId)) active.target.releasePointerCapture(event.pointerId);
    panDrag.current = null;
    setIsPanning(false);
    return true;
  };

  const shouldPan = (event: React.PointerEvent<HTMLElement>) => isPanMode || isSpacePanning || event.altKey;
  const frameWidth = settings.width + previewPadding * 2;
  const frameHeight = settings.height + previewPadding * 2;

  return (
    <section className="stage-panel" aria-label={t("stage.aria")}>
      <div className="stage-toolbar">
        <div className="stage-title">
          <MousePointer2 size={16} />
          <span>{selectedLayerName}</span>
        </div>
        <div className="stage-meta">
          <span>{layerCount === 1 ? t("stage.layerCount.one") : t("stage.layerCount", { count: layerCount })}</span>
          <span>
            {settings.width} x {settings.height}
          </span>
        </div>
        <div className="zoom-controls" aria-label={t("stage.zoom")}>
          <button
            type="button"
            className="secondary-button icon-text obs-preview-button"
            onClick={onOpenObsPreview}
            title={t("stage.openObsPreview")}
          >
            <MonitorPlay size={16} /> {t("stage.openObsPreview")}
          </button>
          <button
            type="button"
            className={`icon-button ${isPanMode ? "selected" : ""}`}
            title={t("stage.panCanvas")}
            aria-pressed={isPanMode}
            onClick={() => setIsPanMode((current) => !current)}
          >
            <Hand size={16} />
          </button>
          <button
            type="button"
            className="icon-button"
            title={t("stage.zoomOut")}
            onClick={() => onZoomChange(Math.max(0.25, zoom - 0.08))}
          >
            <ZoomOut size={16} />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="icon-button"
            title={t("stage.zoomIn")}
            onClick={() => onZoomChange(Math.min(1, zoom + 0.08))}
          >
            <ZoomIn size={16} />
          </button>
          <button type="button" className="icon-button" title={t("stage.fitCanvas")} onClick={fitCanvas}>
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      <div
        className={`canvas-scroll ${isPanMode || isSpacePanning ? "pan-ready" : ""} ${isPanning ? "panning" : ""}`}
        ref={scrollRef}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) beginPan(event);
        }}
        onPointerMove={(event) => {
          continuePan(event);
        }}
        onPointerUp={(event) => {
          endPan(event);
        }}
        onPointerCancel={(event) => {
          endPan(event);
        }}
      >
        <div
          className="canvas-frame"
          style={{
            aspectRatio: `${frameWidth} / ${frameHeight}`,
            width: `${Math.max(1, Math.round(frameWidth * zoom))}px`,
          }}
        >
          <canvas
            ref={canvasRef}
            className="thumbnail-canvas"
            aria-label={t("stage.canvasLabel")}
            style={{ cursor: isPanning ? "grabbing" : isPanMode || isSpacePanning ? "grab" : cursor }}
            onPointerDown={(event) => {
              if (shouldPan(event)) {
                beginPan(event);
                return;
              }
              onPointerDown(event);
            }}
            onPointerMove={(event) => {
              if (continuePan(event)) return;
              onPointerMove(event);
            }}
            onPointerUp={(event) => {
              if (endPan(event)) return;
              onPointerUp(event);
            }}
            onPointerCancel={(event) => {
              if (endPan(event)) return;
              onPointerUp(event);
            }}
          />
        </div>
      </div>
      <section className="stage-layout-io" aria-label={t("left.generatedLayout")}>
        <button
          type="button"
          className="collapsible-heading"
          aria-expanded={isLayoutIoExpanded}
          onClick={() => setIsLayoutIoExpanded((current) => !current)}
        >
          {isLayoutIoExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span>{t("left.generatedLayout")}</span>
        </button>
        {isLayoutIoExpanded ? (
          <div className="stage-layout-grid">
            <div className="stage-layout-actions">
              <button type="button" className="secondary-button icon-text" onClick={onSyncLayoutText}>
                <RefreshCw size={16} /> {t("left.generateLayout")}
              </button>
            </div>
            <label className="field stage-layout-field">
              <span>{t("left.csvLayout")}</span>
              <textarea
                className="layout-textarea"
                spellCheck={false}
                value={csvText}
                onChange={(event) => onCsvTextChange(event.target.value)}
                aria-label={t("left.csvEditor")}
              />
            </label>
            <button type="button" className="secondary-button icon-text" onClick={onApplyCsv}>
              <FileText size={16} /> {t("left.applyCsv")}
            </button>
            <label className="field stage-layout-field">
              <span>{t("left.htmlLayout")}</span>
              <textarea
                className="layout-textarea"
                spellCheck={false}
                value={htmlText}
                onChange={(event) => onHtmlTextChange(event.target.value)}
                aria-label={t("left.htmlEditor")}
              />
            </label>
            <button type="button" className="secondary-button icon-text" onClick={onApplyHtml}>
              <Code2 size={16} /> {t("left.applyHtml")}
            </button>
          </div>
        ) : null}
      </section>
      <section className="stage-edit-state" aria-label={t("left.editState")}>
        <div className="stage-edit-state-header">
          <div className="section-heading">
            <Save size={16} />
            <h2>{t("left.editState")}</h2>
          </div>
          <p className="edit-state-meta">
            {savedEditStateUpdatedAt
              ? t("left.savedEditStateAt", { time: formatSavedAt(savedEditStateUpdatedAt) })
              : t("left.noSavedEditState")}
          </p>
        </div>
        <label className="checkbox-row autosave-row">
          <input
            type="checkbox"
            checked={autoSaveEnabled}
            onChange={(event) => onAutoSaveChange(event.currentTarget.checked)}
          />
          <span>{t("left.autoSaveEditState")}</span>
        </label>
        <div className="stage-edit-actions">
          <button type="button" className="secondary-button icon-text" onClick={onSaveEditState}>
            <Save size={16} /> {t("left.saveEditState")}
          </button>
          <button type="button" className="secondary-button icon-text" onClick={onRestoreEditState}>
            <FolderOpen size={16} /> {t("left.restoreEditState")}
          </button>
          <button type="button" className="secondary-button icon-text" onClick={onExportEditState}>
            <Download size={16} /> {t("left.exportState")}
          </button>
          <label className="secondary-button icon-text file-action">
            <FolderOpen size={16} /> {t("left.importState")}
            <input type="file" accept="application/json,.json" onChange={(event) => onImportEditState(event.currentTarget.files?.[0] ?? null)} />
          </label>
          <button type="button" className="ghost-button danger-text icon-text" onClick={onDeleteEditState}>
            <Trash2 size={15} /> {t("left.deleteEditState")}
          </button>
        </div>
        <p className="privacy-note">{t("left.privacyNotice")}</p>
      </section>
    </section>
  );
}

function isKeyboardInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function formatSavedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function cssPixels(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
