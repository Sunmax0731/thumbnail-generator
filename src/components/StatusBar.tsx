import { Activity, CheckCircle2 } from "lucide-react";
import type { Translator } from "../lib/i18n";
import type { OutputSettings } from "../lib/types";

interface StatusBarProps {
  status: string;
  settings: OutputSettings;
  zoom: number;
  layerCount: number;
  t: Translator;
}

export function StatusBar({ status, settings, zoom, layerCount, t }: StatusBarProps) {
  return (
    <footer className="status-bar" aria-label={t("status.aria")}>
      <div className="status-message">
        <CheckCircle2 size={16} />
        <span>{status}</span>
      </div>
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
