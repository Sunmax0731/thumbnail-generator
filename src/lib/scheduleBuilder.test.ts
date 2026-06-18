import { describe, expect, it } from "vitest";
import { buildScheduleTemplate, getDaysInMonth, getWeekday, type ScheduleBuilderRequest } from "./scheduleBuilder";
import { defaultOutputSettings } from "./presets";

const baseRequest: ScheduleBuilderRequest = {
  kind: "month",
  orientation: "landscape",
  year: 2026,
  month: 6,
  day: 10,
  weekStartsOn: "sunday",
  weekdayLanguage: "en",
  dateFormat: "month-day",
  title: "",
  fontFamily: "Noto Sans JP, Arial, sans-serif",
  fontWeight: "800",
  fontSize: 56,
  titleFontSize: 56,
  weekdayFontSize: 22,
  dateFontSize: 30,
  eventFontSize: 18,
  gridStyle: "cards",
  backgroundColor: "#f7fafc",
  surfaceColor: "#ffffff",
  accentColor: "#10b6d7",
  textColor: "#152033",
  cornerRadius: 8,
  strokeWidth: 3,
  dailyCircleSize: 100,
  actionCountMode: "uniform",
  actionsPerDay: 3,
  dailyActionCounts: [3, 3, 3, 3, 3, 3, 3],
  dailyPeriodLabels: ["AM", "PM"],
  dailyTimeLabels: ["09:00", "14:00"],
  dailyEndTimeLabels: ["11:00", "16:00"],
  dailyEventLabels: ["Morning work", "Collaboration"],
  dailyShowEventLabels: [true, true],
  showTimeLabels: true,
  showAdjacentDays: false,
  groupLayers: true,
  weekendColorMode: "default",
  showBadge: true,
};

describe("scheduleBuilder", () => {
  it("calculates weekdays and leap-year month lengths in UTC", () => {
    expect(getWeekday(2026, 6, 1)).toBe(1);
    expect(getDaysInMonth(2024, 2)).toBe(29);
    expect(getDaysInMonth(2026, 2)).toBe(28);
  });

  it("builds a Sunday-start monthly schedule with leading blank cells", () => {
    const result = buildScheduleTemplate(baseRequest, defaultOutputSettings, "en");
    const numbers = result.layers.filter((layer) => layer.type === "text" && layer.name.includes("number"));
    const firstNumber = numbers.find((layer) => layer.type === "text" && layer.text === "6/1");

    expect(result.name).toBe("2026-06 Monthly Schedule");
    expect(result.settings.width).toBe(1280);
    expect(result.layers.some((layer) => layer.name === "Day cell 1")).toBe(true);
    expect(result.layers.some((layer) => layer.type === "text" && layer.name === "JUNE badge text" && layer.text === "JUNE")).toBe(true);
    expect(firstNumber?.x).toBeGreaterThan(64);
  });

  it("localizes the monthly badge from weekday language", () => {
    const result = buildScheduleTemplate({ ...baseRequest, weekdayLanguage: "ja" }, defaultOutputSettings, "en");

    expect(result.layers.some((layer) => layer.type === "text" && layer.name === "6月 badge text" && layer.text === "6月")).toBe(true);
  });

  it("moves June 2026 day one into the first column for Monday-start months", () => {
    const sunday = buildScheduleTemplate(baseRequest, defaultOutputSettings, "en");
    const monday = buildScheduleTemplate({ ...baseRequest, weekStartsOn: "monday" }, defaultOutputSettings, "en");
    const sundayOne = sunday.layers.find((layer) => layer.type === "text" && layer.name === "Day 6/1 number");
    const mondayOne = monday.layers.find((layer) => layer.type === "text" && layer.name === "Day 6/1 number");

    expect(mondayOne?.x).toBeLessThan(sundayOne?.x ?? 0);
  });

  it("builds a one-week schedule from the requested start date", () => {
    const result = buildScheduleTemplate({ ...baseRequest, kind: "week", day: 10, weekdayLanguage: "ja" }, defaultOutputSettings, "ja");
    const labels = result.layers.filter((layer) => layer.type === "text").map((layer) => layer.text);

    expect(result.name).toBe("2026年6月10日週の予定");
    expect(labels).toContain("6/10");
    expect(labels).toContain("6/16");
    expect(labels).toContain("水");
  });

  it("uses per-day action counts for weekly schedules", () => {
    const result = buildScheduleTemplate(
      {
        ...baseRequest,
        kind: "week",
        actionCountMode: "individual",
        dailyActionCounts: [0, 1, 2, 3, 4, 5, 6],
        orientation: "portrait",
      },
      defaultOutputSettings,
      "en",
    );

    expect(result.layers.filter((layer) => layer.name.startsWith("Week day 1 action")).length).toBe(0);
    expect(result.layers.filter((layer) => layer.name.startsWith("Week day 7 action") && layer.type === "shape")).toHaveLength(6);
  });

  it("builds a daily schedule with sector objects and clock hour labels", () => {
    const result = buildScheduleTemplate(
      {
        ...baseRequest,
        kind: "day",
        dailyPeriodLabels: ["AM", "PM"],
        dailyTimeLabels: ["09:00", "14:00"],
        dailyEndTimeLabels: ["11:00", "16:00"],
        dailyEventLabels: ["Morning focus", "Collaboration"],
      },
      defaultOutputSettings,
      "en",
    );
    const amSector = result.layers.find((layer) => layer.name === "Daily AM sector");
    const labels = result.layers.filter((layer) => layer.type === "text").map((layer) => layer.text);

    expect(result.name).toBe("2026-06-10 Daily Schedule");
    expect(amSector?.type).toBe("shape");
    expect(amSector?.type === "shape" ? amSector.shape : undefined).toBe("sector");
    expect(amSector?.type === "shape" ? amSector.sectorStartAngle : undefined).toBe(270);
    expect(amSector?.type === "shape" ? amSector.sectorEndAngle : undefined).toBe(330);
    expect(result.layers.some((layer) => layer.type === "text" && layer.name === "Daily AM hour 0" && layer.text === "0")).toBe(true);
    expect(result.layers.some((layer) => layer.type === "text" && layer.name === "Daily AM hour 11" && layer.text === "11")).toBe(true);
    expect(result.layers.some((layer) => layer.name === "Daily AM hour 12")).toBe(false);
    expect(result.layers.some((layer) => layer.name === "Daily AM hour 23")).toBe(false);
    expect(result.layers.some((layer) => layer.type === "text" && layer.name === "Daily PM hour 12" && layer.text === "12")).toBe(true);
    expect(result.layers.some((layer) => layer.type === "text" && layer.name === "Daily PM hour 24" && layer.text === "24")).toBe(true);
    expect(labels).toContain("09:00-11:00\nMorning focus");
    expect(result.layers.every((layer) => layer.groupId && layer.groupName)).toBe(true);
  });

  it("centers portrait daily circles and applies the daily circle size setting", () => {
    const result = buildScheduleTemplate(
      {
        ...baseRequest,
        kind: "day",
        orientation: "portrait",
        dailyCircleSize: 110,
      },
      defaultOutputSettings,
      "en",
    );
    const amCircle = result.layers.find((layer) => layer.name === "Daily AM circle");

    expect(result.settings.width).toBe(1080);
    expect(amCircle?.type).toBe("shape");
    expect(amCircle?.width).toBe(715);
    expect(amCircle?.x).toBeCloseTo((1080 - 715) / 2, 4);
  });

  it("can hide daily clock hour labels from generated daily schedules", () => {
    const result = buildScheduleTemplate(
      {
        ...baseRequest,
        kind: "day",
        showTimeLabels: false,
        dailyTimeLabels: ["08:30", "20:00"],
        dailyEndTimeLabels: ["10:30", "22:00"],
        dailyEventLabels: ["Morning focus", "Collaboration"],
      },
      defaultOutputSettings,
      "en",
    );
    const labels = result.layers.filter((layer) => layer.type === "text").map((layer) => layer.text);

    expect(result.layers.some((layer) => layer.name === "Daily AM hour 8")).toBe(false);
    expect(labels).toContain("08:30-10:30\nMorning focus");
  });

  it("can hide AM or PM event labels independently", () => {
    const result = buildScheduleTemplate(
      {
        ...baseRequest,
        kind: "day",
        dailyShowEventLabels: [false, true],
        dailyEventLabels: ["Morning focus", "Collaboration"],
      },
      defaultOutputSettings,
      "en",
    );

    expect(result.layers.some((layer) => layer.name === "Daily AM event")).toBe(false);
    expect(result.layers.some((layer) => layer.type === "text" && layer.name === "Daily PM event" && layer.text.includes("Collaboration"))).toBe(true);
  });

  it("can render day-only dates and ungrouped generated layers", () => {
    const result = buildScheduleTemplate(
      { ...baseRequest, kind: "week", dateFormat: "day", groupLayers: false },
      defaultOutputSettings,
      "en",
    );
    const labels = result.layers.filter((layer) => layer.type === "text").map((layer) => layer.text);

    expect(labels).toContain("10");
    expect(labels).not.toContain("6/10");
    expect(result.layers.every((layer) => !layer.groupId && !layer.groupName)).toBe(true);
  });

  it("applies separate font sizes to title, weekday, date, and event text", () => {
    const result = buildScheduleTemplate(
      {
        ...baseRequest,
        kind: "week",
        titleFontSize: 80,
        weekdayFontSize: 24,
        dateFontSize: 36,
        eventFontSize: 20,
      },
      defaultOutputSettings,
      "en",
    );

    expect(findTextFontSize(result.layers, "Schedule title")).toBe(80);
    expect(findTextFontSize(result.layers, "Week day 1 label")).toBe(24);
    expect(findTextFontSize(result.layers, "Week day 1 date")).toBe(36);
    expect(findTextFontSize(result.layers, "Week day 1 slot 1 text")).toBe(20);
  });
});

function findTextFontSize(layers: ReturnType<typeof buildScheduleTemplate>["layers"], name: string): number | undefined {
  const layer = layers.find((candidate) => candidate.name === name);
  return layer?.type === "text" ? layer.fontSize : undefined;
}
