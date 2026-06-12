export function registerPwaServiceWorker(baseUrl: string): void {
  if (typeof window === "undefined") return;
  if (!navigator.serviceWorker?.register) return;
  const base = normalizeBaseUrl(baseUrl);
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
      // PWA support is progressive; the editor remains usable without service worker registration.
    });
  });
}

function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) return "/";
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}
