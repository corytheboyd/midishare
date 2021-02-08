import {
  SessionDataWebSocketArgs,
  WebSocketCloseCode,
  WebSocketSubType,
} from "@midishare/common";
import { handleSessionDataMessage } from "./handleSessionDataMessage";

export type ReturnContext = {
  close: (code?: WebSocketCloseCode, reason?: string) => void;

  /**
   * Resolves to null if there was an error creating the WebSocket
   * */
  ws: Promise<WebSocket | null>;
};

const WS_MAX_RETRY_CONNECT_ATTEMPTS = 4;
const WS_INITIAL_RETRY_DELAY = 2000;
const WS_RETRY_DELAY_MS = (attempts: number) => 2 ** (attempts - 1) * 1000;

// Initial state is null, and promise resolves to null if the WebSocket could
// not be created.
const webSocketMap: Record<
  WebSocketSubType,
  Promise<WebSocket | null> | null
> = {
  sessionData: null,
  signaling: null,
};

export function initializeWebSocket<T = undefined>(
  subType: WebSocketSubType,
  args?: T
): ReturnContext {
  if (webSocketMap[subType]) {
    return buildReturnContext(subType);
  }

  const url = wsSubTypeUrl(subType, args);
  // console.info(`WS[type="${subType}"]: request initialization`, url);

  webSocketMap[subType] = new Promise<WebSocket | null>((resolve) => {
    // Note: using try/catch on this has no effect. I tried, but go ahead.
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.info(`WS[type="${subType}"]: connected`, url);
      ws.onopen = ws.onerror = ws.onclose = null;
      resolve(ws);
    };

    ws.onclose = ws.onerror = () => {
      ws.onopen = ws.onerror = ws.onclose = null;
      resolve(null);
    };
  });

  webSocketMap[subType]!.then((ws) => {
    if (!ws) {
      console.error(`WS[type="${subType}"] failed to create`);
      return;
    }
    return registerEventListeners<T>(subType, args);
  });

  return buildReturnContext(subType);
}

function wsSubTypeUrl<T>(subType: WebSocketSubType, args: T): string {
  const url = new URL(process.env.WS_URL as string);
  url.searchParams.append("type", subType);

  if (subType === WebSocketSubType.SESSION_DATA) {
    const { sessionId } = args as SessionDataWebSocketArgs;
    url.searchParams.append("sessionId", sessionId);
  }

  return url.toString();
}

function buildReturnContext(subType: WebSocketSubType): ReturnContext {
  return {
    close: (
      code: WebSocketCloseCode = WebSocketCloseCode.NORMAL_CLOSURE,
      reason?: string
    ) => {
      console.info(
        `WS[type="${subType}"]: close return context function called`
      );
      const deferredWs = webSocketMap[subType];
      deferredWs?.then((ws) => {
        ws?.close(code, reason);
        return reset(subType);
      });
    },
    ws: webSocketMap[subType] ?? Promise.resolve(null),
  };
}

async function reset(subType: WebSocketSubType): Promise<void> {
  const ws = await webSocketMap[subType];
  if (ws) {
    ws.onopen = ws.onerror = ws.onclose = ws.onmessage = null;
  }
  webSocketMap[subType] = null;
}

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

async function registerEventListeners<T>(
  subType: WebSocketSubType,
  args?: T
): Promise<void> {
  const ws = await webSocketMap[subType];
  if (!ws) {
    console.info(`WS[type="${subType}"] failed to build return context`);
    return;
  }

  ws.onmessage = function (event) {
    console.info(`WS[type="${subType}"]: message received`, event.data);

    if (subType === WebSocketSubType.SESSION_DATA) {
      handleSessionDataMessage(event.data);
    } else {
      console.warn(
        `WS[type="${subType}"]: unhandled subtype message received`,
        event.data
      );
    }
  };

  ws.onerror = function (event) {
    console.info(`WS[type="${subType}"]: error`, event);
  };

  ws.onclose = async function (event) {
    console.info(
      `WS[type="${subType}"]: closed [code="${event.code}", reason="${event.reason}"]`
    );

    const reconnect = async (retries = 0): Promise<void> => {
      console.info(
        `WS[type="${subType}"]: retry connection [retries="${retries}"]`
      );
      await reset(subType);
      await sleep(WS_RETRY_DELAY_MS(retries));
      const { ws } = initializeWebSocket<T>(subType, args);
      if (!(await ws)) {
        if (retries === WS_MAX_RETRY_CONNECT_ATTEMPTS) {
          console.warn(
            `WS[type="${subType}"]: reconnect timeout [retries=${retries}]`
          );
          return;
        } else {
          console.info(`WS[type="${subType}"] retry reconnect`);
          await reset(subType);
          await reconnect(retries + 1);
        }
      }
    };

    if (event.code === WebSocketCloseCode.SERVICE_RESTART) {
      setTimeout(reconnect, WS_INITIAL_RETRY_DELAY);
    } else {
      console.warn(
        `WS[type="${subType}"]: unhandled close code [code="${event.code}", reason="${event.reason}"]`
      );
    }
  };
}
