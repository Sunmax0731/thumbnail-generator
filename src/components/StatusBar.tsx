import { Activity, CheckCircle2 } from "lucide-react";
import type { Translator } from "../lib/i18n";
import type { QualityWarning } from "../lib/qualityChecks";
import type { OutputSettings } from "../lib/types";

interface StatusBarProps {
  status: string;
  settings: OutputSettings;
  zoom: number;
  layerCount: number;
  warnings: QualityWarning[];
  t: Translator;
}

export function StatusBar({ status, settings, zoom, layerCount, warnings, t }: StatusBarProps) {
  return (
    <footer className="status-bar" aria-label={t("status.aria")}>
      <div className="status-message">
        <CheckCircle2 size={16} />
        <span>{status}</span>
      </div>
      {warnings.length > 0 ? (
        <div className="status-warnings" aria-label={t("status.warnings")}>
          {warnings.slice(0, 3).map((warning) => (
            <span key={warning.code}>{warning.message}</span>
          ))}
        </div>
      ) : null}
      <div className="status-metrics">
        <span>
          <Activity size={14} /> {layerCount === 1 ? t("status.layerCount.one") : t("status.layerCount", { count: layerCount })}
        </span>
        <span>
          {settings.width}x{settings.height}
        </span>
        <span>{settings.format.toUpperCase()}</span>
        <span>{t("status.zoom", { zoom: Math.round(zoom * 100) })}</span>
      </div>
    </footer>
  );
}
