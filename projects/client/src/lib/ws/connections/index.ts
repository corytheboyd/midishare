import { WebSocketSubType } from "@midishare/common";

export const WS_MAX_RETRY_CONNECT_ATTEMPTS = 4;
export const WS_INITIAL_RETRY_DELAY = 2000;
export const WS_RETRY_DELAY_MS = (attempts: number): number =>
  2 ** (attempts - 1) * 1000;

// Initial state is null, and promise resolves to null if the WebSocket could
// not be created.
export const webSocketMap: Record<
  WebSocketSubType,
  Promise<WebSocket | null> | null
> = {
  sessionData: null,
  signaling: null,
};
