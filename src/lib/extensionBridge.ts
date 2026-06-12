import type { SavedEditState } from "./editState";

export const extensionBridgeChannel = "thumbnail-generator.extension.v1";

export type ExtensionBridgeCommand = "ping" | "getSnapshot" | "applySnapshot";

export interface ExtensionBridgeRequest {
  channel: typeof extensionBridgeChannel;
  direction: "request";
  requestId: string;
  command: ExtensionBridgeCommand;
  payload?: unknown;
}

export interface ExtensionBridgeResponse {
  channel: typeof extensionBridgeChannel;
  direction: "response";
  requestId: string;
  command: ExtensionBridgeCommand;
  ok: boolean;
  payload?: unknown;
  error?: string;
}

export interface ExtensionBridgeHandlers {
  getSnapshot: () => SavedEditState;
  applySnapshot: (snapshot: unknown) => boolean;
}

export const extensionBridgeCapabilities: ExtensionBridgeCommand[] = ["ping", "getSnapshot", "applySnapshot"];

export function installExtensionBridge(handlers: ExtensionBridgeHandlers): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleMessage = (event: MessageEvent) => {
    if (event.source !== window) return;
    if (!isExtensionBridgeRequest(event.data)) return;

    const request = event.data;
    try {
      if (request.command === "ping") {
        postExtensionBridgeResponse(request, true, { capabilities: extensionBridgeCapabilities });
        return;
      }
      if (request.command === "getSnapshot") {
        postExtensionBridgeResponse(request, true, { snapshot: handlers.getSnapshot() });
        return;
      }
      if (request.command === "applySnapshot") {
        const payload = request.payload as { snapshot?: unknown } | undefined;
        const applied = handlers.applySnapshot(payload?.snapshot);
        postExtensionBridgeResponse(request, applied, applied ? { applied: true } : undefined, applied ? undefined : "Invalid edit-state snapshot.");
      }
    } catch (error) {
      postExtensionBridgeResponse(request, false, undefined, error instanceof Error ? error.message : String(error));
    }
  };

  window.addEventListener("message", handleMessage);
  window.dispatchEvent(
    new CustomEvent("thumbnail-generator:extension-ready", {
      detail: {
        channel: extensionBridgeChannel,
        version: 1,
        capabilities: extensionBridgeCapabilities,
      },
    }),
  );

  return () => window.removeEventListener("message", handleMessage);
}

function postExtensionBridgeResponse(
  request: ExtensionBridgeRequest,
  ok: boolean,
  payload?: unknown,
  error?: string,
): void {
  const response: ExtensionBridgeResponse = {
    channel: extensionBridgeChannel,
    direction: "response",
    requestId: request.requestId,
    command: request.command,
    ok,
    payload,
    error,
  };
  window.postMessage(response, window.location.origin);
}

function isExtensionBridgeRequest(value: unknown): value is ExtensionBridgeRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<ExtensionBridgeRequest>;
  return (
    request.channel === extensionBridgeChannel &&
    request.direction === "request" &&
    typeof request.requestId === "string" &&
    extensionBridgeCapabilities.includes(request.command as ExtensionBridgeCommand)
  );
}
