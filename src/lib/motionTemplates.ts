import { defaultOutputSettings } from "./presets";
import { makeImageLayer, makeShapeLayer, makeTextLayer } from "./layerFactory";
import type { DefaultTemplateDefinition } from "./defaultTemplates";
import type { LayerAnimation, ThumbnailLayer } from "./types";

const titleFont = "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
const strongFont = "Arial Black, Arial, sans-serif";

export const motionTemplates: DefaultTemplateDefinition[] = [
  {
    id: "motion-eyecatch-neon-pulse",
    name: "Animated Eyecatch Neon Pulse",
    description: "Looping neon eyecatch with pulsing title and drifting accents.",
    category: "motion",
    previewColors: ["#111827", "#10b6d7", "#ff4f5f"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720" },
    createLayers: () => eyecatchNeonPulse(),
  },
  {
    id: "motion-eyecatch-pop-title",
    name: "Animated Eyecatch Pop Title",
    description: "Fast title card with pop, bounce, and slide-in accents.",
    category: "motion",
    previewColors: ["#ffd166", "#152033", "#ffffff"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720" },
    createLayers: () => eyecatchPopTitle(),
  },
  {
    id: "motion-eyecatch-news-flash",
    name: "Animated Eyecatch News Flash",
    description: "Alert-style eyecatch with flashing label and sliding ticker.",
    category: "motion",
    previewColors: ["#d90429", "#ffffff", "#111827"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720" },
    createLayers: () => eyecatchNewsFlash(),
  },
  {
    id: "motion-eyecatch-countdown",
    name: "Animated Eyecatch Countdown",
    description: "Countdown eyecatch with breathing number and spinning ring.",
    category: "motion",
    previewColors: ["#152033", "#ffd166", "#10b6d7"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720" },
    createLayers: () => eyecatchCountdown(),
  },
  {
    id: "motion-eyecatch-product-reveal",
    name: "Animated Eyecatch Product Reveal",
    description: "Product reveal board with zooming frame and sliding headline.",
    category: "motion",
    previewColors: ["#f7fafc", "#ff4f5f", "#152033"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720" },
    createLayers: () => eyecatchProductReveal(),
  },
  {
    id: "motion-waiting-stream-start",
    name: "Animated Waiting Stream Start",
    description: "OBS waiting screen with breathing start message and drifting bars.",
    category: "motion",
    previewColors: ["#111827", "#10b6d7", "#ffffff"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720" },
    createLayers: () => waitingStreamStart(),
  },
  {
    id: "motion-waiting-chat-lobby",
    name: "Animated Waiting Chat Lobby",
    description: "Chat lobby waiting layout with pulsing chat bubbles.",
    category: "motion",
    previewColors: ["#edf2f6", "#152033", "#10b6d7"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720" },
    createLayers: () => waitingChatLobby(),
  },
  {
    id: "motion-waiting-countdown",
    name: "Animated Waiting Countdown",
    description: "Countdown waiting screen with looping pulse and sliding status.",
    category: "motion",
    previewColors: ["#152033", "#ffd166", "#ff4f5f"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720" },
    createLayers: () => waitingCountdown(),
  },
  {
    id: "motion-waiting-calm-screen",
    name: "Animated Waiting Calm Screen",
    description: "Quiet waiting screen with slow breathing title and soft movement.",
    category: "motion",
    previewColors: ["#ffffff", "#10b6d7", "#152033"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720" },
    createLayers: () => waitingCalmScreen(),
  },
  {
    id: "motion-waiting-game-room",
    name: "Animated Waiting Game Room",
    description: "Game-room waiting screen with shake-ready alert and drifting neon.",
    category: "motion",
    previewColors: ["#111827", "#7c3aed", "#ffd166"],
    settings: { ...defaultOutputSettings, presetId: "youtube-720" },
    createLayers: () => waitingGameRoom(),
  },
];

function eyecatchNeonPulse(): ThumbnailLayer[] {
  return [
    bgImage("Neon texture", 0.42),
    rect("Dark plate", 64, 82, 1152, 528, "#111827", 24, "#10b6d7", 10, anim("breathe", "easeInOutSine", true)),
    text("Neon title", 120, 190, 1040, 140, "NEXT HIGHLIGHT", 92, "#ffffff", "#10b6d7", anim("pulse", "easeInOutSine", true)),
    text("Neon subtitle", 214, 382, 850, 70, "GET READY", 48, "#ffd166", "#111827", anim("slide", "easeOutBack", false, "up", 70)),
    line("Neon drift line", 220, 512, 840, "#ff4f5f", anim("drift", "linear", true, "right", 36)),
  ];
}

function eyecatchPopTitle(): ThumbnailLayer[] {
  return [
    rect("Pop background", 0, 0, 1280, 720, "#ffd166", 0),
    rect("Pop panel", 112, 116, 1056, 440, "#ffffff", 28, "#152033", 9, anim("zoom", "easeOutBack")),
    text("Pop title", 150, 196, 980, 150, "BIG MOMENT", 98, "#152033", "#ffffff", anim("pop", "easeOutBounce")),
    text("Pop tag", 360, 430, 560, 62, "DO NOT MISS", 46, "#ffffff", "#152033", anim("slide", "easeOutExpo", false, "left", 140)),
    rect("Pop slash", 170, 556, 940, 28, "#ff4f5f", 8, "#ff4f5f", 0, anim("sway", "linear", true)),
  ];
}

function eyecatchNewsFlash(): ThumbnailLayer[] {
  return [
    bgImage("News motion background", 0.36),
    rect("Red alert block", 0, 434, 1280, 180, "#d90429", 0, "#d90429", 0, anim("slide", "easeOutCubic", false, "down", 120)),
    rect("Top flash", 0, 74, 1280, 78, "#ffffff", 0, "#ffffff", 0, anim("blink", "linear", true)),
    text("News alert", 64, 86, 430, 52, "BREAKING", 46, "#d90429", "#ffffff", anim("shake", "linear", true, "right", 10)),
    text("News headline", 74, 458, 1080, 116, "LIVE UPDATE", 88, "#ffffff", "#111827", anim("slide", "easeOutBack", false, "left", 180)),
    line("Ticker motion", 90, 640, 1100, "#ffd166", anim("drift", "linear", true, "left", 70)),
  ];
}

function eyecatchCountdown(): ThumbnailLayer[] {
  return [
    rect("Countdown background", 0, 0, 1280, 720, "#152033", 0),
    rect("Countdown ring", 414, 82, 452, 452, "#111827", 226, "#10b6d7", 14, anim("spin", "easeInOutBack", true)),
    text("Countdown number", 452, 145, 376, 230, "3", 214, "#ffd166", "#152033", anim("breathe", "easeInOutSine", true)),
    text("Countdown label", 310, 530, 660, 70, "STARTING SOON", 54, "#ffffff", "#10b6d7", anim("fade", "easeInOutSine", true)),
    line("Countdown progress", 270, 626, 740, "#ff4f5f", anim("drift", "linear", true, "right", 56)),
  ];
}

function eyecatchProductReveal(): ThumbnailLayer[] {
  return [
    rect("Reveal background", 0, 0, 1280, 720, "#f7fafc", 0),
    rect("Reveal product frame", 748, 96, 360, 420, "#ffffff", 26, "#152033", 10, anim("zoom", "easeOutBack")),
    rect("Reveal badge", 828, 492, 250, 92, "#ff4f5f", 20, "#111827", 6, anim("pop", "easeOutBounce")),
    text("Reveal headline", 96, 150, 590, 180, "FIRST\nLOOK", 100, "#152033", "#ffffff", anim("slide", "easeOutExpo", false, "left", 160)),
    text("Reveal badge text", 854, 516, 198, 48, "NEW", 42, "#ffffff", "#111827", anim("pulse", "easeInOutSine", true)),
    line("Reveal underline", 104, 446, 542, "#10b6d7", anim("drift", "linear", true, "right", 42)),
  ];
}

function waitingStreamStart(): ThumbnailLayer[] {
  return [
    rect("Waiting dark background", 0, 0, 1280, 720, "#111827", 0),
    bgImage("Waiting subtle texture", 0.16),
    text("Waiting title", 170, 190, 940, 122, "STREAM STARTING", 84, "#ffffff", "#10b6d7", anim("breathe", "easeInOutSine", true)),
    text("Waiting note", 344, 354, 592, 58, "PLEASE STAND BY", 42, "#ffd166", "#111827", anim("fade", "easeInOutSine", true)),
    line("Waiting cyan bar", 220, 488, 840, "#10b6d7", anim("drift", "linear", true, "right", 56)),
    line("Waiting coral bar", 290, 550, 700, "#ff4f5f", anim("drift", "linear", true, "left", 38)),
  ];
}

function waitingChatLobby(): ThumbnailLayer[] {
  return [
    rect("Lobby background", 0, 0, 1280, 720, "#edf2f6", 0),
    rect("Lobby board", 88, 92, 1104, 500, "#ffffff", 24, "#152033", 8),
    text("Lobby title", 138, 146, 720, 90, "CHAT LOBBY", 70, "#152033", "#ffffff", anim("slide", "easeOutBack", false, "up", 90)),
    ...[0, 1, 2].map((index) =>
      rect(`Chat bubble ${index + 1}`, 154 + index * 292, 338 + (index % 2) * 44, 232, 86, index === 1 ? "#10b6d7" : "#ffd166", 22, "#152033", 5, anim("pulse", "easeInOutSine", true)),
    ),
    text("Lobby footer", 704, 500, 380, 52, "SAY HELLO", 38, "#ff4f5f", "#ffffff", anim("blink", "linear", true)),
  ];
}

function waitingCountdown(): ThumbnailLayer[] {
  return [
    rect("Wait countdown background", 0, 0, 1280, 720, "#152033", 0),
    rect("Wait countdown card", 132, 118, 1016, 440, "#ffffff", 26, "#ffd166", 10, anim("breathe", "easeInOutSine", true)),
    text("Wait countdown title", 212, 174, 856, 86, "START IN", 66, "#152033", "#ffffff", anim("fade", "easeInOutSine", true)),
    text("Wait countdown number", 394, 286, 492, 170, "05:00", 138, "#ff4f5f", "#152033", anim("pulse", "easeInOutSine", true)),
    line("Wait countdown status", 284, 522, 712, "#10b6d7", anim("drift", "linear", true, "right", 68)),
  ];
}

function waitingCalmScreen(): ThumbnailLayer[] {
  return [
    rect("Calm background", 0, 0, 1280, 720, "#ffffff", 0),
    rect("Calm wash", 92, 84, 1096, 536, "#edf2f6", 30, "#10b6d7", 6, anim("breathe", "easeInOutSine", true)),
    text("Calm title", 180, 226, 920, 108, "WE'LL BE RIGHT BACK", 70, "#152033", "#ffffff", anim("fade", "easeInOutSine", true)),
    text("Calm note", 318, 396, 640, 54, "TAKE A SHORT BREAK", 40, "#10b6d7", "#ffffff", anim("slide", "easeInOutSine", true, "up", 18)),
    line("Calm soft line", 374, 506, 530, "#ff4f5f", anim("drift", "linear", true, "right", 24)),
  ];
}

function waitingGameRoom(): ThumbnailLayer[] {
  return [
    rect("Game room background", 0, 0, 1280, 720, "#111827", 0),
    bgImage("Game room texture", 0.22),
    rect("Game room frame", 64, 62, 1152, 596, "#111827", 22, "#7c3aed", 12, anim("breathe", "easeInOutSine", true)),
    text("Game room title", 118, 186, 820, 140, "GAME ROOM", 98, "#ffffff", "#7c3aed", anim("sway", "linear", true)),
    text("Game room status", 142, 432, 604, 62, "MATCH STARTING SOON", 42, "#ffd166", "#111827", anim("shake", "linear", true, "right", 8)),
    rect("Game room badge", 918, 428, 198, 88, "#10b6d7", 20, "#ffffff", 5, anim("pop", "easeOutBounce")),
    text("Game room badge text", 948, 452, 138, 44, "LIVE", 36, "#ffffff", "#111827", anim("blink", "linear", true)),
  ];
}

function bgImage(name: string, opacity: number): ThumbnailLayer {
  return makeImageLayer({
    name,
    imageKey: "sample-bg",
    x: 0,
    y: 0,
    width: 1280,
    height: 720,
    opacity,
    effects: { grayscale: 0.15, blur: 4, brightness: 74, contrast: 128, mosaic: 0 },
  });
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
  strokeWidth = 0,
  animation?: LayerAnimation,
): ThumbnailLayer {
  return makeShapeLayer({ name, x, y, width, height, fill, cornerRadius, strokeColor, strokeWidth, animation });
}

function line(name: string, x: number, y: number, width: number, strokeColor: string, animation?: LayerAnimation): ThumbnailLayer {
  return makeShapeLayer({
    name,
    shape: "line",
    x,
    y,
    width,
    height: 24,
    strokeColor,
    strokeWidth: 14,
    lineStyle: "wave",
    animation,
  });
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
  strokeColor: string,
  animation?: LayerAnimation,
): ThumbnailLayer {
  return makeTextLayer({
    name,
    x,
    y,
    width,
    height,
    text: value,
    fontSize,
    fontFamily: fontSize >= 64 ? titleFont : strongFont,
    fontWeight: "900",
    color,
    strokeColor,
    strokeWidth: strokeColor === "#ffffff" ? 4 : 7,
    align: "center",
    lineHeight: 0.92,
    animation,
  });
}

function anim(
  type: LayerAnimation["type"],
  easing: LayerAnimation["easing"],
  loop = false,
  direction: LayerAnimation["direction"] = "none",
  distance = 80,
): LayerAnimation {
  return {
    type,
    startMs: 0,
    durationMs: loop ? 1800 : 900,
    easing,
    loop,
    direction,
    distance,
  };
}
