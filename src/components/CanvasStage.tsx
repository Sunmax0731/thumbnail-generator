import { useCallback, useEffect, useRef } from "react";
import { Maximize2, MousePointer2, ZoomIn, ZoomOut } from "lucide-react";
import { calculateCanvasFitZoom } from "../lib/canvasFit";
import type { OutputSettings } from "../lib/types";

interface CanvasStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  settings: OutputSettings;
  layerCount: number;
  selectedLayerName: string;
  zoom: number;
  cursor: string;
  previewPadding: number;
  onZoomChange: (zoom: number) => void;
  onPointerDown: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLCanvasElement>) => void;
}

export function CanvasStage({
  canvasRef,
  settings,
  layerCount,
  selectedLayerName,
  zoom,
  cursor,
  previewPadding,
  onZoomChange,
  onPointerDown,
  onPointerMove,
  onPointerUp,
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
    <section className="stage-panel" aria-label="Canvas preview">
      <div className="stage-toolbar">
        <div className="stage-title">
          <MousePointer2 size={16} />
          <span>{selectedLayerName}</span>
        </div>
        <div className="stage-meta">
          <span>{layerCount} layers</span>
          <span>
            {settings.width} x {settings.height}
          </span>
        </div>
        <div className="zoom-controls" aria-label="Canvas zoom">
          <button
            type="button"
            className="icon-button"
            title="Zoom out"
            onClick={() => onZoomChange(Math.max(0.25, zoom - 0.08))}
          >
            <ZoomOut size={16} />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="icon-button"
            title="Zoom in"
            onClick={() => onZoomChange(Math.min(1, zoom + 0.08))}
          >
            <ZoomIn size={16} />
          </button>
          <button type="button" className="icon-button" title="Fit canvas" onClick={fitCanvas}>
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
            aria-label="Thumbnail preview canvas"
            style={{ cursor }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
        </div>
      </div>
    </section>
  );
}

function cssPixels(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
