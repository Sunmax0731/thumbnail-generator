import { makeShapeLayer, makeTextLayer } from "./layerFactory";
import type { OutputSettings, ShapeLayer, TextLayer, ThumbnailLayer } from "./types";

export type ScheduleBuilderKind = "month" | "week";
export type ScheduleBuilderOrientation = "landscape" | "portrait" | "current";
export type ScheduleWeekStart = "sunday" | "monday";
export type ScheduleGridStyle = "cards" | "lines";

export interface ScheduleBuilderRequest {
  kind: ScheduleBuilderKind;
  orientation: ScheduleBuilderOrientation;
  year: number;
  month: number;
  day: number;
  weekStartsOn: ScheduleWeekStart;
  title: string;
  fontFamily: string;
  fontWeight: string;
  gridStyle: ScheduleGridStyle;
  backgroundColor: string;
  surfaceColor: string;
  accentColor: string;
  textColor: string;
  cornerRadius: number;
  strokeWidth: number;
  showAdjacentDays: boolean;
}

export interface BuiltScheduleTemplate {
  name: string;
  settings: OutputSettings;
  layers: ThumbnailLayer[];
}

interface BuildContext {
  width: number;
  height: number;
  portrait: boolean;
  groupId: string;
  groupName: string;
  request: ScheduleBuilderRequest;
  language: "en" | "ja";
}

const dayLabels = {
  en: {
    sunday: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    monday: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  },
  ja: {
    sunday: ["日", "月", "火", "水", "木", "金", "土"],
    monday: ["月", "火", "水", "木", "金", "土", "日"],
  },
} as const;

const weekdayLabels = {
  en: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  ja: ["日", "月", "火", "水", "木", "金", "土"],
} as const;

export function buildScheduleTemplate(
  request: ScheduleBuilderRequest,
  currentSettings: OutputSettings,
  language: "en" | "ja" = "en",
): BuiltScheduleTemplate {
  const settings = resolveScheduleSettings(request.orientation, currentSettings);
  const portrait = settings.height > settings.width;
  const groupName = buildScheduleName(request, language);
  const context: BuildContext = {
    width: settings.width,
    height: settings.height,
    portrait,
    groupId: `schedule-${Date.now().toString(36)}`,
    groupName,
    request: sanitizeScheduleRequest(request),
    language,
  };
  return {
    name: groupName,
    settings,
    layers: request.kind === "week" ? createWeekLayers(context) : createMonthLayers(context),
  };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0, 12)).getUTCDate();
}

export function getWeekday(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

export function addDays(year: number, month: number, day: number, offset: number): { year: number; month: number; day: number; weekday: number } {
  const date = new Date(Date.UTC(year, month - 1, day + offset, 12));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: date.getUTCDay(),
  };
}

function createMonthLayers(context: BuildContext): ThumbnailLayer[] {
  const { request, width, height, portrait, language } = context;
  const title = request.title.trim() || buildScheduleName(request, language);
  const labels = dayLabels[language][request.weekStartsOn];
  const firstWeekday = getWeekday(request.year, request.month, 1);
  const weekStartIndex = request.weekStartsOn === "monday" ? 1 : 0;
  const leading = (firstWeekday - weekStartIndex + 7) % 7;
  const daysInMonth = getDaysInMonth(request.year, request.month);
  const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;
  const rows = totalCells <= 35 ? 5 : 6;
  const previousMonthDays = getDaysInMonth(request.month === 1 ? request.year - 1 : request.year, request.month === 1 ? 12 : request.month - 1);
  const layers: ThumbnailLayer[] = [
    shape(context, "Schedule background", 0, 0, width, height, request.backgroundColor, 0, request.backgroundColor, 0),
    text(context, "Schedule title", portrait ? 68 : 62, portrait ? 70 : 40, portrait ? width - 136 : width * 0.58, portrait ? 112 : 72, title, portrait ? 72 : 56, request.textColor, "left", 0),
    ...badge(context, request.kind === "month" ? "MONTH" : "WEEK", portrait ? width - 282 : width - 278, portrait ? 76 : 46, portrait ? 214 : 190, portrait ? 72 : 52),
  ];
  const marginX = portrait ? 58 : 64;
  const gridTop = portrait ? 230 : 132;
  const gridWidth = width - marginX * 2;
  const headerHeight = portrait ? 56 : 38;
  const gap = request.gridStyle === "cards" ? (portrait ? 8 : 7) : 0;
  const cellWidth = (gridWidth - gap * 6) / 7;
  const availableHeight = height - gridTop - (portrait ? 86 : 46);
  const cellHeight = (availableHeight - headerHeight - gap * rows) / rows;

  labels.forEach((label, index) => {
    const x = marginX + index * (cellWidth + gap);
    layers.push(shape(context, `Weekday ${label} header`, x, gridTop, cellWidth, headerHeight, request.accentColor, request.cornerRadius, request.accentColor, 0));
    layers.push(text(context, `Weekday ${label} label`, x, gridTop + headerHeight * 0.24, cellWidth, headerHeight * 0.54, label, portrait ? 26 : 18, "#ffffff", "center", 0));
  });

  for (let index = 0; index < totalCells; index += 1) {
    const row = Math.floor(index / 7);
    const col = index % 7;
    const x = marginX + col * (cellWidth + gap);
    const y = gridTop + headerHeight + gap + row * (cellHeight + gap);
    const dayNumber = index - leading + 1;
    const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
    const adjacentDay = dayNumber < 1 ? previousMonthDays + dayNumber : dayNumber - daysInMonth;
    const displayDay = inMonth ? dayNumber : adjacentDay;
    const showNumber = inMonth || request.showAdjacentDays;
    const layerOpacity = inMonth ? 1 : 0.36;
    const cellFill = request.gridStyle === "cards" ? request.surfaceColor : request.backgroundColor;
    const stroke = request.gridStyle === "cards" ? request.accentColor : request.surfaceColor;
    layers.push(shape(context, `Day cell ${index + 1}`, x, y, cellWidth, cellHeight, cellFill, request.cornerRadius, stroke, request.strokeWidth, layerOpacity));
    if (showNumber) {
      layers.push(text(context, `Day ${displayDay} number`, x + cellWidth * 0.08, y + cellHeight * 0.08, cellWidth * 0.34, cellHeight * 0.22, String(displayDay), portrait ? 26 : 18, request.textColor, "left", 0, layerOpacity));
    }
    if (inMonth) {
      layers.push(shape(context, `Day ${displayDay} plan line`, x + cellWidth * 0.1, y + cellHeight * 0.62, cellWidth * 0.8, Math.max(3, cellHeight * 0.024), request.accentColor, 2, request.accentColor, 0, 0.58));
      if (portrait || cellHeight > 70) {
        layers.push(text(context, `Day ${displayDay} memo`, x + cellWidth * 0.1, y + cellHeight * 0.68, cellWidth * 0.8, cellHeight * 0.2, "Plan", portrait ? 20 : 14, request.textColor, "left", 0, 0.48));
      }
    }
  }
  return layers;
}

function createWeekLayers(context: BuildContext): ThumbnailLayer[] {
  const { request, width, height, portrait, language } = context;
  const title = request.title.trim() || buildScheduleName(request, language);
  const layers: ThumbnailLayer[] = [
    shape(context, "Schedule background", 0, 0, width, height, request.backgroundColor, 0, request.backgroundColor, 0),
    text(context, "Schedule title", portrait ? 68 : 62, portrait ? 70 : 42, portrait ? width - 136 : width * 0.6, portrait ? 112 : 72, title, portrait ? 70 : 54, request.textColor, "left", 0),
    ...badge(context, "WEEK", portrait ? width - 252 : width - 250, portrait ? 78 : 48, portrait ? 184 : 176, portrait ? 70 : 50),
  ];
  const dates = Array.from({ length: 7 }, (_, index) => addDays(request.year, request.month, request.day, index));

  if (portrait) {
    const marginX = 62;
    const startY = 226;
    const rowWidth = width - marginX * 2;
    const gap = request.gridStyle === "cards" ? 18 : 8;
    const rowHeight = (height - startY - 86 - gap * 6) / 7;
    dates.forEach((date, index) => {
      const y = startY + index * (rowHeight + gap);
      layers.push(shape(context, `Week day ${index + 1} row`, marginX, y, rowWidth, rowHeight, request.surfaceColor, request.cornerRadius, request.accentColor, request.strokeWidth));
      layers.push(shape(context, `Week day ${index + 1} date block`, marginX + 22, y + rowHeight * 0.16, 156, rowHeight * 0.68, request.accentColor, request.cornerRadius, request.accentColor, 0));
      layers.push(text(context, `Week day ${index + 1} label`, marginX + 22, y + rowHeight * 0.22, 156, rowHeight * 0.22, weekdayLabels[language][date.weekday], Math.max(22, rowHeight * 0.18), "#ffffff", "center", 0));
      layers.push(text(context, `Week day ${index + 1} date`, marginX + 22, y + rowHeight * 0.49, 156, rowHeight * 0.3, `${date.month}/${date.day}`, Math.max(24, rowHeight * 0.22), "#ffffff", "center", 0));
      layers.push(text(context, `Week day ${index + 1} time`, marginX + 212, y + rowHeight * 0.28, 170, rowHeight * 0.25, "20:00", Math.max(26, rowHeight * 0.2), request.textColor, "left", 0));
      layers.push(text(context, `Week day ${index + 1} plan`, marginX + 400, y + rowHeight * 0.28, rowWidth - 440, rowHeight * 0.28, "Plan / event", Math.max(28, rowHeight * 0.22), request.textColor, "left", 0));
      layers.push(shape(context, `Week day ${index + 1} memo line`, marginX + 212, y + rowHeight * 0.68, rowWidth - 256, Math.max(3, rowHeight * 0.025), request.accentColor, 2, request.accentColor, 0, 0.64));
    });
    return layers;
  }

  const marginX = 64;
  const startY = 142;
  const gap = request.gridStyle === "cards" ? 9 : 0;
  const cardWidth = (width - marginX * 2 - gap * 6) / 7;
  const cardHeight = height - startY - 62;
  dates.forEach((date, index) => {
    const x = marginX + index * (cardWidth + gap);
    layers.push(shape(context, `Week day ${index + 1} card`, x, startY, cardWidth, cardHeight, request.surfaceColor, request.cornerRadius, request.accentColor, request.strokeWidth));
    layers.push(shape(context, `Week day ${index + 1} header`, x, startY, cardWidth, 64, request.accentColor, request.cornerRadius, request.accentColor, 0));
    layers.push(text(context, `Week day ${index + 1} label`, x, startY + 14, cardWidth, 28, weekdayLabels[language][date.weekday], 22, "#ffffff", "center", 0));
    layers.push(text(context, `Week day ${index + 1} date`, x + cardWidth * 0.12, startY + 88, cardWidth * 0.76, 36, `${date.month}/${date.day}`, 30, request.textColor, "center", 0));
    for (let slot = 0; slot < 3; slot += 1) {
      const slotY = startY + 154 + slot * 88;
      layers.push(shape(context, `Week day ${index + 1} slot ${slot + 1}`, x + cardWidth * 0.1, slotY, cardWidth * 0.8, 52, slot === 1 ? request.accentColor : request.backgroundColor, Math.min(request.cornerRadius, 8), request.surfaceColor, 0, slot === 1 ? 1 : 0.68));
      layers.push(text(context, `Week day ${index + 1} slot ${slot + 1} text`, x + cardWidth * 0.12, slotY + 13, cardWidth * 0.76, 24, slot === 0 ? "10:00" : slot === 1 ? "14:00" : "20:00", 17, slot === 1 ? "#ffffff" : request.textColor, "center", 0, slot === 1 ? 1 : 0.72));
    }
  });
  return layers;
}

function resolveScheduleSettings(orientation: ScheduleBuilderOrientation, currentSettings: OutputSettings): OutputSettings {
  if (orientation === "portrait") return { ...currentSettings, presetId: "portrait", width: 1080, height: 1920 };
  if (orientation === "landscape") return { ...currentSettings, presetId: "youtube-720", width: 1280, height: 720 };
  return currentSettings;
}

function sanitizeScheduleRequest(request: ScheduleBuilderRequest): ScheduleBuilderRequest {
  return {
    ...request,
    year: Math.min(2100, Math.max(1970, Math.round(request.year || new Date().getFullYear()))),
    month: Math.min(12, Math.max(1, Math.round(request.month || 1))),
    day: Math.min(31, Math.max(1, Math.round(request.day || 1))),
    cornerRadius: Math.min(32, Math.max(0, Math.round(request.cornerRadius || 0))),
    strokeWidth: Math.min(12, Math.max(0, Math.round(request.strokeWidth || 0))),
  };
}

function buildScheduleName(request: ScheduleBuilderRequest, language: "en" | "ja"): string {
  if (request.kind === "week") {
    return language === "ja"
      ? `${request.year}年${request.month}月${request.day}日週の予定`
      : `${request.year}-${pad(request.month)}-${pad(request.day)} Weekly Schedule`;
  }
  return language === "ja" ? `${request.year}年${request.month}月の予定` : `${request.year}-${pad(request.month)} Monthly Schedule`;
}

function badge(context: BuildContext, label: string, x: number, y: number, width: number, height: number): ThumbnailLayer[] {
  return [
    shape(context, `${label} badge`, x, y, width, height, context.request.accentColor, Math.round(height / 3), context.request.accentColor, 0),
    text(context, `${label} badge text`, x, y + height * 0.24, width, height * 0.48, label, Math.max(22, height * 0.38), "#ffffff", "center", 0),
  ];
}

function shape(
  context: BuildContext,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  cornerRadius: number,
  strokeColor: string,
  strokeWidth: number,
  opacity = 1,
): ShapeLayer {
  return makeShapeLayer({
    name,
    x,
    y,
    width,
    height,
    fill,
    cornerRadius,
    strokeColor,
    strokeWidth,
    opacity,
    groupId: context.groupId,
    groupName: context.groupName,
  });
}

function text(
  context: BuildContext,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  fontSize: number,
  color: string,
  align: "left" | "center" | "right",
  strokeWidth: number,
  opacity = 1,
): TextLayer {
  return makeTextLayer({
    name,
    x,
    y,
    width,
    height,
    text: value,
    fontSize,
    fontFamily: context.request.fontFamily,
    fontWeight: context.request.fontWeight,
    color,
    strokeColor: context.request.backgroundColor,
    strokeWidth,
    opacity,
    align,
    lineHeight: 0.95,
    groupId: context.groupId,
    groupName: context.groupName,
  });
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}
