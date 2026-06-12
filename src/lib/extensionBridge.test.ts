import { describe, expect, it } from "vitest";
import { createEditStateSnapshot } from "./editState";
import {
  extensionBridgeCapabilities,
  extensionBridgeChannel,
  installExtensionBridge,
  type ExtensionBridgeResponse,
} from "./extensionBridge";
import { makeTextLayer } from "./layerFactory";
import { defaultOutputSettings } from "./presets";

describe("extensionBridge", () => {
  it("responds to ping and snapshot requests", async () => {
    const snapshot = createEditStateSnapshot(
      [makeTextLayer({ text: "BRIDGE" })],
      [],
      defaultOutputSettings,
      "csv",
      "html",
      "Bridge",
      new Date("2026-06-12T00:00:00Z"),
    );
    const cleanup = installExtensionBridge({
      getSnapshot: () => snapshot,
      applySnapshot: () => true,
    });

    const ping = await sendBridgeRequest("ping-1", "ping");
    const getSnapshot = await sendBridgeRequest("snapshot-1", "getSnapshot");

    cleanup();

    expect(ping.ok).toBe(true);
    expect(ping.payload).toEqual({ capabilities: extensionBridgeCapabilities });
    expect(getSnapshot.ok).toBe(true);
    expect(getSnapshot.payload).toEqual({ snapshot });
  });

  it("validates applySnapshot payloads", async () => {
    const snapshot = createEditStateSnapshot(
      [makeTextLayer({ text: "APPLY" })],
      [],
      defaultOutputSettings,
      "csv",
      "html",
      "Apply",
    );
    const received: unknown[] = [];
    const cleanup = installExtensionBridge({
      getSnapshot: () => snapshot,
      applySnapshot: (payload) => {
        received.push(payload);
        return payload === snapshot;
      },
    });

    const invalid = await sendBridgeRequest("apply-invalid", "applySnapshot", {});
    const valid = await sendBridgeRequest("apply-valid", "applySnapshot", { snapshot });

    cleanup();

    expect(invalid.ok).toBe(false);
    expect(invalid.error).toBe("Invalid edit-state snapshot.");
    expect(valid.ok).toBe(true);
    expect(valid.payload).toEqual({ applied: true });
    expect(received).toEqual([undefined, snapshot]);
  });
});

function sendBridgeRequest(
  requestId: string,
  command: "ping" | "getSnapshot" | "applySnapshot",
  payload?: unknown,
): Promise<ExtensionBridgeResponse> {
  return new Promise((resolve) => {
    const handleMessage = (event: MessageEvent) => {
      const response = event.data as Partial<ExtensionBridgeResponse>;
      if (
        response.channel === extensionBridgeChannel &&
        response.direction === "response" &&
        response.requestId === requestId
      ) {
        window.removeEventListener("message", handleMessage);
        resolve(response as ExtensionBridgeResponse);
      }
    };
    window.addEventListener("message", handleMessage);
    window.dispatchEvent(
      new MessageEvent("message", {
        source: window,
        origin: window.location.origin,
        data: {
          channel: extensionBridgeChannel,
          direction: "request",
          requestId,
          command,
          payload,
        },
      }),
    );
  });
}
