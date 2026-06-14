import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileDown,
  Hand,
  ImageDown,
  Maximize2,
  Monitor,
  MonitorPlay,
  Pause,
  Play,
  MousePointer2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { calculateCanvasFitZoom } from "../lib/canvasFit";
import { pointToCanvas } from "../lib/canvasInteraction";
import { pickLayersInRect } from "../lib/hitTest";
import type { Translator } from "../lib/i18n";
import { outputPresets } from "../lib/presets";
import type { ExportFormat, LayerAnimation, OutputSettings, ThumbnailLayer } from "../lib/types";

const timelineMinHeight = 120;
const timelineMaxHeight = 640;

type RangeSelectionMode = "replace" | "add" | "subtract";

interface RangeSelectionDrag {
  pointerId: number;
  mode: RangeSelectionMode;
  startCanvas: { x: number; y: number };
  currentCanvas: { x: number; y: number };
  startView: { x: number; y: number };
  currentView: { x: number; y: number };
}

interface CanvasStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  settings: OutputSettings;
  selectedLayerName: string;
  zoom: number;
  autoFitRevision: number;
  cursor: string;
  previewPadding: number;
  isExporting: boolean;
  layers: ThumbnailLayer[];
  selectedIds: string[];
  showMotionTimeline: boolean;
  isPlaybackPlaying: boolean;
  playbackTimeMs: number;
  onZoomChange: (zoom: number) => void;
  onTogglePlayback: () => void;
  onResetPlayback: () => void;
  onPointerDown: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onRangeSelect: (ids: string[], mode: RangeSelectionMode) => void;
  onExport: (format?: ExportFormat) => void;
  onSettingsChange: (next: Partial<OutputSettings>) => void;
  onPresetChange: (presetId: string) => void;
  onOpenObsPreview: () => void;
  onSelectLayer: (id: string, additive?: boolean) => void;
  onUpdateLayer: (id: string, updater: (layer: ThumbnailLayer) => ThumbnailLayer) => void;
  onClearSelection: () => void;
  t: Translator;
}

export function CanvasStage({
  canvasRef,
  settings,
  selectedLayerName,
  zoom,
  autoFitRevision,
  cursor,
  previewPadding,
  isExporting,
  layers,
  selectedIds,
  showMotionTimeline,
  isPlaybackPlaying,
  playbackTimeMs,
  onZoomChange,
  onTogglePlayback,
  onResetPlayback,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onRangeSelect,
  onExport,
  onSettingsChange,
  onPresetChange,
  onOpenObsPreview,
  onSelectLayer,
  onUpdateLayer,
  onClearSelection,
  t,
}: CanvasStageProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const panDrag = useRef<{ target: HTMLElement; clientX: number; clientY: number; panX: number; panY: number } | null>(null);
  const [isPanMode, setIsPanMode] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePanning, setIsSpacePanning] = useState(false);
  const [isOutputMenuOpen, setIsOutputMenuOpen] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [rangeSelectionDrag, setRangeSelectionDrag] = useState<RangeSelectionDrag | null>(null);
  const lastAutoFitRevision = useRef(0);
  const centerCanvasView = useCallback(() => {
    const container = scrollRef.current;
    const frame = frameRef.current;
    if (!container || !frame) {
      setPanOffset({ x: 0, y: 0 });
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const deltaX = frameRect.left + frameRect.width / 2 - (containerRect.left + containerRect.width / 2);
    const deltaY = frameRect.top + frameRect.height / 2 - (containerRect.top + containerRect.height / 2);
    setPanOffset((current) => ({
      x: current.x - deltaX,
      y: current.y - deltaY,
    }));
  }, []);

  const setZoomWithAnchor = useCallback(
    (nextZoom: number, clientX?: number, clientY?: number) => {
      const clampedZoom = clampZoom(nextZoom);
      if (clientX !== undefined && clientY !== undefined && scrollRef.current) {
        const rect = scrollRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setPanOffset((current) => {
          const ratio = clampedZoom / zoom;
          return {
            x: clientX - centerX - (clientX - centerX - current.x) * ratio,
            y: clientY - centerY - (clientY - centerY - current.y) * ratio,
          };
        });
      }
      onZoomChange(clampedZoom);
    },
    [onZoomChange, zoom],
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (isPlaybackPlaying) return;
      const direction = event.deltaY > 0 ? -1 : 1;
      const multiplier = event.ctrlKey || event.metaKey ? 0.18 : 0.1;
      setZoomWithAnchor(zoom * (1 + direction * multiplier), event.clientX, event.clientY);
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [isPlaybackPlaying, setZoomWithAnchor, zoom]);

  const fitCanvas = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const styles = window.getComputedStyle(container);
    const horizontalPadding = cssPixels(styles.paddingLeft) + cssPixels(styles.paddingRight);
    const verticalPadding = cssPixels(styles.paddingTop) + cssPixels(styles.paddingBottom);
    const nextZoom = calculateCanvasFitZoom({
      containerWidth: container.clientWidth - horizontalPadding,
      containerHeight: container.clientHeight - verticalPadding,
      documentWidth: settings.width,
      documentHeight: settings.height,
      previewPadding,
    });
    onZoomChange(nextZoom);
    setPanOffset({ x: 0, y: 0 });
    window.requestAnimationFrame(() => window.requestAnimationFrame(centerCanvasView));
  }, [centerCanvasView, onZoomChange, previewPadding, settings.height, settings.width]);

  useEffect(() => {
    if (autoFitRevision <= 0 || lastAutoFitRevision.current === autoFitRevision) return;
    lastAutoFitRevision.current = autoFitRevision;
    const frame = window.requestAnimationFrame(() => fitCanvas());
    return () => window.cancelAnimationFrame(frame);
  }, [autoFitRevision, fitCanvas]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isPlaybackPlaying) return;
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
  }, [isPlaybackPlaying]);

  useEffect(() => {
    if (!isPlaybackPlaying) return;
    panDrag.current = null;
    setRangeSelectionDrag(null);
    setIsPanMode(false);
    setIsPanning(false);
    setIsSpacePanning(false);
  }, [isPlaybackPlaying]);

  const beginPan = (event: React.PointerEvent<HTMLElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    panDrag.current = {
      target: event.currentTarget,
      clientX: event.clientX,
      clientY: event.clientY,
      panX: panOffset.x,
      panY: panOffset.y,
    };
    setIsPanning(true);
  };

  const continuePan = (event: React.PointerEvent<HTMLElement>) => {
    const active = panDrag.current;
    const container = scrollRef.current;
    if (!active || !container) return false;
    event.preventDefault();
    setPanOffset({
      x: active.panX + event.clientX - active.clientX,
      y: active.panY + event.clientY - active.clientY,
    });
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

  const shouldPan = (event: React.PointerEvent<HTMLElement>) =>
    !isPlaybackPlaying && (isPanMode || isSpacePanning || event.altKey || event.button === 2 || (event.buttons & 2) === 2);
  const beginRangeSelection = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPlaybackPlaying || event.button !== 1) return false;
    event.preventDefault();
    event.stopPropagation();
    const canvas = event.currentTarget;
    safelySetPointerCapture(canvas, event.pointerId);
    const startCanvas = pointToCanvas(canvas, event.clientX, event.clientY, previewPadding);
    const startView = clientPointToElementPoint(canvas, event.clientX, event.clientY);
    setRangeSelectionDrag({
      pointerId: event.pointerId,
      mode: event.ctrlKey || event.metaKey ? "subtract" : event.shiftKey ? "add" : "replace",
      startCanvas,
      currentCanvas: startCanvas,
      startView,
      currentView: startView,
    });
    return true;
  };

  const continueRangeSelection = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!rangeSelectionDrag || event.pointerId !== rangeSelectionDrag.pointerId) return false;
    event.preventDefault();
    event.stopPropagation();
    const canvas = event.currentTarget;
    const currentCanvas = pointToCanvas(canvas, event.clientX, event.clientY, previewPadding);
    const currentView = clientPointToElementPoint(canvas, event.clientX, event.clientY);
    setRangeSelectionDrag((current) =>
      current
        ? {
            ...current,
            currentCanvas,
            currentView,
          }
        : current,
    );
    return true;
  };

  const endRangeSelection = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!rangeSelectionDrag || event.pointerId !== rangeSelectionDrag.pointerId) return false;
    event.preventDefault();
    event.stopPropagation();
    const canvas = event.currentTarget;
    const currentCanvas = pointToCanvas(canvas, event.clientX, event.clientY, previewPadding);
    const currentView = clientPointToElementPoint(canvas, event.clientX, event.clientY);
    const dx = currentView.x - rangeSelectionDrag.startView.x;
    const dy = currentView.y - rangeSelectionDrag.startView.y;
    const pickedLayers =
      Math.hypot(dx, dy) < 4
        ? []
        : pickLayersInRect(layers, {
            left: rangeSelectionDrag.startCanvas.x,
            top: rangeSelectionDrag.startCanvas.y,
            right: currentCanvas.x,
            bottom: currentCanvas.y,
          });
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    onRangeSelect(pickedLayers.map((layer) => layer.id), rangeSelectionDrag.mode);
    setRangeSelectionDrag(null);
    return true;
  };

  const rangeSelectionBox = rangeSelectionDrag ? createSelectionBox(rangeSelectionDrag.startView, rangeSelectionDrag.currentView) : null;
  const frameWidth = settings.width + previewPadding * 2;
  const frameHeight = settings.height + previewPadding * 2;

  return (
    <section className="stage-panel" aria-label={t("stage.aria")}>
      <div className="stage-toolbar">
        <div className="stage-title">
          <MousePointer2 size={16} />
          <span>{selectedLayerName}</span>
        </div>
        <div className="stage-size-controls" aria-label={t("toolbar.outputSettings")}>
          <label className="field compact-field">
            <span>
              <Monitor size={14} /> {t("toolbar.preset")}
            </span>
            <select value={settings.presetId} disabled={isPlaybackPlaying} onChange={(event) => onPresetChange(event.target.value)}>
              {outputPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {t(preset.labelKey)}
                </option>
              ))}
            </select>
          </label>
          <label className="field size-field">
            <span>{t("toolbar.width")}</span>
            <input
              type="number"
              min={320}
              max={4096}
              step={16}
              value={settings.width}
              disabled={isPlaybackPlaying}
              onChange={(event) =>
                onSettingsChange({ presetId: "custom", width: Number.parseInt(event.target.value, 10) || 1280 })
              }
            />
            <input
              type="range"
              min={320}
              max={4096}
              step={16}
              value={settings.width}
              disabled={isPlaybackPlaying}
              onChange={(event) =>
                onSettingsChange({ presetId: "custom", width: Number.parseInt(event.target.value, 10) || 1280 })
              }
            />
          </label>
          <label className="field size-field">
            <span>{t("toolbar.height")}</span>
            <input
              type="number"
              min={320}
              max={4096}
              step={16}
              value={settings.height}
              disabled={isPlaybackPlaying}
              onChange={(event) =>
                onSettingsChange({ presetId: "custom", height: Number.parseInt(event.target.value, 10) || 720 })
              }
            />
            <input
              type="range"
              min={320}
              max={4096}
              step={16}
              value={settings.height}
              disabled={isPlaybackPlaying}
              onChange={(event) =>
                onSettingsChange({ presetId: "custom", height: Number.parseInt(event.target.value, 10) || 720 })
              }
            />
          </label>
        </div>
        <div className="zoom-controls" aria-label={t("stage.zoom")}>
          <div className="output-menu">
            <button
              type="button"
              className="secondary-button icon-text obs-preview-button"
              onClick={() => setIsOutputMenuOpen((current) => !current)}
              title={t("toolbar.output")}
              aria-haspopup="menu"
              aria-expanded={isOutputMenuOpen}
            >
              <ImageDown size={16} /> {t("toolbar.output")}
            </button>
            {isOutputMenuOpen ? (
              <div className="output-menu-popover" role="menu">
                <button type="button" role="menuitem" onClick={() => runOutputAction(() => onExport("jpeg"))} disabled={isExporting}>
                  <FileDown size={15} /> JPG
                </button>
                <button type="button" role="menuitem" onClick={() => runOutputAction(() => onExport("png"))} disabled={isExporting}>
                  <ImageDown size={15} /> PNG
                </button>
                <button type="button" role="menuitem" onClick={() => runOutputAction(() => onExport("webp"))} disabled={isExporting}>
                  <FileDown size={15} /> WebP
                </button>
                <button type="button" role="menuitem" onClick={() => runOutputAction(onOpenObsPreview)}>
                  <MonitorPlay size={15} /> {t("stage.openObsPreview")}
                </button>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className={`icon-button ${isPanMode ? "selected" : ""}`}
            title={t("stage.panCanvas")}
            aria-pressed={isPanMode}
            disabled={isPlaybackPlaying}
            onClick={() => setIsPanMode((current) => !current)}
          >
            <Hand size={16} />
          </button>
          <button
            type="button"
            className="icon-button"
            title={t("stage.zoomOut")}
            disabled={isPlaybackPlaying}
            onClick={() => setZoomWithAnchor(zoom - 0.08)}
          >
            <ZoomOut size={16} />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="icon-button"
            title={t("stage.zoomIn")}
            disabled={isPlaybackPlaying}
            onClick={() => setZoomWithAnchor(zoom + 0.08)}
          >
            <ZoomIn size={16} />
          </button>
          <button type="button" className="icon-button" title={t("stage.fitCanvas")} disabled={isPlaybackPlaying} onClick={fitCanvas}>
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      <div
        className={`canvas-scroll ${isPanMode || isSpacePanning ? "pan-ready" : ""} ${isPanning ? "panning" : ""} ${
          isPlaybackPlaying ? "playback-running" : ""
        }`}
        ref={scrollRef}
        onContextMenu={(event) => event.preventDefault()}
        onPointerDownCapture={(event) => {
          if (isPlaybackPlaying) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          if (!shouldPan(event)) return;
          beginPan(event);
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          if (isPlaybackPlaying) {
            event.preventDefault();
            return;
          }
          if (panDrag.current) return;
          if (shouldPan(event)) {
            beginPan(event);
            return;
          }
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          onClearSelection();
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
          ref={frameRef}
          style={{
            aspectRatio: `${frameWidth} / ${frameHeight}`,
            width: `${Math.max(1, Math.round(frameWidth * zoom))}px`,
            transform: `translate(${Math.round(panOffset.x)}px, ${Math.round(panOffset.y)}px)`,
          }}
        >
          <canvas
            ref={canvasRef}
            className="thumbnail-canvas"
            aria-label={t("stage.canvasLabel")}
            style={{ cursor: isPlaybackPlaying ? "not-allowed" : isPanning ? "grabbing" : isPanMode || isSpacePanning ? "grab" : cursor }}
            onContextMenu={(event) => event.preventDefault()}
            onPointerDown={(event) => {
              if (isPlaybackPlaying) {
                event.preventDefault();
                return;
              }
              if (beginRangeSelection(event)) return;
              if (shouldPan(event)) {
                beginPan(event);
                return;
              }
              onPointerDown(event);
            }}
            onPointerMove={(event) => {
              if (continueRangeSelection(event)) return;
              if (continuePan(event)) return;
              onPointerMove(event);
            }}
            onPointerUp={(event) => {
              if (endRangeSelection(event)) return;
              if (endPan(event)) return;
              onPointerUp(event);
            }}
            onPointerCancel={(event) => {
              if (endRangeSelection(event)) return;
              if (endPan(event)) return;
              onPointerUp(event);
            }}
          />
          {rangeSelectionBox ? (
            <div
              className={`canvas-range-selection ${rangeSelectionDrag?.mode ?? "replace"}`}
              style={rangeSelectionBox}
              aria-hidden="true"
            />
          ) : null}
        </div>
      </div>
      {showMotionTimeline ? (
        <MotionTimeline
          layers={layers}
          selectedIds={selectedIds}
          isPlaybackPlaying={isPlaybackPlaying}
          playbackTimeMs={playbackTimeMs}
          onTogglePlayback={onTogglePlayback}
          onResetPlayback={onResetPlayback}
          onSelectLayer={onSelectLayer}
          onUpdateLayer={onUpdateLayer}
          t={t}
        />
      ) : null}
    </section>
  );

  function runOutputAction(action: () => void) {
    action();
    setIsOutputMenuOpen(false);
  }
}

function isKeyboardInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function cssPixels(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clientPointToElementPoint(element: HTMLElement, clientX: number, clientY: number): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function clampZoom(value: number): number {
  return Math.min(4, Math.max(0.1, Number.isFinite(value) ? value : 1));
}

function MotionTimeline({
  layers,
  selectedIds,
  isPlaybackPlaying,
  playbackTimeMs,
  onTogglePlayback,
  onResetPlayback,
  onSelectLayer,
  onUpdateLayer,
  t,
}: {
  layers: ThumbnailLayer[];
  selectedIds: string[];
  isPlaybackPlaying: boolean;
  playbackTimeMs: number;
  onTogglePlayback: () => void;
  onResetPlayback: () => void;
  onSelectLayer: (id: string, additive?: boolean) => void;
  onUpdateLayer: (id: string, updater: (layer: ThumbnailLayer) => ThumbnailLayer) => void;
  t: Translator;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [timelineHeight, setTimelineHeight] = useState(170);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const motionLayers = layers.filter((layer) => {
    const animations = layer.animations?.length ? layer.animations : layer.animation ? [layer.animation] : [];
    return animations.length > 0;
  });
  const duration = Math.max(
    10000,
    ...motionLayers.flatMap((layer) => (layer.animations?.length ? layer.animations : layer.animation ? [layer.animation] : []).map((animation) => animation.startMs + animation.durationMs)),
  );
  const playbackPercent = Math.min(100, Math.max(0, (playbackTimeMs / duration) * 100));

  const updateAnimationTiming = (layerId: string, animationIndex: number, next: Partial<Pick<LayerAnimation, "startMs" | "durationMs">>) => {
    if (isPlaybackPlaying) return;
    onUpdateLayer(layerId, (layer) => {
      const animations = layer.animations?.length ? layer.animations : layer.animation ? [layer.animation] : [];
      if (!animations[animationIndex]) return layer;
      const nextAnimations = animations.map((animation, index) =>
        index === animationIndex
          ? {
              ...animation,
              ...next,
              startMs: Math.max(0, Math.round((next.startMs ?? animation.startMs) / 50) * 50),
              durationMs: Math.max(100, Math.round((next.durationMs ?? animation.durationMs) / 50) * 50),
            }
          : animation,
      );
      return {
        ...layer,
        animation: nextAnimations[0],
        animations: nextAnimations.length > 0 ? nextAnimations : undefined,
      };
    });
  };

  const beginTimelineResize = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isPlaybackPlaying) return;
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = sectionRef.current?.getBoundingClientRect().height ?? timelineHeight;
    const handlePointerMove = (moveEvent: PointerEvent) => {
      setTimelineHeight(Math.min(timelineMaxHeight, Math.max(timelineMinHeight, startHeight + startY - moveEvent.clientY)));
    };
    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <section
      className={`stage-timeline ${isCollapsed ? "collapsed" : ""}`}
      aria-label={t("timeline.aria")}
      ref={sectionRef}
      style={isCollapsed ? undefined : { height: timelineHeight }}
    >
      {isCollapsed ? null : (
        <div
          className="timeline-resize-handle"
          role="separator"
          aria-label={t("timeline.resize")}
          tabIndex={0}
          onPointerDown={beginTimelineResize}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setTimelineHeight((height) => Math.min(timelineMaxHeight, height + 20));
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setTimelineHeight((height) => Math.max(timelineMinHeight, height - 20));
            }
          }}
        />
      )}
      <div className="stage-timeline-header">
        <strong>{t("timeline.title")}</strong>
        <div className="timeline-header-actions">
          <span>{(duration / 1000).toFixed(1)}s</span>
          <button
            type="button"
            className="secondary-button icon-text timeline-reset-button"
            onClick={onResetPlayback}
          >
            <RotateCcw size={14} />
            {t("timeline.reset")}
          </button>
          <button
            type="button"
            className={`secondary-button icon-text timeline-playback-button ${isPlaybackPlaying ? "playing" : ""}`}
            aria-pressed={isPlaybackPlaying}
            onClick={onTogglePlayback}
          >
            {isPlaybackPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaybackPlaying ? t("timeline.pause") : t("timeline.play")}
          </button>
          <button
            type="button"
            className="ghost-button timeline-collapse-button"
            aria-expanded={!isCollapsed}
            onClick={() => setIsCollapsed((current) => !current)}
          >
            {isCollapsed ? t("timeline.expand") : t("timeline.collapse")}
          </button>
        </div>
      </div>
      {isCollapsed ? null : (
        <>
          <div className="timeline-ruler" aria-hidden="true">
            <span className="timeline-playhead-label" style={{ left: `${playbackPercent}%` }}>
              {(playbackTimeMs / 1000).toFixed(1)}s
            </span>
            {[0, 0.25, 0.5, 0.75, 1].map((point) => (
              <span key={point} style={{ left: `${point * 100}%` }}>
                {(point * duration / 1000).toFixed(point === 0 ? 0 : 1)}s
              </span>
            ))}
          </div>
          <div className="timeline-track-list">
            {motionLayers.length === 0 ? (
              <p className="empty-note">{t("timeline.empty")}</p>
            ) : (
              motionLayers.map((layer) => {
                const animations = layer.animations?.length ? layer.animations : layer.animation ? [layer.animation] : [];
                return (
                  <div
                    role="button"
                    tabIndex={0}
                    className={`timeline-row ${selectedIds.includes(layer.id) ? "selected" : ""}`}
                    key={layer.id}
                    onClick={(event) => {
                      if (isPlaybackPlaying) return;
                      onSelectLayer(layer.id, event.ctrlKey || event.metaKey || event.shiftKey);
                    }}
                    onKeyDown={(event) => {
                      if (isPlaybackPlaying) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectLayer(layer.id, event.ctrlKey || event.metaKey || event.shiftKey);
                      }
                    }}
                  >
                    <span className="timeline-layer-name">{layer.name}</span>
                    <span className="timeline-track">
                      <span className="timeline-track-playhead" style={{ left: `${playbackPercent}%` }} aria-hidden="true" />
                      {animations.map((animation, index) => {
                        const left = Math.max(0, (animation.startMs / duration) * 100);
                        const width = Math.min(100 - left, Math.max(3, (Math.max(100, animation.durationMs) / duration) * 100));
                        return (
                          <span key={`${layer.id}-${index}-${animation.type}-${animation.startMs}`} className="timeline-segment-stack">
                            {getLoopEchoSegments(animation, duration).map((echo, echoIndex) => (
                              <span
                                key={`${layer.id}-${index}-echo-${echoIndex}`}
                                className="timeline-loop-echo"
                                style={{ left: `${echo.left}%`, width: `${echo.width}%` }}
                                aria-hidden="true"
                              />
                            ))}
                            <TimelineSegment
                              animation={animation}
                              duration={duration}
                              left={left}
                              width={width}
                              layerId={layer.id}
                              animationIndex={index}
                              onUpdateTiming={updateAnimationTiming}
                              disabled={isPlaybackPlaying}
                            />
                          </span>
                        );
                      })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </section>
  );
}

function TimelineSegment({
  animation,
  duration,
  left,
  width,
  layerId,
  animationIndex,
  onUpdateTiming,
  disabled,
}: {
  animation: LayerAnimation;
  duration: number;
  left: number;
  width: number;
  layerId: string;
  animationIndex: number;
  onUpdateTiming: (layerId: string, animationIndex: number, next: Partial<Pick<LayerAnimation, "startMs" | "durationMs">>) => void;
  disabled: boolean;
}) {
  const [dragged, setDragged] = useState(false);

  const beginDrag = (event: React.PointerEvent<HTMLElement>, mode: "start" | "end" | "move") => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const track = event.currentTarget.closest(".timeline-track") as HTMLElement | null;
    if (!track) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const trackWidth = Math.max(1, track.getBoundingClientRect().width);
    const initialX = event.clientX;
    const initialStartMs = animation.startMs;
    const initialDurationMs = Math.max(100, animation.durationMs);
    setDragged(false);

    const updateFromPointer = (clientX: number) => {
      const deltaMs = ((clientX - initialX) / trackWidth) * duration;
      if (Math.abs(deltaMs) > 8) setDragged(true);
      if (mode === "start") {
        const initialEndMs = initialStartMs + initialDurationMs;
        const nextStartMs = Math.min(initialEndMs - 100, Math.max(0, initialStartMs + deltaMs));
        onUpdateTiming(layerId, animationIndex, { startMs: nextStartMs, durationMs: initialEndMs - nextStartMs });
        return;
      }
      if (mode === "end") {
        const nextEndMs = Math.min(duration, Math.max(initialStartMs + 100, initialStartMs + initialDurationMs + deltaMs));
        onUpdateTiming(layerId, animationIndex, { durationMs: nextEndMs - initialStartMs });
        return;
      }
      const nextStartMs = Math.min(duration - initialDurationMs, Math.max(0, initialStartMs + deltaMs));
      onUpdateTiming(layerId, animationIndex, { startMs: nextStartMs, durationMs: initialDurationMs });
    };

    const handlePointerMove = (moveEvent: PointerEvent) => updateFromPointer(moveEvent.clientX);
    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.setTimeout(() => setDragged(false), 0);
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <span
      className={`timeline-segment ${dragged ? "dragging" : ""} ${disabled ? "disabled" : ""}`}
      style={{ left: `${left}%`, width: `${width}%` }}
      onPointerDown={(event) => beginDrag(event, "move")}
      onClick={(event) => event.stopPropagation()}
    >
      <span className="timeline-handle start" aria-hidden="true" onPointerDown={(event) => beginDrag(event, "start")} />
      <span className="timeline-segment-label">{animationLabel(animation.type, animation.textAnimation, animation.effectAnimation)}</span>
      <span className="timeline-handle end" aria-hidden="true" onPointerDown={(event) => beginDrag(event, "end")} />
    </span>
  );
}

function animationLabel(type: string, textAnimation?: string, effectAnimation?: string): string {
  if (textAnimation && textAnimation !== "none") return textAnimation;
  if (effectAnimation && effectAnimation !== "none") return effectAnimation;
  return type;
}

function getLoopEchoSegments(animation: LayerAnimation, duration: number): Array<{ left: number; width: number }> {
  if (!animation.loop) return [];
  const segmentDuration = Math.max(100, animation.durationMs);
  const echoes: Array<{ left: number; width: number }> = [];
  for (let startMs = animation.startMs + segmentDuration; startMs < duration; startMs += segmentDuration) {
    const left = Math.max(0, (startMs / duration) * 100);
    const width = Math.min(100 - left, Math.max(1.5, (segmentDuration / duration) * 100));
    if (width > 0) echoes.push({ left, width });
  }
  return echoes;
}

function createSelectionBox(
  start: { x: number; y: number },
  current: { x: number; y: number },
): React.CSSProperties {
  return {
    left: `${Math.min(start.x, current.x)}px`,
    top: `${Math.min(start.y, current.y)}px`,
    width: `${Math.abs(current.x - start.x)}px`,
    height: `${Math.abs(current.y - start.y)}px`,
  };
}

function safelySetPointerCapture(element: HTMLElement, pointerId: number): void {
  try {
    element.setPointerCapture(pointerId);
  } catch {
    // Some browsers can reject capture when the pointer already ended.
  }
}
