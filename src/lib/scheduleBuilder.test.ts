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
  actionCountMode: "uniform",
  actionsPerDay: 3,
  dailyActionCounts: [3, 3, 3, 3, 3, 3, 3],
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
