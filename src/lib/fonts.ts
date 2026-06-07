export interface FontOption {
  label: string;
  value: string;
}

export const fontOptions: FontOption[] = [
  {
    label: "Anton (Google Fonts)",
    value: "'Anton', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
  },
  {
    label: "Bangers (Google Fonts)",
    value: "'Bangers', Impact, Haettenschweiler, 'Arial Narrow Bold', cursive",
  },
  {
    label: "Bebas Neue (Google Fonts)",
    value: "'Bebas Neue', 'Arial Narrow', 'Roboto Condensed', Arial, sans-serif",
  },
  {
    label: "Noto Sans JP 900 (Google Fonts)",
    value: "'Noto Sans JP', 'Yu Gothic', 'Meiryo', Arial, sans-serif",
  },
  {
    label: "Oswald (Google Fonts)",
    value: "'Oswald', 'Roboto Condensed', Arial, sans-serif",
  },
  {
    label: "Roboto Condensed (Google Fonts)",
    value: "'Roboto Condensed', 'Arial Narrow', Arial, sans-serif",
  },
  {
    label: "Impact",
    value: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
  },
  {
    label: "Arial Black",
    value: "Arial Black, Arial, sans-serif",
  },
  {
    label: "Bebas-style condensed",
    value: "'Arial Narrow', 'Roboto Condensed', Arial, sans-serif",
  },
  {
    label: "Noto Sans JP fallback",
    value: "'Noto Sans JP', 'Yu Gothic', 'Meiryo', Arial, sans-serif",
  },
  {
    label: "System bold",
    value: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    label: "Serif display",
    value: "Georgia, 'Times New Roman', serif",
  },
  {
    label: "Monospace",
    value: "'Cascadia Code', Consolas, monospace",
  },
];

export function fontLabelFor(value: string): string {
  return fontOptions.find((option) => option.value === value)?.label ?? "Imported font";
}
