import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  applyBrandKitToLayers,
  createBrandKitFromCurrentState,
  defaultBrandKit,
  readBrandKit,
  writeBrandKit,
} from "./lib/brandKit";
import {
  addPaletteColor as appendPaletteColor,
  addSavedColorPalette,
  generatePaletteSchemeColors,
  getHarmonyPrinciple,
  normalizeColor,
  readColorPalette,
  readSavedColorPalettes,
  removePaletteColor,
  removeSavedColorPalette,
  updatePaletteColor,
  type PaletteColor,
  type PaletteTarget,
  type HarmonyMode,
  type PalettePrinciple,
  writeColorPalette,
  type SavedColorPalette,
  writeSavedColorPalettes,
  paletteModesByPrinciple,
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
import { defaultTemplates } from "./lib/defaultTemplates";
import {
  createEditStateSnapshot,
  deleteSavedEditState,
  parseEditStateJson,
  readEditStatePreferences,
  readSavedEditState,
  serializeEditState,
  writeEditStatePreferences,
  writeSavedEditState,
} from "./lib/editState";
import { cloneLayer, makeImageLayer, makeShapeLayer, makeTextLayer } from "./lib/layerFactory";
import { parseCsvLayout } from "./lib/csv";
import { downloadThumbnail } from "./lib/exportThumbnail";
import { fontOptions as defaultFontOptions } from "./lib/fonts";
import { parseHtmlLayout } from "./lib/htmlLayout";
import { pickLayerInteractionAt } from "./lib/hitTest";
import { createTranslator, detectInitialLanguage, type Language, type Translator } from "./lib/i18n";
import { applyRelativeLayerTransform, matchSelectedLayerRotation, type RelativeLayerTransform } from "./lib/layerTransform";
import {
  selectIndividualLayerId,
  selectLayerIdsAfterDelete,
  selectLayerIdsForLayer,
  selectTopSelectableLayerIds,
} from "./lib/layerOperations";
import { layersToCsv, layersToHtml } from "./lib/layoutExport";
import { applyPreset, defaultOutputSettings } from "./lib/presets";
import { estimateProjectStorageBytes, evaluateThumbnailWarnings } from "./lib/qualityChecks";
import { renderThumbnailToCanvas } from "./lib/renderCanvas";
import { buildScheduleTemplate, type ScheduleBuilderRequest } from "./lib/scheduleBuilder";
import { createInitialLayers, initialAssets, sampleCsv, sampleHtml } from "./lib/sampleData";
import {
  createTemplateSnapshot,
  readSavedTemplates,
  type SavedTemplate,
  upsertTemplate,
  writeSavedTemplates,
} from "./lib/templates";
import { readThemeMode, resolveThemeMode, writeThemeMode, type ThemeMode } from "./lib/theme";
import { createCanvasTextMeasurer, fitTextLayerToBounds } from "./lib/textFit";
import type { BrandKit, ExportFormat, ImageAsset, OutputSettings, ThumbnailLayer } from "./lib/types";
import { createYouTubeThumbnailAsset } from "./lib/youtubeThumbnail";

type ImagePalettePreviewHoverState = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const IMAGE_PALETTE_PREVIEW_LENS_SIZE = 160;
const IMAGE_PALETTE_PREVIEW_LENS_SCALE = 3;

interface ActiveCanvasInteraction {
  mode: CanvasInteractionMode;
  layer?: ThumbnailLayer;
  layers: ThumbnailLayer[];
  start: CanvasPoint;
  historyStart?: ThumbnailLayer[];
  didTransform?: boolean;
  latestLayers?: ThumbnailLayer[];
}

type ObsPreviewHostWindow = Window & {
  __thumbnailObsPreviewRender?: (canvas: HTMLCanvasElement, timeMs: number) => Promise<void>;
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeCanvasInteraction = useRef<ActiveCanvasInteraction | null>(null);
  const clipboardLayers = useRef<ThumbnailLayer[]>([]);
  const historyPast = useRef<ThumbnailLayer[][]>([]);
  const historyFuture = useRef<ThumbnailLayer[][]>([]);
  const lastLayerSnapshot = useRef<ThumbnailLayer[] | null>(null);
  const skipHistoryRecord = useRef(false);
  const didInitializeSelection = useRef(false);
  const didMountAutoSave = useRef(false);
  const initialLanguage = useMemo(() => detectInitialLanguage(), []);
  const initialSavedEditState = useMemo(() => (typeof window === "undefined" ? null : readSavedEditState()), []);
  const initialBrandKit = useMemo(() => (typeof window === "undefined" ? defaultBrandKit : readBrandKit()), []);
  const initialEditStatePreferences = useMemo(
    () => (typeof window === "undefined" ? { autoSaveEnabled: false } : readEditStatePreferences()),
    [],
  );
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const t = useMemo(() => createTranslator(language), [language]);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    typeof window === "undefined" ? "system" : readThemeMode(),
  );
  const [prefersDarkTheme, setPrefersDarkTheme] = useState(() =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const effectiveTheme = useMemo(() => resolveThemeMode(themeMode, prefersDarkTheme), [prefersDarkTheme, themeMode]);
  const [settings, setSettings] = useState<OutputSettings>(initialSavedEditState?.settings ?? defaultOutputSettings);
  const [assets, setAssets] = useState<ImageAsset[]>(() =>
    initialSavedEditState?.assets.length ? initialSavedEditState.assets : initialAssets(import.meta.env.BASE_URL),
  );
  const [layers, setLayers] = useState<ThumbnailLayer[]>(() => initialSavedEditState?.layers ?? createInitialLayers());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [csvText, setCsvText] = useState(initialSavedEditState?.csv ?? sampleCsv);
  const [htmlText, setHtmlText] = useState(initialSavedEditState?.html ?? sampleHtml);
  const [templateName, setTemplateName] = useState(initialSavedEditState?.templateName ?? "My thumbnail template");
  const [templates, setTemplates] = useState<SavedTemplate[]>(() =>
    typeof window === "undefined" ? [] : readSavedTemplates(),
  );
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(initialEditStatePreferences.autoSaveEnabled);
  const [savedEditStateUpdatedAt, setSavedEditStateUpdatedAt] = useState<string | null>(
    initialSavedEditState?.updatedAt ?? null,
  );
  const [status, setStatus] = useState(() =>
    initialSavedEditState
      ? `Restored saved edit state from ${formatSavedAt(initialSavedEditState.updatedAt)}.`
      : createTranslator(initialLanguage)("status.ready"),
  );
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(0.94);
  const [autoFitRevision, setAutoFitRevision] = useState(0);
  const [canvasCursor, setCanvasCursor] = useState("default");
  const [hoverInteractionMode, setHoverInteractionMode] = useState<CanvasInteractionMode | null>(null);
  const [activeInteractionMode, setActiveInteractionMode] = useState<CanvasInteractionMode | null>(null);
  const [paletteColors, setPaletteColors] = useState<PaletteColor[]>(() =>
    typeof window === "undefined" ? [] : readColorPalette(),
  );
  const [paletteDraft, setPaletteDraft] = useState("#10b6d7");
  const [paletteNameDraft, setPaletteNameDraft] = useState("Accent");
  const [paletteAlphaDraft, setPaletteAlphaDraft] = useState(1);
  const [paletteModeDraft, setPaletteModeDraft] = useState<HarmonyMode>("triad");
  const [palettePrincipleDraft, setPalettePrincipleDraft] = useState<PalettePrinciple>(() => getHarmonyPrinciple("triad"));
  const [brandKit, setBrandKit] = useState<BrandKit>(initialBrandKit);
  const [selectedPaletteColorId, setSelectedPaletteColorId] = useState<string | null>(null);
  const [savedColorPalettes, setSavedColorPalettes] = useState<SavedColorPalette[]>(() =>
    typeof window === "undefined" ? [] : readSavedColorPalettes(),
  );
  const [extractedImagePalette, setExtractedImagePalette] = useState<string[]>([]);
  const [isImagePaletteModalOpen, setImagePaletteModalOpen] = useState(false);
  const [isExtractingImagePalette, setIsExtractingImagePalette] = useState(false);
  const [extractedPaletteName, setExtractedPaletteName] = useState("Image palette");
  const [extractedPaletteSource, setExtractedPaletteSource] = useState("");
  const [extractedPaletteAsset, setExtractedPaletteAsset] = useState<ImageAsset | null>(null);
  const [imagePaletteTargetCount, setImagePaletteTargetCount] = useState(3);
  const [imagePaletteExcludedColors, setImagePaletteExcludedColors] = useState<string[]>([]);
  const [customFonts, setCustomFonts] = useState<CustomFont[]>(() =>
    typeof window === "undefined" ? [] : readCustomFonts(),
  );
  const [fontReadyRevision, setFontReadyRevision] = useState(0);
  const [isImageLabOpen, setIsImageLabOpen] = useState(false);
  const [selectedAssetKey, setSelectedAssetKey] = useState(() => assets[0]?.key ?? "");
  const [imagePaletteHoverState, setImagePaletteHoverState] = useState<ImagePalettePreviewHoverState | null>(null);
  const [imagePaletteHoverColor, setImagePaletteHoverColor] = useState("");
  const obsWindowRef = useRef<Window | null>(null);
  const obsPreviewStateRef = useRef({ layers, assets, settings, customFonts });
  const imagePaletteHoverSampleVersion = useRef(0);

  const selectedLayers = useMemo(
    () => layers.filter((layer) => selectedIds.includes(layer.id) && layer.selectable),
    [layers, selectedIds],
  );
  const selectedLayer = selectedLayers.length === 1 ? selectedLayers[0] : undefined;
  const fontOptions = useMemo(
    () => [...defaultFontOptions, ...customFonts.map((font) => customFontToOption(font))],
    [customFonts],
  );
  const previewPadding = 0;
  const selectionLabel =
    selectedLayers.length === 0
      ? t("selection.none")
      : selectedLayers.length === 1
        ? selectedLayers[0].name
      : t("selection.multiple", { count: selectedLayers.length });
  const estimatedStorageBytes = useMemo(
    () => estimateProjectStorageBytes(createEditStateSnapshot(layers, assets, settings, csvText, htmlText, templateName)),
    [assets, csvText, htmlText, layers, settings, templateName],
  );
  const qualityWarnings = useMemo(
    () => evaluateThumbnailWarnings({ layers, assets, settings, estimatedStorageBytes }),
    [assets, estimatedStorageBytes, layers, settings],
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setPrefersDarkTheme(query.matches);
    handleChange();
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    writeThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = effectiveTheme;
  }, [effectiveTheme]);

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
    if (!lastLayerSnapshot.current) {
      lastLayerSnapshot.current = structuredClone(layers);
      return;
    }
    if (skipHistoryRecord.current) {
      skipHistoryRecord.current = false;
      lastLayerSnapshot.current = structuredClone(layers);
      return;
    }
    historyPast.current = [...historyPast.current.slice(-49), structuredClone(lastLayerSnapshot.current)];
    historyFuture.current = [];
    lastLayerSnapshot.current = structuredClone(layers);
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
    obsPreviewStateRef.current = { layers, assets, settings, customFonts };
  }, [assets, customFonts, layers, settings]);

  useEffect(() => {
    return () => {
      delete (window as ObsPreviewHostWindow).__thumbnailObsPreviewRender;
    };
  }, []);

  useEffect(() => {
    try {
      writeEditStatePreferences({ autoSaveEnabled });
    } catch (error) {
      setStatus(`Autosave setting failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [autoSaveEnabled]);

  useEffect(() => {
    if (!didMountAutoSave.current) {
      didMountAutoSave.current = true;
      return;
    }
    if (!autoSaveEnabled) return;
    const timeout = window.setTimeout(() => {
      saveEditState("auto");
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [assets, autoSaveEnabled, csvText, htmlText, layers, settings, templateName]);

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
      setSelectedIds((current) => selectLayerIdsForLayer(layers, current, id, additive));
    },
    [layers],
  );

  const selectIndividualLayer = useCallback(
    (id: string) => {
      const layer = layers.find((candidate) => candidate.id === id);
      if (!layer) return;
      if (!layer.selectable) {
        setStatus(`${layer.name} is locked for selection and editing.`);
        return;
      }
      setSelectedIds(selectIndividualLayerId(layers, layer.id));
      setStatus(layer.groupId ? `Selected ${layer.name} for individual group editing.` : `Selected ${layer.name}.`);
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

  const importImageAssets = useCallback(async (files: FileList | null): Promise<ImageAsset[]> => {
    if (!files || files.length === 0) return [];
    const loaded = await Promise.all(Array.from(files).map(readImageFile));
    setAssets((current) => [...current, ...loaded]);
    setSelectedAssetKey(loaded[0]?.key ?? "");
    setStatus(`Imported ${loaded.length} image asset${loaded.length === 1 ? "" : "s"}.`);
    return loaded;
  }, []);

  const handleImageFiles = useCallback(
    async (files: FileList | null) => {
      const loaded = await importImageAssets(files);
      if (loaded.length === 0) return;
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
    [importImageAssets, settings.height, settings.width],
  );

  const addImageLayerFromAsset = useCallback(
    (assetKey: string) => {
      const asset = assets.find((candidate) => candidate.key === assetKey);
      if (!asset) {
        setStatus("Select an image asset before adding an image layer.");
        return;
      }
      const assetRatio = asset.width && asset.height ? asset.height / asset.width : 9 / 16;
      const width = Math.min(settings.width * 0.42, asset.width ?? settings.width * 0.42);
      const layer = makeImageLayer({
        name: asset.name,
        imageKey: asset.key,
        x: settings.width * 0.5 - width / 2,
        y: settings.height * 0.5 - Math.min(settings.height * 0.64, width * assetRatio) / 2,
        width,
        height: Math.min(settings.height * 0.64, width * assetRatio),
      });
      setLayers((current) => [...current, layer]);
      setSelectedIds([layer.id]);
      setSelectedAssetKey(asset.key);
      setStatus(`Added ${asset.name} as an image layer.`);
    },
    [assets, settings.height, settings.width],
  );

  const importYouTubeThumbnail = useCallback(
    async (url: string) => {
      setStatus("Fetching YouTube thumbnail...");
      try {
        const asset = await createYouTubeThumbnailAsset(url);
        setAssets((current) => [...current, asset]);
        setSelectedAssetKey(asset.key);
        const assetRatio = asset.width && asset.height ? asset.height / asset.width : 9 / 16;
        const width = Math.min(settings.width * 0.58, asset.width ?? settings.width * 0.58);
        const height = Math.min(settings.height * 0.78, width * assetRatio);
        const layer = makeImageLayer({
          name: asset.name,
          imageKey: asset.key,
          x: settings.width * 0.5 - width / 2,
          y: settings.height * 0.5 - height / 2,
          width,
          height,
          effects: { grayscale: 0, blur: 0, brightness: 100, contrast: 100, mosaic: 0 },
        });
        setLayers((current) => [...current, layer]);
        setSelectedIds([layer.id]);
        setStatus(`Imported YouTube thumbnail for editing as "${asset.name}".`);
      } catch (error) {
        setStatus(`YouTube thumbnail import failed: ${error instanceof Error ? error.message : String(error)}`);
      }
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

  const addLineLayer = useCallback(() => {
    const layer = makeShapeLayer({
      name: "Line",
      shape: "line",
      x: settings.width * 0.18,
      y: settings.height * 0.5,
      width: settings.width * 0.58,
      height: 12,
      strokeColor: "#ffffff",
      strokeWidth: 10,
      strokeOpacity: 1,
      lineStyle: "solid",
      fillOpacity: 0,
      rotation: -2,
    });
    setLayers((current) => [...current, layer]);
    setSelectedIds([layer.id]);
    setStatus("Line layer added.");
  }, [settings.height, settings.width]);

  const addQuickLayer = useCallback(
    (kind: "headline" | "subtitle" | "badge" | "divider") => {
      const layer =
        kind === "headline"
          ? makeTextLayer({
              name: "Headline",
              x: settings.width * 0.08,
              y: settings.height * 0.12,
              width: settings.width * 0.68,
              height: settings.height * 0.22,
              text: "BIG NEWS",
              fontSize: Math.round(settings.width / 12),
              fontWeight: "900",
              strokeWidth: 10,
            })
          : kind === "subtitle"
            ? makeTextLayer({
                name: "Subtitle",
                x: settings.width * 0.1,
                y: settings.height * 0.62,
                width: settings.width * 0.58,
                height: settings.height * 0.11,
                text: "Add context here",
                fontSize: Math.round(settings.width / 28),
                fontFamily: "Arial Black, Arial, sans-serif",
                fontWeight: "800",
                color: "#fff4c7",
                strokeWidth: 5,
              })
            : kind === "badge"
              ? makeShapeLayer({
                  name: "Badge",
                  shape: "ellipse",
                  x: settings.width * 0.72,
                  y: settings.height * 0.1,
                  width: settings.width * 0.18,
                  height: settings.height * 0.18,
                  fill: "#ffd166",
                  strokeColor: "#111827",
                  strokeWidth: 6,
                  rotation: -8,
                })
              : makeShapeLayer({
                  name: "Divider bar",
                  x: settings.width * 0.08,
                  y: settings.height * 0.76,
                  width: settings.width * 0.62,
                  height: settings.height * 0.045,
                  fill: "#ff4f5f",
                  strokeWidth: 0,
                  rotation: -2,
                });
      setLayers((current) => [...current, layer]);
      setSelectedIds([layer.id]);
      setStatus(`Added ${layer.name}.`);
    },
    [settings.height, settings.width],
  );

  const resetTemplate = useCallback(() => {
    const next = createInitialLayers();
    setLayers(next);
    setSelectedIds(selectTopSelectableLayerIds(next));
    setCsvText(sampleCsv);
    setHtmlText(sampleHtml);
    setStatus("Sample creator template restored.");
  }, []);

  const loadDefaultTemplate = useCallback(
    (templateId: string) => {
      const template = defaultTemplates.find((candidate) => candidate.id === templateId);
      if (!template) return;
      const nextLayers = template.createLayers();
      setSettings(template.settings);
      setAssets(initialAssets(import.meta.env.BASE_URL));
      setSelectedAssetKey("sample-bg");
      setLayers(nextLayers);
      setSelectedIds(selectTopSelectableLayerIds(nextLayers));
      setCsvText(layersToCsv(nextLayers));
      setHtmlText(layersToHtml(nextLayers));
      setTemplateName(template.name);
      setAutoFitRevision((current) => current + 1);
      setStatus(`Loaded default template "${template.name}".`);
    },
    [],
  );

  const generateScheduleTemplate = useCallback(
    (request: ScheduleBuilderRequest) => {
      const schedule = buildScheduleTemplate(request, settings, language);
      setSettings(schedule.settings);
      setLayers(schedule.layers);
      setSelectedIds(selectTopSelectableLayerIds(schedule.layers));
      setCsvText(layersToCsv(schedule.layers));
      setHtmlText(layersToHtml(schedule.layers));
      setTemplateName(schedule.name);
      setAutoFitRevision((current) => current + 1);
      setStatus(`Generated beta schedule template "${schedule.name}" with ${schedule.layers.length} layers.`);
    },
    [language, settings],
  );

  const saveEditState = useCallback(
    (mode: "manual" | "auto" = "manual") => {
      try {
        const snapshot = createEditStateSnapshot(layers, assets, settings, csvText, htmlText, templateName);
        const snapshotSize = estimateProjectStorageBytes(snapshot);
        writeSavedEditState(snapshot);
        setSavedEditStateUpdatedAt(snapshot.updatedAt);
        if (mode === "manual") {
          setStatus(
            snapshotSize >= 4_500_000
              ? `Saved current edit state, but it is large (${formatBytes(snapshotSize)}). Export JSON as a backup.`
              : `Saved current edit state at ${formatSavedAt(snapshot.updatedAt)}.`,
          );
        }
      } catch (error) {
        setStatus(
          `Edit state save failed: ${error instanceof Error ? error.message : String(error)} Export state JSON, delete old browser data, or remove large image/font assets.`,
        );
      }
    },
    [assets, csvText, htmlText, layers, settings, templateName],
  );

  const restoreEditState = useCallback(() => {
    const snapshot = readSavedEditState();
    if (!snapshot) {
      setStatus("No saved edit state found.");
      return;
    }
    setSettings(snapshot.settings);
    setAssets(snapshot.assets.length > 0 ? snapshot.assets : initialAssets(import.meta.env.BASE_URL));
    setLayers(snapshot.layers);
    setSelectedIds(selectTopSelectableLayerIds(snapshot.layers));
    setCsvText(snapshot.csv || layersToCsv(snapshot.layers));
    setHtmlText(snapshot.html || layersToHtml(snapshot.layers));
    setTemplateName(snapshot.templateName);
    setSavedEditStateUpdatedAt(snapshot.updatedAt);
    setStatus(`Restored saved edit state from ${formatSavedAt(snapshot.updatedAt)}.`);
  }, []);

  const exportEditState = useCallback(() => {
    const snapshot = createEditStateSnapshot(layers, assets, settings, csvText, htmlText, templateName);
    downloadTextFile(
      serializeEditState(snapshot),
      `thumbnail-generator-state-${snapshot.updatedAt.replace(/[:.]/g, "-")}.json`,
      "application/json",
    );
    setStatus(`Exported edit state JSON (${formatBytes(estimateProjectStorageBytes(snapshot))}).`);
  }, [assets, csvText, htmlText, layers, settings, templateName]);

  const importEditState = useCallback(async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const snapshot = parseEditStateJson(text);
      if (!snapshot) {
        setStatus("Edit state import failed: JSON did not match the saved state schema.");
        return;
      }
      writeSavedEditState(snapshot);
      setSettings(snapshot.settings);
      setAssets(snapshot.assets.length > 0 ? snapshot.assets : initialAssets(import.meta.env.BASE_URL));
      setLayers(snapshot.layers);
      setSelectedIds(selectTopSelectableLayerIds(snapshot.layers));
      setCsvText(snapshot.csv || layersToCsv(snapshot.layers));
      setHtmlText(snapshot.html || layersToHtml(snapshot.layers));
      setTemplateName(snapshot.templateName);
      setSavedEditStateUpdatedAt(snapshot.updatedAt);
      setStatus(`Imported edit state from ${file.name}.`);
    } catch (error) {
      setStatus(`Edit state import failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, []);

  const deleteEditState = useCallback(() => {
    try {
      deleteSavedEditState();
      setSavedEditStateUpdatedAt(null);
      setStatus("Deleted the saved browser edit state. Current canvas remains open.");
    } catch (error) {
      setStatus(`Edit state delete failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, []);

  const updateBrandKit = useCallback((next: BrandKit) => {
    const normalized = { ...next };
    setBrandKit(normalized);
    try {
      writeBrandKit(normalized);
    } catch (error) {
      setStatus(`Brand kit save failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, []);

  const captureBrandKit = useCallback(() => {
    const next = createBrandKitFromCurrentState(layers, customFonts, brandKit);
    updateBrandKit(next);
    setStatus("Captured brand kit from the current selected style.");
  }, [brandKit, customFonts, layers, updateBrandKit]);

  const applyBrandKit = useCallback(() => {
    const compatibleIds = selectedIds.length
      ? selectedIds
      : layers.filter((layer) => layer.selectable && (layer.type === "text" || layer.type === "shape")).map((layer) => layer.id);
    if (compatibleIds.length === 0 && !brandKit.logoAssetKey) {
      setStatus("No editable text, shape, or logo asset is available for brand kit application.");
      return;
    }
    setLayers((current) => {
      let next = applyBrandKitToLayers(current, compatibleIds, brandKit);
      const logoAsset = brandKit.logoAssetKey ? assets.find((asset) => asset.key === brandKit.logoAssetKey) : undefined;
      if (logoAsset) {
        const logoWidth = Math.min(settings.width * 0.18, logoAsset.width ?? settings.width * 0.18);
        const ratio = logoAsset.width && logoAsset.height ? logoAsset.height / logoAsset.width : 1;
        const logoLayer = makeImageLayer({
          name: `${brandKit.channelName} logo`,
          imageKey: logoAsset.key,
          x: settings.width * 0.055,
          y: settings.height * 0.78,
          width: logoWidth,
          height: logoWidth * ratio,
        });
        next = [...next, logoLayer];
        setSelectedIds([logoLayer.id]);
      }
      return next;
    });
    setStatus(`Applied brand kit "${brandKit.channelName}" to ${compatibleIds.length || 1} target${compatibleIds.length === 1 ? "" : "s"}.`);
  }, [assets, brandKit, layers, selectedIds, settings.height, settings.width]);

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
      const target = current.find((layer) => layer.id === id);
      if (!target) return current;
      const next = current.filter((layer) => layer.id !== id);
      setSelectedIds((selected) => selectLayerIdsAfterDelete(next, selected, id));
      setStatus(`Deleted ${target.name}.`);
      return next;
    });
  }, []);

  const deleteAsset = useCallback((key: string) => {
    const target = assets.find((asset) => asset.key === key);
    setAssets((current) => {
      const next = current.filter((asset) => asset.key !== key);
      setSelectedAssetKey((selected) => (selected === key ? next[0]?.key ?? "" : selected));
      return next;
    });
    setLayers((current) => {
      const removedLayerIds = new Set(
        current
          .filter((layer) => layer.type === "image" && layer.imageKey === key)
          .map((layer) => layer.id),
      );
      if (removedLayerIds.size === 0) return current;
      const next = current.filter((layer) => !removedLayerIds.has(layer.id));
      setSelectedIds((selected) => selected.filter((id) => !removedLayerIds.has(id) && next.some((layer) => layer.id === id)));
      return next;
    });
    setStatus(target ? `Deleted image asset "${target.name}" and related image layers.` : "Image asset deleted.");
  }, [assets]);

  const copySelectedLayers = useCallback(() => {
    const copies = selectedIds
      .map((id) => layers.find((layer) => layer.id === id && layer.selectable))
      .filter((layer): layer is ThumbnailLayer => Boolean(layer))
      .map((layer) => structuredClone(layer));
    clipboardLayers.current = copies;
    setStatus(copies.length > 0 ? `Copied ${copies.length} layer${copies.length === 1 ? "" : "s"}.` : "No editable layer selected to copy.");
  }, [layers, selectedIds]);

  const pasteSelectedLayers = useCallback(() => {
    if (clipboardLayers.current.length === 0) {
      setStatus("Clipboard has no copied layers.");
      return;
    }
    const pasted = clipboardLayers.current.map((layer) => cloneLayer({ ...layer, x: layer.x + 28, y: layer.y + 28 }));
    setLayers((current) => [...current, ...pasted]);
    setSelectedIds(pasted.map((layer) => layer.id));
    setStatus(`Pasted ${pasted.length} layer${pasted.length === 1 ? "" : "s"}.`);
  }, []);

  const duplicateSelectedLayers = useCallback(() => {
    const selectedCopies = selectedIds
      .map((id) => layers.find((layer) => layer.id === id && layer.selectable))
      .filter((layer): layer is ThumbnailLayer => Boolean(layer))
      .map((layer) => cloneLayer({ ...layer, x: layer.x + 24, y: layer.y + 24 }));
    if (selectedCopies.length === 0) {
      setStatus("No editable layer selected to duplicate.");
      return;
    }
    setLayers((current) => [...current, ...selectedCopies]);
    setSelectedIds(selectedCopies.map((layer) => layer.id));
    setStatus(`Duplicated ${selectedCopies.length} selected layer${selectedCopies.length === 1 ? "" : "s"}.`);
  }, [layers, selectedIds]);

  const cutSelectedLayers = useCallback(() => {
    const targets = selectedIds
      .map((id) => layers.find((layer) => layer.id === id && layer.selectable))
      .filter((layer): layer is ThumbnailLayer => Boolean(layer));
    if (targets.length === 0) {
      setStatus("No editable layer selected to cut.");
      return;
    }
    if (layers.length - targets.length < 1) {
      setStatus("At least one layer is required.");
      return;
    }
    const targetIds = new Set(targets.map((layer) => layer.id));
    clipboardLayers.current = targets.map((layer) => structuredClone(layer));
    setLayers((current) => {
      const next = current.filter((layer) => !targetIds.has(layer.id));
      setSelectedIds(selectTopSelectableLayerIds(next));
      return next;
    });
    setStatus(`Cut ${targets.length} layer${targets.length === 1 ? "" : "s"}.`);
  }, [layers, selectedIds]);

  const undoLayers = useCallback(() => {
    const previous = historyPast.current.pop();
    if (!previous) {
      setStatus("Nothing to undo.");
      return;
    }
    historyFuture.current = [structuredClone(layers), ...historyFuture.current.slice(0, 49)];
    skipHistoryRecord.current = true;
    setLayers(structuredClone(previous));
    setSelectedIds((current) => current.filter((id) => previous.some((layer) => layer.id === id && layer.selectable)));
    setStatus("Undo complete.");
  }, [layers]);

  const redoLayers = useCallback(() => {
    const [next, ...rest] = historyFuture.current;
    if (!next) {
      setStatus("Nothing to redo.");
      return;
    }
    historyFuture.current = rest;
    historyPast.current = [...historyPast.current.slice(-49), structuredClone(layers)];
    skipHistoryRecord.current = true;
    setLayers(structuredClone(next));
    setSelectedIds((current) => current.filter((id) => next.some((layer) => layer.id === id && layer.selectable)));
    setStatus("Redo complete.");
  }, [layers]);

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
      if (mode === "distribute-horizontal" || mode === "distribute-vertical") {
        setStatus(selectedIds.length >= 3 ? `Distributed ${selectedIds.length} layers evenly.` : "Select at least three editable layers to distribute.");
      } else {
        setStatus(selectedIds.length > 1 ? `Aligned ${selectedIds.length} layers.` : "Aligned layer to canvas.");
      }
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

  const matchSelectionRotation = useCallback(() => {
    const reference = selectedIds
      .map((id) => layers.find((layer) => layer.id === id && layer.selectable))
      .find((layer): layer is ThumbnailLayer => Boolean(layer));
    if (!reference || selectedLayers.length < 2) {
      setStatus("Select at least two editable layers to match angles.");
      return;
    }
    setLayers((current) => matchSelectedLayerRotation(current, selectedIds));
    setStatus(`Matched ${selectedLayers.length} selected layer angles to ${reference.name}.`);
  }, [layers, selectedIds, selectedLayers.length]);

  const createLayerGroup = useCallback(
    (name: string) => {
      const groupTargets = selectedLayers.filter((layer) => layer.selectable);
      if (groupTargets.length < 2) {
        setStatus("Select at least two editable layers to create a group.");
        return;
      }
      const groupId = `group-${Date.now().toString(36)}`;
      const groupName = name.trim() || "Layer group";
      const targetIds = new Set(groupTargets.map((layer) => layer.id));
      setLayers((current) =>
        current.map((layer) => (targetIds.has(layer.id) ? { ...layer, groupId, groupName } : layer)),
      );
      setStatus(`Grouped ${groupTargets.length} layers as "${groupName}".`);
    },
    [selectedLayers],
  );

  const renameLayerGroup = useCallback(
    (groupId: string, name: string) => {
      const groupName = name.trim() || "Layer group";
      setLayers((current) => current.map((layer) => (layer.groupId === groupId ? { ...layer, groupName } : layer)));
      setStatus(`Renamed group to "${groupName}".`);
    },
    [],
  );

  const ungroupLayerGroup = useCallback((groupId: string) => {
    setLayers((current) =>
      current.map((layer) =>
        layer.groupId === groupId ? { ...layer, groupId: undefined, groupName: undefined } : layer,
      ),
    );
    setStatus("Layer group removed.");
  }, []);

  const fitSelectedLayersToCanvas = useCallback(() => {
    const targetIds = new Set(
      selectedLayers.filter((layer) => layer.type === "image" || layer.type === "shape").map((layer) => layer.id),
    );
    if (targetIds.size === 0) {
      setStatus("Select an image or shape layer to fit it to the canvas.");
      return;
    }
    setLayers((current) =>
      current.map((layer) =>
        targetIds.has(layer.id) ? { ...layer, x: 0, y: 0, width: settings.width, height: settings.height } : layer,
      ),
    );
    setStatus(`Fit ${targetIds.size} selected image/shape layer${targetIds.size === 1 ? "" : "s"} to the canvas.`);
  }, [selectedLayers, settings.height, settings.width]);

  const addPaletteColor = useCallback(() => {
    const next = appendPaletteColor(paletteColors, {
      value: paletteDraft,
      name: paletteNameDraft,
      alpha: paletteAlphaDraft,
    });
    writeColorPalette(next);
    setPaletteColors(next);
    setSelectedPaletteColorId(next[0]?.id ?? null);
    setStatus(
      next.length === paletteColors.length
        ? "Palette color already exists or is invalid."
        : "Palette color registered.",
    );
  }, [paletteAlphaDraft, paletteColors, paletteDraft, paletteNameDraft]);

  const selectPaletteColor = useCallback(
    (id: string) => {
      const color = paletteColors.find((candidate) => candidate.id === id);
      if (!color) return;
      setSelectedPaletteColorId(id);
      setPaletteDraft(color.value);
      setPaletteNameDraft(color.name);
      setPaletteAlphaDraft(color.alpha);
      setStatus(`Selected palette color "${color.name}" for editing.`);
    },
    [paletteColors],
  );

  const saveSelectedPaletteColor = useCallback(() => {
    if (!selectedPaletteColorId) {
      setStatus("Select a registered color before updating it.");
      return;
    }
    const next = updatePaletteColor(paletteColors, selectedPaletteColorId, {
      value: paletteDraft,
      name: paletteNameDraft,
      alpha: paletteAlphaDraft,
    });
    writeColorPalette(next);
    setPaletteColors(next);
    setStatus("Palette color updated.");
  }, [paletteAlphaDraft, paletteColors, paletteDraft, paletteNameDraft, selectedPaletteColorId]);

  const saveCurrentColorPalette = useCallback((previewColors?: string[]) => {
    const colors = previewColors?.length ? previewColors : generatePaletteSchemeColors(paletteDraft, paletteModeDraft);
    const next = addSavedColorPalette(savedColorPalettes, {
      name: paletteNameDraft,
      baseColor: paletteDraft,
      mode: paletteModeDraft,
      colors,
    });
    writeSavedColorPalettes(next);
    setSavedColorPalettes(next);
    setStatus(
      next.length === savedColorPalettes.length
        ? "Palette was not saved because the base color is invalid."
        : `Saved ${colors.length} color palette "${next[0].name}".`,
    );
  }, [paletteDraft, paletteModeDraft, paletteNameDraft, savedColorPalettes]);

  const extractImagePaletteFromAsset = useCallback(
    async (asset: ImageAsset, targetCount: number, excludedColors: string[]): Promise<boolean> => {
      setIsExtractingImagePalette(true);
      try {
        const palette = await extractPaletteFromImageSource(asset.src, targetCount, excludedColors);
        if (palette.length === 0) {
          setStatus(`Could not extract colors from ${asset.name || "the selected image"}.`);
          setExtractedImagePalette([]);
          return false;
        }
        setExtractedImagePalette(palette);
        setStatus(`Extracted ${palette.length} colors from ${asset.name || "the selected image"}.`);
        return true;
      } catch (error) {
        setStatus(`Palette extraction failed: ${error instanceof Error ? error.message : String(error)}`);
        setExtractedImagePalette([]);
        return false;
      } finally {
        setIsExtractingImagePalette(false);
      }
    },
    [],
  );

  const refreshImagePaletteExtraction = useCallback(
    (targetCount: number, excludedColors: string[]) => {
      const source = extractedPaletteAsset;
      if (!source || !isImagePaletteModalOpen) return;
      void extractImagePaletteFromAsset(source, targetCount, excludedColors);
    },
    [extractedPaletteAsset, extractImagePaletteFromAsset, isImagePaletteModalOpen],
  );

  const addImagePaletteExcludedColor = useCallback(
    (color: string) => {
      const normalized = normalizeColor(color);
      if (!normalized) return;
      if (imagePaletteExcludedColors.includes(normalized)) return;
      const next = [...imagePaletteExcludedColors, normalized];
      setImagePaletteExcludedColors(next);
      if (extractedPaletteAsset) {
        refreshImagePaletteExtraction(imagePaletteTargetCount, next);
      }
    },
    [extractedPaletteAsset, imagePaletteExcludedColors, imagePaletteTargetCount, refreshImagePaletteExtraction],
  );

  const removeImagePaletteExcludedColor = useCallback(
    (color: string) => {
      const next = imagePaletteExcludedColors.filter((candidate) => candidate !== color);
      setImagePaletteExcludedColors(next);
      if (extractedPaletteAsset) {
        refreshImagePaletteExtraction(imagePaletteTargetCount, next);
      }
    },
    [extractedPaletteAsset, imagePaletteTargetCount, imagePaletteExcludedColors, refreshImagePaletteExtraction],
  );

  const setImagePaletteTargetCountAndRefresh = useCallback(
    (nextCount: number) => {
      const sanitized = Math.min(5, Math.max(3, nextCount));
      setImagePaletteTargetCount(sanitized);
      if (extractedPaletteAsset) {
        refreshImagePaletteExtraction(sanitized, imagePaletteExcludedColors);
      }
    },
    [extractedPaletteAsset, imagePaletteExcludedColors, refreshImagePaletteExtraction],
  );

  const closeImagePaletteModal = useCallback(() => {
    setImagePaletteModalOpen(false);
    setExtractedImagePalette([]);
    setImagePaletteTargetCount(3);
    setImagePaletteExcludedColors([]);
    setImagePaletteHoverState(null);
    setImagePaletteHoverColor("");
    imagePaletteHoverSampleVersion.current += 1;
    setExtractedPaletteAsset(null);
  }, []);

  const clearImagePalettePreviewHover = useCallback(() => {
    setImagePaletteHoverState(null);
    setImagePaletteHoverColor("");
    imagePaletteHoverSampleVersion.current += 1;
  }, []);

  const handleImagePalettePreviewSample = useCallback(
    async (event: { currentTarget: HTMLImageElement; clientX: number; clientY: number }) => {
      if (!extractedPaletteAsset || isExtractingImagePalette) return;
      const target = event.currentTarget;
      const bounds = target.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) return;

      const requestId = ++imagePaletteHoverSampleVersion.current;
      const color = await sampleColorFromImageAsset(extractedPaletteAsset.src, x, y, bounds.width, bounds.height);
      if (requestId !== imagePaletteHoverSampleVersion.current) return;

      setImagePaletteHoverState({ x, y, width: bounds.width, height: bounds.height });
      setImagePaletteHoverColor(color);
    },
    [extractedPaletteAsset, isExtractingImagePalette],
  );

  const openImagePaletteExtractor = useCallback(async () => {
    const selectedImageLayer = selectedLayers.find((layer) => layer.type === "image");
    if (!selectedImageLayer) {
      setStatus("Select an image layer before extracting a palette.");
      return;
    }
    const selectedAsset = assets.find((asset) => asset.key === selectedImageLayer.imageKey);
    if (!selectedAsset) {
      setStatus("Selected image source is not available.");
      return;
    }
    const sourceName = selectedImageLayer.name || selectedAsset.name;
    setImagePaletteTargetCount(3);
    setImagePaletteExcludedColors([]);
    setExtractedImagePalette([]);
    setImagePaletteHoverState(null);
    setImagePaletteHoverColor("");
    setExtractedPaletteAsset(selectedAsset);
    setExtractedPaletteSource(sourceName);
    setExtractedPaletteName("Image palette");
    const extracted = await extractImagePaletteFromAsset(selectedAsset, 3, []);
    if (extracted) {
      setExtractedPaletteName(`${sourceName} palette`);
    }
    setImagePaletteModalOpen(true);
  }, [assets, selectedLayers, extractImagePaletteFromAsset]);

  const registerExtractedPalette = useCallback(() => {
    if (extractedImagePalette.length === 0) {
      setStatus("No extracted palette is available.");
      return;
    }
    const colors = extractedImagePalette.filter((color) => color);
    const baseColor = colors[0];
    const mode: HarmonyMode = colors.length >= 5 ? "pentad" : colors.length >= 4 ? "tetrad" : "tricolor";
    const next = addSavedColorPalette(savedColorPalettes, {
      name: extractedPaletteName.trim() || "Image palette",
      baseColor,
      mode,
      colors,
    });
    if (next.length === savedColorPalettes.length) {
      setStatus("Palette was not saved because the base color is invalid.");
      return;
    }
    writeSavedColorPalettes(next);
    setSavedColorPalettes(next);
    closeImagePaletteModal();
    setStatus(`Saved ${colors.length} color palette "${next[0].name}".`);
  }, [closeImagePaletteModal, extractedImagePalette, extractedPaletteName, savedColorPalettes]);

  const handlePalettePrincipleDraftChange = useCallback((principle: PalettePrinciple) => {
    const nextMode = paletteModesByPrinciple[principle]?.[0];
    if (nextMode === undefined) return;
    setPalettePrincipleDraft(principle);
    setPaletteModeDraft(nextMode);
  }, []);

  const handlePaletteModeDraftChange = useCallback((mode: HarmonyMode) => {
    setPaletteModeDraft(mode);
    setPalettePrincipleDraft(getHarmonyPrinciple(mode));
  }, []);

  const deleteSavedColorPalette = useCallback(
    (id: string) => {
      const next = removeSavedColorPalette(savedColorPalettes, id);
      writeSavedColorPalettes(next);
      setSavedColorPalettes(next);
      setStatus("Saved palette removed.");
    },
    [savedColorPalettes],
  );

  const reorderSavedColorPalette = useCallback(
    (draggedId: string, targetId: string) => {
      const next = reorderById(savedColorPalettes, draggedId, targetId);
      if (next === savedColorPalettes) return;
      writeSavedColorPalettes(next);
      setSavedColorPalettes(next);
      setStatus("Saved palette order updated.");
    },
    [savedColorPalettes],
  );

  const deletePaletteColor = useCallback(
    (id: string) => {
      const next = removePaletteColor(paletteColors, id);
      writeColorPalette(next);
      setPaletteColors(next);
      setSelectedPaletteColorId((current) => (current === id ? null : current));
      setStatus("Palette color removed.");
    },
    [paletteColors],
  );

  const reorderPaletteColor = useCallback(
    (draggedId: string, targetId: string) => {
      const next = reorderById(paletteColors, draggedId, targetId);
      if (next === paletteColors) return;
      writeColorPalette(next);
      setPaletteColors(next);
      setStatus("Registered color order updated.");
    },
    [paletteColors],
  );

  const applyPaletteColor = useCallback(
    (color: string, target: PaletteTarget, alpha?: number) => {
      const normalizedDraft = normalizeColor(paletteDraft);
      setLayers((current) =>
        current.map((layer) => {
          if (!selectedIds.includes(layer.id) || !layer.selectable) return layer;
          if (layer.type === "text") {
            const palette = paletteColors.find((entry) => entry.value === color && entry.target === target);
            const opacity = alpha ?? palette?.alpha ?? (normalizedDraft === normalizeColor(color) ? paletteAlphaDraft : 1);
            return target === "fill" ? { ...layer, color, fillOpacity: opacity } : { ...layer, strokeColor: color, strokeOpacity: opacity };
          }
          if (layer.type === "shape") {
            const palette = paletteColors.find((entry) => entry.value === color && entry.target === target);
            const opacity = alpha ?? palette?.alpha ?? (normalizedDraft === normalizeColor(color) ? paletteAlphaDraft : 1);
            return target === "fill" ? { ...layer, fill: color, fillOpacity: opacity } : { ...layer, strokeColor: color, strokeOpacity: opacity };
          }
          return layer;
        }),
      );
      setStatus(target === "fill" ? "Applied palette color to fill/text." : "Applied palette color to stroke/outline.");
    },
    [paletteAlphaDraft, paletteColors, paletteDraft, selectedIds],
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
          historyStart: structuredClone(layers),
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
        const moveTargetIds =
          selectedIds.includes(picked.id) && selectedLayers.length > 1
            ? selectedLayers.map((layer) => layer.id)
            : selectLayerIdsForLayer(layers, [], picked.id);
        const moveTargetSet = new Set(moveTargetIds);
        const moveTargets = layers.filter((layer) => moveTargetSet.has(layer.id));
        setSelectedIds(moveTargets.map((layer) => layer.id));
        activeCanvasInteraction.current = {
          mode: "move",
          layers: moveTargets,
          start: point,
          historyStart: structuredClone(layers),
        };
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
        skipHistoryRecord.current = true;
        active.didTransform = true;
        setLayers((current) => {
          const next = current.map((layer) => nextById.get(layer.id) ?? layer);
          active.latestLayers = next;
          return next;
        });
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
    if (
      active.didTransform &&
      active.historyStart &&
      active.latestLayers &&
      !areLayerSnapshotsEqual(active.historyStart, active.latestLayers)
    ) {
      historyPast.current = [...historyPast.current.slice(-49), structuredClone(active.historyStart)];
      historyFuture.current = [];
      lastLayerSnapshot.current = structuredClone(active.latestLayers);
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
      setAutoFitRevision((current) => current + 1);
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

  const openObsPreview = useCallback(() => {
    if (obsWindowRef.current && !obsWindowRef.current.closed) {
      obsWindowRef.current.focus();
      setStatus("OBS preview window focused.");
      return;
    }

    const previewWindow = window.open(
      "",
      "thumbnail-generator-obs-preview",
      "popup=yes,width=1280,height=720,menubar=no,toolbar=no,location=no,status=no,scrollbars=no,resizable=yes",
    );
    if (!previewWindow) {
      setStatus("OBS preview could not open. Allow popups for this site and try again.");
      return;
    }

    obsWindowRef.current = previewWindow;
    (window as ObsPreviewHostWindow).__thumbnailObsPreviewRender = async (canvas, timeMs) => {
      const state = obsPreviewStateRef.current;
      await loadCustomFonts(state.customFonts, canvas.ownerDocument);
      await renderThumbnailToCanvas(canvas, state.layers, state.assets, state.settings, {
        drawSelection: false,
        previewPadding: 0,
        animationTimeMs: timeMs,
        sceneDurationMs: 4000,
      });
    };

    previewWindow.document.open();
    previewWindow.document.write(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>OBS Preview - Thumbnail Generator</title>
    <style>
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
        background: #000000;
      }
      body {
        display: grid;
        place-items: center;
      }
      canvas {
        display: block;
        max-width: 100vw;
        max-height: 100vh;
        object-fit: contain;
      }
    </style>
  </head>
  <body>
    <canvas id="obs-canvas" aria-label="OBS preview canvas"></canvas>
    <script>
      const canvas = document.getElementById("obs-canvas");
      const start = performance.now();
      let last = 0;
      async function frame(now) {
        if (now - last >= 33) {
          last = now;
          try {
            if (!window.opener || window.opener.closed || !window.opener.__thumbnailObsPreviewRender) {
              document.body.style.background = "#111827";
            } else {
              await window.opener.__thumbnailObsPreviewRender(canvas, now - start);
            }
          } catch (error) {
            console.error(error);
          }
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    </script>
  </body>
</html>`);
    previewWindow.document.close();
    try {
      previewWindow.moveTo(0, 0);
      previewWindow.resizeTo(window.screen.availWidth, window.screen.availHeight);
      void previewWindow.document.documentElement.requestFullscreen?.().catch(() => undefined);
    } catch {
      // Browser chrome/fullscreen behavior is controlled by the user's browser and OBS capture mode.
    }
    previewWindow.focus();
    setStatus("OBS preview window opened. Capture that window in OBS.");
  }, []);

  const handleExport = useCallback(
    async (format?: ExportFormat) => {
      const exportSettings = { ...settings, ...(format ? { format } : {}), quality: 1 };
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

  const imagePalettePreviewLensStyle = useMemo(() => {
    if (!imagePaletteHoverState || !extractedPaletteAsset) return null;
    const x = Math.max(0, Math.min(imagePaletteHoverState.x, imagePaletteHoverState.width));
    const y = Math.max(0, Math.min(imagePaletteHoverState.y, imagePaletteHoverState.height));
    const lensLeft = Math.max(0, Math.min(x - IMAGE_PALETTE_PREVIEW_LENS_SIZE / 2, imagePaletteHoverState.width - IMAGE_PALETTE_PREVIEW_LENS_SIZE));
    const lensTop = Math.max(0, Math.min(y - IMAGE_PALETTE_PREVIEW_LENS_SIZE / 2, imagePaletteHoverState.height - IMAGE_PALETTE_PREVIEW_LENS_SIZE));

    return {
      left: `${lensLeft}px`,
      top: `${lensTop}px`,
      backgroundImage: `url("${extractedPaletteAsset.src}")`,
      backgroundSize: `${Math.max(1, imagePaletteHoverState.width) * IMAGE_PALETTE_PREVIEW_LENS_SCALE}px ${
        Math.max(1, imagePaletteHoverState.height) * IMAGE_PALETTE_PREVIEW_LENS_SCALE
      }px`,
      backgroundPosition: `${-x * IMAGE_PALETTE_PREVIEW_LENS_SCALE + IMAGE_PALETTE_PREVIEW_LENS_SIZE / 2}px ${
        -y * IMAGE_PALETTE_PREVIEW_LENS_SCALE + IMAGE_PALETTE_PREVIEW_LENS_SIZE / 2
      }px`,
    };
  }, [extractedPaletteAsset, imagePaletteHoverState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isShortcutSuppressed(event.target)) return;
      const key = event.key.toLowerCase();
      const command = event.ctrlKey || event.metaKey;
      if (!command) return;

      if (key === "c") {
        event.preventDefault();
        copySelectedLayers();
      }
      if (key === "v") {
        event.preventDefault();
        pasteSelectedLayers();
      }
      if (key === "x") {
        event.preventDefault();
        cutSelectedLayers();
      }
      if (key === "d") {
        event.preventDefault();
        duplicateSelectedLayers();
      }
      if (key === "z") {
        event.preventDefault();
        if (event.shiftKey) redoLayers();
        else undoLayers();
      }
      if (key === "y") {
        event.preventDefault();
        redoLayers();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copySelectedLayers, cutSelectedLayers, duplicateSelectedLayers, pasteSelectedLayers, redoLayers, undoLayers]);

  return (
    <div className="app-shell" data-theme={effectiveTheme}>
      <TopToolbar
        language={language}
        themeMode={themeMode}
        onLanguageChange={setLanguage}
        onThemeChange={setThemeMode}
        t={t}
      />
      <main className="workspace" aria-label="Thumbnail editor workspace">
        <LeftPanel
          selectedAssetKey={selectedAssetKey}
          layerPanelProps={{
            layers,
            selectedIds,
            selectedAssetKey,
            onSelect: selectLayer,
            onSelectIndividual: selectIndividualLayer,
            onDelete: deleteLayer,
            onReorderLayer: reorderLayer,
            onToggleVisible: toggleLayerVisible,
            onToggleSelectable: toggleLayerSelectable,
            onAddText: addTextLayer,
            onAddShape: addShapeLayer,
            onAddLineLayer: addLineLayer,
            onAddQuickLayer: addQuickLayer,
            onAddImageAssetLayer: addImageLayerFromAsset,
            onAlignSelection: alignSelection,
            onCreateGroup: createLayerGroup,
            onRenameGroup: renameLayerGroup,
            onUngroup: ungroupLayerGroup,
          }}
          onImageFiles={handleImageFiles}
          onSelectAsset={setSelectedAssetKey}
          onAddImageAssetLayer={addImageLayerFromAsset}
          onDeleteAsset={deleteAsset}
              defaultTemplates={defaultTemplates}
              fontOptions={fontOptions}
              language={language}
              settings={settings}
              onLoadDefaultTemplate={loadDefaultTemplate}
              paletteColors={paletteColors}
              onGenerateScheduleTemplate={generateScheduleTemplate}
              savedColorPalettes={savedColorPalettes}
              templateName={templateName}
              templates={templates}
          onTemplateNameChange={setTemplateName}
          onSaveTemplate={saveCurrentTemplate}
          onLoadTemplate={loadTemplate}
          onDeleteTemplate={deleteTemplate}
          onOpenImageLab={(assetKey) => {
            if (assetKey) setSelectedAssetKey(assetKey);
            setIsImageLabOpen(true);
          }}
          assets={assets}
          t={t}
        />
        <CanvasStage
          canvasRef={canvasRef}
          settings={settings}
          selectedLayerName={selectionLabel}
          zoom={zoom}
          autoFitRevision={autoFitRevision}
          cursor={canvasCursor}
          previewPadding={previewPadding}
          isExporting={isExporting}
          autoSaveEnabled={autoSaveEnabled}
          savedEditStateUpdatedAt={savedEditStateUpdatedAt}
          onZoomChange={setZoom}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onExport={handleExport}
          onSettingsChange={updateSettings}
          onPresetChange={handlePresetChange}
          onAutoSaveChange={setAutoSaveEnabled}
          onSaveEditState={() => saveEditState("manual")}
          onRestoreEditState={restoreEditState}
          onExportEditState={exportEditState}
          onImportEditState={importEditState}
          onDeleteEditState={deleteEditState}
          onOpenObsPreview={openObsPreview}
          onClearSelection={() => {
            setSelectedIds([]);
            setHoverInteractionMode(null);
            setCanvasCursor("default");
            setStatus("Selection cleared.");
          }}
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
          paletteAlphaDraft={paletteAlphaDraft}
          paletteModeDraft={paletteModeDraft}
          palettePrincipleDraft={palettePrincipleDraft}
           selectedPaletteColorId={selectedPaletteColorId}
          savedColorPalettes={savedColorPalettes}
          fontOptions={fontOptions}
          onPaletteDraftChange={setPaletteDraft}
          onPaletteNameDraftChange={setPaletteNameDraft}
          onPaletteAlphaDraftChange={setPaletteAlphaDraft}
           onPaletteModeDraftChange={handlePaletteModeDraftChange}
           onPalettePrincipleDraftChange={handlePalettePrincipleDraftChange}
          onSelectPaletteColor={selectPaletteColor}
          onAddPaletteColor={addPaletteColor}
          onUpdatePaletteColor={saveSelectedPaletteColor}
          onDeletePaletteColor={deletePaletteColor}
          onSaveCurrentColorPalette={saveCurrentColorPalette}
          onDeleteSavedColorPalette={deleteSavedColorPalette}
          onReorderPaletteColor={reorderPaletteColor}
          onReorderSavedColorPalette={reorderSavedColorPalette}
          onApplyPaletteColor={applyPaletteColor}
          onSelect={selectLayer}
          onSelectIndividual={selectIndividualLayer}
          onUpdateLayer={updateLayer}
          onDelete={deleteLayer}
          onDuplicate={duplicateLayer}
          onMove={moveLayer}
          onReorderLayer={reorderLayer}
          onToggleVisible={toggleLayerVisible}
          onToggleSelectable={toggleLayerSelectable}
          selectedAssetKey={selectedAssetKey}
          onAddText={addTextLayer}
          onAddShape={addShapeLayer}
          onAddLineLayer={addLineLayer}
          onAddQuickLayer={addQuickLayer}
          onAddImageAssetLayer={addImageLayerFromAsset}
          onResetTemplate={resetTemplate}
          onOpenImageColorPalette={openImagePaletteExtractor}
          isExtractingImagePalette={isExtractingImagePalette}
          onAlignSelection={alignSelection}
          onTransformSelection={transformSelection}
          onMatchSelectionRotation={matchSelectionRotation}
          onCreateGroup={createLayerGroup}
          onRenameGroup={renameLayerGroup}
          onUngroup={ungroupLayerGroup}
          onFitSelectedToCanvas={fitSelectedLayersToCanvas}
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
            <ImageLabPanel
              assets={assets}
              initialAssetKey={selectedAssetKey}
              onCreateProcessedAsset={createProcessedAsset}
              onClose={() => setIsImageLabOpen(false)}
              t={t}
            />
          </section>
        </div>
      ) : null}
      {isImagePaletteModalOpen ? (
        <div
          className="modal-backdrop image-color-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeImagePaletteModal();
          }}
        >
          <section
            className="image-color-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-palette-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-block">
                <h2 id="image-palette-title">{t("inspector.imagePaletteFromImage")}</h2>
                <p>{t("inspector.imagePaletteSource", { source: extractedPaletteSource || "Selected image" })}</p>
                <p className="image-palette-beta-notice">{t("inspector.imagePaletteBetaNotice")}</p>
              </div>
            </div>
            <div className="field">
              <span>{t("inspector.paletteName")}</span>
              <input value={extractedPaletteName} onChange={(event) => setExtractedPaletteName(event.currentTarget.value)} />
            </div>
            <div className="field">
              <span>{t("inspector.imagePaletteColorCount")}</span>
              <select
                value={imagePaletteTargetCount}
                disabled={isExtractingImagePalette}
                onChange={(event) => setImagePaletteTargetCountAndRefresh(Number(event.currentTarget.value))}
              >
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            {extractedPaletteAsset ? (
              <>
                <label className="field image-palette-preview-field">
                  <span>{t("inspector.imagePaletteSourceImage")}</span>
                  <p className="image-palette-hint">{t("inspector.imagePaletteExcludeHint")}</p>
                  <div className="image-palette-preview-wrapper">
                    <img
                      src={extractedPaletteAsset.src}
                      alt={extractedPaletteAsset.name}
                      className="image-palette-preview"
                      onMouseEnter={handleImagePalettePreviewSample}
                      onMouseMove={handleImagePalettePreviewSample}
                      onMouseLeave={clearImagePalettePreviewHover}
                      onClick={async (event) => {
                        if (isExtractingImagePalette) return;
                        const target = event.currentTarget;
                        const bounds = target.getBoundingClientRect();
                        const x = event.clientX - bounds.left;
                        const y = event.clientY - bounds.top;
                        const color = await sampleColorFromImageAsset(extractedPaletteAsset.src, x, y, bounds.width, bounds.height);
                        await addImagePaletteExcludedColor(color);
                      }}
                    />
                    {imagePalettePreviewLensStyle ? (
                      <div className="image-palette-preview-lens" style={imagePalettePreviewLensStyle}>
                        <span className="image-palette-preview-lens-code">{imagePaletteHoverColor || "--"}</span>
                      </div>
                    ) : null}
                  </div>
                </label>
                <div className="field">
                  <span>{t("inspector.imagePaletteExcludedColors")}</span>
                  {imagePaletteExcludedColors.length > 0 ? (
                    <div className="image-palette-excluded-list">
                      {imagePaletteExcludedColors.map((color) => (
                        <div className="image-palette-excluded-item" key={color}>
                          <span className="image-palette-excluded-swatch" style={{ background: color }} />
                          <span>{color}</span>
                          <button type="button" className="image-palette-remove" onClick={() => removeImagePaletteExcludedColor(color)}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="image-palette-excluded-empty">{t("inspector.imagePaletteNoExcludedColors")}</p>
                  )}
                </div>
              </>
            ) : null}
            <div className="image-palette-candidate-list">
              {extractedImagePalette.length > 0 ? (
                extractedImagePalette.map((color, index) => (
                  <div className="image-palette-candidate" key={color + index}>
                    <span>
                      {getImagePaletteRoleLabel(index, t)}
                    </span>
                    <span className="image-palette-swatch" style={{ background: color }} title={color} />
                    <span className="image-palette-color-code">{color}</span>
                    <button
                      type="button"
                      className="image-palette-exclude-action"
                      onClick={() => addImagePaletteExcludedColor(color)}
                      disabled={imagePaletteExcludedColors.includes(color)}
                    >
                      {imagePaletteExcludedColors.includes(color) ? t("inspector.imagePaletteExcluded") : t("inspector.imagePaletteAddToExcluded")}
                    </button>
                  </div>
                ))
              ) : (
                <p>{t("inspector.imagePaletteNoColors")}</p>
              )}
            </div>
            <div className="confirm-actions">
              <button type="button" className="secondary-button" onClick={closeImagePaletteModal}>
                {t("inspector.cancel")}
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={extractedImagePalette.length === 0}
                onClick={registerExtractedPalette}
              >
                {t("inspector.imagePaletteRegister")}
              </button>
            </div>
          </section>
        </div>
      ) : null}
      <StatusBar status={status} settings={settings} zoom={zoom} layerCount={layers.length} warnings={qualityWarnings} t={t} />
    </div>
  );
}

function transformLayersFromPointer(active: ActiveCanvasInteraction, point: CanvasPoint): ThumbnailLayer[] {
  if (active.mode === "move") return active.layers.map((layer) => moveCanvasLayer(layer, active.start, point));
  if (!active.layer) return active.layers;
  if (active.mode === "rotate") return [rotateLayer(active.layer, active.start, point)];
  return [resizeLayer(active.layer, active.mode, point)];
}

function areLayerSnapshotsEqual(left: ThumbnailLayer[], right: ThumbnailLayer[]): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function reorderById<T extends { id: string }>(items: T[], draggedId: string, targetId: string): T[] {
  if (draggedId === targetId) return items;
  const draggedIndex = items.findIndex((item) => item.id === draggedId);
  if (draggedIndex < 0 || !items.some((item) => item.id === targetId)) return items;
  const next = [...items];
  const [dragged] = next.splice(draggedIndex, 1);
  const nextTargetIndex = next.findIndex((item) => item.id === targetId);
  next.splice(nextTargetIndex, 0, dragged);
  return next;
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

function makeQuantizedBucket(red: number, green: number, blue: number): number {
  return (red >> 3 << 10) | (green >> 3 << 5) | (blue >> 3);
}

function parseHexToRgb(value: string): { r: number; g: number; b: number } | null {
  const trimmed = value.trim().toLowerCase();
  const hex = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  if (!/^[0-9a-f]{3}$/.test(hex) && !/^[0-9a-f]{6}$/.test(hex)) return null;
  const expanded = hex.length === 3 ? `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}` : hex;
  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);
  if ([r, g, b].some((channel) => Number.isNaN(channel))) return null;
  return { r, g, b };
}

function createExcludedBuckets(excludedColors: string[]): Set<number> {
  const buckets = new Set<number>();
  for (const candidate of excludedColors) {
    const rgb = parseHexToRgb(candidate);
    if (!rgb) continue;
    buckets.add(makeQuantizedBucket(rgb.r, rgb.g, rgb.b));
  }
  return buckets;
}

async function extractPaletteFromImageSource(
  src: string,
  targetCount: number,
  excludedColors: string[] = [],
): Promise<string[]> {
  const image = await loadImageForPaletteExtraction(src);
  const maxDimension = 220;
  const baseWidth = image.naturalWidth || image.width;
  const baseHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, maxDimension / Math.max(baseWidth, baseHeight));
  const width = Math.max(1, Math.round(baseWidth * scale));
  const height = Math.max(1, Math.round(baseHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return [];
  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height).data;
  const buckets = new Map<number, { count: number; r: number; g: number; b: number }>();
  const excludedBuckets = createExcludedBuckets(excludedColors);
  const safeTargetCount = Math.min(5, Math.max(3, targetCount));

  for (let index = 0; index < imageData.length; index += 4) {
    const alpha = imageData[index + 3];
    if (alpha < 18) continue;
    const quantizedR = imageData[index] >> 3;
    const quantizedG = imageData[index + 1] >> 3;
    const quantizedB = imageData[index + 2] >> 3;
    const key = makeQuantizedBucket(imageData[index], imageData[index + 1], imageData[index + 2]);
    if (excludedBuckets.has(key)) continue;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.count += 1;
      continue;
    }
    buckets.set(key, {
      count: 1,
      r: quantizedR << 3,
      g: quantizedG << 3,
      b: quantizedB << 3,
    });
  }

  const sortedBuckets = [...buckets.values()].sort((a, b) => b.count - a.count);
  const picked: Array<{ color: string; r: number; g: number; b: number }> = [];
  const minDistance = 42;
  const maxDistance = minDistance ** 2;

  for (const bucket of sortedBuckets) {
    const hex = rgbToHex(bucket.r, bucket.g, bucket.b);
    if (picked.some((pickedColor) => squaredRgbDistance(pickedColor, bucket) < maxDistance)) continue;
    picked.push({ color: hex, r: bucket.r, g: bucket.g, b: bucket.b });
    if (picked.length >= safeTargetCount) break;
  }

  while (picked.length < Math.min(safeTargetCount, sortedBuckets.length)) {
    const fallback = sortedBuckets[picked.length];
    if (!fallback) break;
    picked.push({ color: rgbToHex(fallback.r, fallback.g, fallback.b), r: fallback.r, g: fallback.g, b: fallback.b });
  }

  return picked.map((entry) => entry.color);
}

async function sampleColorFromImageAsset(
  src: string,
  clickX: number,
  clickY: number,
  displayWidth: number,
  displayHeight: number,
): Promise<string> {
  const image = await loadImageForPaletteExtraction(src);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  if (!width || !height || !displayWidth || !displayHeight) return "";

  const sourceX = Math.min(Math.max(0, Math.floor((clickX / displayWidth) * width)), width - 1);
  const sourceY = Math.min(Math.max(0, Math.floor((clickY / displayHeight) * height)), height - 1);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return "";
  canvas.width = 1;
  canvas.height = 1;
  context.drawImage(image, -sourceX, -sourceY);
  const imageData = context.getImageData(0, 0, 1, 1).data;
  if (imageData[3] < 18) return "";
  return rgbToHex(imageData[0], imageData[1], imageData[2]);
}

function squaredRgbDistance(left: { r: number; g: number; b: number }, right: { r: number; g: number; b: number }): number {
  const deltaRed = left.r - right.r;
  const deltaGreen = left.g - right.g;
  const deltaBlue = left.b - right.b;
  return deltaRed * deltaRed + deltaGreen * deltaGreen + deltaBlue * deltaBlue;
}

function getImagePaletteRoleLabel(index: number, t: Translator): string {
  if (index === 0) return t("inspector.imagePaletteBase");
  if (index === 1) return t("inspector.imagePaletteSecondary");
  if (index === 2) return t("inspector.imagePaletteAccent");
  return `${t("inspector.imagePaletteColor")} ${index + 1}`;
}

function rgbToHex(red: number, green: number, blue: number): string {
  const normalizedRed = Math.min(255, Math.max(0, Math.round(red)));
  const normalizedGreen = Math.min(255, Math.max(0, Math.round(green)));
  const normalizedBlue = Math.min(255, Math.max(0, Math.round(blue)));
  return `#${normalizedRed.toString(16).padStart(2, "0")}${normalizedGreen.toString(16).padStart(2, "0")}${normalizedBlue
    .toString(16)
    .padStart(2, "0")}`;
}

function loadImageForPaletteExtraction(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image for palette extraction."));
    image.src = src;
  });
}

function downloadTextFile(text: string, filename: string, type: string): void {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
}

function isShortcutSuppressed(target: EventTarget | null): boolean {
  if (typeof document !== "undefined" && document.querySelector(".modal-backdrop")) return true;
  if (!(target instanceof HTMLElement)) return false;
  if (target.closest("input, textarea, select")) return true;
  return target.isContentEditable;
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

function formatSavedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default App;
