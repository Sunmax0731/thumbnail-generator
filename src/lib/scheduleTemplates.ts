import { defaultOutputSettings } from "./presets";
import { makeShapeLayer, makeTextLayer } from "./layerFactory";
import type { DefaultTemplateDefinition } from "./defaultTemplates";
import type { ShapeLayer, TextLayer, ThumbnailLayer } from "./types";

const font = "Arial Black, Arial, sans-serif";
const titleFont = "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";

export const scheduleTemplates: DefaultTemplateDefinition[] = [
  {
    id: "schedule-year-landscape",
    name: "Yearly Schedule Landscape",
    description: "Annual plan board with 12 editable month cards.",
    category: "schedule",
    previewColors: ["#152033", "#10b6d7", "#ffd166"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720", width: 1280, height: 720 },
    createLayers: () => createYearlySchedule(false),
  },
  {
    id: "schedule-year-portrait",
    name: "Yearly Schedule Portrait",
    description: "Portrait annual plan with stacked month blocks.",
    category: "schedule",
    previewColors: ["#152033", "#ffffff", "#ff4f5f"],
    settings: { ...defaultOutputSettings, presetId: "portrait", width: 1080, height: 1920 },
    createLayers: () => createYearlySchedule(true),
  },
  {
    id: "schedule-month-landscape",
    name: "Monthly Schedule Landscape",
    description: "Wide monthly calendar for stream plans and event posts.",
    category: "schedule",
    previewColors: ["#ffffff", "#10b6d7", "#152033"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720", width: 1280, height: 720 },
    createLayers: () => createMonthlySchedule(false),
  },
  {
    id: "schedule-month-portrait",
    name: "Monthly Schedule Portrait",
    description: "Phone-friendly monthly calendar with note space.",
    category: "schedule",
    previewColors: ["#ffffff", "#ff4f5f", "#152033"],
    settings: { ...defaultOutputSettings, presetId: "portrait", width: 1080, height: 1920 },
    createLayers: () => createMonthlySchedule(true),
  },
  {
    id: "schedule-day-landscape",
    name: "Daily Schedule Landscape",
    description: "OBS-friendly daily timeline with now and next cards.",
    category: "schedule",
    previewColors: ["#111827", "#ffd166", "#10b6d7"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720", width: 1280, height: 720 },
    createLayers: () => createDailySchedule(false),
  },
  {
    id: "schedule-day-portrait",
    name: "Daily Schedule Portrait",
    description: "Portrait daily plan list for mobile announcements.",
    category: "schedule",
    previewColors: ["#111827", "#ffffff", "#ff4f5f"],
    settings: { ...defaultOutputSettings, presetId: "portrait", width: 1080, height: 1920 },
    createLayers: () => createDailySchedule(true),
  },
];

function createYearlySchedule(portrait: boolean): ThumbnailLayer[] {
  const width = portrait ? 1080 : 1280;
  const height = portrait ? 1920 : 720;
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const layers: ThumbnailLayer[] = [
    rect("Year background", 0, 0, width, height, "#152033", 0),
    text("Year title", portrait ? 76 : 64, portrait ? 70 : 52, portrait ? 640 : 650, portrait ? 150 : 96, "2026 PLAN", portrait ? 118 : 78, "#ffffff", "left"),
    ...pill("Year badge", portrait ? 720 : 922, portrait ? 82 : 64, portrait ? 220 : 206, portrait ? 96 : 64, "YEAR", "#ffd166", "#152033", portrait ? 42 : 30),
  ];
  const columns = portrait ? 2 : 4;
  const startX = portrait ? 76 : 64;
  const startY = portrait ? 250 : 174;
  const cardW = portrait ? 420 : 270;
  const cardH = portrait ? 210 : 142;
  const gapX = portrait ? 40 : 30;
  const gapY = portrait ? 34 : 24;
  months.forEach((month, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    layers.push(rect(`${month} card`, x, y, cardW, cardH, "#ffffff", 8, "#10b6d7"));
    layers.push(text(`${month} label`, x + 24, y + 22, cardW - 48, 42, month, portrait ? 38 : 30, "#152033", "left"));
    layers.push(text(`${month} plan`, x + 24, y + 82, cardW - 48, 72, "Main event\nTask note", portrait ? 30 : 22, "#334155", "left", 0));
  });
  return layers;
}

function createMonthlySchedule(portrait: boolean): ThumbnailLayer[] {
  const width = portrait ? 1080 : 1280;
  const height = portrait ? 1920 : 720;
  const layers: ThumbnailLayer[] = [
    rect("Calendar background", 0, 0, width, height, "#f7fafc", 0),
    text("Month title", portrait ? 72 : 64, portrait ? 88 : 40, portrait ? 620 : 620, portrait ? 130 : 86, "JUNE SCHEDULE", portrait ? 92 : 68, "#152033", "left"),
    ...pill("Month badge", portrait ? 704 : 936, portrait ? 92 : 52, portrait ? 214 : 198, portrait ? 86 : 56, "MONTH", "#10b6d7", "#ffffff", portrait ? 36 : 28),
  ];
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const startX = portrait ? 70 : 64;
  const startY = portrait ? 300 : 156;
  const cellW = portrait ? 126 : 156;
  const cellH = portrait ? 178 : 88;
  const gap = portrait ? 8 : 10;
  days.forEach((day, index) => {
    layers.push(rect(`${day} header`, startX + index * (cellW + gap), startY, cellW, portrait ? 58 : 42, "#152033", 0));
    layers.push(text(`${day} label`, startX + index * (cellW + gap), startY + (portrait ? 10 : 8), cellW, 34, day, portrait ? 26 : 20, "#ffffff", "center"));
  });
  for (let index = 0; index < 35; index += 1) {
    const col = index % 7;
    const row = Math.floor(index / 7);
    const x = startX + col * (cellW + gap);
    const y = startY + (portrait ? 70 : 52) + row * (cellH + gap);
    const hasEvent = [3, 9, 14, 20, 27].includes(index);
    layers.push(rect(`Day ${index + 1} cell`, x, y, cellW, cellH, hasEvent ? "#fff7d6" : "#ffffff", 4, "#d8e0e7"));
    layers.push(text(`Day ${index + 1} number`, x + 10, y + 8, 44, 32, String(index + 1), portrait ? 24 : 18, "#152033", "left"));
    if (hasEvent) {
      layers.push(rect(`Day ${index + 1} event chip`, x + 12, y + (portrait ? 78 : 48), cellW - 24, portrait ? 52 : 26, "#ff4f5f", 8));
      layers.push(text(`Day ${index + 1} event`, x + 18, y + (portrait ? 88 : 51), cellW - 36, portrait ? 34 : 22, "20:00", portrait ? 22 : 16, "#ffffff", "center"));
    }
  }
  if (portrait) {
    layers.push(rect("Monthly note", 70, 1636, 940, 180, "#152033", 12));
    layers.push(text("Monthly note text", 104, 1684, 872, 72, "Notes / announcements", 44, "#ffffff", "center"));
  }
  return layers;
}

function createDailySchedule(portrait: boolean): ThumbnailLayer[] {
  const width = portrait ? 1080 : 1280;
  const height = portrait ? 1920 : 720;
  const layers: ThumbnailLayer[] = [
    rect("Daily background", 0, 0, width, height, "#111827", 0),
    text("Daily title", portrait ? 72 : 64, portrait ? 92 : 58, portrait ? 820 : 560, portrait ? 150 : 96, "TODAY'S PLAN", portrait ? 100 : 74, "#ffffff", "left"),
    ...pill("Live badge", portrait ? 72 : 930, portrait ? 250 : 64, portrait ? 260 : 218, portrait ? 86 : 64, "LIVE", "#ff4f5f", "#ffffff", portrait ? 38 : 32),
  ];
  const items = [
    ["18:00", "Opening"],
    ["19:00", "Main topic"],
    ["20:30", "Q&A"],
    ["21:00", "Next notice"],
  ];
  const listX = portrait ? 72 : 76;
  const listY = portrait ? 430 : 190;
  const rowW = portrait ? 936 : 700;
  const rowH = portrait ? 190 : 106;
  const gap = portrait ? 34 : 22;
  items.forEach(([time, label], index) => {
    const y = listY + index * (rowH + gap);
    layers.push(rect(`${label} row`, listX, y, rowW, rowH, index === 1 ? "#ffd166" : "#ffffff", 10, "#10b6d7"));
    layers.push(text(`${label} time`, listX + 28, y + (portrait ? 48 : 30), portrait ? 220 : 148, 54, time, portrait ? 42 : 32, "#152033", "left"));
    layers.push(text(`${label} title`, listX + (portrait ? 270 : 190), y + (portrait ? 48 : 30), rowW - (portrait ? 318 : 230), 62, label, portrait ? 46 : 36, "#152033", "left"));
  });
  if (portrait) {
    layers.push(rect("Tomorrow card", 72, 1430, 936, 240, "#10b6d7", 14));
    layers.push(text("Tomorrow label", 112, 1496, 856, 84, "NEXT: Tomorrow stream", 52, "#ffffff", "center"));
  } else {
    layers.push(rect("Now card", 840, 190, 340, 150, "#ffd166", 12));
    layers.push(text("Now text", 868, 232, 284, 66, "NOW", 54, "#111827", "center"));
    layers.push(rect("Next card", 840, 382, 340, 158, "#10b6d7", 12));
    layers.push(text("Next text", 870, 426, 280, 74, "NEXT\nQ&A", 42, "#ffffff", "center"));
  }
  return layers;
}

function rect(
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  cornerRadius = 0,
  strokeColor = "#ffffff",
): ShapeLayer {
  return makeShapeLayer({
    name,
    x,
    y,
    width,
    height,
    fill,
    strokeColor,
    strokeWidth: strokeColor === "#ffffff" ? 0 : 4,
    cornerRadius,
  });
}

function pill(
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  fill: string,
  color: string,
  fontSize: number,
): ThumbnailLayer[] {
  return [
    rect(`${name} shape`, x, y, width, height, fill, Math.round(height / 3)),
    text(`${name} text`, x, y + Math.round(height * 0.23), width, Math.round(height * 0.55), label, fontSize, color, "center", 0),
  ];
}

function text(
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  fontSize: number,
  color: string,
  align: "left" | "center" | "right",
  strokeWidth = 3,
): TextLayer {
  return makeTextLayer({
    name,
    x,
    y,
    width,
    height,
    text: value,
    fontSize,
    fontFamily: fontSize >= 60 ? titleFont : font,
    fontWeight: "900",
    color,
    strokeColor: color === "#ffffff" ? "#152033" : "#ffffff",
    strokeWidth,
    align,
    lineHeight: 0.95,
  });
}
