import { useEffect, useMemo, useRef } from "react";
import { BookOpen, X } from "lucide-react";

import type { Language } from "../lib/i18n";

export type ManualCategoryId =
  | "templates"
  | "layers"
  | "assets"
  | "adjust"
  | "colors"
  | "motion"
  | "timeline"
  | "preview"
  | "editState"
  | "other";

export interface ManualDialogState {
  categoryId: ManualCategoryId;
  sectionId: string;
  scrollTop: number;
}

interface ManualDialogProps {
  language: Language;
  state: ManualDialogState;
  onStateChange: (next: ManualDialogState) => void;
  onClose: () => void;
}

interface ManualEntry {
  id: string;
  title: string;
  body: string;
  details: string[];
}

interface ManualSection {
  id: string;
  label: string;
  title: string;
  summary: string;
  entries: ManualEntry[];
  related: Array<{ categoryId: ManualCategoryId; sectionId: string; label: string }>;
}

interface ManualCategory {
  id: ManualCategoryId;
  label: string;
  sections: ManualSection[];
}

interface ManualCopy {
  title: string;
  subtitle: string;
  closeLabel: string;
  categoryTabsLabel: string;
  sectionTabsLabel: (categoryLabel: string) => string;
  relatedHeading: string;
  tocHeading: string;
  categories: ManualCategory[];
}

export const defaultManualDialogState: ManualDialogState = {
  categoryId: "preview",
  sectionId: "selection",
  scrollTop: 0,
};

export function ManualDialog({ language, state, onStateChange, onClose }: ManualDialogProps) {
  const contentRef = useRef<HTMLElement | null>(null);
  const copy = useMemo(() => buildManualCopy(language), [language]);
  const activeCategory = copy.categories.find((category) => category.id === state.categoryId) ?? copy.categories[0];
  const activeSection = activeCategory.sections.find((section) => section.id === state.sectionId) ?? activeCategory.sections[0];

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = state.scrollTop;
  }, [state.categoryId, state.sectionId]);

  const selectCategory = (categoryId: ManualCategoryId) => {
    const category = copy.categories.find((candidate) => candidate.id === categoryId) ?? copy.categories[0];
    onStateChange({ categoryId: category.id, sectionId: category.sections[0].id, scrollTop: 0 });
  };

  const selectSection = (sectionId: string) => {
    onStateChange({ ...state, sectionId, scrollTop: 0 });
  };

  const selectRelated = (categoryId: ManualCategoryId, sectionId: string) => {
    onStateChange({ categoryId, sectionId, scrollTop: 0 });
  };

  const jumpToEntry = (entryId: string) => {
    const content = contentRef.current;
    const target = content?.querySelector<HTMLElement>(`#manual-entry-${entryId}`);
    if (!content || !target) return;
    content.scrollTo({ top: Math.max(0, target.offsetTop - 10), behavior: "smooth" });
  };

  return (
    <div className="modal-backdrop manual-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="manual-dialog" role="dialog" aria-modal="true" aria-labelledby="manual-title">
        <div className="modal-header manual-header">
          <div className="modal-title-block">
            <h2 id="manual-title">
              <BookOpen size={18} /> {copy.title}
            </h2>
            <p>{copy.subtitle}</p>
          </div>
          <button type="button" className="icon-button modal-close" aria-label={copy.closeLabel} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="manual-body">
          <nav className="manual-side-tabs" aria-label={copy.categoryTabsLabel}>
            {copy.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={category.id === activeCategory.id ? "selected" : ""}
                onClick={() => selectCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </nav>
          <div className="manual-main">
            <div className="manual-top-tabs" role="tablist" aria-label={copy.sectionTabsLabel(activeCategory.label)}>
              {activeCategory.sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  role="tab"
                  aria-selected={section.id === activeSection.id}
                  className={section.id === activeSection.id ? "selected" : ""}
                  onClick={() => selectSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>
            <div className="manual-content-shell">
              <article
                className="manual-content"
                tabIndex={0}
                ref={contentRef}
                onScroll={(event) => {
                  onStateChange({ ...state, scrollTop: event.currentTarget.scrollTop });
                }}
              >
                <h3>{activeSection.title}</h3>
                <p>{activeSection.summary}</p>
                <div className="manual-entry-list">
                  {activeSection.entries.map((entry) => (
                    <section key={entry.id} id={`manual-entry-${entry.id}`} className="manual-entry">
                      <h4>{entry.title}</h4>
                      <p>{entry.body}</p>
                      {entry.details.length > 0 ? (
                        <ul>
                          {entry.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
                </div>
                <div className="manual-related">
                  <h4>{copy.relatedHeading}</h4>
                  <div>
                    {activeSection.related.map((related) => (
                      <button
                        key={`${related.categoryId}-${related.sectionId}`}
                        type="button"
                        className="manual-related-link"
                        onClick={() => selectRelated(related.categoryId, related.sectionId)}
                      >
                        {related.label}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
              <aside className="manual-toc" aria-label={copy.tocHeading}>
                <h4>{copy.tocHeading}</h4>
                {activeSection.entries.map((entry) => (
                  <button key={entry.id} type="button" onClick={() => jumpToEntry(entry.id)}>
                    {entry.title}
                  </button>
                ))}
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function buildManualCopy(language: Language): ManualCopy {
  const ja = language === "ja";
  const tx = (japanese: string, english: string) => (ja ? japanese : english);
  const related = [
    {
      categoryId: "preview" as const,
      sectionId: "selection",
      label: tx("プレビュー選択", "Preview selection"),
    },
    {
      categoryId: "layers" as const,
      sectionId: "canvas",
      label: tx("キャンバス一覧", "Canvas list"),
    },
    {
      categoryId: "adjust" as const,
      sectionId: "common",
      label: tx("調整: 共通設定", "Adjust: common settings"),
    },
  ];
  const entry = (id: string, title: string, body: string, details: string[] = []): ManualEntry => ({ id, title, body, details });
  const section = (id: string, label: string, title: string, summary: string, entries: ManualEntry[]): ManualSection => ({
    id,
    label,
    title,
    summary,
    entries,
    related,
  });

  const categories: ManualCategory[] = [
    {
      id: "templates",
      label: tx("テンプレート", "Templates"),
      sections: [
        section(
          "generators",
          tx("生成", "Generators"),
          tx("テンプレート生成", "Template generators"),
          tx("用途別の初期レイアウトを作成し、生成条件を次回へ引き継ぎます。", "Create starter layouts for common use cases and keep generator settings for the next run."),
          [
            entry(
              "schedule",
              tx("スケジュール生成", "Schedule generator"),
              tx("月間・週間の配信予定表をレイヤーとして生成します。", "Build monthly or weekly schedule boards as editable layers."),
              [
                tx("開始日、表示期間、週始まり、曜日表記、日付形式、行数、グリッド、余白、角丸、線幅を指定します。", "Set start date, range, week start, weekday language, date format, row count, grid, padding, radius, and stroke width."),
                tx("生成後は通常レイヤーとして色、フォント、配置、グループを調整できます。", "Generated items become normal layers, so color, fonts, position, and grouping remain editable."),
              ],
            ),
            entry(
              "thumbnail",
              tx("通常・縦型・待機画面", "Standard, vertical, and waiting screens"),
              tx("16:9、9:16、待機画面向けの構成をプリセットから作成します。", "Create 16:9, 9:16, and waiting screen compositions from presets."),
              [
                tx("タイトル、サブタイトル、ラベル、画像枠、装飾図形、アニメーション有無を選べます。", "Choose title, subtitle, labels, image frames, decorative shapes, and animation defaults."),
                tx("縦型はモバイル視聴で読める文字量と余白を優先します。", "Vertical layouts prioritize readable text volume and spacing for mobile viewing."),
              ],
            ),
            entry(
              "save-settings",
              tx("設定保存", "Save settings"),
              tx("Save settings はキャンバスを置き換えず、次回の生成条件だけを保存します。", "Save settings stores only the next generator defaults without replacing the current canvas."),
              [
                tx("Generate objects は設定保存とレイヤー生成を同時に行います。", "Generate objects saves settings and creates layers in one action."),
                tx("生成後に戻したい場合は Undo、または編集状態の復元を使います。", "Use Undo or restore an edit state if you need to return after generation."),
              ],
            ),
          ],
        ),
        section(
          "registered",
          tx("登録済み", "Registered"),
          tx("登録済みテンプレート", "Registered templates"),
          tx("現在の作業状態を名前とタグ付きでブラウザに保存し、再利用します。", "Save the current workspace in the browser with a name and tags for reuse."),
          [
            entry(
              "save-load-delete",
              tx("保存・読み込み・削除", "Save, load, and delete"),
              tx("保存時はキャンバス、出力サイズ、素材参照、CSV/HTML 変換情報を含めます。", "Saved templates include canvas layers, output size, asset references, and CSV/HTML conversion metadata."),
              [
                tx("読み込みは現在のキャンバスを置き換えるため確認ダイアログを表示します。", "Loading replaces the current canvas, so a confirmation dialog is shown."),
                tx("Ctrl を押しながら削除すると確認を省略できる削除操作があります。", "Holding Ctrl while deleting can skip confirmation where that fast path is available."),
              ],
            ),
            entry(
              "tags-filter",
              tx("タグ検索と一覧サイズ", "Tag filter and list size"),
              tx("タグでテンプレートを絞り込み、一覧下部のハンドルで表示高さを変えます。", "Filter templates by tag and resize the list with the handle at the bottom."),
              [
                tx("テンプレートタグと共通タグはタグ編集モーダルから管理します。", "Template tags and common tags are managed from the tag settings modal."),
                tx("高さを広げるとサムネイル確認を優先し、縮めるとプレビュー領域を広く使えます。", "A taller list favors template review; a shorter list gives more space to the preview."),
              ],
            ),
          ],
        ),
      ],
    },
    {
      id: "layers",
      label: tx("レイヤー", "Layers"),
      sections: [
        section(
          "quick-add",
          tx("追加", "Add"),
          tx("クイック追加", "Quick add"),
          tx("よく使うオブジェクトをキャンバスへ追加します。", "Add frequently used objects directly to the canvas."),
          [
            entry(
              "text-shape-line",
              tx("テキスト・図形・線", "Text, shapes, and lines"),
              tx("テキスト、見出し、図形、直線、点線、破線、波線を追加します。", "Add text, headings, shapes, solid lines, dotted lines, dashed lines, and waves."),
              [
                tx("テキストは本文、フォント、サイズ、行間、字間、縦書き、整列、塗り、縁取りを後から変更できます。", "Text later exposes content, font, size, line height, letter spacing, vertical writing, alignment, fill, and stroke."),
                tx("図形は塗り、線、角丸、透明度、回転、影、疑似 3D、ベベルを調整できます。", "Shapes expose fill, stroke, radius, opacity, rotation, shadow, pseudo 3D, and bevel controls."),
              ],
            ),
            entry(
              "asset-image",
              tx("選択中画像・グループ素材", "Selected images and group assets"),
              tx("Assets で選択した画像や登録済みグループ素材をキャンバスへ配置します。", "Place the selected image or registered group asset from Assets onto the canvas."),
              [
                tx("画像はクロップ、フィット、透明度、ぼかし、縁ぼかし、影を調整できます。", "Images support crop, fit, opacity, blur, edge blur, and shadow controls."),
                tx("グループ素材は配置後もグループ単位または個別編集で扱えます。", "Group assets can be edited as a group or through individual member editing after placement."),
              ],
            ),
          ],
        ),
        section(
          "canvas",
          tx("一覧", "List"),
          tx("キャンバス内オブジェクト", "Canvas object list"),
          tx("配置済みオブジェクトの順序、表示、ロック、削除、一覧高さを管理します。", "Manage order, visibility, lock state, deletion, and list height for placed objects."),
          [
            entry(
              "order-visibility-lock",
              tx("重なり順・表示・ロック", "Order, visibility, and lock"),
              tx("上にある行ほど前面に表示されます。目アイコンは表示、ロックは編集可否を切り替えます。", "Rows near the top render in front. The eye toggles visibility; lock toggles editability."),
              [
                tx("非表示レイヤーはプレビュー、書き出し、範囲選択の対象外です。", "Hidden layers are excluded from preview, export, and range selection."),
                tx("ロック中のレイヤーは選択や移動を避け、誤操作から保護します。", "Locked layers avoid selection and movement, protecting them from accidental edits."),
              ],
            ),
            entry(
              "groups",
              tx("グループ", "Groups"),
              tx("複数オブジェクトをまとめて選択、移動、整列、素材登録できます。", "Select, move, align, and register multiple objects as a single group."),
              [
                tx("範囲選択ではグループ全体の外接範囲が完全に入った場合だけ対象になります。", "Range selection targets a group only when the entire group bounding box is enclosed."),
                tx("個別編集ではグループを解除せずに 1 メンバーだけ Adjust で編集します。", "Individual editing lets Adjust edit one member without ungrouping."),
              ],
            ),
            entry(
              "align-distribute",
              tx("整列・分布・キャンバスに合わせる", "Align, distribute, and fit to canvas"),
              tx("選択範囲やキャンバスを基準に位置を揃え、3 件以上は等間隔に分布できます。", "Align to the selection bounds or canvas, and distribute three or more items evenly."),
              [
                tx("単体選択ではキャンバス全体、複数選択では選択範囲を基準にします。", "A single selected item aligns to the canvas; multiple items align to their combined bounds."),
                tx("キャンバスに合わせるは選択中の画像や図形を出力サイズいっぱいに合わせます。", "Fit to canvas resizes selected images or shapes to the full output size."),
              ],
            ),
          ],
        ),
      ],
    },
    {
      id: "assets",
      label: tx("素材", "Assets"),
      sections: [
        section(
          "images",
          tx("画像", "Images"),
          tx("画像素材", "Image assets"),
          tx("ローカル画像を登録し、タグ検索、配置、Image Lab、削除を行います。", "Register local images, then tag, filter, place, process in Image Lab, or delete them."),
          [
            entry(
              "register-tags",
              tx("ファイル・フォルダ登録とタグ", "File or folder import and tags"),
              tx("画像ファイルまたは対応ブラウザのフォルダ登録で素材一覧へ追加します。", "Add image files, or folders in supported browsers, to the asset list."),
              [
                tx("登録前タグ、登録後タグ編集、タグ検索で素材を分類できます。", "Use pre-import tags, post-import tag editing, and tag search to classify assets."),
                tx("画像データはブラウザ内で処理され、書き出し時はキャンバスに配置された内容だけを使います。", "Image data is processed in the browser; export uses only content placed on the canvas."),
              ],
            ),
            entry(
              "row-actions-resize",
              tx("行アクションと一覧サイズ", "Row actions and list size"),
              tx("素材行からキャンバス追加、Image Lab 起動、素材削除を実行します。", "Asset rows can add to canvas, open Image Lab, or delete the asset."),
              [
                tx("削除時は参照中の画像オブジェクトも合わせて削除されます。", "Deleting an asset also removes canvas image objects that reference it."),
                tx("一覧ハンドルで高さを変えると大量素材の確認とキャンバス作業を切り替えやすくなります。", "The list handle helps switch between reviewing many assets and focusing on canvas work."),
              ],
            ),
          ],
        ),
        section(
          "image-lab",
          tx("Image Lab", "Image Lab"),
          tx("Image Lab", "Image Lab"),
          tx("画像を切り抜き、透過処理し、新しい素材として追加します。", "Cut out or key out an image and add the processed result as a new asset."),
          [
            entry(
              "crop",
              tx("矩形・円形・自由選択", "Rectangle, circle, and freeform selection"),
              tx("プレビュー上で範囲や頂点を操作し、切り抜き形状を作ります。", "Edit ranges and points on the preview to define the cutout shape."),
              [
                tx("矩形は辺と角ハンドル、円形は比率維持、自由選択は点追加・ドラッグ・Alt+クリック削除を使います。", "Rectangles use side and corner handles, circles keep their ratio, and freeform uses point add, drag, and Alt+click delete."),
                tx("ホイールズームと中ドラッグのパンで細部を確認できます。", "Wheel zoom and middle-drag panning help inspect details."),
              ],
            ),
            entry(
              "chroma-add",
              tx("クロマキーと素材追加", "Chroma key and add asset"),
              tx("キー色と許容範囲で背景を透明化し、PNG として素材に追加します。", "Make a background transparent from key color and tolerance, then add it as a PNG asset."),
              [
                tx("許容範囲を上げるほど近い色まで透明化します。境界が荒い場合は低めから調整します。", "Higher tolerance removes more nearby colors. Start low when edges look rough."),
                tx("処理後の画像は元画像を置き換えず、新規素材として保存されます。", "Processed images are saved as new assets without replacing the source image."),
              ],
            ),
          ],
        ),
      ],
    },
    {
      id: "adjust",
      label: tx("調整", "Adjust"),
      sections: [
        section(
          "common",
          tx("共通", "Common"),
          tx("共通パラメータ", "Common parameters"),
          tx("選択中オブジェクトの位置、サイズ、回転、透明度、重なり順を編集します。", "Edit position, size, rotation, opacity, and stacking for the selected object."),
          [
            entry(
              "geometry",
              tx("X / Y / 幅 / 高さ / 回転", "X / Y / width / height / rotation"),
              tx("数値入力、ステッパー、キャンバス上のドラッグで幾何情報を調整します。", "Adjust geometry with numeric inputs, steppers, and direct canvas dragging."),
              [
                tx("X/Y は出力キャンバス左上を基準にした座標です。", "X/Y are coordinates from the output canvas top-left."),
                tx("角ハンドルはサイズ変更、上の丸ハンドルは回転、左ドラッグは移動です。", "Corner handles resize, the top round handle rotates, and left-drag moves."),
              ],
            ),
            entry(
              "opacity-effects",
              tx("透明度・ぼかし・影", "Opacity, blur, and shadow"),
              tx("全体透明度、画像ぼかし、縁ぼかし、影の色・距離・ぼかし・不透明度を設定します。", "Set opacity, image blur, edge blur, and shadow color, distance, blur, and alpha."),
              [
                tx("透明度は書き出しにも反映されます。非表示とは異なりレイヤー自体は選択できます。", "Opacity affects export. Unlike hidden layers, the object can still be selected."),
                tx("影は視認性を上げますが、小さい文字では強すぎるとにじんで見えます。", "Shadows can improve contrast, but strong shadows may make small text look muddy."),
              ],
            ),
            entry(
              "pseudo-3d-bevel",
              tx("疑似 3D・ベベル", "Pseudo 3D and bevel"),
              tx("押し出しや面取りのような装飾を加え、タイトルや図形を立体的に見せます。", "Add extrusion or beveled styling to make titles and shapes feel dimensional."),
              [
                tx("深さ、角度、ハイライト、シャドウを小さく調整すると自然に見えます。", "Small depth, angle, highlight, and shadow values tend to look more natural."),
                tx("画像よりもテキストや単色図形で効果が分かりやすい設定です。", "These controls are easiest to read on text and solid shapes."),
              ],
            ),
          ],
        ),
        section(
          "text",
          tx("テキスト", "Text"),
          tx("テキスト設定", "Text settings"),
          tx("本文、フォント、サイズ、整列、縁取り、縦書きなどを編集します。", "Edit text content, font, size, alignment, stroke, vertical writing, and more."),
          [
            entry(
              "typography",
              tx("本文・フォント・サイズ・行間・字間", "Content, font, size, line height, and letter spacing"),
              tx("読みやすさと情報量を決める中心パラメータです。", "These are the main parameters for readability and information density."),
              [
                tx("行間は複数行の詰まり具合、字間は見出しの密度や横幅に影響します。", "Line height controls multi-line spacing; letter spacing changes heading density and width."),
                tx("長い語句はキャンバス内での折り返しと出力サイズを確認してください。", "Check wrapping and output size when using long phrases."),
              ],
            ),
            entry(
              "paint",
              tx("塗り・縁取り・整列・縦書き", "Fill, stroke, alignment, and vertical writing"),
              tx("文字色、縁取り色、縁取り幅、左/中央/右寄せ、縦書きを切り替えます。", "Set fill, stroke color, stroke width, left/center/right alignment, and vertical writing."),
              [
                tx("縁取りは背景画像に重ねる文字の視認性を上げます。", "Stroke improves text contrast over images."),
                tx("縦書きは日本語タイトルや短いラベル向けです。欧文混在時はプレビューで確認します。", "Vertical writing suits Japanese titles or short labels. Preview mixed Latin text carefully."),
              ],
            ),
          ],
        ),
        section(
          "shape-image",
          tx("図形・画像", "Shape and image"),
          tx("図形・画像設定", "Shape and image settings"),
          tx("図形の塗りや線、画像のクロップやフィットを制御します。", "Control shape fill/stroke and image crop/fit behavior."),
          [
            entry(
              "shape",
              tx("塗り・線・角丸・線種", "Fill, stroke, radius, and line style"),
              tx("図形ごとに塗り、線幅、線色、角丸、実線/点線/破線などを設定します。", "Set fill, stroke width, stroke color, radius, and solid/dotted/dashed line style per shape."),
              [
                tx("角丸は長方形や吹き出しの印象を柔らかくします。", "Radius softens rectangles and callouts."),
                tx("線幅が大きい場合はキャンバス端で切れないよう位置も確認します。", "When stroke width is large, check that edges are not clipped at the canvas border."),
              ],
            ),
            entry(
              "image",
              tx("フィット・クロップ・画像効果", "Fit, crop, and image effects"),
              tx("画像の収まり方、切り抜き範囲、ぼかし、縁ぼかし、影を調整します。", "Adjust image fitting, crop area, blur, edge blur, and shadow."),
              [
                tx("カバーは枠を埋め、コンテインは画像全体を見せます。", "Cover fills the frame; contain keeps the whole image visible."),
                tx("縁ぼかしは合成感を弱める用途に向きます。", "Edge blur helps reduce a cut-and-paste look."),
              ],
            ),
          ],
        ),
      ],
    },
    {
      id: "colors",
      label: tx("色", "Colors"),
      sections: [
        section(
          "palette",
          tx("パレット", "Palette"),
          tx("色と保存パレット", "Colors and saved palettes"),
          tx("キャンバスで使う色を選び、ブランド向けのパレットとして保存します。", "Choose colors for the canvas and save reusable brand palettes."),
          [
            entry(
              "picker",
              tx("カラーピッカーとスウォッチ", "Color picker and swatches"),
              tx("塗り、線、影、背景などの色をピッカーまたは登録色から指定します。", "Set fill, stroke, shadow, and background colors from the picker or saved swatches."),
              [
                tx("透明度を含む色は重なりや書き出しで見え方が変わります。", "Colors with alpha change appearance when layered or exported."),
                tx("よく使う色は保存パレットへ追加して作業を短縮します。", "Add frequent colors to saved palettes to reduce repeated setup."),
              ],
            ),
            entry(
              "background",
              tx("背景色と透明背景", "Background and transparent output"),
              tx("キャンバス背景色、透明背景、出力形式の相性を確認します。", "Review how canvas background, transparent background, and output format interact."),
              [
                tx("透明背景が必要な場合は PNG または WebP を選びます。JPG は透明を保持しません。", "Use PNG or WebP for transparency. JPG does not preserve transparent pixels."),
                tx("背景画像の上に文字を置く場合は縁取りや影でコントラストを確保します。", "Use stroke or shadow to keep text readable over background images."),
              ],
            ),
          ],
        ),
      ],
    },
    {
      id: "motion",
      label: tx("モーション", "Motion"),
      sections: [
        section(
          "object-motion",
          tx("オブジェクト", "Object"),
          tx("オブジェクトモーション", "Object motion"),
          tx("選択オブジェクトに入場、強調、退場、ループ表現を設定します。", "Apply entrance, emphasis, exit, and loop motion to selected objects."),
          [
            entry(
              "effect-parameters",
              tx("種類・方向・距離・強度", "Type, direction, distance, and intensity"),
              tx("Fade、Slide、Zoom、Rotate、Glow、Blur、Shine などの効果と方向を選びます。", "Choose effects such as Fade, Slide, Zoom, Rotate, Glow, Blur, and Shine plus direction."),
              [
                tx("距離は移動量、強度は発光やぼかしなど効果量に影響します。", "Distance affects movement amount; intensity affects visual amount such as glow or blur."),
                tx("テキスト専用効果はテキスト選択時だけ表示されます。", "Text-only effects appear only for text layers."),
              ],
            ),
            entry(
              "timing-easing",
              tx("開始・長さ・イージング・ループ", "Start, duration, easing, and loop"),
              tx("いつ始まり、どれだけ続き、どの速度曲線で動くかを指定します。", "Define when motion starts, how long it lasts, and which velocity curve it uses."),
              [
                tx("linear は一定速度、Sine/Quad/Cubic などは自然な加減速を作ります。", "linear is constant speed; Sine, Quad, Cubic, and related curves create acceleration and deceleration."),
                tx("Loop ON のセグメントはタイムライン上に 2 周目以降も薄く表示されます。", "Looped segments are echoed faintly on later cycles in the timeline."),
              ],
            ),
          ],
        ),
        section(
          "text-effects",
          tx("文字効果", "Text effects"),
          tx("テキスト専用効果", "Text-only effects"),
          tx("Typewriter、Line reveal、Wave など文字向けの表現を設定します。", "Configure text effects such as Typewriter, Line reveal, and Wave."),
          [
            entry(
              "preview-graph",
              tx("小プレビューとイージンググラフ", "Mini preview and easing graph"),
              tx("Motion タブ内で効果の方向、速度、強弱を確認します。", "Use the Motion tab preview to inspect direction, speed, and strength."),
              [
                tx("小プレビューは選択オブジェクトの効果確認用で、キャンバス全体の再生とは別です。", "The mini preview checks the selected object only; it is separate from whole-canvas playback."),
                tx("グラフは必要に応じて開き、加速・減速の傾向を見ます。", "Open the graph when you need to inspect acceleration and deceleration."),
              ],
            ),
          ],
        ),
      ],
    },
    {
      id: "timeline",
      label: tx("タイムライン", "Timeline"),
      sections: [
        section(
          "playback",
          tx("再生", "Playback"),
          tx("タイムライン再生", "Timeline playback"),
          tx("エディタ内でアニメーションの動きと表示タイミングを確認します。", "Preview animation movement and visibility timing inside the editor."),
          [
            entry(
              "play-reset-lockout",
              tx("Play / Pause / Reset と編集ロック", "Play / Pause / Reset and edit lockout"),
              tx("再生中はキャンバス編集、パネル編集、タイムライン編集を一時的にロックします。", "During playback, canvas, panel, and timeline editing are temporarily locked."),
              [
                tx("Pause で通常編集へ戻ります。Reset は再生位置を 0.0s に戻します。", "Pause returns to normal editing. Reset moves the playhead back to 0.0s."),
                tx("OBS プレビューの P/R/H は再生、リセット、コントロール表示切替です。", "In OBS preview, P/R/H control playback, reset, and control visibility."),
              ],
            ),
            entry(
              "visibility",
              tx("表示条件", "Visibility condition"),
              tx("右パネルのアニメタブが active のときだけタイムラインが表示されます。", "The timeline is shown when the animation tab in the right panel is active."),
              [
                tx("必要ないときは隠れるため、通常のレイヤー編集領域を広く保てます。", "It stays hidden when not needed, keeping more room for ordinary layer editing."),
                tx("タイムライン上端のハンドルで表示高さを変えられます。", "Resize the timeline with the handle on its top edge."),
              ],
            ),
          ],
        ),
        section(
          "timing",
          tx("タイミング", "Timing"),
          tx("開始位置と長さ", "Start and duration"),
          tx("セグメントバーと左右ハンドルでモーションの時間を編集します。", "Edit motion timing with the segment bar and left/right handles."),
          [
            entry(
              "bar-handles",
              tx("バー移動と左右ハンドル", "Bar movement and side handles"),
              tx("バー中央は開始と終了をまとめて移動し、左は開始、右は長さを変更します。", "Dragging the bar moves start and end together; left changes start, right changes duration."),
              [
                tx("最小時間を保ちながら調整されるため、短すぎるセグメントは作られません。", "Minimum duration is preserved so segments do not become too short."),
                tx("Undo/Redo ではタイムライン操作も 1 ステップとして記録されます。", "Undo/Redo records timeline edits as normal editing steps."),
              ],
            ),
          ],
        ),
      ],
    },
    {
      id: "preview",
      label: tx("プレビュー", "Preview"),
      sections: [
        section(
          "selection",
          tx("選択", "Selection"),
          tx("プレビュー選択", "Preview selection"),
          tx("キャンバス上のオブジェクトをクリックまたは範囲で選択します。", "Select objects on the canvas by click or range selection."),
          [
            entry(
              "click-modifier",
              tx("クリック選択と修飾キー", "Click selection and modifier keys"),
              tx("左クリックで前面の対象を選択し、空白クリックで選択解除します。", "Left-click selects the frontmost target; clicking empty space clears selection."),
              [
                tx("Shift/Ctrl/Meta クリックは現在の選択へ追加または解除します。", "Shift/Ctrl/Meta click adds to or removes from the current selection."),
                tx("グループメンバーをクリックした場合、通常はグループ全体を扱います。", "Clicking a group member normally selects the whole group."),
              ],
            ),
            entry(
              "range",
              tx("ホイールボタン範囲選択", "Middle-button range selection"),
              tx("ホイールボタン押し込みドラッグで範囲選択します。", "Press and drag the mouse wheel button to select by rectangle."),
              [
                tx("対象は選択矩形にオブジェクト全体が入ったものだけです。一部だけ重なるものは対象外です。", "Only objects fully enclosed by the rectangle are selected. Partial overlap is ignored."),
                tx("グループはメンバー単位ではなくグループ全体の外接範囲が完全に入った場合だけ選択されます。", "Groups are selected only when the complete group bounds are enclosed, not by individual member overlap."),
                tx("Shift+中ドラッグは追加、Ctrl/Meta+中ドラッグは現在選択から除外します。", "Shift+middle-drag adds; Ctrl/Meta+middle-drag subtracts from the current selection."),
              ],
            ),
          ],
        ),
        section(
          "pan-zoom",
          tx("パン/ズーム", "Pan and zoom"),
          tx("パンとズーム", "Pan and zoom"),
          tx("大きいキャンバスや範囲外オブジェクトを確認するため、表示位置と倍率を調整します。", "Adjust view position and scale to inspect large canvases or off-canvas objects."),
          [
            entry(
              "wheel-pan",
              tx("ホイールズームとパン", "Wheel zoom and pan"),
              tx("ホイールでポインタ周辺を基準に拡大縮小します。Pan ボタン、Space ドラッグ、Alt ドラッグ、右ドラッグでパンします。", "Wheel zooms around the pointer. Use the Pan button, Space-drag, Alt-drag, or right-drag to pan."),
              [
                tx("Ctrl/Meta+ホイールは通常より大きい変化量でズームします。", "Ctrl/Meta+wheel zooms with a larger step."),
                tx("パンは表示位置だけを変え、オブジェクト座標は変更しません。", "Panning changes only the view position, not object coordinates."),
              ],
            ),
            entry(
              "fit",
              tx("全体表示", "Fit canvas"),
              tx("現在のプレビュー領域と出力サイズから倍率を計算し、キャンバス中心をプレビュー中心へ戻します。", "Calculates zoom from the preview area and output size, then centers the canvas in the preview."),
              [
                tx("手動パン後に押すと表示位置もリセットされます。", "After manual panning, this also resets the view position."),
                tx("出力サイズやプリセット変更後の見切れ確認にも使います。", "Use it after output size or preset changes to check for clipping."),
              ],
            ),
            entry(
              "off-canvas",
              tx("キャンバス外表示", "Off-canvas display"),
              tx("編集時は出力範囲外のオブジェクトも見えるよう、表示範囲を必要に応じて広げます。", "During editing, the view expands as needed so off-canvas objects remain visible."),
              [
                tx("範囲外部分は暗く表示され、書き出しでは出力キャンバス内だけが画像化されます。", "Outside regions are dimmed; export renders only the output canvas area."),
                tx("表示範囲の拡張は編集補助であり、出力サイズそのものは変更しません。", "View expansion is an editing aid and does not change output size."),
              ],
            ),
          ],
        ),
        section(
          "output-size",
          tx("サイズ", "Size"),
          tx("プリセットとキャンバスサイズ", "Presets and canvas size"),
          tx("プレビュー上部で出力プリセット、幅、高さ、書き出しメニューを設定します。", "Set output preset, width, height, and export actions in the preview toolbar."),
          [
            entry(
              "preset-width-height",
              tx("プリセット / 幅 / 高さ", "Preset / width / height"),
              tx("YouTube 16:9、Full HD、Twitch panel、Square、Portrait short などを選びます。", "Choose presets such as YouTube 16:9, Full HD, Twitch panel, Square, and Portrait short."),
              [
                tx("幅と高さは 20 から 4096 の範囲で直接入力できます。", "Width and height can be entered directly from 20 to 4096."),
                tx("プリセット変更はキャンバスサイズを変えますが、既存レイヤーは自動で削除しません。", "Changing presets changes canvas size but does not delete existing layers."),
              ],
            ),
            entry(
              "output-menu",
              tx("Output メニュー", "Output menu"),
              tx("JPG、PNG、WebP 書き出しと OBS プレビュー起動を実行します。", "Export JPG, PNG, WebP, or open the OBS preview."),
              [
                tx("PNG と WebP は透明を保持できます。JPG は写真向けで透明は背景色になります。", "PNG and WebP can preserve transparency. JPG suits photos and flattens transparency to the background."),
                tx("OBS プレビューは別ウィンドウで再生確認する用途です。", "OBS preview opens a separate window for playback checking."),
              ],
            ),
          ],
        ),
      ],
    },
    {
      id: "editState",
      label: tx("編集状態", "Edit state"),
      sections: [
        section(
          "save",
          tx("保存", "Save"),
          tx("編集状態の保存", "Saving edit state"),
          tx("作業中データをブラウザに保存し、復元や自動保存を行います。", "Save workspace data in the browser, restore it, or enable autosave."),
          [
            entry(
              "manual-autosave",
              tx("手動保存・復元・Autosave", "Manual save, restore, and Autosave"),
              tx("トップバーの保存アイコンで手動保存し、Autosave ON では編集後に自動保存します。", "Use the top-bar save icon for manual save; Autosave ON saves after edits."),
              [
                tx("復元はキャンバス、素材、出力設定、CSV/HTML 変換情報を戻します。", "Restore brings back canvas, assets, output settings, and CSV/HTML conversion metadata."),
                tx("大容量素材では保存警告が出る場合があります。JSON バックアップも併用してください。", "Large assets may trigger storage warnings. Use JSON backup as well."),
              ],
            ),
            entry(
              "json",
              tx("JSON 書き出し・読み込み", "JSON export and import"),
              tx("ブラウザ外へ作業状態をファイルとして持ち出し、別環境で読み込めます。", "Move workspace state outside the browser as a file and import it elsewhere."),
              [
                tx("バックアップ、共有、端末変更時の移行に使います。", "Use it for backup, sharing, or moving to another device."),
                tx("読み込み時は現在の状態を置き換えるため、必要なら事前に保存します。", "Import replaces the current state, so save first if needed."),
              ],
            ),
          ],
        ),
      ],
    },
    {
      id: "other",
      label: tx("その他", "Other"),
      sections: [
        section(
          "app-settings",
          tx("アプリ設定", "App settings"),
          tx("言語・テーマ・タグ設定", "Language, theme, and tag settings"),
          tx("エディタ全体の表示と言語、タグ辞書、外部連携を管理します。", "Manage editor language, visual theme, tag dictionaries, and integrations."),
          [
            entry(
              "language-theme",
              tx("言語設定とテーマ", "Language and theme"),
              tx("トップバーの言語セレクトで日本語/英語を切り替え、テーマで System/Light/Dark を選びます。", "Use the language selector for Japanese/English and theme selector for System/Light/Dark."),
              [
                tx("マニュアル本文も言語設定に合わせて即時に切り替わります。", "Manual content switches immediately with the language setting."),
                tx("System は OS またはブラウザの prefers-color-scheme に追従します。", "System follows the OS or browser prefers-color-scheme setting."),
              ],
            ),
            entry(
              "tag-modal",
              tx("タグ編集モーダル", "Tag settings modal"),
              tx("共通、画像、グループオブジェクト、テンプレートのタグ候補をカテゴリ別に編集します。", "Edit common, image, group-object, and template tag candidates by category."),
              [
                tx("共通タグは各カテゴリの入力候補として表示されます。", "Common tags appear as suggestions in each category."),
                tx("タグ検索の精度を保つため、不要な候補はこのモーダルで整理します。", "Clean up unused candidates here to keep tag search precise."),
              ],
            ),
            entry(
              "issue-pwa-extension",
              tx("Issue 報告・PWA・拡張連携", "Issue reporting, PWA, and extension integration"),
              tx("Issue reporting は GitHub Issues を開き、対応ブラウザでは PWA インストールや拡張連携を利用できます。", "Issue reporting opens GitHub Issues, and supported browsers can use PWA install and extension integration."),
              [
                tx("拡張連携では ping、getSnapshot、applySnapshot のメッセージを提供します。", "Extension integration provides ping, getSnapshot, and applySnapshot messages."),
                tx("PWA はブラウザ対応状況により表示されない場合があります。", "PWA install UI depends on browser support."),
              ],
            ),
          ],
        ),
        section(
          "gui",
          tx("GUI 調整", "GUI"),
          tx("表示・非表示とサイズ調整", "Visibility and size adjustment"),
          tx("作業内容に合わせてパネル、タブ、一覧、タイムラインの表示密度を調整します。", "Adjust panel, tab, list, and timeline density to match the current work."),
          [
            entry(
              "collapse-resize",
              tx("折りたたみと一覧高さ", "Collapse and list height"),
              tx("Quick Add、Canvas、Assets、Colors などは折りたたみやリサイズに対応します。", "Quick Add, Canvas, Assets, Colors, and similar panels support collapse and resizing."),
              [
                tx("Layers、Registered templates、Assets 画像、Assets グループ素材はハンドルで高さを変えます。", "Layers, Registered templates, Asset images, and Asset group lists can be resized with handles."),
                tx("確認量を増やす時は広げ、プレビュー作業を優先する時は縮めます。", "Expand when reviewing many items; shrink when prioritizing preview work."),
              ],
            ),
            entry(
              "timeline-manual",
              tx("タイムラインとマニュアル", "Timeline and manual"),
              tx("タイムラインは上端ハンドルで高さを調整し、マニュアルは右目次と本文スクロールで詳細を確認します。", "Resize the timeline with its top handle, and use the manual table of contents plus content scrolling for details."),
              [
                tx("モバイル幅ではサイドタブと目次が縦方向に再配置されます。", "At mobile width, side tabs and the table of contents are rearranged vertically."),
                tx("マニュアルは最後に開いた分類、項目、スクロール位置を保持します。", "The manual preserves the last category, section, and scroll position."),
              ],
            ),
          ],
        ),
        section(
          "shortcuts",
          tx("ショートカット", "Shortcuts"),
          tx("キーボード・マウス操作", "Keyboard and mouse operations"),
          tx("テキスト入力やモーダル外で使える編集操作です。特にプレビュー操作をまとめます。", "Editing operations available outside text inputs and modal dialogs, with preview actions called out."),
          [
            entry(
              "keyboard",
              tx("Delete / Ctrl+C / Ctrl+V / Ctrl+X / Ctrl+D / Ctrl+Z / Ctrl+Y", "Delete / Ctrl+C / Ctrl+V / Ctrl+X / Ctrl+D / Ctrl+Z / Ctrl+Y"),
              tx("削除、コピー、貼り付け、切り取り、複製、Undo、Redo を実行します。", "Delete, copy, paste, cut, duplicate, undo, and redo selected objects."),
              [
                tx("テキスト入力中は入力を優先し、編集ショートカットは抑制されます。", "While typing text, text input takes priority and editor shortcuts are suppressed."),
                tx("削除は確認ダイアログを通して誤削除を防ぎます。", "Deletion uses confirmation to avoid accidental removal."),
              ],
            ),
            entry(
              "mouse-preview",
              tx("プレビューのマウス操作", "Preview mouse operations"),
              tx("左ドラッグは移動、角ハンドルはリサイズ、上丸ハンドルは回転、ホイールはズーム、中ドラッグは範囲選択です。", "Left-drag moves, corner handles resize, the top round handle rotates, wheel zooms, and middle-drag range-selects."),
              [
                tx("Space/Alt/右ドラッグはパン操作です。", "Space-drag, Alt-drag, and right-drag pan the view."),
                tx("中ドラッグの範囲選択は完全に囲った対象だけを選択します。", "Middle-drag range selection selects only fully enclosed targets."),
              ],
            ),
          ],
        ),
      ],
    },
  ];

  return {
    title: tx("マニュアル", "Manual"),
    subtitle: tx(
      "主要機能、パラメータ、ショートカット、GUI 調整を分類別に確認できます。",
      "Review major features, parameters, shortcuts, and GUI adjustments by category.",
    ),
    closeLabel: tx("マニュアルを閉じる", "Close manual"),
    categoryTabsLabel: tx("マニュアル機能タブ", "Manual feature tabs"),
    sectionTabsLabel: (categoryLabel) => tx(`${categoryLabel} セクション`, `${categoryLabel} sections`),
    relatedHeading: tx("関連機能", "Related features"),
    tocHeading: tx("目次", "Contents"),
    categories,
  };
}
