import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileDown,
  Hand,
  ImageDown,
  Maximize2,
  Monitor,
  MonitorPlay,
  MousePointer2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { calculateCanvasFitZoom } from "../lib/canvasFit";
import type { Translator } from "../lib/i18n";
import { outputPresets } from "../lib/presets";
import type { ExportFormat, LayerAnimation, OutputSettings, ThumbnailLayer } from "../lib/types";

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
  onZoomChange: (zoom: number) => void;
  onPointerDown: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLCanvasElement>) => void;
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
  onZoomChange,
  onPointerDown,
  onPointerMove,
  onPointerUp,
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
  const panDrag = useRef<{ target: HTMLElement; clientX: number; clientY: number; scrollLeft: number; scrollTop: number } | null>(null);
  const [isPanMode, setIsPanMode] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePanning, setIsSpacePanning] = useState(false);
  const [isOutputMenuOpen, setIsOutputMenuOpen] = useState(false);
  const lastAutoFitRevision = useRef(0);
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
    if (autoFitRevision <= 0 || lastAutoFitRevision.current === autoFitRevision) return;
    lastAutoFitRevision.current = autoFitRevision;
    const frame = window.requestAnimationFrame(() => fitCanvas());
    return () => window.cancelAnimationFrame(frame);
  }, [autoFitRevision, fitCanvas]);

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
        <div className="stage-size-controls" aria-label={t("toolbar.outputSettings")}>
          <label className="field compact-field">
            <span>
              <Monitor size={14} /> {t("toolbar.preset")}
            </span>
            <select value={settings.presetId} onChange={(event) => onPresetChange(event.target.value)}>
              {outputPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
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
            onClick={() => setIsPanMode((current) => !current)}
          >
            <Hand size={16} />
          </button>
          <button
            type="button"
            className="icon-button"
            title={t("stage.zoomOut")}
            onClick={() => onZoomChange(Math.max(0.1, zoom - 0.08))}
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
          if (event.target !== event.currentTarget) return;
          if (shouldPan(event)) {
            beginPan(event);
            return;
          }
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
      {showMotionTimeline ? (
        <MotionTimeline layers={layers} selectedIds={selectedIds} onSelectLayer={onSelectLayer} onUpdateLayer={onUpdateLayer} t={t} />
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

function MotionTimeline({
  layers,
  selectedIds,
  onSelectLayer,
  onUpdateLayer,
  t,
}: {
  layers: ThumbnailLayer[];
  selectedIds: string[];
  onSelectLayer: (id: string, additive?: boolean) => void;
  onUpdateLayer: (id: string, updater: (layer: ThumbnailLayer) => ThumbnailLayer) => void;
  t: Translator;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [timelineHeight, setTimelineHeight] = useState(170);
  const motionLayers = layers.filter((layer) => {
    const animations = layer.animations?.length ? layer.animations : layer.animation ? [layer.animation] : [];
    return animations.length > 0;
  });
  const duration = Math.max(
    10000,
    ...motionLayers.flatMap((layer) => (layer.animations?.length ? layer.animations : layer.animation ? [layer.animation] : []).map((animation) => animation.startMs + animation.durationMs)),
  );

  const updateAnimationTiming = (layerId: string, animationIndex: number, next: Partial<Pick<LayerAnimation, "startMs" | "durationMs">>) => {
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
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = sectionRef.current?.getBoundingClientRect().height ?? timelineHeight;
    const handlePointerMove = (moveEvent: PointerEvent) => {
      setTimelineHeight(Math.min(320, Math.max(120, startHeight + moveEvent.clientY - startY)));
    };
    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <section className="stage-timeline" aria-label={t("timeline.aria")} ref={sectionRef} style={{ height: timelineHeight }}>
      <div className="stage-timeline-header">
        <strong>{t("timeline.title")}</strong>
        <span>{(duration / 1000).toFixed(1)}s</span>
      </div>
      <div className="timeline-ruler" aria-hidden="true">
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
                onClick={(event) => onSelectLayer(layer.id, event.ctrlKey || event.metaKey || event.shiftKey)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectLayer(layer.id, event.ctrlKey || event.metaKey || event.shiftKey);
                  }
                }}
              >
                <span className="timeline-layer-name">{layer.name}</span>
                <span className="timeline-track">
                  {animations.map((animation, index) => {
                    const left = Math.max(0, (animation.startMs / duration) * 100);
                    const width = Math.min(100 - left, Math.max(3, (Math.max(100, animation.durationMs) / duration) * 100));
                    return (
                      <TimelineSegment
                        key={`${layer.id}-${index}-${animation.type}-${animation.startMs}`}
                        animation={animation}
                        duration={duration}
                        left={left}
                        width={width}
                        layerId={layer.id}
                        animationIndex={index}
                        onUpdateTiming={updateAnimationTiming}
                      />
                    );
                  })}
                </span>
              </div>
            );
          })
        )}
      </div>
      <div
        className="timeline-resize-handle"
        role="separator"
        aria-label={t("timeline.resize")}
        tabIndex={0}
        onPointerDown={beginTimelineResize}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setTimelineHeight((height) => Math.min(320, height + 20));
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setTimelineHeight((height) => Math.max(120, height - 20));
          }
        }}
      />
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
}: {
  animation: LayerAnimation;
  duration: number;
  left: number;
  width: number;
  layerId: string;
  animationIndex: number;
  onUpdateTiming: (layerId: string, animationIndex: number, next: Partial<Pick<LayerAnimation, "startMs" | "durationMs">>) => void;
}) {
  const [dragged, setDragged] = useState(false);

  const beginDrag = (event: React.PointerEvent<HTMLElement>, mode: "start" | "end" | "move") => {
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
      className={`timeline-segment ${dragged ? "dragging" : ""}`}
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
