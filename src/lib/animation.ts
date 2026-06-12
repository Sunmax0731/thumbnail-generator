import type { LayerAnimation, LayerAnimationEasing, ThumbnailLayer } from "./types";
import { evaluateEasing } from "./easings";

export const defaultSceneDurationMs = 4000;

export function applyLayerAnimation(
  layer: ThumbnailLayer,
  timeMs: number,
  sceneDurationMs = defaultSceneDurationMs,
): ThumbnailLayer {
  const animations = layer.animations?.length ? layer.animations : layer.animation ? [layer.animation] : [];
  return animations.reduce((currentLayer, animation) => applySingleLayerAnimation(currentLayer, animation, timeMs, sceneDurationMs), layer);
}

function applySingleLayerAnimation(
  layer: ThumbnailLayer,
  animation: LayerAnimation,
  timeMs: number,
  sceneDurationMs = defaultSceneDurationMs,
): ThumbnailLayer {
  if (!animation) return layer;

  const progress = animationProgress(animation, timeMs, sceneDurationMs);
  if (progress == null) return layer;
  let animatedLayer = layer;

  if (animation.type === "fade") {
    animatedLayer = { ...animatedLayer, opacity: animatedLayer.opacity * ease(progress, animation.easing) };
  }

  if (animation.type === "slide") {
    const eased = ease(progress, animation.easing);
    const offset = animation.distance * (1 - eased);
    const { x, y } = offsetLayer(animatedLayer.x, animatedLayer.y, animation.direction, offset);
    animatedLayer = { ...animatedLayer, x, y };
  }

  if (animation.type === "pop") {
    animatedLayer = scaleLayer(animatedLayer, 0.82 + ease(progress, animation.easing) * 0.18);
  }

  if (animation.type === "zoom") {
    animatedLayer = scaleLayer(animatedLayer, 0.9 + ease(progress, animation.easing) * 0.1);
  }

  if (animation.type === "spin") {
    animatedLayer = { ...animatedLayer, rotation: animatedLayer.rotation - (1 - ease(progress, animation.easing)) * 16 };
  }

  if (animation.type === "pulse") {
    const wave = (Math.sin(progress * Math.PI * 2) + 1) / 2;
    animatedLayer = scaleLayer({ ...animatedLayer, opacity: animatedLayer.opacity * (0.72 + wave * 0.28) }, 0.96 + wave * 0.06);
  }

  if (animation.type === "blink") {
    const wave = (Math.sin(progress * Math.PI * 2) + 1) / 2;
    animatedLayer = { ...animatedLayer, opacity: animatedLayer.opacity * (wave > 0.5 ? 1 : 0.28) };
  }

  if (animation.type === "drift") {
    const offset = Math.sin(progress * Math.PI * 2) * animation.distance;
    const { x, y } = offsetLayer(animatedLayer.x, animatedLayer.y, animation.direction, offset);
    animatedLayer = { ...animatedLayer, x, y };
  }

  if (animation.type === "sway") {
    animatedLayer = { ...animatedLayer, rotation: animatedLayer.rotation + Math.sin(progress * Math.PI * 2) * 6 };
  }

  if (animation.type === "shake") {
    const offset = Math.sin(progress * Math.PI * 8) * animation.distance;
    const { x, y } = offsetLayer(animatedLayer.x, animatedLayer.y, animation.direction, offset);
    animatedLayer = { ...animatedLayer, x, y };
  }

  if (animation.type === "breathe") {
    const wave = (Math.sin(progress * Math.PI * 2) + 1) / 2;
    animatedLayer = scaleLayer(animatedLayer, 0.97 + wave * 0.08);
  }

  animatedLayer = applyTextAnimation(animatedLayer, animation, progress);
  animatedLayer = applyEffectAnimation(animatedLayer, animation, progress);
  return animatedLayer;
}

export function applyAnimationsToLayers(
  layers: ThumbnailLayer[],
  timeMs: number,
  sceneDurationMs = defaultSceneDurationMs,
): ThumbnailLayer[] {
  return layers.map((layer) => applyLayerAnimation(layer, timeMs, sceneDurationMs));
}

function animationProgress(animation: LayerAnimation, timeMs: number, sceneDurationMs: number): number | null {
  const duration = Math.max(100, animation.durationMs);
  const timelineMs = animation.loop ? modulo(timeMs - animation.startMs, duration) : timeMs - animation.startMs;
  if (timelineMs < 0) return null;
  if (!animation.loop && timelineMs > duration) {
    return isCycleAnimation(animation.type) ? null : 1;
  }
  return clamp01(timelineMs / duration);
}

function ease(progress: number, easing: LayerAnimationEasing): number {
  return evaluateEasing(progress, easing);
}

function offsetLayer(
  x: number,
  y: number,
  direction: LayerAnimation["direction"],
  amount: number,
): { x: number; y: number } {
  if (direction === "none") return { x, y };
  if (direction === "left") return { x: x - amount, y };
  if (direction === "right") return { x: x + amount, y };
  if (direction === "down") return { x, y: y + amount };
  return { x, y: y - amount };
}

function isCycleAnimation(type: LayerAnimation["type"]): boolean {
  return type === "pulse" || type === "blink" || type === "drift" || type === "sway" || type === "shake" || type === "breathe";
}

function applyTextAnimation(layer: ThumbnailLayer, animation: LayerAnimation, progress: number): ThumbnailLayer {
  if (layer.type !== "text") return layer;
  const textAnimation = animation.textAnimation ?? "none";
  if (textAnimation === "none") return layer;
  const eased = ease(progress, animation.easing);
  if (textAnimation === "typewriter") {
    const count = Math.max(0, Math.ceil(layer.text.length * eased));
    return { ...layer, text: layer.text.slice(0, count) };
  }
  if (textAnimation === "lineReveal") {
    const lines = layer.text.split(/\r?\n/);
    const count = Math.max(1, Math.ceil(lines.length * eased));
    return { ...layer, text: lines.slice(0, count).join("\n"), opacity: layer.opacity * eased };
  }
  const wave = Math.sin(progress * Math.PI * 2);
  return {
    ...layer,
    y: layer.y + wave * 8,
    letterSpacing: layer.letterSpacing + wave * 1.5,
  };
}

function applyEffectAnimation(layer: ThumbnailLayer, animation: LayerAnimation, progress: number): ThumbnailLayer {
  const effectAnimation = animation.effectAnimation ?? "none";
  if (effectAnimation === "none") return layer;
  const intensity = Math.max(0, Math.min(100, animation.effectIntensity ?? 40));
  const wave = (Math.sin(progress * Math.PI * 2) + 1) / 2;
  if (effectAnimation === "glow") {
    return {
      ...layer,
      shadowOpacity: Math.min(1, Math.max(layer.shadowOpacity, 0.18 + (intensity / 100) * wave * 0.75)),
      shadowBlur: Math.max(layer.shadowBlur, 6 + intensity * wave * 0.42),
    };
  }
  if (effectAnimation === "blur") {
    return {
      ...layer,
      layerBlur: Math.max(layer.layerBlur, (intensity / 100) * (1 - ease(progress, animation.easing)) * 18),
    };
  }
  return {
    ...layer,
    bevelSize: Math.max(layer.bevelSize, 2 + (intensity / 100) * wave * 12),
    bevelOpacity: Math.min(1, Math.max(layer.bevelOpacity, 0.15 + (intensity / 100) * wave * 0.7)),
  };
}

export function animationTypeUsesDirection(type: LayerAnimation["type"]): boolean {
  return type === "slide" || type === "drift" || type === "shake";
}

function scaleLayer<T extends ThumbnailLayer>(layer: T, scale: number): T {
  const width = layer.width * scale;
  const height = layer.height * scale;
  return {
    ...layer,
    x: layer.x + (layer.width - width) / 2,
    y: layer.y + (layer.height - height) / 2,
    width,
    height,
  };
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}
