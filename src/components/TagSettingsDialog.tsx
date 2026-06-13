import { useState } from "react";
import { Plus, Tags, Trash2, X } from "lucide-react";
import type { TagCategory } from "../lib/tagRegistry";
import type { Translator } from "../lib/i18n";

interface TagSettingsDialogProps {
  tags: Record<TagCategory, string[]>;
  onAddTag: (category: TagCategory, tag: string) => void;
  onDeleteTag: (category: TagCategory, tag: string) => void;
  onClose: () => void;
  t: Translator;
}

const tagSections: Array<{ category: TagCategory; titleKey: "tags.common" | "tags.images" | "tags.groupObjects" | "tags.templates" }> = [
  { category: "common", titleKey: "tags.common" },
  { category: "images", titleKey: "tags.images" },
  { category: "groupObjects", titleKey: "tags.groupObjects" },
  { category: "templates", titleKey: "tags.templates" },
];

export function TagSettingsDialog({ tags, onAddTag, onDeleteTag, onClose, t }: TagSettingsDialogProps) {
  const [drafts, setDrafts] = useState<Record<TagCategory, string>>({
    common: "",
    images: "",
    groupObjects: "",
    templates: "",
  });

  const addTag = (category: TagCategory) => {
    const draft = drafts[category];
    if (!draft.trim()) return;
    onAddTag(category, draft);
    setDrafts((current) => ({ ...current, [category]: "" }));
  };

  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="confirm-dialog tag-settings-dialog" role="dialog" aria-modal="true" aria-labelledby="tag-settings-title">
        <div className="tag-settings-header">
          <div className="modal-title-block">
            <h2 id="tag-settings-title">
              <Tags size={18} /> {t("tags.title")}
            </h2>
            <p>{t("tags.copy")}</p>
          </div>
          <button type="button" className="icon-button modal-close" aria-label={t("tags.close")} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="tag-settings-grid">
          {tagSections.map((section) => (
            <section className="tag-settings-section" key={section.category}>
              <h3>{t(section.titleKey)}</h3>
              <div className="tag-input-row">
                <input
                  type="text"
                  value={drafts[section.category]}
                  placeholder={t("tags.addPlaceholder")}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setDrafts((current) => ({ ...current, [section.category]: value }));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag(section.category);
                    }
                  }}
                />
                <button
                  type="button"
                  className="secondary-button icon-text"
                  disabled={!drafts[section.category].trim()}
                  onClick={() => addTag(section.category)}
                >
                  <Plus size={14} /> {t("left.addTag")}
                </button>
              </div>
              <div className="tag-settings-list">
                {tags[section.category].length === 0 ? <p className="empty-note">{t("tags.empty")}</p> : null}
                {tags[section.category].map((tag) => (
                  <span className="tag-settings-chip" key={tag}>
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="mini-icon-button danger"
                      title={t("tags.delete", { tag })}
                      onClick={() => onDeleteTag(section.category, tag)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
