import { BookOpen, FileText, Github, ShieldCheck } from "lucide-react";

import type { Translator } from "../lib/i18n";

interface StatusBarProps {
  t: Translator;
  onOpenManual: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export function StatusBar({ t, onOpenManual, onOpenPrivacy, onOpenTerms }: StatusBarProps) {
  return (
    <footer className="status-bar legal-footer" aria-label={t("footer.aria")}>
      <nav className="footer-links" aria-label={t("footer.links")}>
        <button type="button" className="footer-link-button" onClick={onOpenManual}>
          <BookOpen size={14} /> {t("manual.open")}
        </button>
        <button type="button" className="footer-link-button" onClick={onOpenPrivacy}>
          <ShieldCheck size={14} /> {t("footer.privacy")}
        </button>
        <button type="button" className="footer-link-button" onClick={onOpenTerms}>
          <FileText size={14} /> {t("footer.terms")}
        </button>
        <a href="https://x.com/Sunmax0731" target="_blank" rel="noreferrer">
          {t("footer.contact")}
        </a>
      </nav>
      <div className="footer-copyright" aria-label={t("footer.copyright")}>
        {t("footer.copyright")}
      </div>
      <div className="footer-issues">
        <a href="https://github.com/Sunmax0731/thumbnail-generator/issues" target="_blank" rel="noreferrer">
          <Github size={14} />
          <span>{t("footer.issues")}</span>
        </a>
      </div>
    </footer>
  );
}
