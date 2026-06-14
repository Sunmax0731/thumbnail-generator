import type { Translator } from "../lib/i18n";

interface StatusBarProps {
  t: Translator;
}

export function StatusBar({ t }: StatusBarProps) {
  return (
    <footer className="status-bar legal-footer" aria-label={t("footer.aria")}>
      <div className="footer-brand">
        <span>{t("footer.copyright")}</span>
        <span>{t("footer.browserOnly")}</span>
      </div>
      <nav className="footer-links" aria-label={t("footer.links")}>
        <a href="privacy-policy.html" target="_blank" rel="noreferrer">
          {t("footer.privacy")}
        </a>
        <a href="terms.html" target="_blank" rel="noreferrer">
          {t("footer.terms")}
        </a>
        <a href="https://x.com/Sunmax0731" target="_blank" rel="noreferrer">
          {t("footer.contact")}
        </a>
        <a href="https://github.com/Sunmax0731/thumbnail-generator/issues" target="_blank" rel="noreferrer">
          {t("footer.issues")}
        </a>
      </nav>
    </footer>
  );
}
