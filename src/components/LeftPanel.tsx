import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  GripHorizontal,
  ImagePlus,
  Layers,
  LayoutTemplate,
  Radio,
  Save,
  Scissors,
  Video,
  Trash2,
} from "lucide-react";
import { LayerPanel, type LayerPanelProps } from "./LayerPanel";
import {
  buildCreativeTemplate,
  createDefaultCreativeDraft,
  type CreativeGeneratorKind,
  type CreativeGeneratorRequest,
  type CreativeLayoutPattern,
} from "../lib/creativeGenerator";
import type { FontOption } from "../lib/fonts";
import type { Language, TranslationKey, Translator } from "../lib/i18n";
import { readGeneratorSettings, writeGeneratorSettings } from "../lib/generatorSettings";
import {
  addDays,
  buildScheduleTemplate,
  type ScheduleBuilderRequest,
} from "../lib/scheduleBuilder";
import { normalizeColor, type PaletteColor, type SavedColorPalette } from "../lib/colorPalette";
import {
  readUiBooleanPreference,
  readUiNumberPreference,
  writeUiBooleanPreference,
  writeUiNumberPreference,
} from "../lib/uiPreferences";
import type { SavedTemplate } from "../lib/templates";
import type { GroupObjectAsset, ImageAsset, OutputSettings, TextLayer } from "../lib/types";
import { renderThumbnailToCanvas } from "../lib/renderCanvas";

type LeftPanelSection = "templates" | "layers" | "assets";
export type QuickLayerKind = "headline" | "subtitle" | "badge" | "divider";

interface LeftPanelProps {
  isPlaybackLocked?: boolean;
  assets: ImageAsset[];
  selectedAssetKey: string;
  layerPanelProps: Omit<LayerPanelProps, "t">;
  templateName: string;
  templates: SavedTemplate[];
  fontOptions: FontOption[];
  settings: OutputSettings;
  language: Language;
  paletteColors: PaletteColor[];
  savedColorPalettes: SavedColorPalette[];
  groupObjects: GroupObjectAsset[];
  imageRegisteredTags: string[];
  groupObjectRegisteredTags: string[];
  templateRegisteredTags: string[];
  onImageFiles: (files: FileList | File[] | null, tags?: string[]) => void;
  onSelectAsset: (key: string) => void;
  onAddImageAssetLayer: (key: string) => void;
  onDeleteAsset: (key: string) => void;
  onUpdateAssetTags: (key: string, tags: string[]) => void;
  onAddGroupObject: (id: string) => void;
  onUpdateGroupObjectTags: (id: string, tags: string[]) => void;
  onDeleteGroupObject: (id: string) => void;
  onGenerateScheduleTemplate: (request: ScheduleBuilderRequest) => void;
  onGenerateCreativeTemplate: (request: CreativeGeneratorRequest) => void;
  onTemplateNameChange: (value: string) => void;
  onSaveTemplate: (tags?: string[]) => void;
  onLoadTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  onOpenImageLab: (assetKey?: string) => void;
  t: Translator;
}

export function LeftPanel({
  isPlaybackLocked = false,
  assets,
  selectedAssetKey,
  layerPanelProps,
  templateName,
  templates,
  fontOptions,
  settings,
  language,
  paletteColors,
  savedColorPalettes,
  groupObjects,
  imageRegisteredTags,
  groupObjectRegisteredTags,
  templateRegisteredTags,
  onImageFiles,
  onSelectAsset,
  onAddImageAssetLayer,
  onDeleteAsset,
  onUpdateAssetTags,
  onAddGroupObject,
  onUpdateGroupObjectTags,
  onDeleteGroupObject,
  onGenerateScheduleTemplate,
  onGenerateCreativeTemplate,
  onTemplateNameChange,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  onOpenImageLab,
  t,
}: LeftPanelProps) {
  const [activeSection, setActiveSection] = useState<LeftPanelSection>("templates");
  const [imageListHeight, setImageListHeight] = useState(() =>
    readUiNumberPreference("left.assets.imageListHeight", 260, { min: 120, max: 720 }),
  );
  const [groupObjectListHeight, setGroupObjectListHeight] = useState(() =>
    readUiNumberPreference("left.assets.groupObjectListHeight", 180, { min: 120, max: 720 }),
  );
  const [isImageSectionExpanded, setIsImageSectionExpanded] = useState(() =>
    readUiBooleanPreference("left.assets.imagesExpanded", true),
  );
  const [isGroupObjectSectionExpanded, setIsGroupObjectSectionExpanded] = useState(() =>
    readUiBooleanPreference("left.assets.groupObjectsExpanded", true),
  );
  const [pendingImageFiles, setPendingImageFiles] = useState<File[] | null>(null);
  const [imageAssetFilterTag, setImageAssetFilterTag] = useState("");
  const [groupObjectFilterTag, setGroupObjectFilterTag] = useState("");
  const [browserTemplateListHeight, setBrowserTemplateListHeight] = useState(() =>
    readUiNumberPreference("left.templates.browserTemplateListHeight", 220, { min: 120, max: 720 }),
  );
  const [templateApplyCandidate, setTemplateApplyCandidate] = useState<{ id: string; name: string } | null>(null);
  const [templateDeleteCandidate, setTemplateDeleteCandidate] = useState<{ id: string; name: string } | null>(null);
  const [templateTagDraft, setTemplateTagDraft] = useState("");
  const [templateFilterTag, setTemplateFilterTag] = useState("");
  const [isScheduleBuilderOpen, setIsScheduleBuilderOpen] = useState(false);
  const [activeCreativeBuilder, setActiveCreativeBuilder] = useState<CreativeGeneratorKind | null>(null);
  const [scheduleDraft, setScheduleDraft] = useState<ScheduleBuilderRequest>(() =>
    readGeneratorSettings("schedule", createDefaultScheduleDraft()),
  );
  const [creativeDrafts, setCreativeDrafts] = useState<Record<CreativeGeneratorKind, CreativeGeneratorRequest>>(() => ({
    "standard-thumbnail": readGeneratorSettings("creative.standard-thumbnail", createDefaultCreativeDraft("standard-thumbnail")),
    "vertical-thumbnail": readGeneratorSettings("creative.vertical-thumbnail", createDefaultCreativeDraft("vertical-thumbnail")),
    "stream-waiting": readGeneratorSettings("creative.stream-waiting", createDefaultCreativeDraft("stream-waiting")),
  }));

  const updateCreativeDraft = (kind: CreativeGeneratorKind, draft: CreativeGeneratorRequest) => {
    setCreativeDrafts((current) => ({ ...current, [kind]: draft }));
  };

  const saveScheduleDraft = () => writeGeneratorSettings("schedule", scheduleDraft);
  const saveCreativeDraft = (kind: CreativeGeneratorKind, draft = creativeDrafts[kind]) =>
    writeGeneratorSettings(`creative.${kind}`, draft);
  const visibleAssets = useMemo(
    () => (imageAssetFilterTag ? assets.filter((asset) => asset.tags?.includes(imageAssetFilterTag)) : assets),
    [imageAssetFilterTag, assets],
  );
  const visibleGroupObjects = useMemo(
    () => (groupObjectFilterTag ? groupObjects.filter((groupObject) => groupObject.tags.includes(groupObjectFilterTag)) : groupObjects),
    [groupObjectFilterTag, groupObjects],
  );
  const visibleTemplates = useMemo(
    () => (templateFilterTag ? templates.filter((template) => template.tags?.includes(templateFilterTag)) : templates),
    [templateFilterTag, templates],
  );

  useEffect(() => {
    writeUiNumberPreference("left.assets.imageListHeight", imageListHeight);
  }, [imageListHeight]);

  useEffect(() => {
    writeUiNumberPreference("left.assets.groupObjectListHeight", groupObjectListHeight);
  }, [groupObjectListHeight]);

  useEffect(() => {
    writeUiBooleanPreference("left.assets.imagesExpanded", isImageSectionExpanded);
  }, [isImageSectionExpanded]);

  useEffect(() => {
    writeUiBooleanPreference("left.assets.groupObjectsExpanded", isGroupObjectSectionExpanded);
  }, [isGroupObjectSectionExpanded]);

  useEffect(() => {
    writeUiNumberPreference("left.templates.browserTemplateListHeight", browserTemplateListHeight);
  }, [browserTemplateListHeight]);

  return (
    <aside
      className={`side-panel left-panel ${isPlaybackLocked ? "playback-disabled-panel" : ""}`}
      aria-label={t("left.aria")}
      aria-disabled={isPlaybackLocked}
      onPointerDownCapture={(event) => {
        if (!isPlaybackLocked) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      onClickCapture={(event) => {
        if (!isPlaybackLocked) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      onKeyDownCapture={(event) => {
        if (!isPlaybackLocked) return;
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div className="panel-tabs source-tabs" role="tablist" aria-label={t("left.tabs")}>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "templates"}
          className={activeSection === "templates" ? "selected" : ""}
          onClick={() => setActiveSection("templates")}
        >
          <Save size={15} /> {t("left.templates")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "layers"}
          className={activeSection === "layers" ? "selected" : ""}
          onClick={() => setActiveSection("layers")}
        >
          <Layers size={15} /> {t("inspector.layers")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "assets"}
          className={activeSection === "assets" ? "selected" : ""}
          onClick={() => setActiveSection("assets")}
        >
          <ImagePlus size={15} /> {t("left.assets")}
        </button>
      </div>

      <div className="side-panel-body">
        {activeSection === "assets" ? (
          <>
          <section className="panel-section asset-image-section">
            <button
              type="button"
              className="collapsible-heading"
              aria-expanded={isImageSectionExpanded}
              onClick={() => setIsImageSectionExpanded((current) => !current)}
            >
              {isImageSectionExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>{t("left.images")}</span>
              <span className="section-count">{assets.length}</span>
            </button>
            {isImageSectionExpanded ? (
              <>
                <div className="asset-import-grid">
                  <label className="file-drop compact-drop">
                    <ImagePlus size={18} />
                    <span>{t("left.importImages")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => {
                        setPendingImageFiles(Array.from(event.currentTarget.files ?? []));
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                  <label className="file-drop compact-drop">
                    <FolderOpen size={18} />
                    <span>{t("left.importImageFolder")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      {...{ webkitdirectory: "" }}
                      onChange={(event) => {
                        setPendingImageFiles(Array.from(event.currentTarget.files ?? []));
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>
                <label className="field">
                  <span>{t("left.assetTagFilter")}</span>
                  <select value={imageAssetFilterTag} onChange={(event) => setImageAssetFilterTag(event.currentTarget.value)}>
                    <option value="">{t("left.templateTagAll")}</option>
                    {imageRegisteredTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="asset-list" aria-label={t("left.assetsList")} style={{ height: imageListHeight }}>
                  {visibleAssets.length === 0 ? (
                    <p className="empty-note">{t("left.noAssets")}</p>
                  ) : (
                    visibleAssets.map((asset) => (
                      <div className={`asset-row ${asset.key === selectedAssetKey ? "selected" : ""}`} key={asset.key}>
                        <button type="button" className="asset-select" onClick={() => onSelectAsset(asset.key)}>
                          <img src={asset.src} alt="" />
                          <span>{asset.name}</span>
                        </button>
                        <button
                          type="button"
                          className="mini-icon-button"
                          title={t("left.addAssetLayer")}
                          onClick={() => onAddImageAssetLayer(asset.key)}
                        >
                          <ImagePlus size={14} />
                        </button>
                        <button
                          type="button"
                          className="mini-icon-button"
                          title={t("left.openAssetInImageLab")}
                          onClick={() => {
                            onSelectAsset(asset.key);
                            onOpenImageLab(asset.key);
                          }}
                        >
                          <Scissors size={14} />
                        </button>
                        <button
                          type="button"
                          className="mini-icon-button danger"
                          title={t("left.deleteAsset", { name: asset.name })}
                          onClick={() => onDeleteAsset(asset.key)}
                        >
                          <Trash2 size={14} />
                        </button>
                        <TagEditor
                          tags={asset.tags ?? []}
                          suggestions={imageRegisteredTags}
                          datalistId={`asset-tag-options-${asset.key}`}
                          onChange={(tags) => onUpdateAssetTags(asset.key, tags)}
                          t={t}
                        />
                      </div>
                    ))
                  )}
                </div>
                <TemplateResizeHandle
                  label={t("left.resizeAssets")}
                  onResize={(delta) => setImageListHeight((height) => clampTemplateListHeight(height + delta))}
                />
              </>
            ) : null}
          </section>
          <section className="panel-section group-object-section">
            <button
              type="button"
              className="collapsible-heading"
              aria-expanded={isGroupObjectSectionExpanded}
              onClick={() => setIsGroupObjectSectionExpanded((current) => !current)}
            >
              {isGroupObjectSectionExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>{t("left.groupObjects")}</span>
              <span className="section-count">{groupObjects.length}</span>
            </button>
            {isGroupObjectSectionExpanded ? (
              <>
                <label className="field">
                  <span>{t("left.groupObjectTagFilter")}</span>
                  <select value={groupObjectFilterTag} onChange={(event) => setGroupObjectFilterTag(event.currentTarget.value)}>
                    <option value="">{t("left.templateTagAll")}</option>
                    {groupObjectRegisteredTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="group-object-list" aria-label={t("left.groupObjects")} style={{ height: groupObjectListHeight }}>
                  {visibleGroupObjects.length === 0 ? (
                    <p className="empty-note">{t("left.noGroupObjects")}</p>
                  ) : (
                    visibleGroupObjects.map((groupObject) => (
                      <div className="group-object-row" key={groupObject.id}>
                        <button type="button" className="template-load" onClick={() => onAddGroupObject(groupObject.id)}>
                          <Layers size={15} />
                          <span>
                            <span>{groupObject.name}</span>
                            {groupObject.tags[0] ? <small className="template-tag-pill">{groupObject.tags[0]}</small> : null}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="icon-button danger"
                          title={t("left.deleteGroupObject", { name: groupObject.name })}
                          onClick={() => onDeleteGroupObject(groupObject.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                        <TagEditor
                          tags={groupObject.tags ?? []}
                          suggestions={groupObjectRegisteredTags}
                          datalistId={`group-object-tag-options-${groupObject.id}`}
                          onChange={(tags) => onUpdateGroupObjectTags(groupObject.id, tags)}
                          t={t}
                        />
                      </div>
                    ))
                  )}
                </div>
                <TemplateResizeHandle
                  label={t("left.resizeGroupObjects")}
                  onResize={(delta) => setGroupObjectListHeight((height) => clampTemplateListHeight(height + delta))}
                />
              </>
            ) : null}
          </section>
          </>
        ) : null}

        {activeSection === "layers" ? <LayerPanel {...layerPanelProps} t={t} /> : null}

        {activeSection === "templates" ? (
          <>
          <section className="panel-section generator-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("generator.sectionTitle")}</h2>
              <span className="section-count">4</span>
            </div>
            <div className="generator-entry-grid">
              <button type="button" className="generator-entry-button" onClick={() => setIsScheduleBuilderOpen(true)}>
                <CalendarDays size={17} />
                <span>
                  <strong>{t("scheduleBuilder.open")}</strong>
                  <small>{t("scheduleBuilder.entryCopy")}</small>
                </span>
              </button>
              <button type="button" className="generator-entry-button" onClick={() => setActiveCreativeBuilder("standard-thumbnail")}>
                <Video size={17} />
                <span>
                  <strong>{t("generator.standardThumbnail.open")}</strong>
                  <small>{t("generator.standardThumbnail.copy")}</small>
                </span>
              </button>
              <button type="button" className="generator-entry-button" onClick={() => setActiveCreativeBuilder("vertical-thumbnail")}>
                <Video size={17} />
                <span>
                  <strong>{t("generator.verticalThumbnail.open")}</strong>
                  <small>{t("generator.verticalThumbnail.copy")}</small>
                </span>
              </button>
              <button type="button" className="generator-entry-button" onClick={() => setActiveCreativeBuilder("stream-waiting")}>
                <Radio size={17} />
                <span>
                  <strong>{t("generator.streamWaiting.open")}</strong>
                  <small>{t("generator.streamWaiting.copy")}</small>
                </span>
              </button>
            </div>
          </section>

          <section className="panel-section template-section">
            <div className="section-heading">
              <Save size={16} />
              <h2>{t("left.browserTemplates")}</h2>
              <span className="section-count">{templates.length}</span>
            </div>
            <label className="field">
              <span>{t("left.templateName")}</span>
              <input
                type="text"
                value={templateName}
                onChange={(event) => onTemplateNameChange(event.currentTarget.value)}
              />
            </label>
            <label className="field">
              <span>{t("left.templateTag")}</span>
              <input
                type="text"
                list="browser-template-tag-options"
                value={templateTagDraft}
                onChange={(event) => setTemplateTagDraft(event.currentTarget.value)}
              />
              <datalist id="browser-template-tag-options">
                {templateRegisteredTags.map((tag) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            </label>
            <button
              type="button"
              className="primary-button icon-text wide-button"
              onClick={() => onSaveTemplate(templateTagDraft.trim() ? [templateTagDraft] : [])}
            >
              <Save size={16} /> {t("left.saveTemplate")}
            </button>
            <label className="field">
              <span>{t("left.templateTagFilter")}</span>
              <select value={templateFilterTag} onChange={(event) => setTemplateFilterTag(event.currentTarget.value)}>
                <option value="">{t("left.templateTagAll")}</option>
                {templateRegisteredTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>
            <div className="template-list" aria-label={t("left.savedTemplates")} style={{ height: browserTemplateListHeight }}>
              {visibleTemplates.length === 0 ? (
                <p className="empty-note">{t("left.noTemplates")}</p>
              ) : (
                visibleTemplates.map((template) => (
                  <div className="template-row" key={template.id}>
                    <button
                      type="button"
                      className="template-load"
                      onClick={() => setTemplateApplyCandidate({ id: template.id, name: template.name })}
                    >
                      <FolderOpen size={15} />
                      <span>
                        <span>{template.name}</span>
                        {template.tags?.[0] ? <small className="template-tag-pill">{template.tags[0]}</small> : null}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="icon-button danger"
                      title={t("left.deleteTemplate", { name: template.name })}
                      onClick={(event) => {
                        if (event.ctrlKey || event.metaKey) {
                          onDeleteTemplate(template.id);
                          return;
                        }
                        setTemplateDeleteCandidate({ id: template.id, name: template.name });
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <TemplateResizeHandle
              label={t("left.resizeBrowserTemplates")}
              onResize={(delta) => setBrowserTemplateListHeight((height) => clampTemplateListHeight(height + delta))}
            />
          </section>

          </>
        ) : null}

        {templateApplyCandidate ? (
          <ConfirmTemplateDialog
            title={t("left.applyTemplateQuestion")}
            copy={t("left.applyTemplateCopy", { name: templateApplyCandidate.name })}
            confirmLabel={t("left.applyTemplate")}
            confirmClassName="primary-button"
            onCancel={() => setTemplateApplyCandidate(null)}
            onConfirm={() => {
              onLoadTemplate(templateApplyCandidate.id);
              setTemplateApplyCandidate(null);
            }}
            t={t}
          />
        ) : null}
        {templateDeleteCandidate ? (
          <ConfirmTemplateDialog
            title={t("left.deleteTemplateQuestion")}
            copy={t("left.deleteTemplateCopy", { name: templateDeleteCandidate.name })}
            confirmLabel={t("inspector.delete")}
            confirmClassName="primary-button danger-button"
            onCancel={() => setTemplateDeleteCandidate(null)}
            onConfirm={() => {
              onDeleteTemplate(templateDeleteCandidate.id);
              setTemplateDeleteCandidate(null);
            }}
            t={t}
          />
        ) : null}
        {pendingImageFiles ? (
          <ImportImageTagDialog
            files={pendingImageFiles}
            suggestions={imageRegisteredTags}
            onCancel={() => setPendingImageFiles(null)}
            onConfirm={(tags) => {
              onImageFiles(pendingImageFiles, tags);
              setPendingImageFiles(null);
            }}
            t={t}
          />
        ) : null}
        {isScheduleBuilderOpen ? (
          <ScheduleBuilderDialog
            draft={scheduleDraft}
            fontOptions={fontOptions}
            settings={settings}
            language={language}
            paletteColors={paletteColors}
            savedColorPalettes={savedColorPalettes}
            onDraftChange={setScheduleDraft}
            onSaveSettings={saveScheduleDraft}
            onCancel={() => setIsScheduleBuilderOpen(false)}
            onConfirm={() => {
              saveScheduleDraft();
              onGenerateScheduleTemplate(scheduleDraft);
              setIsScheduleBuilderOpen(false);
            }}
            t={t}
          />
        ) : null}
        {activeCreativeBuilder ? (
          <CreativeBuilderDialog
            draft={creativeDrafts[activeCreativeBuilder]}
            fontOptions={fontOptions}
            settings={settings}
            paletteColors={paletteColors}
            savedColorPalettes={savedColorPalettes}
            onDraftChange={(draft) => updateCreativeDraft(activeCreativeBuilder, draft)}
            onSaveSettings={() => saveCreativeDraft(activeCreativeBuilder)}
            onCancel={() => setActiveCreativeBuilder(null)}
            onConfirm={() => {
              saveCreativeDraft(activeCreativeBuilder);
              onGenerateCreativeTemplate(creativeDrafts[activeCreativeBuilder]);
              setActiveCreativeBuilder(null);
            }}
            t={t}
          />
        ) : null}
      </div>
    </aside>
  );
}

function ImportImageTagDialog({
  files,
  suggestions,
  onCancel,
  onConfirm,
  t,
}: {
  files: File[];
  suggestions: string[];
  onCancel: () => void;
  onConfirm: (tags: string[]) => void;
  t: Translator;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="confirm-dialog import-tag-dialog" role="dialog" aria-modal="true" aria-labelledby="import-tag-title">
        <div className="modal-title-block">
          <h2 id="import-tag-title">{t("left.importTagsTitle")}</h2>
          <p>{t("left.importTagsCopy", { count: files.length })}</p>
        </div>
        <TagEditor
          tags={tags}
          suggestions={suggestions}
          datalistId="pending-image-tag-options"
          onChange={setTags}
          onDraftChange={setDraft}
          t={t}
        />
        <div className="confirm-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {t("inspector.cancel")}
          </button>
          <button type="button" className="primary-button" onClick={() => onConfirm(dedupeTags([...tags, ...splitTagDraft(draft)]))}>
            {t("left.registerAssets")}
          </button>
        </div>
      </section>
    </div>
  );
}

function TagEditor({
  tags,
  suggestions,
  datalistId,
  onChange,
  onDraftChange,
  t,
}: {
  tags: string[];
  suggestions: string[];
  datalistId: string;
  onChange: (tags: string[]) => void;
  onDraftChange?: (draft: string) => void;
  t: Translator;
}) {
  const [draft, setDraft] = useState("");
  const updateDraft = (value: string) => {
    setDraft(value);
    onDraftChange?.(value);
  };
  const addDraftTags = () => {
    const nextTags = [...tags, ...splitTagDraft(draft)];
    onChange(dedupeTags(nextTags));
    updateDraft("");
  };
  return (
    <div className="tag-editor">
      <div className="tag-chip-row">
        {tags.length === 0 ? <span className="tag-empty">{t("left.noTags")}</span> : null}
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="tag-chip"
            title={t("left.removeTag", { tag })}
            onClick={() => onChange(tags.filter((candidate) => candidate !== tag))}
          >
            {tag}
            <span aria-hidden="true">x</span>
          </button>
        ))}
      </div>
      <div className="tag-input-row">
        <input
          type="text"
          list={datalistId}
          value={draft}
          placeholder={t("left.tagPlaceholder")}
          onChange={(event) => updateDraft(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addDraftTags();
            }
          }}
        />
        <button type="button" className="secondary-button" onClick={addDraftTags} disabled={splitTagDraft(draft).length === 0}>
          {t("left.addTag")}
        </button>
        <datalist id={datalistId}>
          {suggestions.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
      </div>
    </div>
  );
}

function TemplateResizeHandle({ label, onResize }: { label: string; onResize: (deltaY: number) => void }) {
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

function clampTemplateListHeight(value: number): number {
  return Math.min(720, Math.max(120, Math.round(value)));
}

function splitTagDraft(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim().replace(/\s+/g, " "))
    .filter(Boolean);
}

function dedupeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const key = tag.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(tag);
  }
  return result.slice(0, 8);
}

function createDefaultScheduleDraft(): ScheduleBuilderRequest {
  const now = new Date();
  return {
    kind: "week",
    orientation: "portrait",
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    weekStartsOn: "sunday",
    weekdayLanguage: "en",
    dateFormat: "month-day",
    title: "",
    fontFamily: "'Noto Sans JP', 'Yu Gothic', 'Meiryo', Arial, sans-serif",
    fontWeight: "800",
    fontSize: 56,
    titleFontSize: 56,
    weekdayFontSize: 22,
    dateFontSize: 30,
    eventFontSize: 18,
    gridStyle: "cards",
    backgroundColor: "#f7fafc",
    surfaceColor: "#ffffff",
    accentColor: "#10b6d7",
    textColor: "#152033",
    cornerRadius: 8,
    strokeWidth: 3,
    dailyCircleSize: 100,
    actionCountMode: "uniform",
    actionsPerDay: 1,
    dailyActionCounts: [1, 1, 1, 1, 1, 1, 1],
    dailyPeriodLabels: ["AM", "PM"],
    dailyTimeLabels: ["09:00", "14:00"],
    dailyEndTimeLabels: ["11:00", "16:00"],
    dailyEventLabels: ["Morning work", "Collaboration"],
    dailyShowEventLabels: [true, true],
    showTimeLabels: true,
    showAdjacentDays: false,
    groupLayers: true,
    weekendColorMode: "default",
    showBadge: true,
  };
}

function ScheduleBuilderDialog({
  draft,
  fontOptions,
  settings,
  language,
  paletteColors,
  savedColorPalettes,
  onDraftChange,
  onSaveSettings,
  onCancel,
  onConfirm,
  t,
}: {
  draft: ScheduleBuilderRequest;
  fontOptions: FontOption[];
  settings: OutputSettings;
  language: Language;
  paletteColors: PaletteColor[];
  savedColorPalettes: SavedColorPalette[];
  onDraftChange: (draft: ScheduleBuilderRequest) => void;
  onSaveSettings: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  t: Translator;
}) {
  type ScheduleColorTarget = "backgroundColor" | "surfaceColor" | "accentColor" | "textColor";
  const [activeColorTarget, setActiveColorTarget] = useState<ScheduleColorTarget | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const updateDraft = (next: ScheduleBuilderRequest) => {
    onDraftChange(next);
    setSettingsSaved(false);
  };
  const setDraft = <Key extends keyof ScheduleBuilderRequest>(key: Key, value: ScheduleBuilderRequest[Key]) => {
    updateDraft({ ...draft, [key]: value });
  };
  const isMonthSchedule = draft.kind === "month";
  const isWeekSchedule = draft.kind === "week";
  const isDaySchedule = draft.kind === "day";

  const colorTargets = [
    { key: "backgroundColor" as const, label: t("scheduleBuilder.backgroundColor"), value: draft.backgroundColor },
    { key: "surfaceColor" as const, label: t("scheduleBuilder.surfaceColor"), value: draft.surfaceColor },
    { key: "accentColor" as const, label: t("scheduleBuilder.accentColor"), value: draft.accentColor },
    { key: "textColor" as const, label: t("scheduleBuilder.textColor"), value: draft.textColor },
  ];

  const activeTargetMeta = activeColorTarget ? colorTargets.find((target) => target.key === activeColorTarget) : null;

  const updateMonthValue = (value: string) => {
    const [year, month] = value.split("-").map((part) => Number.parseInt(part, 10));
    if (Number.isFinite(year) && Number.isFinite(month)) updateDraft({ ...draft, year, month });
  };
  const updateDateValue = (value: string) => {
    const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10));
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) updateDraft({ ...draft, year, month, day });
  };
  const updateDailyActionCount = (index: number, value: string) => {
    const nextCounts = normalizeDailyCounts(draft).map((count, countIndex) =>
      countIndex === index ? Number.parseInt(value, 10) || 0 : count,
    );
    updateDraft({ ...draft, dailyActionCounts: nextCounts });
  };
  const updateDailyString = (key: "dailyPeriodLabels" | "dailyTimeLabels" | "dailyEndTimeLabels" | "dailyEventLabels", index: number, value: string) => {
    const fallback =
      key === "dailyPeriodLabels"
        ? ["AM", "PM"]
        : key === "dailyTimeLabels"
          ? ["09:00", "14:00"]
          : key === "dailyEndTimeLabels"
            ? ["11:00", "16:00"]
            : ["Morning work", "Collaboration"];
    const nextValues = Array.from({ length: 2 }, (_, valueIndex) => draft[key]?.[valueIndex] ?? fallback[valueIndex]);
    nextValues[index] = value;
    updateDraft({ ...draft, [key]: nextValues });
  };
  const updateDailyEventVisibility = (index: number, value: boolean) => {
    const nextValues = Array.from({ length: 2 }, (_, valueIndex) => draft.dailyShowEventLabels?.[valueIndex] ?? true);
    nextValues[index] = value;
    updateDraft({ ...draft, dailyShowEventLabels: nextValues });
  };
  const previewTemplate = useMemo(() => buildScheduleTemplate(draft, settings, language), [draft, language, settings]);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    renderThumbnailToCanvas(canvas, previewTemplate.layers, [], previewTemplate.settings, { drawSelection: false }).catch(() => {});
  }, [previewTemplate]);

  const previewTitle = useMemo(() => {
    const titleLayer = previewTemplate.layers.find(
      (layer): layer is TextLayer =>
        layer.type === "text" && layer.name === "Schedule title",
    );
    return titleLayer?.text ?? "";
  }, [previewTemplate]);
  const previewShellStyle = {
    aspectRatio: `${previewTemplate.settings.width} / ${previewTemplate.settings.height}`,
    "--preview-ratio": String(previewTemplate.settings.width / previewTemplate.settings.height),
  } as CSSProperties;
  const isPortraitPreview = previewTemplate.settings.height > previewTemplate.settings.width;

  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section
        className={`schedule-builder-dialog ${isPortraitPreview ? "portrait-builder-dialog" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-builder-title"
        style={previewShellStyle}
      >
        <div className="modal-header">
          <div className="modal-title-block">
            <h2 id="schedule-builder-title">{t("scheduleBuilder.title")}</h2>
            <p>{t("scheduleBuilder.betaNotice")}</p>
          </div>
        </div>

        <div className="schedule-builder-grid">
          <section className="panel-section">
            <div className="section-heading">
              <CalendarDays size={16} />
              <h2>{t("scheduleBuilder.dateSection")}</h2>
            </div>
            <div className="field-grid two">
              <label className="field">
                <span>{t("scheduleBuilder.kind")}</span>
                <select value={draft.kind} onChange={(event) => setDraft("kind", event.currentTarget.value as ScheduleBuilderRequest["kind"])}>
                  <option value="month">{t("scheduleBuilder.kind.month")}</option>
                  <option value="week">{t("scheduleBuilder.kind.week")}</option>
                  <option value="day">{t("scheduleBuilder.kind.day")}</option>
                </select>
              </label>
              <label className="field">
                <span>{t("scheduleBuilder.orientation")}</span>
                <select
                  value={draft.orientation}
                  onChange={(event) => setDraft("orientation", event.currentTarget.value as ScheduleBuilderRequest["orientation"])}
                >
                  <option value="landscape">{t("scheduleBuilder.orientation.landscape")}</option>
                  <option value="portrait">{t("scheduleBuilder.orientation.portrait")}</option>
                  <option value="current">{t("scheduleBuilder.orientation.current")}</option>
                </select>
              </label>
            </div>
            <div className="field-grid two">
              <label className="field">
                <span>{draft.kind === "month" ? t("scheduleBuilder.monthPicker") : t("scheduleBuilder.datePicker")}</span>
                <input
                  type={draft.kind === "month" ? "month" : "date"}
                  value={draft.kind === "month" ? formatMonthInputValue(draft) : formatDateInputValue(draft)}
                  onChange={(event) => (draft.kind === "month" ? updateMonthValue(event.currentTarget.value) : updateDateValue(event.currentTarget.value))}
                />
              </label>
              <label className="field">
                <span>{t("scheduleBuilder.weekdayLanguage")}</span>
                <select
                  value={draft.weekdayLanguage}
                  onChange={(event) => setDraft("weekdayLanguage", event.currentTarget.value as ScheduleBuilderRequest["weekdayLanguage"])}
                >
                  <option value="en">{t("scheduleBuilder.weekdayLanguage.en")}</option>
                  <option value="ja">{t("scheduleBuilder.weekdayLanguage.ja")}</option>
                </select>
              </label>
            </div>
            <div className="field-grid two">
              <label className={`field ${isDaySchedule ? "field-disabled" : ""}`}>
                <span>{t("scheduleBuilder.weekStartsOn")}</span>
                <select
                  value={draft.weekStartsOn}
                  disabled={isDaySchedule}
                  onChange={(event) => setDraft("weekStartsOn", event.currentTarget.value as ScheduleBuilderRequest["weekStartsOn"])}
                >
                  <option value="sunday">{t("scheduleBuilder.weekStartsOn.sunday")}</option>
                  <option value="monday">{t("scheduleBuilder.weekStartsOn.monday")}</option>
                </select>
              </label>
              <label className="field">
                <span>{t("scheduleBuilder.dateFormat")}</span>
                <select value={draft.dateFormat} onChange={(event) => setDraft("dateFormat", event.currentTarget.value as ScheduleBuilderRequest["dateFormat"])}>
                  <option value="day">{t("scheduleBuilder.dateFormat.day")}</option>
                  <option value="month-day">{t("scheduleBuilder.dateFormat.monthDay")}</option>
                </select>
              </label>
            </div>
            <label className="field">
              <span>{t("scheduleBuilder.weekendColorMode")}</span>
              <select
                value={draft.weekendColorMode}
                onChange={(event) => setDraft("weekendColorMode", event.currentTarget.value as ScheduleBuilderRequest["weekendColorMode"])}
              >
                <option value="default">{t("scheduleBuilder.weekendColorMode.default")}</option>
                <option value="grayscale">{t("scheduleBuilder.weekendColorMode.grayscale")}</option>
                <option value="sundaySaturday">{t("scheduleBuilder.weekendColorMode.sundaySaturday")}</option>
              </select>
            </label>
            <label className={`field checkbox-field ${isWeekSchedule || isDaySchedule ? "field-disabled" : ""}`}>
              <input
                type="checkbox"
                checked={isWeekSchedule || isDaySchedule ? false : draft.showAdjacentDays}
                disabled={isWeekSchedule || isDaySchedule}
                onChange={(event) => setDraft("showAdjacentDays", event.currentTarget.checked)}
              />
              <span>{t("scheduleBuilder.showAdjacentDays")}</span>
            </label>
            <label className={`field checkbox-field ${draft.kind === "week" ? "field-disabled" : ""}`}>
              <input
                type="checkbox"
                checked={draft.kind === "week" ? false : draft.showBadge}
                disabled={draft.kind === "week"}
                onChange={(event) => setDraft("showBadge", event.currentTarget.checked)}
              />
              <span>{t("scheduleBuilder.showBadge")}</span>
            </label>
            <label className="field checkbox-field">
              <input type="checkbox" checked={draft.groupLayers} onChange={(event) => setDraft("groupLayers", event.currentTarget.checked)} />
              <span>{t("scheduleBuilder.groupLayers")}</span>
            </label>
          </section>

          <section className="panel-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("scheduleBuilder.styleSection")}</h2>
            </div>
            <label className="field">
              <span>{t("scheduleBuilder.titleLabel")}</span>
              <input type="text" value={draft.title} placeholder={t("scheduleBuilder.titlePlaceholder")} onChange={(event) => setDraft("title", event.currentTarget.value)} />
            </label>
            <div className="field-grid schedule-font-row">
              <label className="field schedule-font-family-field">
                <span>{t("scheduleBuilder.fontFamily")}</span>
                <select value={draft.fontFamily} onChange={(event) => setDraft("fontFamily", event.currentTarget.value)}>
                  {!fontOptions.some((option) => option.value === draft.fontFamily) ? (
                    <option value={draft.fontFamily}>{draft.fontFamily}</option>
                  ) : null}
                  {fontOptions.map((option, index) => (
                    <option key={`${option.value}-${index}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field schedule-font-weight-field">
                <span>{t("scheduleBuilder.fontWeight")}</span>
                <select value={draft.fontWeight} onChange={(event) => setDraft("fontWeight", event.currentTarget.value)}>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </label>
            </div>
            <div className="field-grid two">
              <ScheduleSlider
                label={t("scheduleBuilder.titleFontSize")}
                value={draft.titleFontSize}
                min={24}
                max={140}
                onChange={(value) => setDraft("titleFontSize", value)}
              />
              <ScheduleSlider
                label={t("scheduleBuilder.weekdayFontSize")}
                value={draft.weekdayFontSize}
                min={10}
                max={72}
                onChange={(value) => setDraft("weekdayFontSize", value)}
              />
            </div>
            <div className="field-grid two">
              <ScheduleSlider
                label={t("scheduleBuilder.dateFontSize")}
                value={draft.dateFontSize}
                min={10}
                max={96}
                onChange={(value) => setDraft("dateFontSize", value)}
              />
              <ScheduleSlider
                label={t("scheduleBuilder.eventFontSize")}
                value={draft.eventFontSize}
                min={10}
                max={72}
                onChange={(value) => setDraft("eventFontSize", value)}
              />
            </div>
            {!isDaySchedule ? (
              <label className="field schedule-grid-style-field">
                <span>{t("scheduleBuilder.gridStyle")}</span>
                <select value={draft.gridStyle} onChange={(event) => setDraft("gridStyle", event.currentTarget.value as ScheduleBuilderRequest["gridStyle"])}>
                  <option value="cards">{t("scheduleBuilder.gridStyle.cards")}</option>
                  <option value="lines">{t("scheduleBuilder.gridStyle.lines")}</option>
                </select>
              </label>
            ) : null}
            <div className="field-grid two">
              {isDaySchedule ? (
                <ScheduleSlider
                  label={t("scheduleBuilder.dailyCircleSize")}
                  value={draft.dailyCircleSize ?? 100}
                  min={70}
                  max={120}
                  onChange={(value) => setDraft("dailyCircleSize", value)}
                />
              ) : (
                <ScheduleSlider
                  label={t("scheduleBuilder.cornerRadius")}
                  value={draft.cornerRadius}
                  min={0}
                  max={32}
                  onChange={(value) => setDraft("cornerRadius", value)}
                />
              )}
              <ScheduleSlider
                label={t("scheduleBuilder.strokeWidth")}
                value={draft.strokeWidth}
                min={0}
                max={12}
                onChange={(value) => setDraft("strokeWidth", value)}
              />
            </div>
            {!isDaySchedule ? (
              <div className="field-grid schedule-action-count-row">
                <label className={`field schedule-action-mode-field ${isMonthSchedule ? "field-disabled" : ""}`}>
                  <span>{t("scheduleBuilder.actionCountMode")}</span>
                  <select
                    value={draft.actionCountMode}
                    disabled={isMonthSchedule}
                    onChange={(event) => setDraft("actionCountMode", event.currentTarget.value as ScheduleBuilderRequest["actionCountMode"])}
                  >
                    <option value="uniform">{t("scheduleBuilder.actionCountMode.uniform")}</option>
                    <option value="individual">{t("scheduleBuilder.actionCountMode.individual")}</option>
                  </select>
                </label>
                <ScheduleSlider
                  label={t("scheduleBuilder.actionsPerDay")}
                  value={draft.actionsPerDay}
                  min={0}
                  max={6}
                  onChange={(value) => setDraft("actionsPerDay", value)}
                />
              </div>
            ) : null}
            {isDaySchedule ? (
              <section className="schedule-daily-period-section" aria-label={t("scheduleBuilder.dailyPeriodSection")}>
                <div className="section-heading compact-heading">
                  <CalendarDays size={15} />
                  <h2>{t("scheduleBuilder.dailyPeriodSection")}</h2>
                </div>
                <label className="field checkbox-field schedule-clock-toggle">
                  <input type="checkbox" checked={draft.showTimeLabels !== false} onChange={(event) => setDraft("showTimeLabels", event.currentTarget.checked)} />
                  <span>{t("scheduleBuilder.showTimeLabels")}</span>
                </label>
                <div className="daily-period-grid">
                  {[0, 1].map((index) => {
                    const isEventVisible = draft.dailyShowEventLabels?.[index] !== false;
                    return (
                      <div className="daily-period-editor" key={index}>
                        <div className="daily-period-title-row">
                          <label className="field">
                            <span>{t(index === 0 ? "scheduleBuilder.dailyPeriodAm" : "scheduleBuilder.dailyPeriodPm")}</span>
                            <input
                              type="text"
                              value={draft.dailyPeriodLabels?.[index] ?? (index === 0 ? "AM" : "PM")}
                              onChange={(event) => updateDailyString("dailyPeriodLabels", index, event.currentTarget.value)}
                            />
                          </label>
                          <label className="field checkbox-field daily-event-toggle">
                            <input
                              type="checkbox"
                              checked={isEventVisible}
                              onChange={(event) => updateDailyEventVisibility(index, event.currentTarget.checked)}
                            />
                            <span>{t(index === 0 ? "scheduleBuilder.showAmEvent" : "scheduleBuilder.showPmEvent")}</span>
                          </label>
                        </div>
                        <div className="daily-time-row">
                          <label className="field">
                            <span>{t(index === 0 ? "scheduleBuilder.dailyTimeAm" : "scheduleBuilder.dailyTimePm")}</span>
                            <input
                              type="time"
                              step={300}
                              value={draft.dailyTimeLabels?.[index] ?? (index === 0 ? "09:00" : "14:00")}
                              onChange={(event) => updateDailyString("dailyTimeLabels", index, event.currentTarget.value)}
                            />
                          </label>
                          <label className="field">
                            <span>{t(index === 0 ? "scheduleBuilder.dailyEndTimeAm" : "scheduleBuilder.dailyEndTimePm")}</span>
                            <input
                              type="time"
                              step={300}
                              value={draft.dailyEndTimeLabels?.[index] ?? (index === 0 ? "11:00" : "16:00")}
                              onChange={(event) => updateDailyString("dailyEndTimeLabels", index, event.currentTarget.value)}
                            />
                          </label>
                        </div>
                        <label className={`field ${isEventVisible ? "" : "field-disabled"}`}>
                          <span>{t(index === 0 ? "scheduleBuilder.dailyEventAm" : "scheduleBuilder.dailyEventPm")}</span>
                          <input
                            type="text"
                            disabled={!isEventVisible}
                            value={draft.dailyEventLabels?.[index] ?? (index === 0 ? "Morning work" : "Collaboration")}
                            onChange={(event) => updateDailyString("dailyEventLabels", index, event.currentTarget.value)}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}
            {draft.kind === "week" && draft.actionCountMode === "individual" ? (
              <div className="daily-action-grid" aria-label={t("scheduleBuilder.dailyActionCounts")}>
                {getPreviewWeekDates(draft).map((date, index) => (
                  <label className="field" key={`${date.month}-${date.day}-${index}`}>
                    <span>{`${getWeekdayLabel(draft, date.weekday)} ${formatPreviewDate(date, draft.dateFormat)}`}</span>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      value={normalizeDailyCounts(draft)[index]}
                      onChange={(event) => updateDailyActionCount(index, event.currentTarget.value)}
                    />
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={normalizeDailyCounts(draft)[index]}
                      onChange={(event) => updateDailyActionCount(index, event.currentTarget.value)}
                    />
                  </label>
                ))}
              </div>
            ) : null}
          </section>

          <section className="panel-section schedule-color-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("scheduleBuilder.colorSection")}</h2>
            </div>
            <div className="schedule-color-target-grid">
              {colorTargets.map((target) => (
                <button
                  className={`schedule-color-target-button ${activeColorTarget === target.key ? "selected" : ""}`}
                  type="button"
                  key={target.key}
                  onClick={() => setActiveColorTarget(target.key)}
                >
                  <span>{target.label}</span>
                  <div className="schedule-color-target-button-row">
                    <span className="schedule-color-preview" style={{ background: normalizeColor(target.value) ?? target.value }} aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
            {activeTargetMeta ? (
              <ScheduleColorPickerModal
                targetLabel={activeTargetMeta.label}
                value={activeTargetMeta.value}
                paletteColors={paletteColors}
                savedColorPalettes={savedColorPalettes}
                onApply={(value) => {
                  if (!activeColorTarget) return;
                  setDraft(activeColorTarget, value);
                  setActiveColorTarget(null);
                }}
                onClose={() => setActiveColorTarget(null)}
                t={t}
              />
            ) : null}
          </section>
          <section className="panel-section schedule-preview-section">
            <div className="section-heading">
              <CalendarDays size={16} />
              <h2>{t("scheduleBuilder.previewSection")}</h2>
            </div>
            <div className="schedule-preview-canvas-shell generator-preview-canvas-shell schedule-generator-preview-canvas-shell" style={previewShellStyle}>
              <canvas ref={previewCanvasRef} className="schedule-preview-canvas" aria-label={previewTitle} />
            </div>
            <div className="confirm-actions schedule-builder-actions">
              <button type="button" className="secondary-button" onClick={onCancel}>
                {t("inspector.cancel")}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  onSaveSettings();
                  setSettingsSaved(true);
                }}
              >
                {settingsSaved ? t("generator.settingsSaved") : t("generator.saveSettings")}
              </button>
              <button type="button" className="primary-button" onClick={onConfirm}>
                {t("scheduleBuilder.generate")}
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function ScheduleColorPickerModal({
  targetLabel,
  value,
  paletteColors,
  savedColorPalettes,
  onApply,
  onClose,
  t,
}: {
  targetLabel: string;
  value: string;
  paletteColors: PaletteColor[];
  savedColorPalettes: SavedColorPalette[];
  onApply: (value: string) => void;
  onClose: () => void;
  t: Translator;
}) {
  const [draftValue, setDraftValue] = useState(value);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  const commitDraft = () => {
    const normalized = normalizeColor(draftValue);
    if (normalized) {
      onApply(normalized);
      return;
    }
    setDraftValue(value);
  };

  return (
    <div className="modal-backdrop confirm-backdrop schedule-color-picker-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="schedule-color-picker-modal" role="dialog" aria-modal="true" aria-label={targetLabel} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-block">
            <h2>{`${t("scheduleBuilder.colorSection")} / ${targetLabel}`}</h2>
          </div>
          <button type="button" className="ghost-button schedule-color-picker-close" onClick={() => onClose()}>
            ✕
          </button>
        </div>
        <label className="field">
          <span>HEX</span>
          <div className="schedule-color-input-row">
            <span className="schedule-color-preview" style={{ background: normalizeColor(draftValue) ?? draftValue }} aria-hidden="true" />
            <input
              type="text"
              value={draftValue}
              onChange={(event) => setDraftValue(event.currentTarget.value)}
              onBlur={commitDraft}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitDraft();
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  setDraftValue(value);
                  onClose();
                }
              }}
            />
          </div>
        </label>
        <div className="schedule-color-list-group">
          <p className="schedule-color-list-title">{t("inspector.registeredColors")}</p>
          {paletteColors.length === 0 ? (
            <p className="schedule-empty-message">{t("scheduleBuilder.noRegisteredColors")}</p>
          ) : (
            <div className="schedule-color-swatch-grid">
              {paletteColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`schedule-color-swatch ${normalizeColor(value) === color.value ? "selected" : ""}`}
                  style={{ background: color.value }}
                  title={`${color.name}: ${color.value}`}
                  onClick={() => onApply(color.value)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="schedule-color-list-group">
          <p className="schedule-color-list-title">{t("inspector.savedPalettes")}</p>
          {savedColorPalettes.length === 0 ? (
            <p className="schedule-empty-message">{t("scheduleBuilder.noSavedPalettes")}</p>
          ) : (
            <div className="schedule-saved-palette-list">
              {savedColorPalettes.map((palette) => (
                <div className="schedule-saved-palette-row" key={palette.id}>
                  <div className="schedule-saved-palette-header">
                    <span>{palette.name}</span>
                    <small>{palette.mode}</small>
                  </div>
                  <div className="schedule-saved-palette-swatches">
                    {palette.colors.map((paletteColor) => (
                      <button
                        key={`${palette.id}-${paletteColor}`}
                        type="button"
                        className={`schedule-saved-palette-swatch ${normalizeColor(value) === paletteColor ? "selected" : ""}`}
                        style={{ background: paletteColor }}
                        title={paletteColor}
                        onClick={() => onApply(paletteColor)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </section>
    </div>
  );
}

function CreativeBuilderDialog({
  draft,
  fontOptions,
  settings,
  paletteColors,
  savedColorPalettes,
  onDraftChange,
  onSaveSettings,
  onCancel,
  onConfirm,
  t,
}: {
  draft: CreativeGeneratorRequest;
  fontOptions: FontOption[];
  settings: OutputSettings;
  paletteColors: PaletteColor[];
  savedColorPalettes: SavedColorPalette[];
  onDraftChange: (draft: CreativeGeneratorRequest) => void;
  onSaveSettings: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  t: Translator;
}) {
  type CreativeColorTarget = "backgroundColor" | "surfaceColor" | "accentColor" | "secondaryColor" | "textColor";
  const [activeColorTarget, setActiveColorTarget] = useState<CreativeColorTarget | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const previewTemplate = useMemo(() => buildCreativeTemplate(draft, settings), [draft, settings]);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const layoutPatternOptions: Array<{ value: CreativeLayoutPattern; label: TranslationKey }> = [
    { value: "pattern-1", label: "generator.layoutPattern.pattern-1" },
    { value: "pattern-2", label: "generator.layoutPattern.pattern-2" },
    { value: "pattern-3", label: "generator.layoutPattern.pattern-3" },
    { value: "pattern-4", label: "generator.layoutPattern.pattern-4" },
    { value: "pattern-5", label: "generator.layoutPattern.pattern-5" },
  ];

  const setDraft = <Key extends keyof CreativeGeneratorRequest>(key: Key, value: CreativeGeneratorRequest[Key]) => {
    onDraftChange({ ...draft, [key]: value });
    setSettingsSaved(false);
  };

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    renderThumbnailToCanvas(canvas, previewTemplate.layers, [], previewTemplate.settings, { drawSelection: false }).catch(() => {});
  }, [previewTemplate]);

  const title = getCreativeDialogTitle(draft.kind, t);
  const previewShellStyle = {
    aspectRatio: `${previewTemplate.settings.width} / ${previewTemplate.settings.height}`,
    "--preview-ratio": String(previewTemplate.settings.width / previewTemplate.settings.height),
  } as CSSProperties;
  const isPortraitPreview = previewTemplate.settings.height > previewTemplate.settings.width;
  const colorTargets = [
    { key: "backgroundColor" as const, label: t("scheduleBuilder.backgroundColor"), value: draft.backgroundColor },
    { key: "surfaceColor" as const, label: t("scheduleBuilder.surfaceColor"), value: draft.surfaceColor },
    { key: "accentColor" as const, label: t("scheduleBuilder.accentColor"), value: draft.accentColor },
    { key: "secondaryColor" as const, label: t("generator.secondaryColor"), value: draft.secondaryColor },
    { key: "textColor" as const, label: t("scheduleBuilder.textColor"), value: draft.textColor },
  ];
  const activeTargetMeta = activeColorTarget ? colorTargets.find((target) => target.key === activeColorTarget) : null;

  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section
        className={`schedule-builder-dialog creative-builder-dialog ${isPortraitPreview ? "portrait-builder-dialog" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="creative-builder-title"
        style={previewShellStyle}
      >
        <div className="modal-header">
          <div className="modal-title-block">
            <h2 id="creative-builder-title">{title}</h2>
            <p>{t("generator.betaNotice")}</p>
          </div>
        </div>

        <div className="schedule-builder-grid creative-builder-grid">
          <section className="panel-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("generator.contentSection")}</h2>
            </div>
            <label className="field">
              <span>{t("scheduleBuilder.titleLabel")}</span>
              <input value={draft.title} onChange={(event) => setDraft("title", event.currentTarget.value)} />
            </label>
            <label className="field">
              <span>{t("generator.subtitle")}</span>
              <input value={draft.subtitle} onChange={(event) => setDraft("subtitle", event.currentTarget.value)} />
            </label>
            <label className="field">
              <span>{t("generator.label")}</span>
              <input value={draft.label} onChange={(event) => setDraft("label", event.currentTarget.value)} />
            </label>
            <label className="field">
              <span>{t("generator.tone")}</span>
              <select value={draft.tone} onChange={(event) => setDraft("tone", event.currentTarget.value as CreativeGeneratorRequest["tone"])}>
                <option value="bold">{t("generator.tone.bold")}</option>
                <option value="clean">{t("generator.tone.clean")}</option>
                <option value="neon">{t("generator.tone.neon")}</option>
              </select>
            </label>
            <label className="field">
              <span>{t("generator.layoutPattern")}</span>
              <select value={draft.layoutPattern} onChange={(event) => setDraft("layoutPattern", event.currentTarget.value as CreativeLayoutPattern)}>
                {layoutPatternOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field checkbox-field">
              <input type="checkbox" checked={draft.includeImageSlot} onChange={(event) => setDraft("includeImageSlot", event.currentTarget.checked)} />
              <span>{t("generator.includeImageSlot")}</span>
            </label>
            <label className="field checkbox-field">
              <input type="checkbox" checked={draft.groupLayers} onChange={(event) => setDraft("groupLayers", event.currentTarget.checked)} />
              <span>{t("scheduleBuilder.groupLayers")}</span>
            </label>
            {draft.kind === "stream-waiting" ? (
              <label className="field checkbox-field">
                <input type="checkbox" checked={draft.animated} onChange={(event) => setDraft("animated", event.currentTarget.checked)} />
                <span>{t("generator.animated")}</span>
              </label>
            ) : null}
          </section>

          <section className="panel-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("generator.gridTextSection")}</h2>
            </div>
            <div className="generator-text-groups">
              <div className="generator-text-group">
                <h3>{t("generator.commonGroup")}</h3>
                <div className="field-grid schedule-font-row">
                  <label className="field schedule-font-family-field">
                    <span>{t("scheduleBuilder.fontFamily")}</span>
                    <select value={draft.fontFamily} onChange={(event) => setDraft("fontFamily", event.currentTarget.value)}>
                      {!fontOptions.some((option) => option.value === draft.fontFamily) ? (
                        <option value={draft.fontFamily}>{draft.fontFamily}</option>
                      ) : null}
                      {fontOptions.map((option, index) => (
                        <option key={`${option.value}-${index}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field schedule-font-weight-field">
                    <span>{t("scheduleBuilder.fontWeight")}</span>
                    <select value={draft.fontWeight} onChange={(event) => setDraft("fontWeight", event.currentTarget.value)}>
                      <option value="600">600</option>
                      <option value="700">700</option>
                      <option value="800">800</option>
                      <option value="900">900</option>
                    </select>
                  </label>
                </div>
                <div className="field-grid two">
                  <ScheduleSlider
                    label={t("generator.letterSpacing")}
                    value={draft.letterSpacing}
                    min={-8}
                    max={24}
                    onChange={(value) => setDraft("letterSpacing", value)}
                  />
                  <ScheduleSlider
                    label={t("generator.cornerRadius")}
                    value={draft.labelCornerRadius}
                    min={0}
                    max={42}
                    onChange={(value) => setDraft("labelCornerRadius", value)}
                  />
                </div>
              </div>

              <div className="generator-text-group generator-text-group--compact">
                <h3>{t("generator.titleGroup")}</h3>
                <ScheduleSlider
                  label={t("generator.titleFontSize")}
                  value={draft.titleFontSize}
                  min={24}
                  max={180}
                  onChange={(value) => setDraft("titleFontSize", value)}
                />
                <ScheduleSlider
                  label={t("generator.strokeWidth")}
                  value={draft.titleStrokeWidth}
                  min={0}
                  max={20}
                  onChange={(value) => setDraft("titleStrokeWidth", value)}
                />
                <CreativeAlignSelect value={draft.titleAlign} onChange={(value) => setDraft("titleAlign", value)} t={t} />
              </div>

              <div className="generator-text-group generator-text-group--compact">
                <h3>{t("generator.subtitleGroup")}</h3>
                <ScheduleSlider
                  label={t("generator.subtitleFontSize")}
                  value={draft.subtitleFontSize}
                  min={12}
                  max={96}
                  onChange={(value) => setDraft("subtitleFontSize", value)}
                />
                <ScheduleSlider
                  label={t("generator.strokeWidth")}
                  value={draft.subtitleStrokeWidth}
                  min={0}
                  max={14}
                  onChange={(value) => setDraft("subtitleStrokeWidth", value)}
                />
                <CreativeAlignSelect value={draft.subtitleAlign} onChange={(value) => setDraft("subtitleAlign", value)} t={t} />
              </div>

              <div className="generator-text-group generator-text-group--compact">
                <h3>{t("generator.labelGroup")}</h3>
                <ScheduleSlider
                  label={t("generator.labelFontSize")}
                  value={draft.labelFontSize}
                  min={10}
                  max={72}
                  onChange={(value) => setDraft("labelFontSize", value)}
                />
                <ScheduleSlider
                  label={t("generator.strokeWidth")}
                  value={draft.labelStrokeWidth}
                  min={0}
                  max={12}
                  onChange={(value) => setDraft("labelStrokeWidth", value)}
                />
                <CreativeAlignSelect value={draft.labelAlign} onChange={(value) => setDraft("labelAlign", value)} t={t} />
              </div>
            </div>
          </section>

          <section className="panel-section schedule-color-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("scheduleBuilder.colorSection")}</h2>
            </div>
            <div className="schedule-color-target-grid">
              {colorTargets.map((target) => (
                <button
                  className={`schedule-color-target-button ${activeColorTarget === target.key ? "selected" : ""}`}
                  type="button"
                  key={target.key}
                  onClick={() => setActiveColorTarget(target.key)}
                >
                  <span>{target.label}</span>
                  <div className="schedule-color-target-button-row">
                    <span className="schedule-color-preview" style={{ background: normalizeColor(target.value) ?? target.value }} aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
            {activeTargetMeta ? (
              <ScheduleColorPickerModal
                targetLabel={activeTargetMeta.label}
                value={activeTargetMeta.value}
                paletteColors={paletteColors}
                savedColorPalettes={savedColorPalettes}
                onApply={(value) => {
                  if (!activeColorTarget) return;
                  setDraft(activeColorTarget, value);
                  setActiveColorTarget(null);
                }}
                onClose={() => setActiveColorTarget(null)}
                t={t}
              />
            ) : null}
          </section>

          <section className="panel-section schedule-preview-section">
            <div className="section-heading">
              <Video size={16} />
              <h2>{t("scheduleBuilder.previewSection")}</h2>
            </div>
            <div className="schedule-preview-canvas-shell generator-preview-canvas-shell creative-preview-canvas-shell" style={previewShellStyle}>
              <canvas ref={previewCanvasRef} className="schedule-preview-canvas" aria-label={title} />
            </div>
            <div className="confirm-actions schedule-builder-actions creative-builder-actions">
              <button type="button" className="secondary-button" onClick={onCancel}>
                {t("inspector.cancel")}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  onSaveSettings();
                  setSettingsSaved(true);
                }}
              >
                {settingsSaved ? t("generator.settingsSaved") : t("generator.saveSettings")}
              </button>
              <button type="button" className="primary-button" onClick={onConfirm}>
                {t("scheduleBuilder.generate")}
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function getCreativeDialogTitle(kind: CreativeGeneratorKind, t: Translator): string {
  if (kind === "stream-waiting") return t("generator.streamWaiting.title");
  if (kind === "vertical-thumbnail") return t("generator.verticalThumbnail.title");
  return t("generator.standardThumbnail.title");
}

function CreativeAlignSelect({
  value,
  onChange,
  t,
}: {
  value: TextLayer["align"];
  onChange: (value: TextLayer["align"]) => void;
  t: Translator;
}) {
  return (
    <label className="field">
      <span>{t("generator.align")}</span>
      <select value={value} onChange={(event) => onChange(event.currentTarget.value as TextLayer["align"])}>
        <option value="left">{t("generator.align.left")}</option>
        <option value="center">{t("generator.align.center")}</option>
        <option value="right">{t("generator.align.right")}</option>
      </select>
    </label>
  );
}

function ScheduleSlider({
  label,
  value,
  min,
  max,
  disabled = false,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  const handleChange = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed)) return;
    onChange(Math.min(max, Math.max(min, parsed)));
  };
  return (
    <label className={`field schedule-slider-field ${disabled ? "field-disabled" : ""}`}>
      <span>{label}</span>
      <input type="range" min={min} max={max} value={value} disabled={disabled} onChange={(event) => handleChange(event.currentTarget.value)} />
      <input type="number" min={min} max={max} value={value} disabled={disabled} onChange={(event) => handleChange(event.currentTarget.value)} />
    </label>
  );
}

function formatMonthInputValue(draft: ScheduleBuilderRequest): string {
  return `${draft.year}-${pad2(draft.month)}`;
}

function formatDateInputValue(draft: ScheduleBuilderRequest): string {
  return `${draft.year}-${pad2(draft.month)}-${pad2(draft.day)}`;
}

function getPreviewWeekDates(draft: ScheduleBuilderRequest) {
  return Array.from({ length: 7 }, (_, index) => addDays(draft.year, draft.month, draft.day, index));
}


function getWeekdayLabel(draft: ScheduleBuilderRequest, weekday: number): string {
  return draft.weekdayLanguage === "ja"
    ? ["日", "月", "火", "水", "木", "金", "土"][weekday]
    : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][weekday];
}

function formatPreviewDate(date: { month: number; day: number }, format: ScheduleBuilderRequest["dateFormat"]): string {
  return format === "month-day" ? `${date.month}/${date.day}` : String(date.day);
}

function normalizeDailyCounts(draft: ScheduleBuilderRequest): number[] {
  return Array.from({ length: 7 }, (_, index) => clampPreviewCount(draft.dailyActionCounts?.[index] ?? draft.actionsPerDay));
}

function clampPreviewCount(value: number): number {
  return Math.min(6, Math.max(0, Math.round(value || 0)));
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function ConfirmTemplateDialog({
  title,
  copy,
  confirmLabel,
  confirmClassName,
  onCancel,
  onConfirm,
  t,
}: {
  title: string;
  copy: string;
  confirmLabel: string;
  confirmClassName: string;
  onCancel: () => void;
  onConfirm: () => void;
  t: Translator;
}) {
  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="template-confirm-title">
        <div className="modal-title-block">
          <h2 id="template-confirm-title">{title}</h2>
        </div>
        <p>{copy}</p>
        <div className="confirm-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {t("inspector.cancel")}
          </button>
          <button type="button" className={confirmClassName} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
