import type { LayerAnimation, LayerAnimationEasing, ThumbnailLayer } from "./types";

export const defaultSceneDurationMs = 4000;

export function applyLayerAnimation(
  layer: ThumbnailLayer,
  timeMs: number,
  sceneDurationMs = defaultSceneDurationMs,
): ThumbnailLayer {
  const animation = layer.animation;
  if (!animation || animation.type === "none") return layer;

  const progress = animationProgress(animation, timeMs, sceneDurationMs);
  if (progress == null) return layer;

  if (animation.type === "fade") {
    return { ...layer, opacity: layer.opacity * ease(progress, animation.easing) };
  }

  if (animation.type === "slide") {
    const eased = ease(progress, animation.easing);
    const offset = animation.distance * (1 - eased);
    const { x, y } = offsetLayer(layer.x, layer.y, animation.direction, offset);
    return { ...layer, x, y };
  }

  if (animation.type === "pop") {
    return scaleLayer(layer, 0.82 + ease(progress, animation.easing) * 0.18);
  }

  if (animation.type === "pulse") {
    const wave = (Math.sin(progress * Math.PI * 2) + 1) / 2;
    return scaleLayer({ ...layer, opacity: layer.opacity * (0.72 + wave * 0.28) }, 0.96 + wave * 0.06);
  }

  if (animation.type === "blink") {
    const wave = (Math.sin(progress * Math.PI * 2) + 1) / 2;
    return { ...layer, opacity: layer.opacity * (wave > 0.5 ? 1 : 0.28) };
  }

  if (animation.type === "drift") {
    const offset = Math.sin(progress * Math.PI * 2) * animation.distance;
    const { x, y } = offsetLayer(layer.x, layer.y, animation.direction, offset);
    return { ...layer, x, y };
  }

  return layer;
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
    return animation.type === "pulse" || animation.type === "blink" || animation.type === "drift" ? null : 1;
  }
  return clamp01(timelineMs / duration);
}

function ease(progress: number, easing: LayerAnimationEasing): number {
  if (easing === "linear") return progress;
  if (easing === "easeIn") return progress * progress;
  if (easing === "easeOut") return 1 - (1 - progress) * (1 - progress);
  return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

function offsetLayer(
  x: number,
  y: number,
  direction: LayerAnimation["direction"],
  amount: number,
): { x: number; y: number } {
  if (direction === "left") return { x: x - amount, y };
  if (direction === "right") return { x: x + amount, y };
  if (direction === "down") return { x, y: y + amount };
  return { x, y: y - amount };
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
