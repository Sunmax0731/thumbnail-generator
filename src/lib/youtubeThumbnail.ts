import type { ImageAsset } from "./types";

const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;

export function extractYouTubeVideoId(input: string): string | null {
  const value = input.trim();
  if (youtubeIdPattern.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && youtubeIdPattern.test(id) ? id : null;
    }
    if (host.endsWith("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && youtubeIdPattern.test(v)) return v;
      const [kind, id] = url.pathname.split("/").filter(Boolean);
      if ((kind === "embed" || kind === "shorts" || kind === "live") && id && youtubeIdPattern.test(id)) {
        return id;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeThumbnailCandidates(videoId: string): string[] {
  return ["maxresdefault.jpg", "sddefault.jpg", "hqdefault.jpg", "mqdefault.jpg", "default.jpg"].map(
    (fileName) => `https://i.ytimg.com/vi/${videoId}/${fileName}`,
  );
}

export async function createYouTubeThumbnailAsset(
  input: string,
  options: {
    fetchImpl?: typeof fetch;
    now?: Date;
  } = {},
): Promise<ImageAsset> {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) {
    throw new Error("Enter a valid YouTube video URL or 11-character video id.");
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const errors: string[] = [];
  for (const candidate of youtubeThumbnailCandidates(videoId)) {
    try {
      const response = await fetchImpl(candidate, { mode: "cors" });
      if (!response.ok) {
        errors.push(`${candidate} returned ${response.status}`);
        continue;
      }
      const blob = await response.blob();
      if (!blob.type.startsWith("image/") || blob.size === 0) {
        errors.push(`${candidate} did not return an image`);
        continue;
      }
      const dataUrl = await blobToDataUrl(blob);
      const dimensions = await imageDimensions(dataUrl);
      const stamp = (options.now ?? new Date()).getTime().toString(36);
      return {
        key: `youtube-${videoId}-${stamp}`,
        name: `YouTube ${videoId}`,
        src: dataUrl,
        width: dimensions.width,
        height: dimensions.height,
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(`Could not load a YouTube thumbnail. ${errors.join(" ")}`.trim());
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read thumbnail image."));
    reader.readAsDataURL(blob);
  });
}

function imageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("Could not decode thumbnail image."));
    image.src = src;
  });
}
