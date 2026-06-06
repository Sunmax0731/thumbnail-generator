import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CanvasStage } from "./components/CanvasStage";
import { InspectorPanel } from "./components/InspectorPanel";
import { LeftPanel } from "./components/LeftPanel";
import { StatusBar } from "./components/StatusBar";
import { TopToolbar } from "./components/TopToolbar";
import {
  getLayerInteractionAt,
  moveLayer as moveCanvasLayer,
  pointToCanvas,
  resizeLayer,
  rotateLayer,
  type CanvasInteractionMode,
  type CanvasPoint,
} from "./lib/canvasInteraction";
import { cloneLayer, makeImageLayer, makeShapeLayer, makeTextLayer } from "./lib/layerFactory";
import { parseCsvLayout } from "./lib/csv";
import { downloadThumbnail } from "./lib/exportThumbnail";
import { parseHtmlLayout } from "./lib/htmlLayout";
import { pickLayerAt } from "./lib/hitTest";
import { layersToCsv, layersToHtml } from "./lib/layoutExport";
import { applyPreset, defaultOutputSettings } from "./lib/presets";
import { renderThumbnailToCanvas } from "./lib/renderCanvas";
import { createInitialLayers, initialAssets, sampleCsv, sampleHtml } from "./lib/sampleData";
import {
  createTemplateSnapshot,
  readSavedTemplates,
  type SavedTemplate,
  upsertTemplate,
  writeSavedTemplates,
} from "./lib/templates";
import type { ExportFormat, ImageAsset, OutputSettings, ThumbnailLayer } from "./lib/types";

interface ActiveCanvasInteraction {
  mode: CanvasInteractionMode;
  layer: ThumbnailLayer;
  start: CanvasPoint;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeCanvasInteraction = useRef<ActiveCanvasInteraction | null>(null);
  const [settings, setSettings] = useState<OutputSettings>(defaultOutputSettings);
  const [assets, setAssets] = useState<ImageAsset[]>(() => initialAssets(import.meta.env.BASE_URL));
  const [layers, setLayers] = useState<ThumbnailLayer[]>(() => createInitialLayers());
  const [selectedId, setSelectedId] = useState<string>("");
  const [csvText, setCsvText] = useState(sampleCsv);
  const [htmlText, setHtmlText] = useState(sampleHtml);
  const [templateName, setTemplateName] = useState("My thumbnail template");
  const [templates, setTemplates] = useState<SavedTemplate[]>(() =>
    typeof window === "undefined" ? [] : readSavedTemplates(),
  );
  const [status, setStatus] = useState("Ready. Edit the sample, import CSV/HTML, or add local images.");
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(0.94);
  const [canvasCursor, setCanvasCursor] = useState("default");

  const selectedLayer = useMemo(
    () => layers.find((layer) => layer.id === selectedId) ?? layers.at(-1),
    [layers, selectedId],
  );

  useEffect(() => {
    if ((!selectedId || !layers.some((layer) => layer.id === selectedId)) && layers.length > 0) {
      setSelectedId(layers.at(-1)?.id ?? "");
    }
  }, [layers, selectedId]);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderThumbnailToCanvas(canvas, layers, assets, settings, {
      selectedLayerId: selectedLayer?.id,
      drawSelection: true,
    })
      .then(() => {
        if (!cancelled) {
          setStatus((current) => (current.startsWith("Render error") ? "Canvas rendered." : current));
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setStatus(`Render error: ${error instanceof Error ? error.message : String(error)}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [assets, layers, selectedLayer?.id, settings]);

  const updateSettings = useCallback((next: Partial<OutputSettings>) => {
    setSettings((current) => ({ ...current, ...next }));
  }, []);

  const updateLayer = useCallback((id: string, updater: (layer: ThumbnailLayer) => ThumbnailLayer) => {
    setLayers((current) => current.map((layer) => (layer.id === id ? updater(layer) : layer)));
  }, []);

  const applyCsv = useCallback(() => {
    const result = parseCsvLayout(csvText, {
      baseWidth: settings.width,
      baseHeight: settings.height,
      existingImageKeys: assets.map((asset) => asset.key),
    });
    if (result.layers.length > 0) {
      setLayers(result.layers);
      setSelectedId(result.layers.at(-1)?.id ?? "");
      setStatus(`CSV applied: ${result.layers.length} layers. ${result.warnings.join(" ")}`.trim());
    } else {
      setStatus(`CSV not applied. ${result.warnings.join(" ")}`);
    }
  }, [assets, csvText, settings.height, settings.width]);

  const applyHtml = useCallback(() => {
    const result = parseHtmlLayout(htmlText, {
      baseWidth: settings.width,
      baseHeight: settings.height,
      existingImageKeys: assets.map((asset) => asset.key),
    });
    if (result.layers.length > 0) {
      setLayers(result.layers);
      setSelectedId(result.layers.at(-1)?.id ?? "");
      setStatus(`HTML applied: ${result.layers.length} layers. ${result.warnings.join(" ")}`.trim());
    } else {
      setStatus(`HTML not applied. ${result.warnings.join(" ")}`);
    }
  }, [assets, htmlText, settings.height, settings.width]);

  const handleImageFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const loaded = await Promise.all(Array.from(files).map(readImageFile));
      setAssets((current) => [...current, ...loaded]);
      const newLayers = loaded.map((asset, index) =>
        makeImageLayer({
          name: asset.name,
          imageKey: asset.key,
          x: settings.width * 0.54 + index * 24,
          y: settings.height * 0.12 + index * 24,
          width: settings.width * 0.34,
          height: settings.height * 0.52,
          rotation: index % 2 === 0 ? 4 : -4,
          effects: { grayscale: 0, blur: 0, brightness: 100, contrast: 108, mosaic: 0 },
        }),
      );
      setLayers((current) => [...current, ...newLayers]);
      setSelectedId(newLayers.at(-1)?.id ?? selectedId);
      setStatus(`Imported ${loaded.length} image file${loaded.length === 1 ? "" : "s"}.`);
    },
    [selectedId, settings.height, settings.width],
  );

  const addTextLayer = useCallback(() => {
    const layer = makeTextLayer({
      name: "New text",
      x: settings.width * 0.08,
      y: settings.height * 0.18,
      width: settings.width * 0.62,
      height: settings.height * 0.18,
      text: "NEW TEXT",
      fontSize: Math.round(settings.width / 15),
    });
    setLayers((current) => [...current, layer]);
    setSelectedId(layer.id);
    setStatus("Text layer added.");
  }, [settings.height, settings.width]);

  const addShapeLayer = useCallback(() => {
    const layer = makeShapeLayer({
      name: "New shape",
      x: settings.width * 0.12,
      y: settings.height * 0.72,
      width: settings.width * 0.36,
      height: settings.height * 0.12,
      fill: "#10b6d7",
    });
    setLayers((current) => [...current, layer]);
    setSelectedId(layer.id);
    setStatus("Shape layer added.");
  }, [settings.height, settings.width]);

  const resetTemplate = useCallback(() => {
    const next = createInitialLayers();
    setLayers(next);
    setSelectedId(next.at(-1)?.id ?? "");
    setCsvText(sampleCsv);
    setHtmlText(sampleHtml);
    setStatus("Sample creator template restored.");
  }, []);

  const duplicateLayer = useCallback(
    (id: string) => {
      const source = layers.find((layer) => layer.id === id);
      if (!source) return;
      const copy = cloneLayer({ ...source, x: source.x + 24, y: source.y + 24 });
      setLayers((current) => [...current, copy]);
      setSelectedId(copy.id);
      setStatus(`Duplicated ${source.name}.`);
    },
    [layers],
  );

  const deleteLayer = useCallback((id: string) => {
    setLayers((current) => {
      if (current.length <= 1) {
        setStatus("At least one layer is required.");
        return current;
      }
      const next = current.filter((layer) => layer.id !== id);
      setSelectedId(next.at(-1)?.id ?? "");
      setStatus("Layer removed.");
      return next;
    });
  }, []);

  const moveLayer = useCallback((id: string, direction: -1 | 1) => {
    setLayers((current) => {
      const index = current.findIndex((layer) => layer.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [layer] = next.splice(index, 1);
      next.splice(nextIndex, 0, layer);
      setStatus(direction > 0 ? "Layer moved up." : "Layer moved down.");
      return next;
    });
  }, []);

  const reorderLayer = useCallback((draggedId: string, targetId: string) => {
    setLayers((current) => {
      if (draggedId === targetId) return current;
      const displayOrder = [...current].reverse();
      const draggedIndex = displayOrder.findIndex((layer) => layer.id === draggedId);
      const targetIndex = displayOrder.findIndex((layer) => layer.id === targetId);
      if (draggedIndex < 0 || targetIndex < 0) return current;
      const [dragged] = displayOrder.splice(draggedIndex, 1);
      displayOrder.splice(targetIndex, 0, dragged);
      setSelectedId(draggedId);
      setStatus("Layer order updated by drag and drop.");
      return displayOrder.reverse();
    });
  }, []);

  const handlePresetChange = useCallback((presetId: string) => {
    setSettings((current) => applyPreset(current, presetId));
  }, []);

  const handleCanvasPointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = event.currentTarget;
      const point = pointToCanvas(canvas, event.clientX, event.clientY);
      const selectedMode = selectedLayer ? getLayerInteractionAt(selectedLayer, point) : null;

      if (selectedLayer && selectedMode) {
        event.preventDefault();
        canvas.setPointerCapture(event.pointerId);
        activeCanvasInteraction.current = { mode: selectedMode, layer: selectedLayer, start: point };
        setCanvasCursor(cursorForMode(selectedMode));
        setStatus(`${labelForMode(selectedMode)} ${selectedLayer.name}.`);
        return;
      }

      const picked = pickLayerAt(layers, point.x, point.y);
      if (picked) {
        event.preventDefault();
        canvas.setPointerCapture(event.pointerId);
        setSelectedId(picked.id);
        activeCanvasInteraction.current = { mode: "move", layer: picked, start: point };
        setCanvasCursor("grabbing");
        setStatus(`Selected ${picked.name}. Dragging to move.`);
      } else {
        setCanvasCursor("default");
      }
    },
    [layers, selectedLayer],
  );

  const handleCanvasPointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = event.currentTarget;
      const point = pointToCanvas(canvas, event.clientX, event.clientY);
      const active = activeCanvasInteraction.current;

      if (active) {
        event.preventDefault();
        const nextLayer = transformLayerFromPointer(active, point);
        setLayers((current) => current.map((layer) => (layer.id === active.layer.id ? nextLayer : layer)));
        return;
      }

      const selectedMode = selectedLayer ? getLayerInteractionAt(selectedLayer, point) : null;
      if (selectedMode) {
        setCanvasCursor(cursorForMode(selectedMode));
        return;
      }

      const picked = pickLayerAt(layers, point.x, point.y);
      setCanvasCursor(picked ? "pointer" : "default");
    },
    [layers, selectedLayer],
  );

  const handleCanvasPointerUp = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const active = activeCanvasInteraction.current;
    if (!active) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activeCanvasInteraction.current = null;
    setCanvasCursor("default");
    setStatus(`${labelForMode(active.mode)} complete.`);
  }, []);

  const syncLayoutTextFromLayers = useCallback(() => {
    setCsvText(layersToCsv(layers));
    setHtmlText(layersToHtml(layers));
    setStatus("Generated CSV and HTML layout text from the current canvas.");
  }, [layers]);

  const saveCurrentTemplate = useCallback(() => {
    const snapshot = createTemplateSnapshot(templateName, layers, assets, settings);
    const next = upsertTemplate(templates, snapshot);
    try {
      writeSavedTemplates(next);
      setTemplates(next);
      setTemplateName(snapshot.name);
      setCsvText(snapshot.csv);
      setHtmlText(snapshot.html);
      setStatus(`Saved template "${snapshot.name}" in browser storage.`);
    } catch (error) {
      setStatus(`Template save failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [assets, layers, settings, templateName, templates]);

  const loadTemplate = useCallback(
    (templateId: string) => {
      const template = templates.find((candidate) => candidate.id === templateId);
      if (!template) return;
      setSettings(template.settings);
      setAssets(template.assets.length > 0 ? template.assets : initialAssets(import.meta.env.BASE_URL));
      setLayers(template.layers);
      setSelectedId(template.layers.at(-1)?.id ?? "");
      setCsvText(template.csv || layersToCsv(template.layers));
      setHtmlText(template.html || layersToHtml(template.layers));
      setTemplateName(template.name);
      setStatus(`Loaded template "${template.name}".`);
    },
    [templates],
  );

  const deleteTemplate = useCallback(
    (templateId: string) => {
      const template = templates.find((candidate) => candidate.id === templateId);
      const next = templates.filter((candidate) => candidate.id !== templateId);
      try {
        writeSavedTemplates(next);
        setTemplates(next);
        setStatus(template ? `Deleted template "${template.name}".` : "Template deleted.");
      } catch (error) {
        setStatus(`Template delete failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    [templates],
  );

  const handleExport = useCallback(
    async (format?: ExportFormat) => {
      const exportSettings = format ? { ...settings, format } : settings;
      setSettings(exportSettings);
      setIsExporting(true);
      setStatus("Exporting thumbnail...");
      try {
        const filename = await downloadThumbnail(layers, assets, exportSettings);
        setStatus(`Export ready: ${filename}`);
      } catch (error) {
        setStatus(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsExporting(false);
      }
    },
    [assets, layers, settings],
  );

  return (
    <div className="app-shell">
      <TopToolbar
        settings={settings}
        onSettingsChange={updateSettings}
        onPresetChange={handlePresetChange}
        onExport={handleExport}
        isExporting={isExporting}
      />
      <main className="workspace" aria-label="Thumbnail editor workspace">
        <LeftPanel
          csvText={csvText}
          htmlText={htmlText}
          onCsvTextChange={setCsvText}
          onHtmlTextChange={setHtmlText}
          onApplyCsv={applyCsv}
          onApplyHtml={applyHtml}
          onImageFiles={handleImageFiles}
          onAddText={addTextLayer}
          onAddShape={addShapeLayer}
          onResetTemplate={resetTemplate}
          templateName={templateName}
          templates={templates}
          onTemplateNameChange={setTemplateName}
          onSyncLayoutText={syncLayoutTextFromLayers}
          onSaveTemplate={saveCurrentTemplate}
          onLoadTemplate={loadTemplate}
          onDeleteTemplate={deleteTemplate}
          assets={assets}
        />
        <CanvasStage
          canvasRef={canvasRef}
          settings={settings}
          layerCount={layers.length}
          selectedLayerName={selectedLayer?.name ?? "None"}
          zoom={zoom}
          cursor={canvasCursor}
          onZoomChange={setZoom}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
        />
        <InspectorPanel
          assets={assets}
          layers={layers}
          selectedId={selectedLayer?.id ?? ""}
          onSelect={setSelectedId}
          onUpdateLayer={updateLayer}
          onDelete={deleteLayer}
          onDuplicate={duplicateLayer}
          onMove={moveLayer}
          onReorderLayer={reorderLayer}
        />
      </main>
      <StatusBar status={status} settings={settings} zoom={zoom} layerCount={layers.length} />
    </div>
  );
}

function transformLayerFromPointer(active: ActiveCanvasInteraction, point: CanvasPoint): ThumbnailLayer {
  if (active.mode === "move") return moveCanvasLayer(active.layer, active.start, point);
  if (active.mode === "rotate") return rotateLayer(active.layer, active.start, point);
  return resizeLayer(active.layer, active.mode, point);
}

function cursorForMode(mode: CanvasInteractionMode): string {
  if (mode === "move") return "grab";
  if (mode === "rotate") return "crosshair";
  if (mode === "resize-nw" || mode === "resize-se") return "nwse-resize";
  return "nesw-resize";
}

function labelForMode(mode: CanvasInteractionMode): string {
  if (mode === "move") return "Move";
  if (mode === "rotate") return "Rotate";
  return "Resize";
}

function readImageFile(file: File): Promise<ImageAsset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const key = `${slug(baseName)}-${Date.now().toString(36)}`;
      resolve({
        key,
        name: baseName,
        src: String(reader.result),
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);
}

export default App;
