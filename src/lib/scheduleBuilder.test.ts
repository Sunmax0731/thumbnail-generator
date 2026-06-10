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
  title: "",
  fontFamily: "Noto Sans JP, Arial, sans-serif",
  fontWeight: "800",
  gridStyle: "cards",
  backgroundColor: "#f7fafc",
  surfaceColor: "#ffffff",
  accentColor: "#10b6d7",
  textColor: "#152033",
  cornerRadius: 8,
  strokeWidth: 3,
  showAdjacentDays: false,
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
    const firstNumber = numbers.find((layer) => layer.type === "text" && layer.text === "1");

    expect(result.name).toBe("2026-06 Monthly Schedule");
    expect(result.settings.width).toBe(1280);
    expect(result.layers.some((layer) => layer.name === "Day cell 1")).toBe(true);
    expect(firstNumber?.x).toBeGreaterThan(64);
  });

  it("moves June 2026 day one into the first column for Monday-start months", () => {
    const sunday = buildScheduleTemplate(baseRequest, defaultOutputSettings, "en");
    const monday = buildScheduleTemplate({ ...baseRequest, weekStartsOn: "monday" }, defaultOutputSettings, "en");
    const sundayOne = sunday.layers.find((layer) => layer.type === "text" && layer.name === "Day 1 number");
    const mondayOne = monday.layers.find((layer) => layer.type === "text" && layer.name === "Day 1 number");

    expect(mondayOne?.x).toBeLessThan(sundayOne?.x ?? 0);
  });

  it("builds a one-week schedule from the requested start date", () => {
    const result = buildScheduleTemplate({ ...baseRequest, kind: "week", day: 10 }, defaultOutputSettings, "ja");
    const labels = result.layers.filter((layer) => layer.type === "text").map((layer) => layer.text);

    expect(result.name).toBe("2026年6月10日週の予定");
    expect(labels).toContain("6/10");
    expect(labels).toContain("6/16");
    expect(labels).toContain("水");
  });
});
