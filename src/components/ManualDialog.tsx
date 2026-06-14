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
                onScroll={(event) => onStateChange({ ...state, scrollTop: event.currentTarget.scrollTop })}
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
  const entry = (id: string, title: string, body: string, details: string[] = []): ManualEntry => ({ id, title, body, details });
  const related = [
    { categoryId: "preview" as const, sectionId: "selection", label: tx("プレビュー選択", "Preview selection") },
    { categoryId: "layers" as const, sectionId: "canvas", label: tx("Canvas", "Canvas") },
    { categoryId: "adjust" as const, sectionId: "common", label: tx("Adjust: Common settings", "Adjust: Common settings") },
  ];
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
        section("generators", tx("生成", "Generators"), tx("テンプレート生成", "Template generators"), tx("Templates タブの生成機能で、用途別の初期レイアウトを作成します。", "Use generator actions in the Templates tab to create starter layouts for each use case."), [
          entry("schedule", tx("スケジュール生成", "Schedule generator"), tx("月間または週間の予定表を編集可能なテキスト/図形レイヤーとして生成します。", "Generates a monthly or weekly schedule as editable text and shape layers."), [
            tx("Schedule type: monthly は月全体、weekly は指定週だけを表示します。", "Schedule type: monthly shows the full month; weekly shows only the selected week."),
            tx("Canvas orientation: landscape は 16:9、portrait は 9:16、current は現在のキャンバスサイズを使います。", "Canvas orientation: landscape uses 16:9, portrait uses 9:16, and current keeps the current canvas size."),
            tx("Week starts on / weekday language / date format: 曜日順、曜日表記、日付の見せ方を変えます。", "Week starts on / weekday language / date format: changes weekday order, weekday labels, and date display."),
            tx("Grid / corner radius / stroke width: 予定表の枠線、カードの丸み、罫線の強さを調整します。", "Grid / corner radius / stroke width: controls calendar frames, card rounding, and line strength."),
          ]),
          entry("thumbnail", tx("通常・縦型・待機画面", "Standard, vertical, and stream waiting"), tx("動画サムネイル、縦型サムネイル、配信待機画面の初期構成を作ります。", "Creates initial layouts for video thumbnails, portrait thumbnails, and stream waiting screens."), [
            tx("Placement pattern: 画像枠、タイトル、ラベルの配置パターンを切り替えます。", "Placement pattern: switches image frame, title, and label placement."),
            tx("Tone: Bold は強いコントラスト、Clean は整理された余白、Neon は発光色を重視します。", "Tone: Bold emphasizes contrast, Clean emphasizes spacing, and Neon emphasizes glowing color accents."),
            tx("Include image slot: ON で画像差し替え用の枠を生成します。", "Include image slot: ON creates a replaceable image frame."),
            tx("Add animation: stream waiting screen で待機画面向けのアニメーション初期値を付与します。", "Add animation: adds starter animation metadata for stream waiting screens."),
          ]),
          entry("save-settings", tx("Generate objects / Save settings", "Generate objects / Save settings"), tx("生成と設定保存の違いを理解して使い分けます。", "Use generation and setting persistence intentionally."), [
            tx("Generate objects: 現在のキャンバスを生成結果で置き換え、同時に設定も保存します。", "Generate objects: replaces the current canvas with generated layers and also saves the settings."),
            tx("Save settings: キャンバスを変えず、次回の生成フォーム初期値だけを保存します。", "Save settings: stores the next form defaults without changing the canvas."),
            tx("Live preview: 生成前に文字量、色、余白、画像枠のバランスを確認するための軽量プレビューです。", "Live preview: a lightweight check for text volume, colors, spacing, and image-frame balance before generation."),
          ]),
        ]),
        section("registered", tx("登録済み", "Registered"), tx("Registered templates", "Registered templates"), tx("ブラウザ内に保存したテンプレートを再利用します。", "Reuse named templates saved in the browser."), [
          entry("save-load-delete", tx("保存・読み込み・削除", "Save, load, and delete"), tx("現在のキャンバス、素材参照、出力サイズ、互換情報をテンプレートとして保存します。", "Saves the current canvas, asset references, output size, and compatibility metadata as a template."), [
            tx("Template name: 一覧で識別する名前です。同名でも別エントリとして保存されます。", "Template name: the display name in the list. Duplicate names are kept as separate entries."),
            tx("Load: 現在の作業状態を置き換えるため、確認後にテンプレート内容を適用します。", "Load: replaces the current workspace after confirmation."),
            tx("Delete: 保存済みテンプレートだけを削除し、現在のキャンバスは変更しません。", "Delete: removes the saved template only and does not change the current canvas."),
          ]),
          entry("tags-filter", tx("タグ検索と一覧サイズ", "Tag filter and list size"), tx("テンプレートの絞り込みと一覧の表示密度を調整します。", "Controls template filtering and list density."), [
            tx("Tags: 保存時の分類ラベルです。既存候補から選択しても自由入力しても構いません。", "Tags: classification labels added at save time. Choose existing suggestions or type freely."),
            tx("Tag filter: 選択したタグを持つテンプレートだけを表示します。", "Tag filter: shows only templates with the selected tag."),
            tx("List height handle: 一覧の高さを広げると多くのテンプレートを比較しやすく、縮めるとプレビュー領域を広く使えます。", "List height handle: expand to compare more templates, shrink to keep more room for the preview."),
          ]),
        ]),
      ],
    },
    {
      id: "layers",
      label: tx("レイヤー", "Layers"),
      sections: [
        section("quick-add", tx("追加", "Add"), tx("Quick Add", "Quick Add"), tx("Layers タブからよく使うオブジェクトをキャンバスへ追加します。", "Add common objects to the canvas from the Layers tab."), [
          entry("text-shape-line", tx("テキスト・図形・線", "Text, shapes, and lines"), tx("テキスト、見出し、図形、線、バッジ、区切り線を追加します。", "Adds text, headings, shapes, lines, badges, and dividers."), [
            tx("Basic text / Headline / Subtitle: 文字量と初期サイズが異なるテキストレイヤーを追加します。", "Basic text / Headline / Subtitle: adds text layers with different starter size and text volume."),
            tx("Basic shape / Badge: 塗りと線を持つ図形を追加します。角丸、影、ベベルにも対応します。", "Basic shape / Badge: adds fill/stroke shapes that also support radius, shadow, and bevel."),
            tx("Basic line / Divider: 実線、点線、破線、波線へ変更できる線レイヤーを追加します。", "Basic line / Divider: adds line layers that can become solid, dotted, dashed, or wave lines."),
          ]),
          entry("asset-image", tx("選択中画像・グループ素材", "Selected images and group assets"), tx("Assets で選択中の画像やグループオブジェクトをキャンバスに配置します。", "Places the selected image or group object from Assets onto the canvas."), [
            tx("Selected image: 選択中の画像素材を画像レイヤーとして追加します。", "Selected image: inserts the selected image asset as an image layer."),
            tx("Group object: 登録済みの複数レイヤー構成を新しい ID で複製して配置します。", "Group object: duplicates a registered multi-layer composition with new ids."),
            tx("配置後は Canvas 一覧、Adjust、プレビュー操作で通常のオブジェクトとして編集できます。", "After placement, edit it from Canvas, Adjust, or direct preview operations like any other object."),
          ]),
        ]),
        section("canvas", tx("Canvas", "Canvas"), tx("Canvas object list", "Canvas object list"), tx("配置済みオブジェクトの順序、表示、ロック、グループ、整列を管理します。", "Manages order, visibility, lock state, grouping, and alignment for placed objects."), [
          entry("order-visibility-lock", tx("重なり順・表示・ロック", "Order, visibility, and lock"), tx("Canvas 一覧は上の行ほど前面に表示されます。", "Rows near the top of Canvas render in front."), [
            tx("Visibility: OFF のオブジェクトはプレビュー、範囲選択、書き出しに出ません。", "Visibility: OFF excludes the object from preview, range selection, and export."),
            tx("Lock: ON のオブジェクトは表示されたままですが、選択や移動の対象外になります。", "Lock: ON keeps the object visible but prevents selection and movement."),
            tx("Delete: 確認後に対象を削除します。Ctrl+削除は確認省略の高速操作です。", "Delete: removes the target after confirmation. Ctrl+delete is the fast path where available."),
          ]),
          entry("groups", tx("グループ", "Groups"), tx("複数オブジェクトを一まとまりとして扱います。", "Treats multiple objects as one composition."), [
            tx("Group selected objects: 選択中の複数オブジェクトに共通 groupId を付けます。", "Group selected objects: assigns a shared groupId to selected objects."),
            tx("Individual edit: グループを解除せず、1 メンバーだけを Adjust で編集します。", "Individual edit: edits one member in Adjust without ungrouping."),
            tx("Register group object: よく使うグループを Assets の再利用素材として保存します。", "Register group object: saves a frequent group as a reusable asset in Assets."),
          ]),
          entry("align-distribute", tx("整列・分布・キャンバスに合わせる", "Align, distribute, and fit to canvas"), tx("選択中オブジェクトの位置とサイズを揃えます。", "Aligns selected object positions and sizes."), [
            tx("Left / Center / Right / Top / Middle / Bottom: 1 件選択ではキャンバス、複数選択では選択範囲を基準に揃えます。", "Left / Center / Right / Top / Middle / Bottom: one object aligns to the canvas; multiple objects align to their combined bounds."),
            tx("Distribute H / Distribute V: 3 件以上の中心間隔を横または縦に均等化します。", "Distribute H / Distribute V: evenly spaces centers horizontally or vertically for three or more objects."),
            tx("Fit to canvas: 選択中の画像または図形を出力キャンバスいっぱいに合わせます。", "Fit to canvas: resizes selected images or shapes to fill the output canvas."),
          ]),
        ]),
      ],
    },
    {
      id: "assets",
      label: tx("素材", "Assets"),
      sections: [
        section("images", tx("画像", "Images"), tx("画像素材", "Image assets"), tx("ローカル画像を登録し、タグ、配置、削除を管理します。", "Register local images and manage tags, placement, and deletion."), [
          entry("register-tags", tx("ファイル・フォルダ登録とタグ", "File or folder import and tags"), tx("画像ファイルまたは対応ブラウザのフォルダ選択から素材を追加します。", "Adds assets from image files or supported browser folder selection."), [
            tx("Image files: 対応 MIME/拡張子の画像だけを読み込みます。", "Image files: imports only supported image MIME types or extensions."),
            tx("Folder import: 選択フォルダ直下の対応画像をまとめて登録し、画像以外は無視します。", "Folder import: registers supported images directly under the selected folder and ignores non-images."),
            tx("Import tags: 登録前に付けるタグです。チップにしていない入力中テキストも登録時に反映されます。", "Import tags: tags added before registration. Draft text not yet chipped is also committed on register."),
          ]),
          entry("row-actions-resize", tx("行アクションと一覧サイズ", "Row actions and list size"), tx("素材行の操作ボタンと一覧高さを使い分けます。", "Use asset row actions and list height controls depending on the task."), [
            tx("Add to canvas: 選択画像を画像レイヤーとしてキャンバスに追加します。", "Add to canvas: inserts the selected image as an image layer."),
            tx("Image Lab: 選択画像を切り抜き/透過処理用モーダルで開きます。", "Image Lab: opens the selected image in the cutout/transparency modal."),
            tx("Delete asset: 素材を削除し、その素材を参照する画像レイヤーも削除します。", "Delete asset: removes the asset and any image layers that reference it."),
            tx("Image list height: 素材確認を優先する時は広げ、キャンバス作業を優先する時は縮めます。", "Image list height: expand for asset review, shrink for canvas work."),
          ]),
        ]),
        section("image-lab", tx("Image Lab", "Image Lab"), tx("Image Lab", "Image Lab"), tx("画像を切り抜き、背景を透過し、新しい素材として追加します。", "Cuts out images, keys backgrounds, and adds processed results as new assets."), [
          entry("crop", tx("矩形・円形・自由選択", "Rectangle, circle, and freeform selection"), tx("切り抜き形状とプレビュー上の編集方法を選びます。", "Choose the cutout shape and edit it directly on the preview."), [
            tx("Rect: ドラッグで矩形を作り、角/辺ハンドルでサイズ変更します。", "Rect: drag to create a rectangle, then resize with corner or side handles."),
            tx("Circle: 楕円範囲を作ります。角ハンドルは比率を保ち、辺ハンドルは片側だけを動かします。", "Circle: creates an ellipse. Corner handles preserve ratio; side handles move one side."),
            tx("Polygon: 左クリックで点を追加、ドラッグで点移動、Alt+クリックで点削除します。", "Polygon: left-click adds points, dragging moves points, and Alt+click deletes points."),
            tx("Wheel / right-drag: Image Lab プレビューのズームとパンです。", "Wheel / right-drag: zooms and pans the Image Lab preview."),
          ]),
          entry("chroma-add", tx("クロマキーと素材追加", "Chroma key and add asset"), tx("指定色に近い背景を透明化し、処理結果を追加します。", "Keys out colors near the selected background color and adds the processed result."), [
            tx("Key color: 透明化の基準色です。スポイトや色入力で背景に近い色を指定します。", "Key color: the reference color to remove. Pick or enter a color close to the background."),
            tx("Tolerance: 値が大きいほど近い色まで透明化します。境界が消えすぎる時は下げます。", "Tolerance: higher values remove more nearby colors. Lower it if edges disappear too much."),
            tx("Add processed image: 元画像は残し、処理後 PNG を新しい素材として追加します。", "Add processed image: keeps the source and registers the processed PNG as a new asset."),
          ]),
        ]),
      ],
    },
    {
      id: "adjust",
      label: tx("調整", "Adjust"),
      sections: [
        section("common", tx("共通", "Common"), tx("Common settings", "Common settings"), tx("選択中オブジェクトの基本的な位置、サイズ、見た目を調整します。", "Adjusts the selected object's basic geometry and appearance."), [
          entry("geometry", tx("X / Y / 幅 / 高さ / 回転", "X / Y / width / height / rotation"), tx("数値入力、スライダー、プレビュー上のハンドルで幾何情報を編集します。", "Edits geometry through inputs, sliders, and preview handles."), [
            tx("X / Y: 出力キャンバス左上を基準にした位置です。", "X / Y: position from the output canvas top-left."),
            tx("Width / Height: レイヤーの表示枠です。画像、図形、縦書き/横書きテキストの選択枠に影響します。", "Width / Height: the display bounds for image, shape, and vertical/horizontal text selection."),
            tx("Rotation: 中心を基準に時計回りの角度で回転します。Reset rotation で 0 に戻します。", "Rotation: clockwise rotation around the center. Reset rotation returns it to 0."),
            tx("Opacity: 1 が不透明、0 が透明です。非表示とは違い、オブジェクト自体は残ります。", "Opacity: 1 is opaque and 0 is transparent. Unlike hidden state, the object remains present."),
          ]),
          entry("opacity-effects", tx("ぼかし・影", "Blur and shadow"), tx("全体ぼかし、縁ぼかし、影で背景とのなじみや視認性を調整します。", "Uses blur and shadow to control blending and readability."), [
            tx("Layer blur: レイヤー全体をぼかします。写真や背景装飾を柔らかくする用途です。", "Layer blur: blurs the whole layer, useful for soft photos or background decoration."),
            tx("Edge blur: 正の値は外側を柔らかく、負の値は内側の縁を柔らかくします。", "Edge blur: positive values soften outside edges; negative values soften inside edges."),
            tx("Edge blur stroke: ON で文字縁取りや図形線も縁ぼかしに含めます。OFF では線をシャープに保ちます。", "Edge blur stroke: ON includes text strokes and shape strokes in edge blur; OFF keeps strokes sharp."),
            tx("Enable shadow: ON にすると色、透明度、ぼかし、距離、角度の影パラメータが有効になります。", "Enable shadow: ON enables shadow color, opacity, blur, distance, and angle controls."),
          ]),
          entry("pseudo-3d-bevel", tx("疑似 3D・ベベル", "Pseudo 3D and bevel"), tx("平面レイヤーに奥行きや面取り風の装飾を追加します。", "Adds depth-like or beveled decoration to flat layers."), [
            tx("3D rotate X / Y: レイヤー面を上下/左右に傾けたように見せます。", "3D rotate X / Y: makes the layer plane look tilted vertically or horizontally."),
            tx("Bevel size: 正負でハイライトと影の向きを反転できます。", "Bevel size: positive and negative values flip highlight and shadow direction."),
            tx("Bevel opacity: 面取りの強さです。高すぎると文字や細線が濁って見えます。", "Bevel opacity: controls bevel strength. High values can muddy text or thin lines."),
          ]),
        ]),
        section("text", tx("テキスト", "Text"), tx("Text settings", "Text settings"), tx("テキストレイヤー専用の文字内容、組版、塗り、縁取りを編集します。", "Edits text-layer content, typography, fill, and stroke."), [
          entry("typography", tx("本文・フォント・サイズ・行間・字間", "Content, font, size, line height, and letter spacing"), tx("文字の読みやすさと収まりを決める設定です。", "Controls text readability and fit."), [
            tx("Text: 実際に表示される文字列です。改行はレイヤー内の行分割になります。", "Text: the displayed string. Line breaks create separate lines inside the layer."),
            tx("Font: システムフォント、Google Fonts、インポート済みカスタムフォントから選びます。", "Font: choose from system fonts, Google Fonts, and imported custom fonts."),
            tx("Font size: 文字の大きさです。Fit text to box は枠に収まる最大サイズを自動計算します。", "Font size: text size. Fit text to box calculates the largest size that fits the bounds."),
            tx("Line height: 複数行の上下間隔です。1 行テキストでは効果が小さいため無効になる場合があります。", "Line height: vertical spacing between lines. It may be disabled for single-line text."),
            tx("Letter spacing: 文字間隔です。0 は通常、正の値は広げ、負の値は詰めます。", "Letter spacing: character spacing. 0 is normal, positive expands, negative tightens."),
          ]),
          entry("paint", tx("塗り・縁取り・整列・縦書き", "Fill, stroke, alignment, and vertical writing"), tx("文字色、アウトライン、揃え方、縦横方向を制御します。", "Controls text color, outline, alignment, and writing direction."), [
            tx("Fill: 文字本体の色です。色表示を押すとアルファ付きカラーピッカーを開きます。", "Fill: text body color. Clicking the color display opens the alpha color picker."),
            tx("Stroke / stroke width: 文字の縁取りです。背景画像上の可読性を上げます。", "Stroke / stroke width: text outline, useful for readability over images."),
            tx("Left / Center / Right: テキスト枠内での横方向の揃え方です。", "Left / Center / Right: horizontal alignment inside the text bounds."),
            tx("Writing mode: horizontal は横書き、vertical は縦書きです。縦書きも同じ Width/Height 枠でリサイズします。", "Writing mode: horizontal writes left-to-right; vertical writes in columns and still resizes through Width/Height bounds."),
          ]),
        ]),
        section("shape-image", tx("図形・画像", "Shape and image"), tx("Shape settings / Image settings", "Shape settings / Image settings"), tx("図形と画像に固有の設定を編集します。", "Edits settings specific to shapes and images."), [
          entry("shape", tx("塗り・線・角丸・線種", "Fill, stroke, radius, and line style"), tx("図形の面、輪郭、角、線の表現を設定します。", "Controls shape fill, outline, corners, and line rendering."), [
            tx("Shape dropdown: rectangle は矩形、ellipse は楕円、triangle/diamond/pentagon/hexagon/star は多角形です。", "Shape dropdown: rectangle is a box, ellipse is an oval, and triangle/diamond/pentagon/hexagon/star are polygon shapes."),
            tx("Fill / Stroke: 図形の面色と輪郭色です。Fill/Stroke ボタンや色表示から変更します。", "Fill / Stroke: shape face and outline colors, edited from Fill/Stroke controls or color displays."),
            tx("Corner radius: 矩形や対応多角形の角を丸めます。", "Corner radius: rounds rectangle or supported polygon corners."),
            tx("Line style: solid は実線、dotted は点線、dashed は破線、wave は滑らかな波線です。", "Line style: solid is a continuous line, dotted is dots, dashed is broken strokes, and wave is a smooth wave."),
          ]),
          entry("image", tx("フィット・クロップ・画像効果", "Fit, crop, and image effects"), tx("画像の見え方と簡易フィルターを調整します。", "Controls image fitting and lightweight filters."), [
            tx("Image key: レイヤーが参照している素材です。素材が 1 件だけの時は切り替えが無効になる場合があります。", "Image key: the referenced asset. Switching may be disabled when only one asset is available."),
            tx("Gray: 0 は通常色、1 は完全なグレースケールです。", "Gray: 0 keeps color, 1 makes the image fully grayscale."),
            tx("Blur: 画像自体をぼかします。背景や遠近感の演出に向きます。", "Blur: blurs the image itself, useful for background or depth effects."),
            tx("Bright / Contrast: 明るさとコントラストを割合で調整します。100 が標準です。", "Bright / Contrast: adjusts brightness and contrast by percent. 100 is normal."),
            tx("Mosaic: 0 で無効、値を上げるほど大きいブロック状になります。", "Mosaic: 0 disables it; higher values create larger pixel blocks."),
          ]),
        ]),
      ],
    },
    {
      id: "colors",
      label: tx("色", "Colors"),
      sections: [
        section("palette", tx("パレット", "Palette"), tx("色と保存パレット", "Colors and saved palettes"), tx("Colors タブで単色、配色パターン、保存済みパレットを管理します。", "Use the Colors tab to manage single colors, palette patterns, and saved palettes."), [
          entry("picker", tx("カラーピッカーとスウォッチ", "Color picker and swatches"), tx("現在色、登録色、最近使った色、パレット色を選びます。", "Choose current color, registered colors, recent colors, and palette colors."), [
            tx("HEX/RGB/alpha: 色コード、RGB チャンネル、透明度を直接編集します。", "HEX/RGB/alpha: directly edits color code, RGB channels, and transparency."),
            tx("Recent colors: 最近使った色をすばやく再利用します。", "Recent colors: quickly reuses recently used colors."),
            tx("Registered colors: 名前付き単色として保存し、Fill または Stroke に直接適用できます。", "Registered colors: saved named single colors can be applied directly as Fill or Stroke."),
            tx("Saved palette sets: 複数色の配色セットです。各色を Fill/Stroke として適用できます。", "Saved palette sets: multi-color schemes where each color can be applied as Fill or Stroke."),
            tx("Palette pattern: analogous は近い色、opponent は補色、triad/tetrad は均等配置色、tone-on-tone は同系色の濃淡を作ります。", "Palette pattern: analogous uses nearby hues, opponent uses complements, triad/tetrad use evenly spaced hues, and tone-on-tone creates related tonal colors."),
          ]),
          entry("background", tx("背景色と透明背景", "Background and transparent output"), tx("キャンバス背景と書き出し形式の関係を確認します。", "Checks how canvas background and export format interact."), [
            tx("Background: 出力キャンバスの背景色です。透明背景でない場合は書き出しにも反映されます。", "Background: output canvas background color, included in export unless transparency is used."),
            tx("PNG / WebP: 透明を保持できます。ロゴや配信用素材に向きます。", "PNG / WebP: can preserve transparency, useful for logos and stream assets."),
            tx("JPG: 透明を保持せず背景色に合成します。写真中心のサムネイルに向きます。", "JPG: flattens transparency to the background color, useful for photo-heavy thumbnails."),
          ]),
        ]),
      ],
    },
    {
      id: "motion",
      label: tx("アニメ", "アニメ"),
      sections: [
        section("object-motion", tx("オブジェクト", "Object"), tx("アニメタブ: オブジェクト設定", "アニメ tab: object settings"), tx("右パネルのアニメタブで、選択オブジェクトの動き、効果、再生タイミングを設定します。", "Use the right-panel アニメ tab to configure movement, effects, and timing for the selected object."), [
          entry("effect-parameters", tx("モーション / 発光 / エフェクト の項目", "Motion / Glow / effects items"), tx("画面上のモーションと発光 / エフェクトの各項目が、どの表現になるかを示します。", "Explains what each Motion and Glow / effects dropdown item does."), [
            tx("モーション: なしは移動なし、Slide は指定方向から入場、Drift は往復するゆっくり移動、Shake は短い揺れを作ります。", "Motion: None disables movement, Slide enters from the selected direction, Drift slowly oscillates, and Shake creates a quick jitter."),
            tx("発光 / エフェクト: なしは追加効果なし、フェードは透明から表示、Pop は小さく始まり拡大、Pulse は拡大縮小を繰り返します。", "Glow / effects: None disables extra effects, Fade appears from transparent, Pop starts small and grows, and Pulse repeats subtle scaling."),
            tx("発光 / エフェクト: Blink は点滅、Zoom は軽く拡大しながら表示、Spin は短い回転、Sway は左右の揺れ、Breathe はゆっくり呼吸する拡大縮小です。", "Glow / effects: Blink flashes, Zoom appears with slight scale, Spin rotates briefly, Sway rocks side to side, and Breathe slowly scales like breathing."),
            tx("発光 / エフェクト: 発光パルスは発光を脈動、ぼかしインはぼかしから明瞭化、シャインは光が走るような強調表現です。", "Glow / effects: Glow pulse pulses brightness, Blur in resolves from blur, and Shine adds a sweeping highlight."),
            tx("Effect intensity: 発光パルス / ぼかしイン / シャインの強さです。対象外の項目では無効化されます。", "Effect intensity: strength for Glow pulse, Blur in, and Shine. It is disabled for choices that do not use it."),
          ]),
          entry("timing-easing", tx("開始・長さ・イージング・方向・距離・ループ", "Start, duration, easing, direction, distance, and loop"), tx("アニメーションの時間軸と速度変化を決めます。", "Controls animation timing and velocity."), [
            tx("Start: タイムライン上でアニメーションが始まる秒数です。", "Start: the time on the timeline when the animation begins."),
            tx("Duration: 効果が続く長さです。短いほど速く、長いほどゆっくり見えます。", "Duration: how long the effect lasts. Shorter feels faster; longer feels slower."),
            tx("Easing: Linear は一定速度、Ease in は徐々に加速、Ease out は徐々に減速、Ease in/out は開始と停止をなめらかにします。", "Easing: Linear is constant speed, Ease in accelerates, Ease out decelerates, and Ease in/out smooths both start and stop."),
            tx("Easing family: Sine は自然で軽い、Cubic/Quart/Quint は強め、Back/Elastic/Bounce は跳ねや戻りを含む演出です。", "Easing family: Sine is light and natural, Cubic/Quart/Quint are stronger, and Back/Elastic/Bounce add overshoot or bounce."),
            tx("Direction: None は方向なし、Left/Right/Up/Down は Slide/Drift/Shake の移動方向です。", "Direction: None has no direction; Left/Right/Up/Down set the movement direction for Slide, Drift, and Shake."),
            tx("Distance: 移動量です。Direction が None または対象外の Motion では無効になります。", "Distance: movement amount. It is disabled when Direction is None or the Motion choice does not use movement."),
            tx("Loop animation: ON で同じ効果を繰り返します。タイムラインには後続ループが薄く表示されます。", "Loop animation: ON repeats the effect. Later cycles appear faintly on the timeline."),
          ]),
        ]),
        section("text-effects", tx("文字効果", "Text effects"), tx("アニメタブ: テキスト専用モーション", "アニメ tab: text-only motion"), tx("テキストレイヤー選択時だけ表示される文字向け表現です。", "Text-specific controls that appear only when a text layer is selected."), [
          entry("preview-graph", tx("モーションプリセット / テキスト専用モーション / 小プレビュー", "Motion presets / Text-only motion / mini preview"), tx("プリセット、文字効果、プレビュー、イージンググラフの意味を確認します。", "Explains presets, text effects, preview, and the easing graph."), [
            tx("モーションプリセット: Soft entry はフェード入場、News ticker はテロップ風スライド、Neon pulse は発光ループです。", "Motion presets: Soft entry fades in, News ticker slides like a ticker, and Neon pulse loops glowing emphasis."),
            tx("モーションプリセット: Countdown pop は短いポップ強調、Type on はタイプ表示、Background breathe は背景向けのゆっくり拡大縮小です。", "Motion presets: Countdown pop is a short pop emphasis, Type on types text on, and Background breathe is slow background scaling."),
            tx("テキスト専用モーション: なしは文字専用効果なし、タイプ表示は文字を順に表示、行ごと表示は行単位で表示、文字ウェーブは文字に波の動きを付けます。", "Text-only motion: None disables text-only effects, Typewriter reveals characters one by one, Line reveal reveals by line, and Text wave adds a wave motion to characters."),
            tx("Motion preview: 選択オブジェクトだけを小さく再生し、全体タイムラインとは別に効果を確認します。", "Motion preview: plays only the selected object at small size, separate from the full timeline."),
            tx("Show/Hide easing graph: 選択中のイージングがどのように加速/減速するかを曲線で確認します。", "Show/Hide easing graph: shows how the selected easing accelerates and decelerates."),
          ]),
        ]),
      ],
    },
    {
      id: "timeline",
      label: tx("タイムライン", "Timeline"),
      sections: [
        section("playback", tx("再生", "Playback"), tx("Timeline playback", "Timeline playback"), tx("アニメタブが active の時だけ表示される下部タイムラインで再生確認します。", "Preview playback in the bottom timeline, visible only while the アニメ tab is active."), [
          entry("play-reset-lockout", tx("Play / Pause / Reset と編集ロック", "Play / Pause / Reset and edit lockout"), tx("再生中は編集操作を一時的に止め、見た目の確認を優先します。", "During playback, editing is temporarily locked so you can verify motion."), [
            tx("Play: タイムラインの現在位置から再生し、プレビュー上でアニメーションを確認します。", "Play: starts playback from the current timeline position."),
            tx("Pause: 再生を止め、通常の編集状態に戻します。", "Pause: stops playback and returns to normal editing."),
            tx("Reset: 再生位置を 0.0s に戻します。", "Reset: returns playback position to 0.0s."),
            tx("Playback lockout: 再生中は Canvas、Adjust、タイムラインハンドル、プレビュー選択が操作できません。", "Playback lockout: Canvas, Adjust, timeline handles, and preview selection are inactive while playing."),
          ]),
          entry("visibility", tx("表示条件", "Visibility condition"), tx("タイムラインが表示される条件と高さ調整です。", "Explains when the timeline appears and how its height is adjusted."), [
            tx("表示条件: 右パネルのアニメタブが選択されている時だけ表示されます。", "Visibility: appears only when the right-panel アニメ tab is selected."),
            tx("Collapse / Expand: タイムラインをたたんでプレビュー領域を広げます。", "Collapse / Expand: hides or restores the timeline to give the preview more room."),
            tx("Resize handle: 上端ハンドルをドラッグしてタイムライン高さを変更します。", "Resize handle: drag the top edge to change timeline height."),
          ]),
        ]),
        section("timing", tx("タイミング", "Timing"), tx("Start and duration", "Start and duration"), tx("セグメントバーとハンドルでアニメーション時間を直接編集します。", "Edit animation timing directly through segment bars and handles."), [
          entry("bar-handles", tx("バー移動と左右ハンドル", "Bar movement and side handles"), tx("タイムライン上のセグメントは開始位置と長さを視覚的に表します。", "Timeline segments visually represent start time and duration."), [
            tx("Segment bar drag: 開始と終了をまとめて移動します。", "Segment bar drag: moves start and end together."),
            tx("Left handle: 開始時刻を変更します。終了時刻は維持されます。", "Left handle: changes start time while preserving the end time."),
            tx("Right handle: 長さを変更します。開始時刻は維持されます。", "Right handle: changes duration while preserving start time."),
            tx("Loop echo: Loop animation が ON の時、2 周目以降が薄いセグメントで表示されます。", "Loop echo: when Loop animation is ON, later cycles appear as faint segments."),
          ]),
        ]),
      ],
    },
    {
      id: "preview",
      label: tx("プレビュー", "Preview"),
      sections: [
        section("selection", tx("選択", "Selection"), tx("プレビュー選択", "Preview selection"), tx("キャンバス上のオブジェクトをクリックまたは範囲で選択します。", "Select objects on the canvas by click or range selection."), [
          entry("click-modifier", tx("クリック選択と修飾キー", "Click selection and modifier keys"), tx("プレビュー上の直接選択ルールです。", "Direct selection rules on the preview."), [
            tx("Left click: 前面の選択可能オブジェクトを選びます。", "Left click: selects the frontmost selectable object."),
            tx("Blank click: オブジェクトやハンドル以外の場所で選択解除します。", "Blank click: clears selection when clicking away from objects and handles."),
            tx("Shift/Ctrl/Meta click: 現在の選択に追加または解除します。", "Shift/Ctrl/Meta click: adds to or removes from the current selection."),
          ]),
          entry("range", tx("ホイールボタン範囲選択", "Middle-button range selection"), tx("ホイールボタン押し込みドラッグで矩形範囲を作ります。", "Press and drag the mouse wheel button to create a rectangular range."), [
            tx("通常: 範囲内に全体が入ったオブジェクトだけを選択し、現在選択を置き換えます。", "Normal: selects only fully enclosed objects and replaces the current selection."),
            tx("Shift+中ドラッグ: 範囲内の対象を現在選択へ追加します。", "Shift+middle-drag: adds enclosed targets to the current selection."),
            tx("Ctrl/Meta+中ドラッグ: 範囲内の対象を現在選択から除外します。", "Ctrl/Meta+middle-drag: removes enclosed targets from the current selection."),
            tx("グループ: グループ全体の外接範囲が完全に入った場合だけ選択対象になります。", "Groups: selected only when the full group bounds are enclosed."),
          ]),
        ]),
        section("pan-zoom", tx("パン/ズーム", "Pan and zoom"), tx("パンとズーム", "Pan and zoom"), tx("表示位置と倍率を調整し、キャンバス全体や範囲外オブジェクトを確認します。", "Adjusts view position and zoom to inspect the canvas and off-canvas objects."), [
          entry("wheel-pan", tx("ホイールズームとパン", "Wheel zoom and pan"), tx("プレビューの見え方だけを変える操作です。オブジェクト座標は変わりません。", "These operations change only the view, not object coordinates."), [
            tx("Wheel: ポインタ位置を基準に拡大縮小します。", "Wheel: zooms around the pointer position."),
            tx("Ctrl/Meta+Wheel: 通常より大きいステップでズームします。", "Ctrl/Meta+Wheel: zooms in larger steps."),
            tx("Pan button: プレビューをドラッグして表示位置を動かすモードです。", "Pan button: enables drag panning in the preview."),
            tx("Space-drag / Alt-drag / right-drag: 一時的なパン操作です。", "Space-drag / Alt-drag / right-drag: temporary panning operations."),
          ]),
          entry("fit", tx("全体表示", "Fit canvas"), tx("倍率と表示位置をまとめて整えます。", "Adjusts both scale and view position."), [
            tx("Fit canvas: 現在のプレビュー領域に収まる倍率を計算します。", "Fit canvas: calculates a zoom that fits the current preview area."),
            tx("Centering: 手動パン後でもキャンバス中心をプレビュー中心へ戻します。", "Centering: returns the canvas center to the preview center after manual panning."),
            tx("Preset/size check: 出力サイズ変更後に見切れや余白を確認する時に使います。", "Preset/size check: useful after changing output size to inspect clipping or margins."),
          ]),
          entry("off-canvas", tx("キャンバス外表示", "Off-canvas display"), tx("編集時は出力範囲外のオブジェクトも見えるよう表示範囲が広がります。", "During editing, the view expands so off-canvas objects stay visible."), [
            tx("Dim outside frame: 出力範囲外だけを暗く表示し、出力範囲を判別しやすくします。", "Dim outside frame: darkens only outside-frame portions so the output area is clear."),
            tx("Export clipping: JPG/PNG/WebP は出力キャンバス内だけを書き出します。", "Export clipping: JPG/PNG/WebP export only the output canvas area."),
            tx("View expansion: 編集補助であり、出力サイズ自体は変更しません。", "View expansion: an editing aid that does not change output size."),
          ]),
        ]),
        section("output-size", tx("サイズ", "Size"), tx("プリセットとキャンバスサイズ", "Presets and canvas size"), tx("プレビュー上部で出力サイズと書き出しを管理します。", "Manage output size and export actions in the preview header."), [
          entry("preset-width-height", tx("プリセット / 幅 / 高さ", "Preset / width / height"), tx("出力キャンバスのピクセルサイズを決めます。", "Defines output canvas pixel size."), [
            tx("Preset: YouTube 16:9、Full HD、Twitch panel、Square、Portrait short などの定型サイズです。", "Preset: fixed sizes such as YouTube 16:9, Full HD, Twitch panel, Square, and Portrait short."),
            tx("Width / Height: 20 から 4096 の範囲で直接入力できます。", "Width / Height: direct values from 20 to 4096."),
            tx("Preset change: 既存レイヤーは削除せず、キャンバスサイズだけを変更します。", "Preset change: changes canvas size without deleting existing layers."),
          ]),
          entry("output-menu", tx("Output メニュー", "Output menu"), tx("静止画書き出しと OBS プレビューを 1 つのメニューにまとめています。", "Groups static exports and OBS preview in one menu."), [
            tx("JPG: 透明なしの写真向け形式です。背景色へ合成されます。", "JPG: photo-oriented format without transparency; transparency is flattened to the background."),
            tx("PNG: 透明保持と高品質に向く形式です。ファイルサイズは大きくなりやすいです。", "PNG: high-quality format that preserves transparency, often larger."),
            tx("WebP: 透明保持と容量削減のバランスが良い形式です。", "WebP: balances transparency support and smaller file size."),
            tx("Open OBS preview: アニメーション付きプレビューを別ウィンドウで開きます。", "Open OBS preview: opens animated preview in a separate window."),
          ]),
        ]),
      ],
    },
    {
      id: "editState",
      label: tx("編集状態", "Edit state"),
      sections: [
        section("save", tx("保存", "Save"), tx("編集状態の保存", "Saving edit state"), tx("作業中データの保存、復元、JSON バックアップを管理します。", "Manages saving, restoring, and JSON backups for the current workspace."), [
          entry("manual-autosave", tx("手動保存・復元・Autosave", "Manual save, restore, and Autosave"), tx("トップバー右側の編集状態アイコンと Autosave を使います。", "Use the top-right edit-state icons and Autosave."), [
            tx("Save state: 1 つの作業中スロットへ現在状態を保存します。", "Save state: saves the current workspace to one work-in-progress slot."),
            tx("Restore state: 保存済みスロットを現在の編集画面へ戻します。", "Restore state: restores the saved slot into the editor."),
            tx("Autosave current edit state: ON で編集後に短い待ち時間を置いて自動保存します。", "Autosave current edit state: ON saves after edits with a short debounce."),
            tx("Delete saved state: 作業中スロットを削除します。現在のキャンバスは別操作です。", "Delete saved state: removes the work-in-progress slot. The current canvas is separate."),
          ]),
          entry("json", tx("JSON 書き出し・読み込み", "JSON export and import"), tx("ブラウザ保存に依存しないバックアップ/移行用の操作です。", "Portable backup and migration actions that do not rely on browser storage."), [
            tx("Export JSON: 現在の編集状態をファイルとして保存します。", "Export JSON: saves the current edit state as a file."),
            tx("Import JSON: ファイルから編集状態を読み込み、現在の状態を置き換えます。", "Import JSON: loads an edit state from a file and replaces the current state."),
            tx("Large storage warning: 大きい画像やフォントが多い時は JSON バックアップ併用を推奨します。", "Large storage warning: use JSON backup when many large images or fonts are present."),
          ]),
        ]),
      ],
    },
    {
      id: "other",
      label: tx("その他", "Other"),
      sections: [
        section("app-settings", tx("アプリ設定", "App settings"), tx("言語・テーマ・タグ設定", "Language, theme, and tag settings"), tx("トップバーや設定モーダルからエディタ全体の挙動を調整します。", "Adjust editor-wide behavior from the top bar and settings modals."), [
          entry("language-theme", tx("言語設定とテーマ", "Language and theme"), tx("表示言語と外観テーマを切り替えます。", "Switch display language and visual theme."), [
            tx("Language: 日本語/English を切り替えます。マニュアル本文も開いたまま切り替わります。", "Language: switches Japanese/English. Manual content updates while open."),
            tx("System theme: OS/ブラウザの prefers-color-scheme に追従します。", "System theme: follows OS/browser prefers-color-scheme."),
            tx("Light / Dark: 明るいテーマまたは暗いテーマを固定します。", "Light / Dark: forces the light or dark theme."),
          ]),
          entry("tag-modal", tx("タグ編集モーダル", "Tag settings modal"), tx("タグ候補をカテゴリ別に整理します。", "Organizes tag suggestions by category."), [
            tx("Common tags: 画像、グループオブジェクト、テンプレートの入力候補として共通表示されます。", "Common tags: shared suggestions for image, group object, and template tag inputs."),
            tx("Image tags: 画像素材のタグ候補とフィルターに使います。", "Image tags: used for image asset suggestions and filtering."),
            tx("Group object tags: グループ素材のタグ候補とフィルターに使います。", "Group object tags: used for group-object suggestions and filtering."),
            tx("Template tags: Registered templates のタグ候補とフィルターに使います。", "Template tags: used for Registered templates suggestions and filtering."),
          ]),
          entry("issue-pwa-extension", tx("Issue 報告・PWA・拡張連携", "Issue reporting, PWA, and extension integration"), tx("外部連携とサポート導線です。", "External integration and support entry points."), [
            tx("Issue reporting: GitHub Issues を開き、バグや要望を報告できます。", "Issue reporting: opens GitHub Issues for bugs and requests."),
            tx("PWA install: 対応ブラウザではインストールしてアプリ風に起動できます。", "PWA install: supported browsers can install and launch it like an app."),
            tx("Extension bridge: ping、getSnapshot、applySnapshot で Chrome 拡張から編集状態を連携できます。", "Extension bridge: Chrome extensions can use ping, getSnapshot, and applySnapshot for edit-state integration."),
          ]),
        ]),
        section("gui", tx("GUI 調整", "GUI"), tx("表示・非表示とサイズ調整", "Visibility and size adjustment"), tx("作業内容に合わせてパネルや一覧の密度を変えます。", "Adjust panel and list density for the current task."), [
          entry("collapse-resize", tx("折りたたみと一覧高さ", "Collapse and list height"), tx("左/右パネルの一部セクションは折りたたみやリサイズに対応します。", "Some left and right panel sections support collapse and resizing."), [
            tx("Collapse / Expand: 使わないセクションを閉じ、必要な領域を広げます。", "Collapse / Expand: closes unused sections and gives space to active work."),
            tx("Layers list handle: Canvas 一覧の高さを変更します。", "Layers list handle: changes Canvas list height."),
            tx("Registered templates handle: 保存テンプレート一覧の高さを変更します。", "Registered templates handle: changes saved template list height."),
            tx("Assets image / group object handles: 画像素材とグループ素材の一覧高さを個別に変更します。", "Assets image / group object handles: resize image and group-object lists independently."),
            tx("Timeline resize handle: アニメタブ表示中の下部タイムライン高さを変更します。", "Timeline resize handle: changes the bottom timeline height while the アニメ tab is visible."),
          ]),
          entry("timeline-manual", tx("タイムラインとマニュアル", "Timeline and manual"), tx("大きい情報面をスクロールや目次で扱います。", "Uses scrolling and contents navigation for dense information surfaces."), [
            tx("Manual side tabs: 機能分類を切り替えます。", "Manual side tabs: switch feature categories."),
            tx("Manual top tabs: 分類内の詳細セクションを切り替えます。", "Manual top tabs: switch detail sections inside a category."),
            tx("Contents: 現在セクション内の見出しへジャンプします。", "Contents: jumps to headings inside the current section."),
            tx("Scroll position memory: 閉じた後もカテゴリ、セクション、スクロール位置を保持します。", "Scroll position memory: preserves category, section, and scroll position after closing."),
          ]),
        ]),
        section("shortcuts", tx("ショートカット", "Shortcuts"), tx("キーボード・マウス操作", "Keyboard and mouse operations"), tx("テキスト入力中やモーダル表示中を除いて使える編集操作です。", "Editing operations available outside text input and modal states."), [
          entry("keyboard", tx("Delete / Ctrl+C / Ctrl+V / Ctrl+X / Ctrl+D / Ctrl+Z / Ctrl+Y", "Delete / Ctrl+C / Ctrl+V / Ctrl+X / Ctrl+D / Ctrl+Z / Ctrl+Y"), tx("一般的な編集ショートカットです。", "Common editing shortcuts."), [
            tx("Delete / Backspace: 選択中オブジェクトの削除確認を開きます。", "Delete / Backspace: opens deletion confirmation for selected objects."),
            tx("Ctrl+C / Ctrl+V / Ctrl+X: コピー、貼り付け、切り取りです。貼り付けは少しずらした複製になります。", "Ctrl+C / Ctrl+V / Ctrl+X: copy, paste, and cut. Paste creates an offset copy."),
            tx("Ctrl+D: 選択中オブジェクトを複製します。", "Ctrl+D: duplicates selected objects."),
            tx("Ctrl+Z / Ctrl+Y: Undo / Redo です。ドラッグ移動は開始位置と完了位置の 1 ステップで記録されます。", "Ctrl+Z / Ctrl+Y: undo and redo. Drag movement is recorded as one step from start to completion."),
          ]),
          entry("mouse-preview", tx("プレビューのマウス操作", "Preview mouse operations"), tx("プレビュー上で直接編集する時の操作です。", "Mouse operations for direct preview editing."), [
            tx("Left-drag: 選択オブジェクトを移動します。", "Left-drag: moves the selected object."),
            tx("Corner handle drag: 選択オブジェクトをリサイズします。", "Corner handle drag: resizes the selected object."),
            tx("Top round handle drag: 選択オブジェクトを回転します。", "Top round handle drag: rotates the selected object."),
            tx("Wheel: 表示倍率を変更します。", "Wheel: changes view zoom."),
            tx("Middle-drag: 完全に囲ったオブジェクトだけを範囲選択します。", "Middle-drag: range-selects only fully enclosed objects."),
            tx("Space / Alt / right-drag: 表示位置をパンします。", "Space / Alt / right-drag: pans the view."),
          ]),
        ]),
      ],
    },
  ];

  return {
    title: tx("マニュアル", "Manual"),
    subtitle: tx(
      "画面上の表記に合わせて、機能、パラメータ、ドロップダウン項目、ショートカットを確認できます。",
      "Review features, parameters, dropdown items, and shortcuts using the same labels shown in the editor.",
    ),
    closeLabel: tx("マニュアルを閉じる", "Close manual"),
    categoryTabsLabel: tx("マニュアル機能タブ", "Manual feature tabs"),
    sectionTabsLabel: (categoryLabel) => tx(`${categoryLabel} セクション`, `${categoryLabel} sections`),
    relatedHeading: tx("関連機能", "Related features"),
    tocHeading: tx("目次", "Contents"),
    categories,
  };
}
