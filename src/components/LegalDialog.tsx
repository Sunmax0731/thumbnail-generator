import { FileText, ShieldCheck, X } from "lucide-react";

import { createTranslator, type Language } from "../lib/i18n";

export type LegalDialogKind = "privacy" | "terms";

interface LegalDialogProps {
  kind: LegalDialogKind;
  language: Language;
  onClose: () => void;
}

interface LegalSection {
  heading: string;
  body?: string;
  items?: string[];
}

interface LegalCopy {
  title: string;
  subtitle: string;
  closeLabel: string;
  sections: LegalSection[];
}

export function LegalDialog({ kind, language, onClose }: LegalDialogProps) {
  const t = createTranslator(language);
  const copy = buildLegalCopy(kind, language);
  const TitleIcon = kind === "privacy" ? ShieldCheck : FileText;
  const titleId = `legal-${kind}-title`;

  return (
    <div className="modal-backdrop manual-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="manual-dialog legal-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-header manual-header">
          <div className="modal-title-block">
            <h2 id={titleId}>
              <TitleIcon size={18} /> {copy.title}
            </h2>
            <p>{copy.subtitle}</p>
          </div>
          <button type="button" className="icon-button modal-close" aria-label={copy.closeLabel} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="legal-content" aria-label={t("footer.links")}>
          {copy.sections.map((section) => (
            <section key={section.heading} className="legal-section">
              <h3>{section.heading}</h3>
              {section.body ? <p>{section.body}</p> : null}
              {section.items ? (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

function buildLegalCopy(kind: LegalDialogKind, language: Language): LegalCopy {
  if (language === "ja") return kind === "privacy" ? jaPrivacyCopy : jaTermsCopy;
  return kind === "privacy" ? enPrivacyCopy : enTermsCopy;
}

const enPrivacyCopy: LegalCopy = {
  title: "Privacy Policy",
  subtitle: "Effective date: June 14, 2026",
  closeLabel: "Close privacy policy",
  sections: [
    {
      heading: "Operator",
      body: "This web app is operated by Sunmax Engineering. Contact is available through X / Twitter: https://x.com/Sunmax0731.",
    },
    {
      heading: "Information handled by the app",
      items: [
        "Imported images, fonts, templates, colors, brand settings, and edit-state data are processed in your browser.",
        "The app stores autosave data, templates, palettes, and related settings in localStorage or equivalent browser storage.",
        "Exported thumbnail files are created locally in the browser and downloaded by your device.",
      ],
    },
    {
      heading: "Analytics and external services",
      body: "The published GitHub Pages app may use Google Analytics to understand usage trends. GitHub Pages, GitHub Issues, Google Fonts, and X / Twitter may process data under their own policies when their services are loaded or opened.",
    },
    {
      heading: "Purpose of use",
      items: [
        "Provide thumbnail editing, preview, import, export, autosave, and recovery features.",
        "Improve app quality and prioritize fixes through aggregate usage information and issue reports.",
        "Respond to inquiries and support requests sent through linked contact channels.",
      ],
    },
    {
      heading: "Sharing and deletion",
      body: "Sunmax Engineering does not intentionally receive or sell your browser-local project data. You can delete local app data by clearing browser site data, disabling autosave, or using in-app delete/export controls where available.",
    },
    {
      heading: "Security and updates",
      body: "Reasonable care is taken to keep the static app safe, but browser storage is controlled by your device and browser. This policy may be updated when app features, linked services, or legal requirements change.",
    },
  ],
};

const jaPrivacyCopy: LegalCopy = {
  title: "プライバシーポリシー",
  subtitle: "施行日: 2026年6月14日",
  closeLabel: "プライバシーポリシーを閉じる",
  sections: [
    {
      heading: "運営者",
      body: "本ウェブアプリは Sunmax Engineering が運営します。問い合わせ先は X / Twitter（https://x.com/Sunmax0731）です。",
    },
    {
      heading: "アプリが扱う情報",
      items: [
        "読み込んだ画像、フォント、テンプレート、色、ブランド設定、編集状態データは利用者のブラウザ内で処理されます。",
        "自動保存データ、テンプレート、パレット、関連設定は localStorage などのブラウザストレージに保存されます。",
        "書き出したサムネイルファイルはブラウザ内で生成され、利用者の端末へダウンロードされます。",
      ],
    },
    {
      heading: "アクセス解析と外部サービス",
      body: "公開版 GitHub Pages では利用傾向の把握のため Google Analytics を使用する場合があります。GitHub Pages、GitHub Issues、Google Fonts、X / Twitter を読み込む、または開く場合、それぞれのサービスのポリシーに従って情報が処理されることがあります。",
    },
    {
      heading: "利用目的",
      items: [
        "サムネイル編集、プレビュー、読み込み、書き出し、自動保存、復元機能を提供するため。",
        "集計された利用情報や Issue 報告をもとに品質改善と修正優先度の判断を行うため。",
        "リンク先の問い合わせ窓口から届いた連絡やサポート依頼に対応するため。",
      ],
    },
    {
      heading: "共有と削除",
      body: "Sunmax Engineering は、ブラウザ内に保存されたプロジェクトデータを意図的に受信または販売しません。ローカルデータはブラウザのサイトデータ削除、自動保存の無効化、またはアプリ内の削除/書き出し機能で管理できます。",
    },
    {
      heading: "安全管理と改定",
      body: "静的アプリとして安全性に配慮しますが、ブラウザストレージは利用者の端末とブラウザにより管理されます。本ポリシーは機能、外部サービス、法令要件の変更に応じて改定されることがあります。",
    },
  ],
};

const enTermsCopy: LegalCopy = {
  title: "Terms of Use",
  subtitle: "Effective date: June 14, 2026",
  closeLabel: "Close terms of use",
  sections: [
    {
      heading: "Scope",
      body: "These terms apply to use of the ThumbNailed It? static web app provided by Sunmax Engineering.",
    },
    {
      heading: "Service",
      body: "The app provides browser-based thumbnail layout, editing, preview, local storage, and image export features. Features may be changed, suspended, or discontinued without prior notice.",
    },
    {
      heading: "User responsibilities",
      items: [
        "Use only images, fonts, text, and other materials that you have the right to use.",
        "Back up important work by exporting files or edit-state JSON when needed.",
        "Confirm that exported thumbnails satisfy the rules of the platform where you publish them.",
      ],
    },
    {
      heading: "Prohibited use",
      items: [
        "Do not use the app for illegal acts, rights infringement, harmful content, or disruption of the service.",
        "Do not attempt unauthorized access, abuse linked services, or misrepresent Sunmax Engineering.",
      ],
    },
    {
      heading: "Disclaimer",
      body: "The app is provided as-is. Sunmax Engineering does not guarantee uninterrupted operation, data preservation, fitness for a particular purpose, or results from exported thumbnails. To the extent permitted by law, Sunmax Engineering is not liable for damages arising from use of the app.",
    },
    {
      heading: "Contact and changes",
      body: "Questions may be sent through X / Twitter: https://x.com/Sunmax0731. These terms may be updated when app features, operating needs, or legal requirements change.",
    },
  ],
};

const jaTermsCopy: LegalCopy = {
  title: "利用規約",
  subtitle: "施行日: 2026年6月14日",
  closeLabel: "利用規約を閉じる",
  sections: [
    {
      heading: "適用範囲",
      body: "本規約は、Sunmax Engineering が提供する静的ウェブアプリ「サムネいる？」の利用に適用されます。",
    },
    {
      heading: "サービス内容",
      body: "本アプリは、ブラウザ上でのサムネイルレイアウト、編集、プレビュー、ローカル保存、画像書き出し機能を提供します。機能は事前の通知なく変更、停止、終了されることがあります。",
    },
    {
      heading: "利用者の責任",
      items: [
        "画像、フォント、文章、その他素材は、利用者が使用権限を持つものだけを使用してください。",
        "重要な作業内容は、必要に応じてファイルまたは編集状態JSONとして書き出してバックアップしてください。",
        "書き出したサムネイルが公開先プラットフォームの規約やルールに適合することを確認してください。",
      ],
    },
    {
      heading: "禁止事項",
      items: [
        "違法行為、権利侵害、有害なコンテンツ作成、サービス運営の妨害に本アプリを使用しないでください。",
        "不正アクセス、外部サービスの悪用、Sunmax Engineering になりすます行為をしないでください。",
      ],
    },
    {
      heading: "免責",
      body: "本アプリは現状有姿で提供されます。Sunmax Engineering は、継続的な動作、データ保存、特定目的への適合性、書き出し結果を保証しません。法令で認められる範囲で、本アプリの利用により生じた損害について責任を負いません。",
    },
    {
      heading: "問い合わせと改定",
      body: "問い合わせは X / Twitter（https://x.com/Sunmax0731）から行えます。本規約は機能、運営上の必要、法令要件の変更に応じて改定されることがあります。",
    },
  ],
};
