import { useCallback, useEffect, useRef } from "react";
import { Download, FolderOpen, Maximize2, MonitorPlay, MousePointer2, Save, Trash2, ZoomIn, ZoomOut } from "lucide-react";
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
  autoSaveEnabled: boolean;
  savedEditStateUpdatedAt: string | null;
  onZoomChange: (zoom: number) => void;
  onPointerDown: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLCanvasElement>) => void;
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
  autoSaveEnabled,
  savedEditStateUpdatedAt,
  onZoomChange,
  onPointerDown,
  onPointerMove,
  onPointerUp,
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
    fitCanvas();
    const container = scrollRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => fitCanvas());
    observer.observe(container);
    return () => observer.disconnect();
  }, [fitCanvas]);

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
      <div className="canvas-scroll" ref={scrollRef}>
        <div
          className="canvas-frame"
          style={{
            aspectRatio: `${settings.width + previewPadding * 2} / ${settings.height + previewPadding * 2}`,
            width: `${Math.round(100 * zoom)}%`,
            minWidth: settings.height > settings.width ? "290px" : "520px",
          }}
        >
          <canvas
            ref={canvasRef}
            className="thumbnail-canvas"
            aria-label={t("stage.canvasLabel")}
            style={{ cursor }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
        </div>
      </div>
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

function formatSavedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function cssPixels(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
