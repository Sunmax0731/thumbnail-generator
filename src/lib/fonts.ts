export interface FontOption {
  label: string;
  value: string;
}

export const hostedGoogleFontFamilies = [
  "Anton",
  "Bangers",
  "Bebas Neue",
  "Dela Gothic One",
  "DotGothic16",
  "Luckiest Guy",
  "M PLUS Rounded 1c",
  "Mochiy Pop One",
  "Montserrat",
  "Noto Sans JP",
  "Oswald",
  "Permanent Marker",
  "Playfair Display",
  "Poppins",
  "Rampart One",
  "Roboto Condensed",
  "Yusei Magic",
  "Zen Kaku Gothic New",
] as const;

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
    label: "Dela Gothic One (Google Fonts)",
    value: "'Dela Gothic One', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif",
  },
  {
    label: "DotGothic16 (Google Fonts)",
    value: "'DotGothic16', 'MS Gothic', monospace",
  },
  {
    label: "Luckiest Guy (Google Fonts)",
    value: "'Luckiest Guy', Impact, Haettenschweiler, 'Arial Narrow Bold', cursive",
  },
  {
    label: "M PLUS Rounded 1c 900 (Google Fonts)",
    value: "'M PLUS Rounded 1c', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif",
  },
  {
    label: "Mochiy Pop One (Google Fonts)",
    value: "'Mochiy Pop One', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif",
  },
  {
    label: "Montserrat 900 (Google Fonts)",
    value: "'Montserrat', 'Arial Black', Arial, sans-serif",
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
    label: "Permanent Marker (Google Fonts)",
    value: "'Permanent Marker', 'Comic Sans MS', cursive",
  },
  {
    label: "Playfair Display 900 (Google Fonts)",
    value: "'Playfair Display', Georgia, 'Times New Roman', serif",
  },
  {
    label: "Poppins 900 (Google Fonts)",
    value: "'Poppins', 'Arial Black', Arial, sans-serif",
  },
  {
    label: "Rampart One (Google Fonts)",
    value: "'Rampart One', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif",
  },
  {
    label: "Roboto Condensed (Google Fonts)",
    value: "'Roboto Condensed', 'Arial Narrow', Arial, sans-serif",
  },
  {
    label: "Yusei Magic (Google Fonts)",
    value: "'Yusei Magic', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif",
  },
  {
    label: "Zen Kaku Gothic New 900 (Google Fonts)",
    value: "'Zen Kaku Gothic New', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif",
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
