import { useEffect, useRef } from "react";
import { BookOpen, X } from "lucide-react";

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
  state: ManualDialogState;
  onStateChange: (next: ManualDialogState) => void;
  onClose: () => void;
}

interface ManualSection {
  id: string;
  label: string;
  title: string;
  summary: string;
  items: string[];
  related: Array<{ categoryId: ManualCategoryId; sectionId: string; label: string }>;
}

interface ManualCategory {
  id: ManualCategoryId;
  label: string;
  sections: ManualSection[];
}

export const defaultManualDialogState: ManualDialogState = {
  categoryId: "layers",
  sectionId: "quick-add",
  scrollTop: 0,
};

export function ManualDialog({ state, onStateChange, onClose }: ManualDialogProps) {
  const contentRef = useRef<HTMLElement | null>(null);
  const activeCategory = manualCategories.find((category) => category.id === state.categoryId) ?? manualCategories[0];
  const activeSection = activeCategory.sections.find((section) => section.id === state.sectionId) ?? activeCategory.sections[0];

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = state.scrollTop;
  }, [state.categoryId, state.sectionId]);

  const selectCategory = (categoryId: ManualCategoryId) => {
    const category = manualCategories.find((candidate) => candidate.id === categoryId) ?? manualCategories[0];
    onStateChange({ categoryId: category.id, sectionId: category.sections[0].id, scrollTop: 0 });
  };

  const selectSection = (sectionId: string) => {
    onStateChange({ ...state, sectionId, scrollTop: 0 });
  };

  const selectRelated = (categoryId: ManualCategoryId, sectionId: string) => {
    onStateChange({ categoryId, sectionId, scrollTop: 0 });
  };

  return (
    <div className="modal-backdrop manual-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="manual-dialog" role="dialog" aria-modal="true" aria-labelledby="manual-title">
        <div className="modal-header manual-header">
          <div className="modal-title-block">
            <h2 id="manual-title">
              <BookOpen size={18} /> マニュアル
            </h2>
            <p>各タブの役割、追加されるオブジェクト、関連する編集先を確認できます。</p>
          </div>
          <button type="button" className="icon-button modal-close" aria-label="マニュアルを閉じる" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="manual-body">
          <nav className="manual-side-tabs" aria-label="マニュアル機能タブ">
            {manualCategories.map((category) => (
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
            <div className="manual-top-tabs" role="tablist" aria-label={`${activeCategory.label} セクション`}>
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
              <ul>
                {activeSection.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="manual-related">
                <h4>関連機能</h4>
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
          </div>
        </div>
      </section>
    </div>
  );
}

const manualCategories: ManualCategory[] = [
  {
    id: "templates",
    label: "テンプレ",
    sections: [
      section("generators", "生成", "テンプレ生成", "用途別の初期レイアウトを作る入口です。", [
        "スケジュール、通常サムネイル、縦型サムネイル、配信待機の生成モーダルを開けます。",
        "生成した内容はキャンバス上の編集可能なオブジェクトとして配置されます。",
        "設定保存は生成設定だけを保存し、現在のキャンバス内容とは別に管理されます。",
      ]),
      section("registered", "登録済み", "登録済みテンプレート", "ブラウザ内に保存した作業状態を再利用します。", [
        "テンプレート名とタグを付けて現在のキャンバス、素材、出力サイズを保存できます。",
        "読み込み時は現在のキャンバス内容を置き換えるため、確認ダイアログが表示されます。",
        "タグフィルタで用途別のテンプレートを絞り込めます。",
      ]),
    ],
  },
  {
    id: "layers",
    label: "レイヤー",
    sections: [
      section("quick-add", "クイック追加", "クイック追加", "よく使う8種類のオブジェクトをすぐキャンバスに追加します。", [
        "テキストは自由入力できる文字オブジェクトを追加します。",
        "図形は矩形を基点に、調整タブで円、三角、ひし形、五角形、六角形、星形へ変更できます。",
        "線は実線、点線、破線、波線のスタイルを持つ線オブジェクトです。",
        "画像は素材タブで選択中の画像をキャンバス上の画像オブジェクトとして追加します。",
        "見出し、サブタイトル、バッジ、区切り線はサムネイル制作で使いやすい初期サイズと色で追加されます。",
        "追加されたオブジェクトはキャンバスセクションに表示され、選択状態になります。",
      ]),
      section("canvas", "キャンバス", "キャンバス内オブジェクト", "キャンバス上に配置されたオブジェクトの順序と状態を管理します。", [
        "一覧の上にある行ほど前面に表示されます。ドラッグで重なり順を変更できます。",
        "目のボタンで表示/非表示、ロックボタンで選択と編集の可否を切り替えます。",
        "ゴミ箱ボタンは対象オブジェクトを削除します。Ctrlを押しながら削除すると確認を省略します。",
        "グループ化された行はフォルダ表示になり、通常選択では同じグループの編集可能オブジェクトをまとめて選択します。",
        "個別選択ボタンを使うと、グループを解除せずに1オブジェクトだけ調整できます。",
        "キャンバス一覧は高さ変更ハンドルで広げられるため、オブジェクト数が多い制作でも一覧を優先して確認できます。",
        "選択中の行はプレビュー上の選択枠と連動します。プレビューで範囲選択した結果もこの一覧の選択状態に反映されます。",
        "ロックされたオブジェクトは表示と重なり順を保ちますが、プレビュー選択、範囲選択、調整タブ編集の対象から外れます。",
        "画像素材を削除すると、その素材を参照する画像オブジェクトもキャンバスから削除されます。",
        "テンプレートや生成機能から作られた要素も、最終的にはこのキャンバス内オブジェクト一覧で通常の編集対象として扱えます。",
        "重なり順を変えたい場合は、一覧内の行をドラッグして目的の位置へ移動します。上側の行ほど前面です。",
        "複数選択後は、グループ化、整列、均等配置、調整タブの相対移動など、複数対象の操作に進めます。",
        "関連機能はこの説明の末尾にまとめています。スクロールした一番下から、調整やプレビュー選択の説明へ移動できます。",
      ]),
      section("groups", "グループ", "グループ", "複数オブジェクトをひとまとまりとして扱います。", [
        "2件以上を選択してグループ化すると、移動や選択をまとめて行えます。",
        "グループ名はキャンバス一覧の行にバッジとして表示されます。",
        "登録ボタンでグループオブジェクト素材として保存し、素材タブから再利用できます。",
      ]),
      section("align", "整列", "整列", "選択オブジェクトの位置を揃えます。", [
        "1件選択時はキャンバス全体に対して左、中央、右、上、中、下へ整列します。",
        "複数選択時は選択範囲に対して整列します。",
        "3件以上では横均等、縦均等で中心間隔を揃えられます。",
      ]),
    ],
  },
  {
    id: "assets",
    label: "素材",
    sections: [
      section("images", "画像", "画像素材", "ローカル画像をブラウザ内に登録して使います。", [
        "画像ファイルまたはフォルダ内の対応画像を登録できます。",
        "登録前後にタグを付け、タグフィルタで画像素材一覧を絞り込めます。",
        "画像行の追加ボタンでキャンバスに画像オブジェクトを追加できます。",
      ]),
      section("image-lab", "Image Lab", "Image Lab", "素材画像を切り抜き・透過処理して新しい画像として追加します。", [
        "四角、円、自由選択、クロマキー透過をブラウザ内で処理します。",
        "作成ボタンは処理済み画像を素材に追加し、同時にキャンバス上へ画像オブジェクトを配置します。",
        "プレビューはホイールでズーム、右ドラッグでパンできます。",
      ]),
      section("group-objects", "グループ素材", "グループオブジェクト", "よく使う複数オブジェクトのまとまりを再配置します。", [
        "レイヤータブのグループ登録から保存したまとまりが表示されます。",
        "タグ編集、タグフィルタ、削除に対応しています。",
        "追加すると新しいIDとグループ名を持つオブジェクト群としてキャンバスに入ります。",
      ]),
    ],
  },
  {
    id: "adjust",
    label: "調整",
    sections: [
      section("common", "共通", "共通設定", "選択オブジェクトの基本情報を編集します。", [
        "名前、位置、サイズ、回転、不透明度を数値とスライダーで調整できます。",
        "回転リセット、不透明度リセットでよく使う初期状態へ戻せます。",
        "ぼかし、縁ぼかし、角丸、影、疑似3D、ベベルで見た目を調整します。",
      ]),
      section("type-specific", "種類別", "種類別設定", "オブジェクト種別ごとの設定を編集します。", [
        "テキストでは文字、フォント、文字サイズ、字間、縦書き、塗り、縁取りを編集できます。",
        "図形では形状、線幅、線種、塗り、線色を編集できます。",
        "画像では参照素材、白黒、ぼかし、明るさ、コントラスト、モザイクを編集できます。",
      ]),
      section("multi", "複数選択", "複数選択の調整", "複数オブジェクトを同時に移動・回転します。", [
        "相対移動X/Yは選択中の編集可能オブジェクトすべてへ差分を即時反映します。",
        "回転差分は各オブジェクトの現在角度に加算されます。",
        "先頭選択に角度を合わせる操作で、角度だけをまとめて揃えられます。",
      ]),
    ],
  },
  {
    id: "colors",
    label: "色",
    sections: [
      section("single", "単色", "登録色", "よく使う単色を保存して塗りや線へ適用します。", [
        "色名、HEX、透明度を保存できます。",
        "各行のFill/Strokeボタンで選択中のテキストや図形へ直接適用します。",
        "登録色は選択して更新でき、ドラッグで順序変更できます。",
      ]),
      section("palette", "パレット", "配色パレット", "複数色の組み合わせを作成・保存します。", [
        "配色原理とパターンを選んで候補色を生成します。",
        "カラーホイール上の点をドラッグすると、選んだ配色関係を維持したまま再計算します。",
        "保存済みパレットの各色もFill/Strokeへ直接適用できます。",
      ]),
    ],
  },
  {
    id: "motion",
    label: "アニメ",
    sections: [
      section("sets", "モーション", "モーションセット", "選択オブジェクトにアニメーション設定を追加します。", [
        "1つのオブジェクトに複数のモーションセットを持たせられます。",
        "フェード、スライド、ポップ、パルス、点滅、ドリフト、ズーム、回転、揺れ、シェイク、呼吸を選べます。",
        "ループ再生をONにすると、タイムライン上でも2周目以降の動きが薄く表示されます。",
      ]),
      section("text-effects", "テキスト/効果", "テキスト専用・エフェクト", "文字や見た目の変化を追加します。", [
        "テキストオブジェクトではタイプ表示、行ごと表示、文字ウェーブを選べます。",
        "発光、ぼかし、シャインは非移動の効果として設定できます。",
        "効果強度が使えない組み合わせでは入力欄が無効になります。",
      ]),
    ],
  },
  {
    id: "timeline",
    label: "タイムライン",
    sections: [
      section("playback", "再生", "タイムライン再生", "エディタ内でアニメーションを確認します。", [
        "再生中はキャンバス選択、パネル編集、タイムライン編集がロックされます。",
        "一時停止すると通常編集に戻ります。",
        "リセットボタンで再生位置を0秒へ戻せます。",
      ]),
      section("timing", "タイミング", "開始位置と長さ", "モーションの開始・終了を視覚的に編集します。", [
        "セグメント中央をドラッグすると開始と終了をまとめて移動します。",
        "左右ハンドルをドラッグすると開始位置または長さを変更します。",
        "ループONのセグメントは2周目以降が薄い残像として表示されます。",
      ]),
    ],
  },
  {
    id: "preview",
    label: "プレビュー画面",
    sections: [
      section("selection", "選択", "プレビュー選択", "キャンバス上のオブジェクトを直接選択します。", [
        "左クリックで前面のオブジェクトを選択します。Shift/Ctrlクリックは既存選択へ追加または切り替えます。",
        "ホイールボタンを押し込んだままドラッグすると範囲内のオブジェクトを複数選択します。",
        "Shift+ホイールボタンドラッグは範囲内のオブジェクトを現在の選択へ追加します。",
        "Ctrl+ホイールボタンドラッグは範囲内のオブジェクトを現在の選択から除外します。",
      ]),
      section("pan-zoom", "パン/ズーム", "パンとズーム", "大きいキャンバスや外側オブジェクトを確認します。", [
        "ホイールでズーム、パンボタン・Spaceドラッグ・Altドラッグ・右ドラッグで表示位置を動かせます。",
        "全体表示ボタンは現在のキャンバスサイズに合わせて一度だけ倍率を調整します。",
        "キャンバス外のオブジェクトは編集時に薄く表示され、書き出しはキャンバス範囲にクリップされます。",
      ]),
    ],
  },
  {
    id: "editState",
    label: "編集状態",
    sections: [
      section("save", "保存/復元", "編集状態の保存", "現在の作業中データをブラウザ内に保存します。", [
        "状態保存は1つの作業中スロットを上書きします。",
        "自動保存をONにすると編集後に短い待ち時間で保存されます。",
        "状態復元は保存済みのキャンバス、素材、出力設定を戻します。",
      ]),
      section("json", "JSON", "JSONバックアップ", "ブラウザ外へ作業状態を持ち出します。", [
        "JSON書き出しで現在の編集状態をファイルとして保存できます。",
        "JSON読み込みで別ブラウザや別端末から同じ作業状態を復元できます。",
        "大きな画像やフォントが多い場合は、ブラウザ保存だけでなくJSON書き出しも併用してください。",
      ]),
    ],
  },
  {
    id: "other",
    label: "その他",
    sections: [
      section("output", "出力", "画像出力", "完成したサムネイルを書き出します。", [
        "プレビュー上部の出力メニューからJPG、PNG、WebPを書き出せます。",
        "OBSプレビューは別ウィンドウでアニメーション付き表示を確認できます。",
        "静止画書き出しは現在のキャンバス範囲だけを画像化します。",
      ]),
      section("quality", "品質警告", "品質警告", "読みにくさや容量リスクを確認します。", [
        "長すぎる文字、低コントラスト、端に近い重要オブジェクトなどを警告します。",
        "4Kサイズ、素材容量、多すぎるオブジェクトもステータスバーで知らせます。",
        "警告は助言であり、書き出し自体はブロックしません。",
      ]),
    ],
  },
];

function section(id: string, label: string, title: string, summary: string, items: string[]): ManualSection {
  return {
    id,
    label,
    title,
    summary,
    items,
    related: [
      { categoryId: "layers", sectionId: "canvas", label: "キャンバス内オブジェクト" },
      { categoryId: "adjust", sectionId: "common", label: "調整: 共通設定" },
      { categoryId: "preview", sectionId: "selection", label: "プレビュー選択" },
    ],
  };
}
