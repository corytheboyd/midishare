import {
  SessionDataWebSocketArgs,
  WebSocketCloseCode,
  WebSocketSubType,
} from "@midishare/common";
import { handleSessionDataMessage } from "./handleSessionDataMessage";

export type ReturnContext = {
  close: (code?: WebSocketCloseCode, reason?: string) => void;
  ws: Promise<WebSocket>;
};

const WS_MAX_RETRY_CONNECT_ATTEMPTS = 5;
const WS_INITIAL_RETRY_DELAY = 2000;
const WS_RETRY_DELAY_MS = (attempts: number) => (2 ** attempts - 1) * 1000;

const webSocketMap: Record<WebSocketSubType, Promise<WebSocket> | null> = {
  sessionData: null,
  signaling: null,
};

export function initializeWebSocket<T = undefined>(
  subType: WebSocketSubType,
  args?: T
): ReturnContext {
  const url = wsSubTypeUrl(subType, args);

  webSocketMap[subType] = new Promise<WebSocket>((resolve, reject) => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.info(`WS[type="${subType}"]: connected`);
      ws.onopen = ws.onerror = ws.onclose = null;
      resolve(ws);
    };

    ws.onclose = ws.onerror = () => {
      ws.onopen = ws.onerror = ws.onclose = null;
      reject(
        new Error(
          `WS[type="${subType}"]: initial open failed: ${url.toString()}`
        )
      );
    };
  });

  webSocketMap[subType]!.then(() =>
    registerEventListeners<T>(subType, args)
  ).catch((error) => console.error(error));

  return buildReturnContext(subType);
}

function wsSubTypeUrl<T>(subType: WebSocketSubType, args: T): string {
  const url = new URL(process.env.WS_URL as string);
  url.searchParams.append("type", WebSocketSubType.SESSION_DATA);

  if (subType === WebSocketSubType.SESSION_DATA) {
    const { sessionId } = args as SessionDataWebSocketArgs;
    url.searchParams.append("sessionId", sessionId);
  }

  return url.toString();
}

function buildReturnContext(subType: WebSocketSubType): ReturnContext {
  const deferredWs = webSocketMap[subType];

  if (!deferredWs) {
    // If this happens, it's bad enough to throw and crash the app.
    throw new Error(`WS[type="${subType}"] failed to build return context`);
  }

  return {
    close: (
      code: WebSocketCloseCode = WebSocketCloseCode.NORMAL_CLOSURE,
      reason?: string
    ) => {
      console.info(
        `WS[type="${subType}"]: close return context function called`
      );
      deferredWs.then((ws) => {
        ws.close(code, reason);
        return reset(subType);
      });
    },
    ws: deferredWs,
  };
}

async function reset(subType: WebSocketSubType): Promise<void> {
  const ws = await webSocketMap[subType];
  if (!ws) {
    console.warn("DATA WS: not initialized");
    return;
  }
  ws.onopen = ws.onerror = ws.onclose = ws.onmessage = null;
  webSocketMap[subType] = null;
}

async function sleep(duration: number): Promise<void> {
  new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

async function registerEventListeners<T>(
  subType: WebSocketSubType,
  args?: T
): Promise<void> {
  const ws = await webSocketMap[subType];
  if (!ws) {
    console.error(`WS[type="${subType}"] failed to build return context`);
    return;
  }

  console.debug("registerEventListeners", subType, args);

  ws.onmessage = function (event) {
    console.debug(`WS[type="${subType}"]: message received`, event.data);

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
    console.error(`WS[type="${subType}"]: error`, event);
  };

  ws.onclose = async function (event) {
    console.warn(
      `WS[type="${subType}"]: closed [code="${event.code}", reason="${event.reason}"]`
    );

    const reconnect = async (retries = 0): Promise<void> => {
      console.info(
        `WS[type="${subType}"]: retry connection [retries="${retries}"]`
      );
      await sleep(WS_RETRY_DELAY_MS(retries));
      const { ws } = initializeWebSocket<T>(subType, args);
      try {
        await ws;
        console.info(`WS[type="${subType}"]: reconnected`);
      } catch (error) {
        if (retries === WS_MAX_RETRY_CONNECT_ATTEMPTS) {
          throw new Error(
            `WS[type="${subType}"]: reconnect timeout [retries=${retries}]`
          );
        }
        await reset(subType);
        await reconnect(retries + 1);
      }
    };

    if (event.code === WebSocketCloseCode.SERVICE_RESTART) {
      console.debug(`WS[type="${subType}"]: close reason is server restart`);
      await reset(subType);
      setTimeout(reconnect, WS_INITIAL_RETRY_DELAY);
    } else {
      console.warn(
        `WS[type="${subType}"]: unhandled close code [code="${event.code}", reason="${event.reason}"]`
      );
    }
  };
}
