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
          <XLogoIcon size={14} />
          <span>{t("footer.contact")}</span>
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

function XLogoIcon({ size }: { size: number }) {
  return (
    <svg
      className="x-logo-icon"
      width={size}
      height={size}
      viewBox="0 0 1200 1227"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
        fill="currentColor"
      />
    </svg>
  );
}
