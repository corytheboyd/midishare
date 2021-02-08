import {
  UserId,
  WebSocketCloseCode,
  WebSocketSessionDataArgs,
  WebSocketSignalingArgs,
  WebSocketSubType,
  WebSocketSubTypeArgs,
} from "@midishare/common";
import {
  webSocketMap,
  WS_INITIAL_RETRY_DELAY,
  WS_MAX_RETRY_CONNECT_ATTEMPTS,
  WS_RETRY_DELAY_MS,
} from "./index";
import { handleSessionDataMessage } from "../handleSessionDataMessage";
import { handleSignalingMessage } from "../handleSignalingMessage";

export type ReturnContext = {
  close: (code?: WebSocketCloseCode, reason?: string) => void;

  /**
   * Resolves to null if there was an error creating the WebSocket
   * */
  ws: Promise<WebSocket | null>;
};

/**
 * This is probably the flakiest logic right now... keep an eye on it.
 * */
export function create(args: WebSocketSubTypeArgs): ReturnContext {
  if (webSocketMap[args.type]) {
    return buildReturnContext(args.type);
  }

  const url = wsSubTypeUrl(args);
  // console.info(`WS[type="${args.type}"]: request initialization`, url);

  webSocketMap[args.type] = new Promise<WebSocket | null>((resolve) => {
    // Note: using try/catch on this has no effect. I tried, but go ahead.
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.info(`WS[type="${args.type}"]: connected`, url);
      ws.onopen = ws.onerror = ws.onclose = null;
      resolve(ws);
    };

    ws.onclose = ws.onerror = () => {
      ws.onopen = ws.onerror = ws.onclose = null;
      resolve(null);
    };
  });

  webSocketMap[args.type]!.then((ws) => {
    if (!ws) {
      console.error(`WS[type="${args.type}"] failed to create`);
      return;
    }
    return registerEventListeners(args);
  });

  return buildReturnContext(args.type);
}

function wsSubTypeUrl(args: WebSocketSubTypeArgs): string {
  const url = new URL(process.env.WS_URL as string);
  url.searchParams.append("type", args.type);

  if (args.type === WebSocketSubType.SESSION_DATA) {
    const { sessionId } = args as WebSocketSessionDataArgs;
    url.searchParams.append("sessionId", sessionId);
  } else if (args.type === WebSocketSubType.SIGNALING) {
    const { sessionId } = args as WebSocketSignalingArgs;
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

async function registerEventListeners(
  args: WebSocketSubTypeArgs
): Promise<void> {
  const ws = await webSocketMap[args.type];
  if (!ws) {
    console.info(`WS[type="${args.type}"] failed to build return context`);
    return;
  }

  ws.onmessage = function (event) {
    console.info(`WS[type="${args.type}"]: message received`, event.data);

    if (args.type === WebSocketSubType.SESSION_DATA) {
      handleSessionDataMessage(event.data);
    } else if (args.type === WebSocketSubType.SIGNALING) {
      handleSignalingMessage(args, event.data);
    } else {
      console.warn(
        `WS[type="${args.type}"]: unhandled subtype message received`,
        event.data
      );
    }
  };

  ws.onerror = function (event) {
    console.info(`WS[type="${args.type}"]: error`, event);
  };

  ws.onclose = async function (event) {
    console.info(
      `WS[type="${args.type}"]: closed [code="${event.code}", reason="${event.reason}"]`
    );

    const reconnect = async (retries = 0): Promise<void> => {
      console.info(
        `WS[type="${args.type}"]: retry connection [retries="${retries}"]`
      );
      await reset(args.type);
      await sleep(WS_RETRY_DELAY_MS(retries));
      const { ws } = create(args);
      if (!(await ws)) {
        if (retries === WS_MAX_RETRY_CONNECT_ATTEMPTS) {
          console.warn(
            `WS[type="${args.type}"]: reconnect timeout [retries=${retries}]`
          );
          return;
        } else {
          console.info(`WS[type="${args.type}"] retry reconnect`);
          await reset(args.type);
          await reconnect(retries + 1);
        }
      }
    };

    if (event.code === WebSocketCloseCode.SERVICE_RESTART) {
      setTimeout(reconnect, WS_INITIAL_RETRY_DELAY);
    } else {
      console.warn(
        `WS[type="${args.type}"]: unhandled close code [code="${event.code}", reason="${event.reason}"]`
      );
    }
  };
}
