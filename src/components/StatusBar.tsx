import { Activity, CheckCircle2 } from "lucide-react";
import type { OutputSettings } from "../lib/types";

interface StatusBarProps {
  status: string;
  settings: OutputSettings;
  zoom: number;
  layerCount: number;
}

export function StatusBar({ status, settings, zoom, layerCount }: StatusBarProps) {
  return (
    <footer className="status-bar" aria-label="Editor status">
      <div className="status-message">
        <CheckCircle2 size={16} />
        <span>{status}</span>
      </div>
      <div className="status-metrics">
        <span>
          <Activity size={14} /> {layerCount} layers
        </span>
        <span>
          {settings.width}x{settings.height}
        </span>
        <span>{settings.format.toUpperCase()}</span>
        <span>{Math.round(zoom * 100)}% zoom</span>
      </div>
    </footer>
  );
}

