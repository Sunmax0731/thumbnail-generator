import { describe, expect, it } from "vitest";
import { extractYouTubeVideoId, youtubeThumbnailCandidates } from "./youtubeThumbnail";

describe("youtubeThumbnail", () => {
  it("extracts video ids from common YouTube URL shapes", () => {
    expect(extractYouTubeVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://www.example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
  });

  it("tries high quality thumbnail candidates first", () => {
    expect(youtubeThumbnailCandidates("dQw4w9WgXcQ")).toEqual([
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/sddefault.jpg",
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
    ]);
  });
});
