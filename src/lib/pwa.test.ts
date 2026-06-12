import { afterEach, describe, expect, it, vi } from "vitest";
import { registerPwaServiceWorker } from "./pwa";

describe("pwa", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers the service worker under the provided base path", () => {
    const register = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register },
    });

    registerPwaServiceWorker("/thumbnail-generator/");
    window.dispatchEvent(new Event("load"));

    expect(register).toHaveBeenCalledWith("/thumbnail-generator/sw.js", { scope: "/thumbnail-generator/" });
  });

  it("skips registration when service workers are unavailable", () => {
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: undefined,
    });

    expect(() => registerPwaServiceWorker("/thumbnail-generator/")).not.toThrow();
  });
});
