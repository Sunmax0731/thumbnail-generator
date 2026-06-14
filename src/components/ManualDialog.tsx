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

interface ManualEntry {
  id: string;
  title: string;
  body: string;
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

export const defaultManualDialogState: ManualDialogState = {
  categoryId: "preview",
  sectionId: "selection",
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
              <BookOpen size={18} /> マニュアル
            </h2>
            <p>主要機能、パラメータ、ショートカット、GUI 調整を確認できます。</p>
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
                    </section>
                  ))}
                </div>
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
              <aside className="manual-toc" aria-label="このセクションの目次">
                <h4>目次</h4>
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

const manualCategories: ManualCategory[] = [
  {
    id: "templates",
    label: "テンプレート",
    sections: [
      section("generators", "生成", "テンプレート生成", "用途別の初期レイアウトを作成する入口です。", [
        entry("schedule", "スケジュール生成", "月間・週間スケジュールを作成します。日付、週始まり、曜日言語、日付表記、行動数、グリッド、色、角丸、線幅、フォント、グループ化を調整できます。"),
        entry("standard", "通常サムネイル生成", "16:9 の動画サムネイル向けです。5 種類の配置パターン、共通・タイトル・サブタイトル・ラベルの文字設定、色、画像枠、トーンを選べます。"),
        entry("vertical", "縦型サムネイル生成", "ショート動画向けの 9:16 レイアウトです。縦長プレビューを確認しながら文字サイズ、余白感、画像配置を決められます。"),
        entry("waiting", "配信待機画面生成", "16:9 の待機画面を作成します。静止要素に加えてアニメーション設定を含められ、OBS プレビューで動きを確認できます。"),
        entry("save-settings", "設定保存", "Generate objects は設定保存とレイヤー生成を同時に行います。Save settings は現在のキャンバスを置き換えず、次回の生成設定だけを保存します。"),
      ]),
      section("registered", "登録済み", "登録済みテンプレート", "現在の作業状態をブラウザ内に名前付きで保存します。", [
        entry("save", "テンプレート保存", "テンプレート名と任意タグを付けて、キャンバス、出力サイズ、素材、CSV/HTML 互換情報を保存します。同じ名前でも別エントリとして残ります。"),
        entry("load", "読み込み", "読み込み時は現在のキャンバスを置き換えるため確認ダイアログを表示します。テンプレート側の出力サイズも同時に適用されます。"),
        entry("delete", "削除", "登録済みテンプレートを削除します。Ctrl を押しながら削除すると確認を省略できる削除操作があります。"),
        entry("tag-filter", "タグ検索", "登録テンプレートのタグで一覧を絞り込みます。共通タグとテンプレートタグが候補として利用されます。"),
        entry("resize", "一覧サイズ変更", "Registered templates のリスト下部ハンドルをドラッグ、またはフォーカスして Arrow Up/Down で高さを調整できます。"),
      ]),
    ],
  },
  {
    id: "layers",
    label: "レイヤー",
    sections: [
      section("quick-add", "クイック追加", "クイック追加", "よく使うオブジェクトをすぐキャンバスへ追加します。", [
        entry("text", "テキスト", "通常テキスト、見出し、サブタイトルを追加できます。追加後は Adjust タブで文字、フォント、サイズ、縦書き、行間、字間を編集します。"),
        entry("shape", "図形", "長方形、楕円、三角形、ひし形、五角形、六角形、星、バッジなどを追加します。塗り、線、角丸、ぼかしを調整できます。"),
        entry("line", "線", "実線、点線、破線、波線の線オブジェクトを追加します。線幅、色、透明度、回転で区切り線や装飾を作ります。"),
        entry("asset-image", "選択中画像", "Assets で選択した画像を、現在のキャンバスへ画像オブジェクトとして追加します。"),
      ]),
      section("canvas", "キャンバス一覧", "キャンバス内オブジェクト", "配置済みオブジェクトの順序、表示、編集可否を管理します。", [
        entry("order", "重なり順", "リストの上にある行ほど前面に表示されます。行ドラッグで前後関係を変更できます。"),
        entry("visibility", "表示・非表示", "目のボタンでレンダー対象を切り替えます。非表示のオブジェクトはプレビューと書き出しに出ません。"),
        entry("lock", "ロック", "ロック中は表示と重なり順を保ちますが、プレビュー選択、範囲選択、Adjust 編集の対象外になります。"),
        entry("delete", "削除", "ゴミ箱または Delete/Backspace で削除します。最後の 1 件も削除でき、空キャンバスにできます。"),
        entry("resize-list", "一覧の高さ", "Canvas 一覧はハンドルで高さを変更できます。オブジェクト数が多い制作では一覧を広げて確認できます。"),
      ]),
      section("groups", "グループ", "グループ", "複数オブジェクトを一まとまりとして扱います。", [
        entry("create", "グループ化", "2 件以上を選択してグループ化すると、プレビュークリックや通常選択では編集可能なグループメンバー全体を選択します。"),
        entry("rename", "グループ名", "Canvas 一覧とグループ素材で識別しやすい名前を設定できます。"),
        entry("individual", "個別編集", "グループ行の個別編集ボタンを使うと、グループを解除せず 1 オブジェクトだけ Adjust で編集できます。"),
        entry("ungroup", "解除", "グループ情報を外し、各オブジェクトを独立した通常レイヤーとして扱います。"),
        entry("asset", "グループ素材登録", "選択中グループをタグ付きの素材として Assets に保存し、別のキャンバス状態へ再配置できます。"),
      ]),
      section("align", "整列", "整列と分布", "選択オブジェクトの位置を揃えます。", [
        entry("single", "単体整列", "1 件選択時はキャンバス全体を基準に左、中央、右、上、中央、下へ揃えます。"),
        entry("multi", "複数整列", "複数選択時は選択範囲を基準に揃えます。グループ選択にも適用されます。"),
        entry("distribute", "均等配置", "3 件以上の選択で、横方向または縦方向の中心間隔を均等にします。"),
        entry("fit-canvas", "キャンバスに合わせる", "選択中の画像・図形を現在の出力サイズいっぱいに合わせます。正確なサイズ合わせの開始点として使います。"),
      ]),
    ],
  },
  {
    id: "assets",
    label: "素材",
    sections: [
      section("images", "画像", "画像素材", "ローカル画像をブラウザ内に登録して使います。", [
        entry("file", "画像ファイル登録", "単体画像を読み込み、登録前タグを付けて Assets の画像一覧に追加します。画像データはブラウザ内で処理されます。"),
        entry("folder", "フォルダ登録", "対応ブラウザではフォルダ直下の画像をまとめて登録できます。画像以外のファイルは無視されます。"),
        entry("tags", "画像タグ", "登録前タグ、登録後のタグ編集、画像タグ検索を使って素材を分類できます。共通タグも候補に出ます。"),
        entry("row-actions", "行アクション", "画像行からキャンバス追加、Image Lab 起動、素材削除ができます。素材削除時は参照中の画像オブジェクトも削除されます。"),
        entry("resize-list", "画像一覧サイズ", "画像素材一覧は折りたたみと高さ変更に対応します。大量素材を扱う時は高さを広げます。"),
      ]),
      section("image-lab", "Image Lab", "Image Lab", "画像を切り抜き・透過処理して新しい素材として追加します。", [
        entry("chroma", "クロマキー", "キー色と許容範囲で背景色を透明化します。処理はブラウザ内で完結します。"),
        entry("rect-circle", "矩形・円形切り抜き", "プレビュー上で範囲をドラッグ作成し、8 つのハンドルで移動・サイズ変更できます。角ハンドルは比率を保ち、辺ハンドルは片方向に調整します。"),
        entry("polygon", "自由選択", "左クリックで点を追加し、点ドラッグで調整します。Alt+クリックで点を削除できます。右クリックでは点を追加しません。"),
        entry("pan-zoom", "表示操作", "ホイールでズーム、右ドラッグでパンします。切り抜き範囲を細かく確認する時に使います。"),
        entry("add", "処理済み画像を追加", "処理結果を PNG 素材として登録し、同時にキャンバスへ画像オブジェクトを配置します。"),
      ]),
      section("group-objects", "グループ素材", "グループオブジェクト", "よく使う複数オブジェクトのまとまりを再配置します。", [
        entry("register", "登録", "Canvas 側で 1 つの編集可能グループを選択している時に登録できます。タグ付きでブラウザ内に保存されます。"),
        entry("reuse", "再利用", "追加すると新しい ID とグループ名を持つ複製としてキャンバスへ入ります。必要な画像素材も補完されます。"),
        entry("tags", "タグ編集", "グループ素材専用タグを編集し、画像素材とは独立したタグ検索で絞り込めます。"),
        entry("delete", "削除", "不要なグループ素材を削除します。キャンバス上の既存オブジェクトは素材行とは別に管理されます。"),
        entry("resize-list", "一覧表示", "グループ素材一覧は折りたたみと高さ変更に対応し、行の操作ボタンが潰れない最小高さを保ちます。"),
      ]),
    ],
  },
  {
    id: "adjust",
    label: "調整",
    sections: [
      section("common", "共通", "共通設定", "選択オブジェクトの基本情報と見た目を編集します。", [
        entry("position", "位置 X/Y", "キャンバス座標で左上位置を指定します。プレビューのドラッグ移動と同じ値です。"),
        entry("size", "幅・高さ", "オブジェクトの編集枠サイズを指定します。縦書きテキストもこの枠を基準に選択・リサイズされます。"),
        entry("rotation", "回転", "角度を数値またはプレビューの回転ハンドルで変更します。リセットボタンで 0 度に戻します。"),
        entry("opacity", "不透明度", "オブジェクト全体の透明度を変更します。リセットで 100% に戻します。"),
        entry("blur-edge", "ぼかし・エッジぼかし", "レイヤー全体のぼかし、内側・外側のエッジぼかし、線やアウトラインをぼかし対象に含めるかを設定します。"),
        entry("shadow-bevel", "影・疑似 3D・ベベル", "影は有効時のみ色、透明度、ぼかし、距離、角度を表示します。疑似 3D とベベルで立体感を追加できます。"),
      ]),
      section("type-specific", "種類別", "種類別設定", "テキスト、図形、画像ごとの専用パラメータです。", [
        entry("text", "テキスト", "文字、フォント、太さ、サイズ、行間、字間、横書き・縦書き、整列、塗り、アウトライン、テキストを枠に合わせる操作を設定します。"),
        entry("custom-font", "カスタムフォント", "WOFF2、WOFF、TTF、OTF を読み込み、フォント一覧へ追加します。書き出し前にブラウザの FontFace 読み込み完了を待ちます。"),
        entry("shape", "図形", "形状、塗り、線色、線幅、線種、角丸を編集します。線オブジェクトでは実線、点線、破線、波線を選択できます。"),
        entry("image", "画像", "参照素材、グレースケール、明るさ、コントラスト、ぼかし、モザイクを編集します。素材が 1 件のみなど無効な操作は disabled になります。"),
        entry("color-popup", "塗り・線色ポップアップ", "Fill/Stroke の色表示からドラッグ可能な単色ピッカーを開き、HEX/RGB/alpha を編集します。"),
      ]),
      section("multi", "複数選択", "複数選択の調整", "選択中の編集可能オブジェクトをまとめて動かします。", [
        entry("relative-move", "相対移動 X/Y", "入力値の差分を選択中すべてに即時反映します。値を 12 から 5 に戻すと -7 だけ動きます。"),
        entry("relative-rotation", "相対回転", "現在角度へ差分を足します。各オブジェクトの元角度は保ったまままとめて回せます。"),
        entry("match-angle", "先頭に角度を合わせる", "選択順の先頭オブジェクトの角度を基準に、他の編集可能オブジェクトへ同じ角度を適用します。"),
        entry("disabled", "無効状態", "選択がない、ロック中、対象種類が違うなど効果がない操作は disabled になり、誤操作を避けます。"),
      ]),
    ],
  },
  {
    id: "colors",
    label: "色",
    sections: [
      section("single", "単色", "登録色", "よく使う単色を保存して塗りや線へ適用します。", [
        entry("draft", "色の作成", "名前、HEX/RGB、透明度を指定して単色を登録します。最近使った色からも選択できます。"),
        entry("apply", "Fill/Stroke 適用", "登録色行の Fill または Stroke ボタンで、選択中のテキスト・図形へ色と透明度を直接適用します。"),
        entry("update", "更新", "既存色を選択して値を変更し、Update で同じ登録色へ上書きします。"),
        entry("reorder", "並べ替え", "登録色行はドラッグで順序を変更できます。折りたたみで一覧を省スペース化できます。"),
      ]),
      section("palette", "パレット", "配色パレット", "複数色の関係を作成・保存します。", [
        entry("principle", "配色原理とパターン", "Order、Proximity、Similarity、Clarity の原理から配色パターンを選び、ベース色から候補色を生成します。"),
        entry("wheel", "カラーホイール", "ホイール上の点を選択して確認し、ドラッグすると選んだ色を基準に関係色を再計算します。"),
        entry("bars", "パレットバー", "生成色を大きなバーで確認し、HEX ラベルを見ながら選択できます。"),
        entry("save", "パレット保存", "現在の配色を名前付きセットとして保存します。保存済みパレットの各色も Fill/Stroke へ直接適用できます。"),
        entry("image-palette", "画像から配色", "選択画像から代表色を抽出し、不要色を除外して保存済みパレットへ登録できます。"),
      ]),
    ],
  },
  {
    id: "motion",
    label: "アニメ",
    sections: [
      section("sets", "モーション", "モーションセット", "選択オブジェクトにアニメーションを追加します。", [
        entry("multiple", "複数セット", "1 つのオブジェクトへ複数のアニメーションを順番に持たせられます。旧形式との互換のため先頭セットも保持されます。"),
        entry("presets", "プリセット", "Fade、Slide、Pop、Pulse、Blink、Drift、Zoom、Spin、Sway、Shake、Breathe などから動きを選びます。"),
        entry("motion-effect", "Motion と Effect", "移動を伴う動きは Motion、発光・ぼかし・シャインなどは Effect で選びます。使わない方向や強度は disabled になります。"),
        entry("easing", "イージング", "linear と easings.net 系の Sine、Quad、Cubic、Quart、Quint、Expo、Circ、Back、Elastic、Bounce を選択できます。"),
        entry("loop", "ループ", "ON にすると再生中に繰り返します。タイムラインには 2 周目以降が薄いセグメントで表示されます。"),
      ]),
      section("text-effects", "文字効果", "テキスト専用・効果設定", "文字や視覚効果の追加設定です。", [
        entry("text-only", "テキスト専用", "テキストオブジェクトでは Typewriter、Line reveal、Wave を選択できます。画像や図形では表示されません。"),
        entry("effect-intensity", "効果強度", "Glow、Blur、Shine など強度を使う効果でのみ有効です。対象外では入力できません。"),
        entry("preview", "選択オブジェクトプレビュー", "Motion タブ内の小さなプレビューで、選択中オブジェクトの動きの方向性を確認できます。"),
        entry("graph", "イージンググラフ", "必要に応じて開閉し、選択中イージングの加速・減速カーブを確認できます。"),
      ]),
    ],
  },
  {
    id: "timeline",
    label: "タイムライン",
    sections: [
      section("playback", "再生", "タイムライン再生", "エディタ内でアニメーションを確認します。", [
        entry("play", "Play/Pause", "再生中はプレビュー選択、キャンバス編集、パネル編集、タイムライン編集がロックされます。Pause で通常編集へ戻ります。"),
        entry("reset", "Reset", "再生位置を 0.0s に戻します。OBS プレビューの Reset と同じ確認用途です。"),
        entry("playhead", "再生ヘッド", "ルーラーと各トラック上の縦線で現在時刻を示します。"),
        entry("visibility", "表示条件", "タイムラインは右パネルのアニメタブが active の時だけ表示されます。"),
      ]),
      section("timing", "タイミング", "開始位置と長さ", "モーションの開始・終了を視覚的に編集します。", [
        entry("bar", "セグメント移動", "バー中央をドラッグすると開始時刻と終了時刻をまとめて移動します。"),
        entry("handles", "左右ハンドル", "左ハンドルは開始時刻、右ハンドルは長さを変更します。最小長を保って調整されます。"),
        entry("height", "高さ変更", "タイムライン上端のハンドルで表示高さを変更できます。折りたたみでプレビュー領域を広げられます。"),
        entry("loop-echo", "ループ表示", "ループ ON のセグメントは 2 周目以降を薄く表示し、元の編集ハンドル位置は変えません。"),
      ]),
    ],
  },
  {
    id: "preview",
    label: "プレビュー",
    sections: [
      section("selection", "選択", "プレビュー選択", "キャンバス上のオブジェクトを直接選びます。", [
        entry("click", "クリック選択", "左クリックで前面の選択可能オブジェクトを選びます。空白または出力範囲外の空白をクリックすると選択解除します。"),
        entry("additive", "Shift/Ctrl/Meta クリック", "現在の選択へ追加または解除します。グループメンバーをクリックした場合は通常グループ全体を扱います。"),
        entry("range", "中ボタン範囲選択", "ホイールボタンを押し込んだままドラッグすると範囲選択します。矩形内にオブジェクト全体が入ったものだけ選択対象になります。"),
        entry("range-modifiers", "範囲選択の修飾キー", "Shift+中ボタンドラッグは範囲内を追加、Ctrl/Meta+中ボタンドラッグは範囲内を現在選択から除外します。"),
        entry("group-range", "グループの範囲選択", "グループはメンバー全体の外接範囲が矩形に完全に入った時だけ選択されます。一部だけ囲んでも対象になりません。"),
      ]),
      section("pan-zoom", "パン/ズーム", "パンとズーム", "大きいキャンバスや範囲外オブジェクトを確認します。", [
        entry("wheel", "ホイールズーム", "プレビュー上のホイールでポインタ周辺を基準に拡大縮小します。Ctrl/Meta ホイールでは変化量が大きくなります。"),
        entry("pan", "パン操作", "Pan ボタン、Space ドラッグ、Alt ドラッグ、右ドラッグで表示位置を移動します。ズーム値は維持されます。"),
        entry("fit", "全体表示", "Fit canvas は現在の表示領域と出力サイズから 1 回だけ収まる倍率を計算します。自動追従ではありません。"),
        entry("off-canvas", "キャンバス外表示", "出力範囲外のオブジェクトも編集時は見えるように表示範囲が拡張されます。範囲外部分は暗く表示され、書き出しは出力範囲でクリップされます。"),
        entry("shortcuts", "マウス・キー操作", "左ドラッグは移動、角ハンドルはリサイズ、上の丸ハンドルは回転です。Space は一時パン、右ドラッグもパンです。"),
      ]),
      section("output-size", "サイズ", "プリセットとキャンバスサイズ", "プレビュー上部で出力サイズを決めます。", [
        entry("preset", "プリセット", "YouTube 16:9、Full HD、Twitch panel、Square、Portrait short などを選べます。選択後もズームはユーザー操作の値を維持します。"),
        entry("width-height", "幅・高さ", "数値入力またはスライダーでカスタムサイズに変更します。320 から 4096 の範囲で静的出力に使われます。"),
        entry("output-menu", "Output メニュー", "JPG、PNG、WebP 書き出しと OBS プレビュー起動を 1 つのメニューから実行します。"),
        entry("obs", "OBS プレビュー", "別ウィンドウでアニメーション付きプレビューを表示します。P は再生切替、R はリセット、H はコントロール表示切替です。"),
      ]),
    ],
  },
  {
    id: "editState",
    label: "編集状態",
    sections: [
      section("save", "保存・復元", "編集状態の保存", "現在の作業中データをブラウザ内に保存します。", [
        entry("manual-save", "手動保存", "トップ右の保存アイコンで 1 つの作業中スロットへ現在状態を保存します。"),
        entry("restore", "復元", "保存済みの作業中状態を読み戻します。キャンバス、素材、出力設定、CSV/HTML 互換情報が復元されます。"),
        entry("autosave", "Autosave", "ON にすると編集後に短い待ち時間で自動保存します。大容量素材では保存警告が出る場合があります。"),
        entry("delete", "保存状態削除", "ブラウザ内の作業中スロットを削除します。現在表示中のキャンバス自体は別操作として残ります。"),
      ]),
      section("json", "JSON", "JSON バックアップ", "ブラウザ外へ作業状態を持ち出します。", [
        entry("export", "JSON 書き出し", "現在の編集状態をファイルとして保存します。ブラウザ保存容量に依存しないバックアップとして使えます。"),
        entry("import", "JSON 読み込み", "別ブラウザや別端末で保存した JSON を読み込み、同じスキーマの編集状態を復元します。"),
        entry("compat", "互換情報", "CSV/HTML レイアウト互換テキスト、素材、テンプレート名もスナップショットに含まれます。"),
        entry("storage", "容量警告", "大きい画像やフォントが多い場合はローカル保存失敗を避けるため、JSON 書き出しの併用を推奨します。"),
      ]),
    ],
  },
  {
    id: "other",
    label: "その他",
    sections: [
      section("output", "書き出し", "画像書き出し", "完成したサムネイルを画像化します。", [
        entry("formats", "形式", "JPG、PNG、WebP に対応します。PNG は透明を保ちやすく、JPG は写真向け、WebP は容量を抑えやすい形式です。"),
        entry("clip", "書き出し範囲", "編集時にキャンバス外が見えていても、静止画像の書き出しは現在の出力キャンバス範囲だけを画像化します。"),
        entry("quality", "最大品質", "出力はブラウザの canvas 書き出しを使い、選択した幅・高さで生成します。"),
      ]),
      section("quality", "品質警告", "品質警告", "読みにくさや容量リスクを確認します。", [
        entry("text", "文字警告", "長すぎる文字、低コントラスト、重要テキストの非表示、端に近い配置などを警告します。"),
        entry("storage", "容量警告", "4K サイズ、大きな素材、多すぎるオブジェクト、保存状態の推定容量をステータスバーで知らせます。"),
        entry("advisory", "警告の扱い", "警告は助言であり、書き出しをブロックしません。最終判断はプレビュー確認を優先します。"),
      ]),
      section("app-settings", "アプリ設定", "言語・テーマ・タグ設定", "エディタ全体の表示とタグ辞書を管理します。", [
        entry("language", "言語設定", "トップ右の言語セレクトで日本語と英語を切り替えます。初期表示はブラウザ言語から判定し、未対応言語は英語にフォールバックします。"),
        entry("theme", "テーマ", "System、Light、Dark から選べます。System は OS/ブラウザの prefers-color-scheme に追従します。"),
        entry("tag-modal", "タグ編集モーダル", "共通、画像、グループオブジェクト、テンプレートのタグ辞書をカテゴリ別に編集できます。共通タグは各カテゴリの入力候補に出ます。"),
        entry("issue", "Issue 報告", "上部の Issue reporting から GitHub Issues を開き、バグや要望を報告できます。"),
        entry("pwa", "PWA と拡張連携", "対応ブラウザではインストール可能です。Chrome 拡張向けには ping、getSnapshot、applySnapshot のページブリッジを提供します。"),
      ]),
      section("gui", "GUI 調整", "表示・非表示とサイズ調整", "作業内容に合わせてエディタの密度を調整します。", [
        entry("collapse", "折りたたみ", "Quick Add、Canvas、Assets 画像、グループ素材、Colors の保存パレットなどは必要に応じて折りたためます。"),
        entry("panel-resize", "パネル内リスト高さ", "Layers、Colors、Registered templates、Assets 画像、Assets グループ素材のハンドルでリスト高さを変更できます。"),
        entry("timeline-resize", "タイムライン高さ", "アニメタブ表示時の下部タイムラインは上端ハンドルで高さを変え、折りたたみで非表示に近い状態にできます。"),
        entry("manual", "マニュアル表示", "Manual ボタンでこのモーダルを開きます。前回のカテゴリ、セクション、スクロール位置を閉じた後も保持します。"),
        entry("mobile", "レスポンシブ表示", "狭い画面ではパネルが縦に並び、キャンバスを優先して確認できる構成になります。横はみ出しを避ける設計です。"),
      ]),
      section("shortcuts", "ショートカット", "キーボードショートカット", "テキスト入力欄やモーダル外で使える編集操作です。", [
        entry("delete", "Delete / Backspace", "選択中オブジェクトの削除確認を開きます。"),
        entry("clipboard", "Ctrl+C / Ctrl+V / Ctrl+X", "選択オブジェクトを内部クリップボードへコピー、貼り付け、切り取りします。"),
        entry("duplicate", "Ctrl+D", "選択オブジェクトを複製します。"),
        entry("undo-redo", "Ctrl+Z / Ctrl+Y", "レイヤー編集を元に戻す、やり直す操作です。キャンバスドラッグは開始位置と完了位置の 1 ステップとして記録されます。"),
        entry("obs-keys", "OBS プレビュー P/R/H", "OBS プレビューウィンドウでは P が再生切替、R がリセット、H がコントロール表示切替です。"),
      ]),
    ],
  },
];

function section(id: string, label: string, title: string, summary: string, entries: ManualEntry[]): ManualSection {
  return {
    id,
    label,
    title,
    summary,
    entries,
    related: [
      { categoryId: "preview", sectionId: "selection", label: "プレビュー選択" },
      { categoryId: "layers", sectionId: "canvas", label: "キャンバス一覧" },
      { categoryId: "adjust", sectionId: "common", label: "調整: 共通設定" },
    ],
  };
}

function entry(id: string, title: string, body: string): ManualEntry {
  return { id, title, body };
}
