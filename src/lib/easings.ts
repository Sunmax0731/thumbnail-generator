import type { LayerAnimationEasing } from "./types";

export const easingOptions: LayerAnimationEasing[] = [
  "linear",
  "easeInSine",
  "easeOutSine",
  "easeInOutSine",
  "easeInQuad",
  "easeOutQuad",
  "easeInOutQuad",
  "easeInCubic",
  "easeOutCubic",
  "easeInOutCubic",
  "easeInQuart",
  "easeOutQuart",
  "easeInOutQuart",
  "easeInQuint",
  "easeOutQuint",
  "easeInOutQuint",
  "easeInExpo",
  "easeOutExpo",
  "easeInOutExpo",
  "easeInCirc",
  "easeOutCirc",
  "easeInOutCirc",
  "easeInBack",
  "easeOutBack",
  "easeInOutBack",
  "easeInElastic",
  "easeOutElastic",
  "easeInOutElastic",
  "easeInBounce",
  "easeOutBounce",
  "easeInOutBounce",
];

export function isLayerAnimationEasing(value: unknown): value is LayerAnimationEasing {
  return typeof value === "string" && easingOptions.includes(value as LayerAnimationEasing);
}

export function normalizeEasingName(value: unknown, fallback: LayerAnimationEasing): LayerAnimationEasing {
  if (isLayerAnimationEasing(value)) return value;
  if (value === "easeIn") return "easeInQuad";
  if (value === "easeOut") return "easeOutQuad";
  if (value === "easeInOut") return "easeInOutQuad";
  return fallback;
}

export function evaluateEasing(rawProgress: number, easing: LayerAnimationEasing): number {
  const x = clamp01(rawProgress);
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  const c3 = c1 + 1;
  const c4 = (2 * Math.PI) / 3;
  const c5 = (2 * Math.PI) / 4.5;

  if (easing === "linear") return x;
  if (easing === "easeInSine") return 1 - Math.cos((x * Math.PI) / 2);
  if (easing === "easeOutSine") return Math.sin((x * Math.PI) / 2);
  if (easing === "easeInOutSine") return -(Math.cos(Math.PI * x) - 1) / 2;
  if (easing === "easeInQuad") return x * x;
  if (easing === "easeOutQuad") return 1 - (1 - x) * (1 - x);
  if (easing === "easeInOutQuad") return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  if (easing === "easeInCubic") return x * x * x;
  if (easing === "easeOutCubic") return 1 - Math.pow(1 - x, 3);
  if (easing === "easeInOutCubic") return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  if (easing === "easeInQuart") return x * x * x * x;
  if (easing === "easeOutQuart") return 1 - Math.pow(1 - x, 4);
  if (easing === "easeInOutQuart") return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
  if (easing === "easeInQuint") return x * x * x * x * x;
  if (easing === "easeOutQuint") return 1 - Math.pow(1 - x, 5);
  if (easing === "easeInOutQuint") return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  if (easing === "easeInExpo") return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
  if (easing === "easeOutExpo") return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  if (easing === "easeInOutExpo") {
    if (x === 0 || x === 1) return x;
    return x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
  }
  if (easing === "easeInCirc") return 1 - Math.sqrt(1 - x * x);
  if (easing === "easeOutCirc") return Math.sqrt(1 - Math.pow(x - 1, 2));
  if (easing === "easeInOutCirc") {
    return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  }
  if (easing === "easeInBack") return c3 * x * x * x - c1 * x * x;
  if (easing === "easeOutBack") return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  if (easing === "easeInOutBack") {
    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  }
  if (easing === "easeInElastic") {
    if (x === 0 || x === 1) return x;
    return -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
  }
  if (easing === "easeOutElastic") {
    if (x === 0 || x === 1) return x;
    return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }
  if (easing === "easeInOutElastic") {
    if (x === 0 || x === 1) return x;
    return x < 0.5
      ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
  }
  if (easing === "easeInBounce") return 1 - easeOutBounce(1 - x);
  if (easing === "easeOutBounce") return easeOutBounce(x);
  return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2;
}

function easeOutBounce(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x - 1.5 / d1) * (x - 1.5 / d1) + 0.75;
  if (x < 2.5 / d1) return n1 * (x - 2.25 / d1) * (x - 2.25 / d1) + 0.9375;
  return n1 * (x - 2.625 / d1) * (x - 2.625 / d1) + 0.984375;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
