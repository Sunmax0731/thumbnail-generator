import { makeShapeLayer, makeTextLayer } from "./layerFactory";
import type { OutputSettings, ShapeLayer, TextLayer, ThumbnailLayer } from "./types";

export type ScheduleBuilderKind = "month" | "week";
export type ScheduleBuilderOrientation = "landscape" | "portrait" | "current";
export type ScheduleWeekStart = "sunday" | "monday";
export type ScheduleGridStyle = "cards" | "lines";
export type ScheduleWeekdayLanguage = "en" | "ja";
export type ScheduleDateFormat = "day" | "month-day";
export type ScheduleActionCountMode = "uniform" | "individual";

export interface ScheduleBuilderRequest {
  kind: ScheduleBuilderKind;
  orientation: ScheduleBuilderOrientation;
  year: number;
  month: number;
  day: number;
  weekStartsOn: ScheduleWeekStart;
  weekdayLanguage: ScheduleWeekdayLanguage;
  dateFormat: ScheduleDateFormat;
  title: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  titleFontSize: number;
  weekdayFontSize: number;
  dateFontSize: number;
  eventFontSize: number;
  gridStyle: ScheduleGridStyle;
  backgroundColor: string;
  surfaceColor: string;
  accentColor: string;
  textColor: string;
  cornerRadius: number;
  strokeWidth: number;
  actionCountMode: ScheduleActionCountMode;
  actionsPerDay: number;
  dailyActionCounts: number[];
  showAdjacentDays: boolean;
  groupLayers: boolean;
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
  const labelLanguage = request.weekdayLanguage;
  const labels = dayLabels[labelLanguage][request.weekStartsOn];
  const firstWeekday = getWeekday(request.year, request.month, 1);
  const weekStartIndex = request.weekStartsOn === "monday" ? 1 : 0;
  const leading = (firstWeekday - weekStartIndex + 7) % 7;
  const daysInMonth = getDaysInMonth(request.year, request.month);
  const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;
  const rows = totalCells <= 35 ? 5 : 6;
  const layers: ThumbnailLayer[] = [
    shape(context, "Schedule background", 0, 0, width, height, request.backgroundColor, 0, request.backgroundColor, 0),
    text(context, "Schedule title", portrait ? 68 : 62, portrait ? 70 : 40, portrait ? width - 136 : width * 0.58, portrait ? 112 : 72, title, request.titleFontSize, request.textColor, "left", 0),
    ...badge(context, getScheduleBadgeLabel(request), portrait ? width - 282 : width - 278, portrait ? 76 : 46, portrait ? 214 : 190, portrait ? 72 : 52),
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
    layers.push(text(context, `Weekday ${label} label`, x, gridTop + headerHeight * 0.24, cellWidth, headerHeight * 0.54, label, request.weekdayFontSize, "#ffffff", "center", 0));
  });

  for (let index = 0; index < totalCells; index += 1) {
    const row = Math.floor(index / 7);
    const col = index % 7;
    const x = marginX + col * (cellWidth + gap);
    const y = gridTop + headerHeight + gap + row * (cellHeight + gap);
    const date = addDays(request.year, request.month, 1, index - leading);
    const inMonth = date.month === request.month;
    const displayDay = formatDateLabel(date, request.dateFormat);
    const showNumber = inMonth || request.showAdjacentDays;
    const layerOpacity = inMonth ? 1 : 0.36;
    const cellFill = request.gridStyle === "cards" ? request.surfaceColor : request.backgroundColor;
    const stroke = request.gridStyle === "cards" ? request.accentColor : request.surfaceColor;
    layers.push(shape(context, `Day cell ${index + 1}`, x, y, cellWidth, cellHeight, cellFill, request.cornerRadius, stroke, request.strokeWidth, layerOpacity));
    if (showNumber) {
      layers.push(text(context, `Day ${displayDay} number`, x + cellWidth * 0.08, y + cellHeight * 0.08, cellWidth * 0.46, cellHeight * 0.22, displayDay, request.dateFontSize, request.textColor, "left", 0, layerOpacity));
    }
    if (inMonth) {
      const slots = Math.min(3, request.actionsPerDay);
      const slotTop = y + cellHeight * 0.52;
      const slotGap = Math.max(4, cellHeight * 0.04);
      const slotHeight = Math.max(4, (cellHeight * 0.36 - slotGap * Math.max(0, slots - 1)) / Math.max(1, slots));
      for (let slot = 0; slot < slots; slot += 1) {
        const slotY = slotTop + slot * (slotHeight + slotGap);
        layers.push(shape(context, `Day ${displayDay} action ${slot + 1}`, x + cellWidth * 0.1, slotY, cellWidth * 0.8, slotHeight, slot === 0 ? request.accentColor : request.backgroundColor, Math.min(request.cornerRadius, 6), request.accentColor, slot === 0 ? 0 : Math.max(1, request.strokeWidth - 1), slot === 0 ? 0.72 : 0.52));
        if (slot === 0 && (portrait || cellHeight > 70)) {
          layers.push(text(context, `Day ${displayDay} action ${slot + 1} text`, x + cellWidth * 0.13, slotY + slotHeight * 0.18, cellWidth * 0.74, slotHeight * 0.5, "Plan", request.eventFontSize, "#ffffff", "center", 0, 0.82));
        }
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
    text(context, "Schedule title", portrait ? 68 : 62, portrait ? 70 : 42, portrait ? width - 136 : width * 0.6, portrait ? 112 : 72, title, request.titleFontSize, request.textColor, "left", 0),
    ...badge(context, getScheduleBadgeLabel(request), portrait ? width - 252 : width - 250, portrait ? 78 : 48, portrait ? 184 : 176, portrait ? 70 : 50),
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
      const actionCount = getActionCount(request, index);
      const contentX = marginX + 212;
      const contentY = y + rowHeight * 0.18;
      const contentW = rowWidth - 252;
      const contentH = rowHeight * 0.64;
      const slotGap = Math.max(4, rowHeight * 0.035);
      const slotHeight = actionCount > 0 ? (contentH - slotGap * (actionCount - 1)) / actionCount : contentH;
      layers.push(shape(context, `Week day ${index + 1} row`, marginX, y, rowWidth, rowHeight, request.surfaceColor, request.cornerRadius, request.accentColor, request.strokeWidth));
      layers.push(shape(context, `Week day ${index + 1} date block`, marginX + 22, y + rowHeight * 0.16, 156, rowHeight * 0.68, request.accentColor, request.cornerRadius, request.accentColor, 0));
      layers.push(text(context, `Week day ${index + 1} label`, marginX + 22, y + rowHeight * 0.22, 156, rowHeight * 0.22, weekdayLabels[request.weekdayLanguage][date.weekday], request.weekdayFontSize, "#ffffff", "center", 0));
      layers.push(text(context, `Week day ${index + 1} date`, marginX + 22, y + rowHeight * 0.49, 156, rowHeight * 0.3, formatDateLabel(date, request.dateFormat), request.dateFontSize, "#ffffff", "center", 0));
      for (let slot = 0; slot < actionCount; slot += 1) {
        const slotY = contentY + slot * (slotHeight + slotGap);
        layers.push(shape(context, `Week day ${index + 1} action ${slot + 1}`, contentX, slotY, contentW, slotHeight, slot === 0 ? request.backgroundColor : request.surfaceColor, Math.min(request.cornerRadius, 8), request.accentColor, Math.max(1, request.strokeWidth - 1), slot === 0 ? 0.78 : 1));
        layers.push(text(context, `Week day ${index + 1} action ${slot + 1} time`, contentX + 18, slotY + slotHeight * 0.22, 132, slotHeight * 0.44, defaultActionTime(slot), request.eventFontSize, request.textColor, "left", 0));
        layers.push(text(context, `Week day ${index + 1} action ${slot + 1} plan`, contentX + 166, slotY + slotHeight * 0.22, contentW - 188, slotHeight * 0.44, "Plan / event", request.eventFontSize, request.textColor, "left", 0));
      }
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
    const actionCount = getActionCount(request, index);
    layers.push(shape(context, `Week day ${index + 1} card`, x, startY, cardWidth, cardHeight, request.surfaceColor, request.cornerRadius, request.accentColor, request.strokeWidth));
    layers.push(shape(context, `Week day ${index + 1} header`, x, startY, cardWidth, 64, request.accentColor, request.cornerRadius, request.accentColor, 0));
    layers.push(text(context, `Week day ${index + 1} label`, x, startY + 14, cardWidth, 28, weekdayLabels[request.weekdayLanguage][date.weekday], request.weekdayFontSize, "#ffffff", "center", 0));
    layers.push(text(context, `Week day ${index + 1} date`, x + cardWidth * 0.08, startY + 88, cardWidth * 0.84, 36, formatDateLabel(date, request.dateFormat), request.dateFontSize, request.textColor, "center", 0));
    const slotAreaY = startY + 150;
    const slotAreaH = cardHeight - 176;
    const slotGap = 10;
    const slotHeight = actionCount > 0 ? Math.max(28, (slotAreaH - slotGap * (actionCount - 1)) / actionCount) : slotAreaH;
    for (let slot = 0; slot < actionCount; slot += 1) {
      const slotY = slotAreaY + slot * (slotHeight + slotGap);
      const active = slot % 2 === 1;
      layers.push(shape(context, `Week day ${index + 1} slot ${slot + 1}`, x + cardWidth * 0.1, slotY, cardWidth * 0.8, slotHeight, active ? request.accentColor : request.backgroundColor, Math.min(request.cornerRadius, 8), request.surfaceColor, 0, active ? 1 : 0.68));
      layers.push(text(context, `Week day ${index + 1} slot ${slot + 1} text`, x + cardWidth * 0.12, slotY + slotHeight * 0.28, cardWidth * 0.76, slotHeight * 0.32, defaultActionTime(slot), request.eventFontSize, active ? "#ffffff" : request.textColor, "center", 0, active ? 1 : 0.72));
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
    fontSize: Math.min(140, Math.max(24, Math.round(request.fontSize || 56))),
    titleFontSize: clampFontSize(request.titleFontSize, request.fontSize || 56),
    weekdayFontSize: clampFontSize(request.weekdayFontSize, 22),
    dateFontSize: clampFontSize(request.dateFontSize, 30),
    eventFontSize: clampFontSize(request.eventFontSize, 18),
    cornerRadius: Math.min(32, Math.max(0, Math.round(request.cornerRadius || 0))),
    strokeWidth: Math.min(12, Math.max(0, Math.round(request.strokeWidth || 0))),
    actionsPerDay: clampActionCount(request.actionsPerDay),
    dailyActionCounts: Array.from({ length: 7 }, (_, index) => clampActionCount(request.dailyActionCounts?.[index] ?? request.actionsPerDay)),
  };
}

function getActionCount(request: ScheduleBuilderRequest, index: number): number {
  if (request.actionCountMode === "individual") return clampActionCount(request.dailyActionCounts[index] ?? request.actionsPerDay);
  return clampActionCount(request.actionsPerDay);
}

function clampActionCount(value: number): number {
  return Math.min(6, Math.max(0, Math.round(value || 0)));
}

function clampFontSize(value: number, fallback: number): number {
  return Math.min(140, Math.max(10, Math.round(value || fallback)));
}

function getScheduleBadgeLabel(request: ScheduleBuilderRequest): string {
  if (request.kind === "week") return request.weekdayLanguage === "ja" ? "週" : "WEEK";
  if (request.weekdayLanguage === "ja") return `${request.month}月`;
  return englishMonthNames[request.month - 1] ?? "MONTH";
}

function formatDateLabel(date: { month: number; day: number }, format: ScheduleDateFormat): string {
  return format === "month-day" ? `${date.month}/${date.day}` : String(date.day);
}

function defaultActionTime(index: number): string {
  return `${String(Math.min(23, 10 + index * 2)).padStart(2, "0")}:00`;
}

const englishMonthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];

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
    groupId: context.request.groupLayers ? context.groupId : undefined,
    groupName: context.request.groupLayers ? context.groupName : undefined,
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
    groupId: context.request.groupLayers ? context.groupId : undefined,
    groupName: context.request.groupLayers ? context.groupName : undefined,
  });
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}
