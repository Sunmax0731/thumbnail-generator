import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { MousePointer2, Scissors, Sparkles, X } from "lucide-react";
import {
  processImageAsset,
  type CropMode,
  type ImagePoint,
  type RectSelection,
} from "../lib/imageProcessing";
import type { Translator } from "../lib/i18n";
import type { ImageAsset } from "../lib/types";

type LabMode = Exclude<CropMode, "none">;
type RectDragMode = "new" | "move" | "nw" | "ne" | "sw" | "se";

interface ImageLabPanelProps {
  assets: ImageAsset[];
  initialAssetKey?: string;
  onCreateProcessedAsset: (asset: ImageAsset) => void;
  onClose: () => void;
  t: Translator;
}

interface PreviewRect {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

const previewWidth = 900;
const previewHeight = 560;

export function ImageLabPanel({ assets, initialAssetKey, onCreateProcessedAsset, onClose, t }: ImageLabPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewRect = useRef<PreviewRect>({ x: 0, y: 0, width: 0, height: 0, scale: 1 });
  const dragStart = useRef<ImagePoint | null>(null);
  const dragStartRect = useRef<RectSelection | null>(null);
  const rectDragMode = useRef<RectDragMode>("new");
  const polygonDragIndex = useRef<number | null>(null);
  const [assetKey, setAssetKey] = useState(assets[0]?.key ?? "");
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [mode, setMode] = useState<LabMode>("rect");
  const [cropRect, setCropRect] = useState<RectSelection>({ x: 0, y: 0, width: 320, height: 180 });
  const [polygonPoints, setPolygonPoints] = useState<ImagePoint[]>([]);
  const [chromaEnabled, setChromaEnabled] = useState(false);
  const [chromaColor, setChromaColor] = useState("#00ff00");
  const [chromaTolerance, setChromaTolerance] = useState(48);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedAsset = useMemo(() => assets.find((asset) => asset.key === assetKey) ?? assets[0], [assetKey, assets]);

  useEffect(() => {
    if (initialAssetKey && assets.some((asset) => asset.key === initialAssetKey)) {
      setAssetKey(initialAssetKey);
    }
  }, [assets, initialAssetKey]);

  useEffect(() => {
    if (!selectedAsset) return;
    setAssetKey((current) => (assets.some((asset) => asset.key === current) ? current : selectedAsset.key));
  }, [assets, selectedAsset]);

  useEffect(() => {
    if (!selectedAsset) return;
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (cancelled) return;
      const nextSize = { width: image.naturalWidth || image.width, height: image.naturalHeight || image.height };
      setImageSize(nextSize);
      setCropRect((current) => fitRect(current, nextSize.width, nextSize.height));
      drawPreview(image, cropRect, polygonPoints, mode, previewRect, canvasRef.current);
    };
    image.src = selectedAsset.src;
    return () => {
      cancelled = true;
    };
  }, [selectedAsset]);

  useEffect(() => {
    if (!selectedAsset) return;
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (!cancelled) drawPreview(image, cropRect, polygonPoints, mode, previewRect, canvasRef.current);
    };
    image.src = selectedAsset.src;
    return () => {
      cancelled = true;
    };
  }, [cropRect, mode, polygonPoints, selectedAsset]);

  const pointerToImage = useCallback((event: React.PointerEvent<HTMLCanvasElement>): ImagePoint => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const canvasX = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const canvasY = ((event.clientY - rect.top) / rect.height) * canvas.height;
    const preview = previewRect.current;
    return {
      x: clamp((canvasX - preview.x) / preview.scale, 0, imageSize.width),
      y: clamp((canvasY - preview.y) / preview.scale, 0, imageSize.height),
    };
  }, [imageSize.height, imageSize.width]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const point = pointerToImage(event);
      if (mode === "polygon") {
        const hitIndex = hitPolygonPoint(point, polygonPoints, previewRect.current.scale);
        if (hitIndex >= 0) {
          if (event.altKey) {
            setPolygonPoints((current) => current.filter((_, index) => index !== hitIndex));
            return;
          }
          safelySetPointerCapture(event.currentTarget, event.pointerId);
          polygonDragIndex.current = hitIndex;
          return;
        }
        setPolygonPoints((current) => [...current, point]);
        return;
      }
      safelySetPointerCapture(event.currentTarget, event.pointerId);
      dragStart.current = point;
      dragStartRect.current = fitRect(cropRect, imageSize.width, imageSize.height);
      rectDragMode.current = hitRectDragMode(point, dragStartRect.current, previewRect.current.scale);
      if (rectDragMode.current === "new") setCropRect({ x: point.x, y: point.y, width: 1, height: 1 });
    },
    [cropRect, imageSize.height, imageSize.width, mode, pointerToImage, polygonPoints],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const point = pointerToImage(event);
      if (mode === "polygon" && polygonDragIndex.current !== null) {
        const index = polygonDragIndex.current;
        setPolygonPoints((current) => current.map((candidate, pointIndex) => (pointIndex === index ? point : candidate)));
        return;
      }
      if (mode === "polygon" || !dragStart.current) return;
      const startRect = dragStartRect.current;
      if (!startRect || rectDragMode.current === "new") {
        setCropRect({
          x: dragStart.current.x,
          y: dragStart.current.y,
          width: point.x - dragStart.current.x,
          height: point.y - dragStart.current.y,
        });
        return;
      }
      setCropRect(updateRectFromDrag(startRect, dragStart.current, point, rectDragMode.current));
    },
    [mode, pointerToImage],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const hadDragSelection = Boolean(dragStart.current) && mode !== "polygon";
      dragStart.current = null;
      dragStartRect.current = null;
      polygonDragIndex.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      if (hadDragSelection) {
        setCropRect((rect) => fitRect(rect, imageSize.width, imageSize.height));
      }
    },
    [imageSize.height, imageSize.width, mode],
  );

  const applyProcessing = useCallback(async () => {
    if (!selectedAsset) return;
    setIsProcessing(true);
    try {
      const processed = await processImageAsset(selectedAsset, {
        chromaKeyEnabled: chromaEnabled,
        chromaKeyColor: chromaColor,
        chromaKeyTolerance: chromaTolerance,
        cropMode: mode,
        cropRect: fitRect(cropRect, imageSize.width, imageSize.height),
        polygonPoints,
      });
      onCreateProcessedAsset(processed);
    } finally {
      setIsProcessing(false);
    }
  }, [
    chromaColor,
    chromaEnabled,
    chromaTolerance,
    cropRect,
    imageSize.height,
    imageSize.width,
    mode,
    onCreateProcessedAsset,
    polygonPoints,
    selectedAsset,
  ]);

  return (
    <>
      <div className="modal-header image-lab-header">
        <div className="modal-title-block">
          <h2 id="image-lab-title">{t("imageLab.title")}</h2>
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="primary-button icon-text"
            onClick={applyProcessing}
            disabled={!selectedAsset || isProcessing || (mode === "polygon" && polygonPoints.length < 3)}
          >
            <Scissors size={16} /> {isProcessing ? t("imageLab.processing") : t("imageLab.createLayer")}
          </button>
          <button type="button" className="icon-button modal-close" aria-label={t("imageLab.close")} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="image-lab" aria-label={t("imageLab.aria")}>
      <section className="panel-section image-cutout-section">
        <div className="section-heading">
          <Scissors size={16} />
          <h2>{t("imageLab.cutout")}</h2>
        </div>
        <div className="segmented-control" aria-label={t("imageLab.cutoutMode")}>
          {[
            ["rect", t("imageLab.rect")],
            ["ellipse", t("imageLab.circle")],
            ["polygon", t("imageLab.free")],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={mode === value ? "selected" : ""}
              onClick={() => setMode(value as LabMode)}
            >
              {label}
            </button>
          ))}
        </div>
        <canvas
          ref={canvasRef}
          width={previewWidth}
          height={previewHeight}
          className="image-lab-canvas"
          aria-label={t("imageLab.preview")}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        {mode === "polygon" ? (
          <div className="button-grid">
            <button type="button" className="secondary-button icon-text" onClick={() => setPolygonPoints([])}>
              <MousePointer2 size={16} /> {t("imageLab.clearPoints")}
            </button>
            <button
              type="button"
              className="secondary-button icon-text"
              onClick={() => setPolygonPoints((current) => current.slice(0, -1))}
            >
              {t("imageLab.undoPoint")}
            </button>
          </div>
        ) : null}
        <div className="image-lab-adjust-grid">
          <div className="field-grid two image-lab-position-fields">
            <LabSlider label="X" value={cropRect.x} min={0} max={imageSize.width} onChange={(x) => setCropRect((rect) => ({ ...rect, x }))} />
            <LabSlider label="Y" value={cropRect.y} min={0} max={imageSize.height} onChange={(y) => setCropRect((rect) => ({ ...rect, y }))} />
            <LabSlider
              label="W"
              value={Math.abs(cropRect.width)}
              min={1}
              max={imageSize.width}
              onChange={(width) => setCropRect((rect) => ({ ...rect, width }))}
            />
            <LabSlider
              label="H"
              value={Math.abs(cropRect.height)}
              min={1}
              max={imageSize.height}
              onChange={(height) => setCropRect((rect) => ({ ...rect, height }))}
            />
          </div>
          <section className="image-chroma-inline" aria-label={t("imageLab.chroma")}>
            <div className="section-heading compact-heading">
              <Sparkles size={16} />
              <h2>{t("imageLab.chroma")}</h2>
            </div>
            <label className="checkbox-row">
              <input type="checkbox" checked={chromaEnabled} onChange={(event) => setChromaEnabled(event.currentTarget.checked)} />
              {t("imageLab.enableTransparent")}
            </label>
            <div className="field-grid two">
              <label className="field color-field">
                <span>{t("imageLab.keyColor")}</span>
                <input type="color" value={chromaColor} onChange={(event) => setChromaColor(event.currentTarget.value)} />
                <input type="text" value={chromaColor} onChange={(event) => setChromaColor(event.currentTarget.value)} />
              </label>
              <LabSlider label={t("imageLab.tolerance")} value={chromaTolerance} min={0} max={180} onChange={setChromaTolerance} />
            </div>
          </section>
        </div>
      </section>
      </div>
    </>
  );
}

function drawPreview(
  image: HTMLImageElement,
  cropRect: RectSelection,
  polygonPoints: ImagePoint[],
  mode: LabMode,
  previewRef: MutableRefObject<PreviewRect>,
  canvas: HTMLCanvasElement | null,
) {
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#111827";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  const scale = Math.min((canvas.width - 20) / imageWidth, (canvas.height - 20) / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;
  previewRef.current = { x, y, width, height, scale };
  context.drawImage(image, x, y, width, height);
  context.strokeStyle = "#10b6d7";
  context.lineWidth = 3;
  context.setLineDash([8, 6]);

  if (mode === "polygon" && polygonPoints.length > 0) {
    context.beginPath();
    polygonPoints.forEach((point, index) => {
      const px = x + point.x * scale;
      const py = y + point.y * scale;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    });
    if (polygonPoints.length >= 3) context.closePath();
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = "#10b6d7";
    polygonPoints.forEach((point) => {
      context.beginPath();
      context.arc(x + point.x * scale, y + point.y * scale, 4, 0, Math.PI * 2);
      context.fill();
    });
    return;
  }

  const rect = normalizeRect(cropRect);
  const rx = x + rect.x * scale;
  const ry = y + rect.y * scale;
  const rw = rect.width * scale;
  const rh = rect.height * scale;
  if (mode === "ellipse") {
    context.beginPath();
    context.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, Math.PI * 2);
    context.stroke();
  } else {
    context.strokeRect(rx, ry, rw, rh);
  }
  context.setLineDash([]);
  drawRectHandles(context, [
    [rx, ry],
    [rx + rw, ry],
    [rx, ry + rh],
    [rx + rw, ry + rh],
  ]);
}

function drawRectHandles(context: CanvasRenderingContext2D, points: Array<[number, number]>): void {
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#10b6d7";
  context.lineWidth = 3;
  points.forEach(([x, y]) => {
    context.beginPath();
    context.rect(x - 5, y - 5, 10, 10);
    context.fill();
    context.stroke();
  });
}

function LabSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const rounded = Math.round(value);
  return (
    <label className="range-field compact-range">
      <span>
        {label} {rounded}
      </span>
      <input type="range" min={min} max={Math.max(min, max)} step={1} value={rounded} onChange={(event) => onChange(Number(event.currentTarget.value))} />
      <input type="number" min={min} max={max} step={1} value={rounded} onChange={(event) => onChange(Number(event.currentTarget.value) || 0)} />
    </label>
  );
}

function fitRect(rect: RectSelection, width: number, height: number): RectSelection {
  const normalized = normalizeRect(rect);
  return {
    x: clamp(normalized.x, 0, Math.max(0, width - 1)),
    y: clamp(normalized.y, 0, Math.max(0, height - 1)),
    width: clamp(normalized.width, 1, width),
    height: clamp(normalized.height, 1, height),
  };
}

function normalizeRect(rect: RectSelection): RectSelection {
  const x = Math.min(rect.x, rect.x + rect.width);
  const y = Math.min(rect.y, rect.y + rect.height);
  return { x, y, width: Math.abs(rect.width), height: Math.abs(rect.height) };
}

function hitRectDragMode(point: ImagePoint, rect: RectSelection, scale: number): RectDragMode {
  const normalized = normalizeRect(rect);
  const threshold = Math.max(8, 12 / scale);
  const handles: Array<[RectDragMode, ImagePoint]> = [
    ["nw", { x: normalized.x, y: normalized.y }],
    ["ne", { x: normalized.x + normalized.width, y: normalized.y }],
    ["sw", { x: normalized.x, y: normalized.y + normalized.height }],
    ["se", { x: normalized.x + normalized.width, y: normalized.y + normalized.height }],
  ];
  for (const [mode, handle] of handles) {
    if (Math.hypot(point.x - handle.x, point.y - handle.y) <= threshold) return mode;
  }
  if (
    point.x >= normalized.x &&
    point.x <= normalized.x + normalized.width &&
    point.y >= normalized.y &&
    point.y <= normalized.y + normalized.height
  ) {
    return "move";
  }
  return "new";
}

function updateRectFromDrag(rect: RectSelection, start: ImagePoint, point: ImagePoint, mode: RectDragMode): RectSelection {
  const right = rect.x + rect.width;
  const bottom = rect.y + rect.height;
  if (mode === "move") {
    return { ...rect, x: rect.x + point.x - start.x, y: rect.y + point.y - start.y };
  }
  if (mode === "nw") return { x: point.x, y: point.y, width: right - point.x, height: bottom - point.y };
  if (mode === "ne") return { x: rect.x, y: point.y, width: point.x - rect.x, height: bottom - point.y };
  if (mode === "sw") return { x: point.x, y: rect.y, width: right - point.x, height: point.y - rect.y };
  if (mode === "se") return { x: rect.x, y: rect.y, width: point.x - rect.x, height: point.y - rect.y };
  return { x: start.x, y: start.y, width: point.x - start.x, height: point.y - start.y };
}

function hitPolygonPoint(point: ImagePoint, points: ImagePoint[], scale: number): number {
  const threshold = Math.max(8, 12 / scale);
  return points.findIndex((candidate) => Math.hypot(point.x - candidate.x, point.y - candidate.y) <= threshold);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function safelySetPointerCapture(element: HTMLElement, pointerId: number): void {
  try {
    element.setPointerCapture(pointerId);
  } catch {
    // Synthetic pointer tests do not always create an active pointer capture target.
  }
}
