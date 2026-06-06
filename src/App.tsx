import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { CanvasStage } from "./components/CanvasStage";
import { ImageLabPanel } from "./components/ImageLabPanel";
import { InspectorPanel } from "./components/InspectorPanel";
import { LeftPanel } from "./components/LeftPanel";
import { StatusBar } from "./components/StatusBar";
import { TopToolbar } from "./components/TopToolbar";
import { alignLayers, type AlignmentMode } from "./lib/alignment";
import {
  moveLayer as moveCanvasLayer,
  pointToCanvas,
  resizeLayer,
  rotateLayer,
  type CanvasInteractionMode,
  type CanvasPoint,
} from "./lib/canvasInteraction";
import {
  addPaletteColor as appendPaletteColor,
  readColorPalette,
  removePaletteColor,
  type PaletteColor,
  type PaletteTarget,
  writeColorPalette,
} from "./lib/colorPalette";
import {
  customFontToOption,
  findMatchingCustomFont,
  loadCustomFonts,
  mergeCustomFonts,
  readCustomFontFile,
  readCustomFonts,
  type CustomFont,
  writeCustomFonts,
} from "./lib/customFonts";
import { cloneLayer, makeImageLayer, makeShapeLayer, makeTextLayer } from "./lib/layerFactory";
import { parseCsvLayout } from "./lib/csv";
import { downloadThumbnail } from "./lib/exportThumbnail";
import { fontOptions as defaultFontOptions } from "./lib/fonts";
import { parseHtmlLayout } from "./lib/htmlLayout";
import { pickLayerInteractionAt } from "./lib/hitTest";
import { createTranslator, detectInitialLanguage, type Language } from "./lib/i18n";
import { applyRelativeLayerTransform, type RelativeLayerTransform } from "./lib/layerTransform";
import { selectLayerIdsAfterDelete, selectTopSelectableLayerIds } from "./lib/layerOperations";
import { layersToCsv, layersToHtml } from "./lib/layoutExport";
import { applyPreset, defaultOutputSettings } from "./lib/presets";
import { calculatePreviewPadding } from "./lib/previewPadding";
import { renderThumbnailToCanvas } from "./lib/renderCanvas";
import { createInitialLayers, initialAssets, sampleCsv, sampleHtml } from "./lib/sampleData";
import {
  createTemplateSnapshot,
  readSavedTemplates,
  type SavedTemplate,
  upsertTemplate,
  writeSavedTemplates,
} from "./lib/templates";
import { createCanvasTextMeasurer, fitTextLayerToBounds } from "./lib/textFit";
import type { ExportFormat, ImageAsset, OutputSettings, ThumbnailLayer } from "./lib/types";

interface ActiveCanvasInteraction {
  mode: CanvasInteractionMode;
  layer?: ThumbnailLayer;
  layers: ThumbnailLayer[];
  start: CanvasPoint;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeCanvasInteraction = useRef<ActiveCanvasInteraction | null>(null);
  const didInitializeSelection = useRef(false);
  const initialLanguage = useMemo(() => detectInitialLanguage(), []);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const t = useMemo(() => createTranslator(language), [language]);
  const [settings, setSettings] = useState<OutputSettings>(defaultOutputSettings);
  const [assets, setAssets] = useState<ImageAsset[]>(() => initialAssets(import.meta.env.BASE_URL));
  const [layers, setLayers] = useState<ThumbnailLayer[]>(() => createInitialLayers());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [csvText, setCsvText] = useState(sampleCsv);
  const [htmlText, setHtmlText] = useState(sampleHtml);
  const [templateName, setTemplateName] = useState("My thumbnail template");
  const [templates, setTemplates] = useState<SavedTemplate[]>(() =>
    typeof window === "undefined" ? [] : readSavedTemplates(),
  );
  const [status, setStatus] = useState(() => createTranslator(initialLanguage)("status.ready"));
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(0.94);
  const [canvasCursor, setCanvasCursor] = useState("default");
  const [hoverInteractionMode, setHoverInteractionMode] = useState<CanvasInteractionMode | null>(null);
  const [activeInteractionMode, setActiveInteractionMode] = useState<CanvasInteractionMode | null>(null);
  const [paletteColors, setPaletteColors] = useState<PaletteColor[]>(() =>
    typeof window === "undefined" ? [] : readColorPalette(),
  );
  const [paletteDraft, setPaletteDraft] = useState("#10b6d7");
  const [paletteNameDraft, setPaletteNameDraft] = useState("Accent fill");
  const [paletteTargetDraft, setPaletteTargetDraft] = useState<PaletteTarget>("fill");
  const [customFonts, setCustomFonts] = useState<CustomFont[]>(() =>
    typeof window === "undefined" ? [] : readCustomFonts(),
  );
  const [fontReadyRevision, setFontReadyRevision] = useState(0);
  const [isImageLabOpen, setIsImageLabOpen] = useState(false);

  const selectedLayers = useMemo(
    () => layers.filter((layer) => selectedIds.includes(layer.id) && layer.selectable),
    [layers, selectedIds],
  );
  const selectedLayer = selectedLayers.length === 1 ? selectedLayers[0] : undefined;
  const fontOptions = useMemo(
    () => [...defaultFontOptions, ...customFonts.map((font) => customFontToOption(font))],
    [customFonts],
  );
  const previewPadding = useMemo(
    () => calculatePreviewPadding(layers, settings, { minimum: 88, margin: 40 }),
    [layers, settings],
  );
  const selectionLabel =
    selectedLayers.length === 0
      ? t("selection.none")
      : selectedLayers.length === 1
        ? selectedLayers[0].name
        : t("selection.multiple", { count: selectedLayers.length });

  useEffect(() => {
    setSelectedIds((current) => {
      const valid = current.filter((id) => layers.some((layer) => layer.id === id && layer.selectable));
      if (!didInitializeSelection.current && current.length === 0) {
        didInitializeSelection.current = true;
        return selectTopSelectableLayerIds(layers);
      }
      didInitializeSelection.current = true;
      return valid.length === current.length ? current : valid;
    });
  }, [layers]);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderThumbnailToCanvas(canvas, layers, assets, settings, {
      selectedLayerIds: selectedIds,
      drawSelection: true,
      previewPadding,
      hoverInteractionMode,
      activeInteractionMode,
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
  }, [activeInteractionMode, assets, fontReadyRevision, hoverInteractionMode, layers, previewPadding, selectedIds, settings]);

  useEffect(() => {
    if (customFonts.length === 0) return;
    let cancelled = false;
    loadCustomFonts(customFonts)
      .then((errors) => {
        if (cancelled) return;
        setFontReadyRevision((current) => current + 1);
        if (errors.length > 0) {
          setStatus(`Font load warning: ${errors.join(" ")}`);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setStatus(`Font load failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [customFonts]);

  useEffect(() => {
    if (!isImageLabOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsImageLabOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isImageLabOpen]);

  const updateSettings = useCallback((next: Partial<OutputSettings>) => {
    setSettings((current) => ({ ...current, ...next }));
  }, []);

  const updateLayer = useCallback((id: string, updater: (layer: ThumbnailLayer) => ThumbnailLayer) => {
    setLayers((current) => current.map((layer) => (layer.id === id ? updater(layer) : layer)));
  }, []);

  const selectLayer = useCallback(
    (id: string, additive = false) => {
      const layer = layers.find((candidate) => candidate.id === id);
      if (!layer) return;
      if (!layer.selectable) {
        setStatus(`${layer.name} is locked for selection and editing.`);
        return;
      }
      setSelectedIds((current) => {
        if (!additive) return [id];
        return current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id];
      });
    },
    [layers],
  );

  const applyCsv = useCallback(() => {
    const result = parseCsvLayout(csvText, {
      baseWidth: settings.width,
      baseHeight: settings.height,
      existingImageKeys: assets.map((asset) => asset.key),
    });
    if (result.layers.length > 0) {
      setLayers(result.layers);
      setSelectedIds(selectTopSelectableLayerIds(result.layers));
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
      setSelectedIds(selectTopSelectableLayerIds(result.layers));
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
      setSelectedIds(selectTopSelectableLayerIds(newLayers));
      setStatus(`Imported ${loaded.length} image file${loaded.length === 1 ? "" : "s"}.`);
    },
    [settings.height, settings.width],
  );

  const handleCustomFontFiles = useCallback(
    async (files: FileList | null) => {
      const fontFiles = Array.from(files ?? []);
      if (fontFiles.length === 0) return;

      try {
        const loaded = await Promise.all(fontFiles.map((file) => readCustomFontFile(file)));
        const loadErrors = await loadCustomFonts(loaded);
        if (loadErrors.length > 0) {
          throw new Error(loadErrors.join(" "));
        }

        const next = mergeCustomFonts(customFonts, loaded);
        writeCustomFonts(next);
        setCustomFonts(next);
        setFontReadyRevision((current) => current + 1);

        const firstFont = loaded[0] ? findMatchingCustomFont(next, loaded[0]) : undefined;
        if (selectedLayer?.type === "text" && firstFont) {
          const option = customFontToOption(firstFont);
          setLayers((current) =>
            current.map((layer) => (layer.id === selectedLayer.id && layer.type === "text" ? { ...layer, fontFamily: option.value } : layer)),
          );
          setStatus(`Added custom font "${firstFont.name}" and applied it to ${selectedLayer.name}.`);
          return;
        }

        const addedCount = next.length - customFonts.length;
        setStatus(
          addedCount > 0
            ? `Added ${addedCount} custom font${addedCount === 1 ? "" : "s"}.`
            : "Custom font already exists.",
        );
      } catch (error) {
        setStatus(`Font import failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    [customFonts, selectedLayer],
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
    setSelectedIds([layer.id]);
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
    setSelectedIds([layer.id]);
    setStatus("Shape layer added.");
  }, [settings.height, settings.width]);

  const resetTemplate = useCallback(() => {
    const next = createInitialLayers();
    setLayers(next);
    setSelectedIds(selectTopSelectableLayerIds(next));
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
      setSelectedIds([copy.id]);
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
      const target = current.find((layer) => layer.id === id);
      if (!target) return current;
      const next = current.filter((layer) => layer.id !== id);
      setSelectedIds((selected) => selectLayerIdsAfterDelete(next, selected, id));
      setStatus(`Deleted ${target.name}.`);
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
      setSelectedIds([draggedId]);
      setStatus("Layer order updated by drag and drop.");
      return displayOrder.reverse();
    });
  }, []);

  const toggleLayerVisible = useCallback((id: string) => {
    setLayers((current) => current.map((layer) => (layer.id === id ? { ...layer, visible: !layer.visible } : layer)));
  }, []);

  const toggleLayerSelectable = useCallback((id: string) => {
    setLayers((current) =>
      current.map((layer) => (layer.id === id ? { ...layer, selectable: !layer.selectable } : layer)),
    );
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
  }, []);

  const alignSelection = useCallback(
    (mode: AlignmentMode) => {
      setLayers((current) => alignLayers(current, selectedIds, settings, mode));
      setStatus(selectedIds.length > 1 ? `Aligned ${selectedIds.length} layers.` : "Aligned layer to canvas.");
    },
    [selectedIds, settings],
  );

  const transformSelection = useCallback(
    (transform: RelativeLayerTransform) => {
      setLayers((current) => applyRelativeLayerTransform(current, selectedIds, transform));
      const selectedCount = selectedLayers.length;
      if (transform.deltaRotation) {
        setStatus(`Rotated ${selectedCount} selected layers by ${transform.deltaRotation} degrees.`);
      } else {
        setStatus(`Moved ${selectedCount} selected layers by ${transform.deltaX ?? 0}, ${transform.deltaY ?? 0}.`);
      }
    },
    [selectedIds, selectedLayers.length],
  );

  const addPaletteColor = useCallback(() => {
    const next = appendPaletteColor(paletteColors, {
      value: paletteDraft,
      name: paletteNameDraft,
      target: paletteTargetDraft,
    });
    writeColorPalette(next);
    setPaletteColors(next);
    setStatus(
      next.length === paletteColors.length
        ? "Palette color already exists for that target or is invalid."
        : `Palette color registered for ${paletteTargetDraft === "fill" ? "Fill" : "Stroke"}.`,
    );
  }, [paletteColors, paletteDraft, paletteNameDraft, paletteTargetDraft]);

  const deletePaletteColor = useCallback(
    (id: string) => {
      const next = removePaletteColor(paletteColors, id);
      writeColorPalette(next);
      setPaletteColors(next);
      setStatus("Palette color removed.");
    },
    [paletteColors],
  );

  const applyPaletteColor = useCallback(
    (color: string, target: PaletteTarget) => {
      setLayers((current) =>
        current.map((layer) => {
          if (!selectedIds.includes(layer.id) || !layer.selectable) return layer;
          if (layer.type === "text") {
            return target === "fill" ? { ...layer, color } : { ...layer, strokeColor: color };
          }
          if (layer.type === "shape") {
            return target === "fill" ? { ...layer, fill: color } : { ...layer, strokeColor: color };
          }
          return layer;
        }),
      );
      setStatus(target === "fill" ? "Applied palette color to fill/text." : "Applied palette color to stroke/outline.");
    },
    [selectedIds],
  );

  const createProcessedAsset = useCallback(
    (asset: ImageAsset) => {
      setAssets((current) => [...current, asset]);
      const assetRatio = asset.width && asset.height ? asset.height / asset.width : 9 / 16;
      const width = Math.min(settings.width * 0.46, asset.width ?? settings.width * 0.46);
      const height = Math.min(settings.height * 0.72, width * assetRatio);
      const layer = makeImageLayer({
        name: asset.name,
        imageKey: asset.key,
        x: settings.width * 0.5 - width / 2,
        y: settings.height * 0.5 - height / 2,
        width,
        height,
      });
      setLayers((current) => [...current, layer]);
      setSelectedIds([layer.id]);
      setStatus(`Created processed image layer "${asset.name}".`);
    },
    [settings.height, settings.width],
  );

  const handlePresetChange = useCallback((presetId: string) => {
    setSettings((current) => applyPreset(current, presetId));
  }, []);

  const fitTextToBounds = useCallback((id: string) => {
    const measureTextWidth = createCanvasTextMeasurer();
    setLayers((current) => {
      let message: string | null = null;
      const next = current.map((layer) => {
        if (layer.id !== id || layer.type !== "text" || !layer.selectable) return layer;
        const fitted = fitTextLayerToBounds(layer, { measureTextWidth });
        message = `Fit ${layer.name} text to its box at ${fitted.fontSize}px.`;
        return fitted;
      });
      if (message) setStatus(message);
      return next;
    });
  }, []);

  const handleCanvasPointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = event.currentTarget;
      const point = pointToCanvas(canvas, event.clientX, event.clientY, previewPadding);
      const additive = event.ctrlKey || event.metaKey || event.shiftKey;
      const interaction = pickLayerInteractionAt(layers, point, selectedLayer);

      if (interaction && interaction.mode !== "move") {
        event.preventDefault();
        safelySetPointerCapture(canvas, event.pointerId);
        activeCanvasInteraction.current = {
          mode: interaction.mode,
          layer: interaction.layer,
          layers: [interaction.layer],
          start: point,
        };
        setActiveInteractionMode(interaction.mode);
        setHoverInteractionMode(interaction.mode);
        setCanvasCursor(cursorForMode(interaction.mode, true));
        setStatus(`${labelForMode(interaction.mode)} ${interaction.layer.name}.`);
        return;
      }

      const picked = interaction?.layer;
      if (picked) {
        event.preventDefault();
        if (additive) {
          selectLayer(picked.id, true);
          setStatus(`Toggled ${picked.name} in the selection.`);
          return;
        }
        safelySetPointerCapture(canvas, event.pointerId);
        const moveTargets = selectedIds.includes(picked.id) && selectedLayers.length > 1 ? selectedLayers : [picked];
        setSelectedIds(moveTargets.map((layer) => layer.id));
        activeCanvasInteraction.current = { mode: "move", layers: moveTargets, start: point };
        setActiveInteractionMode("move");
        setHoverInteractionMode("move");
        setCanvasCursor("grabbing");
        setStatus(moveTargets.length > 1 ? `Dragging ${moveTargets.length} layers.` : `Selected ${picked.name}. Dragging to move.`);
      } else {
        event.preventDefault();
        setSelectedIds([]);
        setHoverInteractionMode(null);
        setCanvasCursor("default");
        setStatus("Selection cleared.");
      }
    },
    [layers, selectLayer, selectedIds, selectedLayer, selectedLayers],
  );

  const handleCanvasPointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = event.currentTarget;
      const point = pointToCanvas(canvas, event.clientX, event.clientY, previewPadding);
      const active = activeCanvasInteraction.current;

      if (active) {
        event.preventDefault();
        const nextLayers = transformLayersFromPointer(active, point);
        const nextById = new Map(nextLayers.map((layer) => [layer.id, layer]));
        setLayers((current) => current.map((layer) => nextById.get(layer.id) ?? layer));
        return;
      }

      const interaction = pickLayerInteractionAt(layers, point, selectedLayer);
      if (interaction) {
        setHoverInteractionMode(interaction.mode);
        setCanvasCursor(
          interaction.mode === "move" && interaction.layer.id !== selectedLayer?.id
            ? "pointer"
            : cursorForMode(interaction.mode),
        );
        return;
      }

      setHoverInteractionMode(null);
      setCanvasCursor("default");
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
    setActiveInteractionMode(null);
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
      const nextLayers = template.layers.map((layer) => ({ ...layer, selectable: layer.selectable !== false }));
      setLayers(nextLayers);
      setSelectedIds(selectTopSelectableLayerIds(nextLayers));
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
        language={language}
        onSettingsChange={updateSettings}
        onPresetChange={handlePresetChange}
        onExport={handleExport}
        onLanguageChange={setLanguage}
        isExporting={isExporting}
        t={t}
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
          onOpenImageLab={() => setIsImageLabOpen(true)}
          assets={assets}
          t={t}
        />
        <CanvasStage
          canvasRef={canvasRef}
          settings={settings}
          layerCount={layers.length}
          selectedLayerName={selectionLabel}
          zoom={zoom}
          cursor={canvasCursor}
          previewPadding={previewPadding}
          onZoomChange={setZoom}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          t={t}
        />
        <InspectorPanel
          assets={assets}
          layers={layers}
          selectedIds={selectedIds}
          settings={settings}
          paletteColors={paletteColors}
          paletteDraft={paletteDraft}
          paletteNameDraft={paletteNameDraft}
          paletteTargetDraft={paletteTargetDraft}
          fontOptions={fontOptions}
          onPaletteDraftChange={setPaletteDraft}
          onPaletteNameDraftChange={setPaletteNameDraft}
          onPaletteTargetDraftChange={setPaletteTargetDraft}
          onAddPaletteColor={addPaletteColor}
          onDeletePaletteColor={deletePaletteColor}
          onApplyPaletteColor={applyPaletteColor}
          onSelect={selectLayer}
          onUpdateLayer={updateLayer}
          onDelete={deleteLayer}
          onDuplicate={duplicateLayer}
          onMove={moveLayer}
          onReorderLayer={reorderLayer}
          onToggleVisible={toggleLayerVisible}
          onToggleSelectable={toggleLayerSelectable}
          onAlignSelection={alignSelection}
          onTransformSelection={transformSelection}
          onCustomFontFiles={handleCustomFontFiles}
          onFitTextToBounds={fitTextToBounds}
          t={t}
        />
      </main>
      {isImageLabOpen ? (
        <div
          className="modal-backdrop image-lab-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsImageLabOpen(false);
          }}
        >
          <section
            className="image-lab-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-lab-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-block">
                <h2 id="image-lab-title">{t("imageLab.title")}</h2>
              </div>
              <button
                type="button"
                className="icon-button modal-close"
                aria-label={t("imageLab.close")}
                onClick={() => setIsImageLabOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <ImageLabPanel
              assets={assets}
              onImageFiles={handleImageFiles}
              onCreateProcessedAsset={createProcessedAsset}
              t={t}
            />
          </section>
        </div>
      ) : null}
      <StatusBar status={status} settings={settings} zoom={zoom} layerCount={layers.length} t={t} />
    </div>
  );
}

function transformLayersFromPointer(active: ActiveCanvasInteraction, point: CanvasPoint): ThumbnailLayer[] {
  if (active.mode === "move") return active.layers.map((layer) => moveCanvasLayer(layer, active.start, point));
  if (!active.layer) return active.layers;
  if (active.mode === "rotate") return [rotateLayer(active.layer, active.start, point)];
  return [resizeLayer(active.layer, active.mode, point)];
}

function cursorForMode(mode: CanvasInteractionMode, active = false): string {
  if (mode === "move") return "grab";
  if (mode === "rotate") return active ? "grabbing" : "grab";
  if (mode === "resize-nw" || mode === "resize-se") return "nwse-resize";
  return "nesw-resize";
}

function labelForMode(mode: CanvasInteractionMode): string {
  if (mode === "move") return "Move";
  if (mode === "rotate") return "Rotate";
  return "Resize";
}

function safelySetPointerCapture(element: HTMLElement, pointerId: number): void {
  try {
    element.setPointerCapture(pointerId);
  } catch {
    // Synthetic tests may dispatch pointer events without an active browser pointer.
  }
}

function readImageFile(file: File): Promise<ImageAsset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const key = `${slug(baseName)}-${Date.now().toString(36)}`;
      const src = String(reader.result);
      const image = new Image();
      image.onload = () =>
        resolve({
          key,
          name: baseName,
          src,
          width: image.naturalWidth || image.width,
          height: image.naturalHeight || image.height,
        });
      image.onerror = () => resolve({ key, name: baseName, src });
      image.src = src;
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
