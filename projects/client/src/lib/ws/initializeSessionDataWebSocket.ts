import { queryClient } from "../queryClient";
import { Session, WebSocketCloseCode } from "@midishare/common";
import { queryKey } from "../queries/getSession";

const DATA_WS_MAX_RETRY_CONNECT_ATTEMPTS = 5;
const DATA_WS_INITIAL_RETRY_DELAY = 2000;
const DATA_WS_RETRY_DELAY_MS = (attempts: number) => (2 ** attempts - 1) * 1000;

let deferredWs: Promise<WebSocket> | null;

type ReturnContext = {
  close: () => void;
  ws: typeof deferredWs;
};

const buildReturnContext = (): ReturnContext => ({
  close: (
    code: WebSocketCloseCode = WebSocketCloseCode.NORMAL_CLOSURE,
    reason?: string
  ) => deferredWs?.then((ws) => ws.close(code, reason)),
  ws: deferredWs,
});

/**
 * @throws Error When failed to open on create
 * */
export function initializeSessionDataWebSocket(
  sessionId: string
): ReturnContext {
  if (deferredWs) {
    console.warn("DATA WS: already initialized");
    return buildReturnContext();
  }

  const url = new URL(process.env.WS_URL as string);
  url.searchParams.append("type", "sessionData");
  url.searchParams.append("sessionId", sessionId);

  deferredWs = new Promise<WebSocket>((resolve, reject) => {
    const ws = new WebSocket(url.toString());
    ws.onopen = () => {
      resolve(ws);
      ws.onopen = ws.onerror = ws.onclose = null;
    };
    ws.onclose = ws.onerror = () => {
      ws.onopen = ws.onerror = ws.onclose = null;
      reject(new Error(`DATA WS: initial open failed: ${url.toString()}`));
    };
  });

  deferredWs
    .then(() => {
      console.info("DATA WS: connected");
      return registerEventListeners(sessionId);
    })
    .catch((error) => console.error(error));

  return buildReturnContext();
}

async function reset() {
  const ws = await deferredWs;
  if (!ws) {
    console.warn("DATA WS: not initialized");
    return;
  }
  ws.onopen = ws.onerror = ws.onclose = ws.onmessage = null;
  deferredWs = null;
}

async function registerEventListeners(sessionId: string): Promise<void> {
  const ws = await deferredWs;
  if (!ws) {
    console.warn("DATA WS: not initialized");
    return;
  }

  ws.onerror = function (event) {
    console.error("DATA WS: error", this, event);
  };

  ws.onclose = async function (event) {
    console.warn(
      `DATA WS: closed [code="${event.code}", reason="${event.reason}"]`
    );

    await reset();

    if (event.code === WebSocketCloseCode.SERVICE_RESTART) {
      console.debug("DATA WS: close reason is server restart");

      const sleep = (duration: number): Promise<void> =>
        new Promise((resolve) => {
          setTimeout(resolve, duration);
        });

      const reconnect = async (retries = 0): Promise<void> => {
        console.info(`DATA WS: reconnect [retries="${retries}"]`);

        await sleep(DATA_WS_RETRY_DELAY_MS(retries));
        const { ws } = initializeSessionDataWebSocket(sessionId);
        try {
          await ws;
          console.info("DATA WS: reconnected");
        } catch (error) {
          if (retries === DATA_WS_MAX_RETRY_CONNECT_ATTEMPTS) {
            throw new Error(`DATA WS: reconnect timeout [retries=${retries}]`);
          }
          await reconnect(retries + 1);
        }
      };

      setTimeout(reconnect, DATA_WS_INITIAL_RETRY_DELAY);
    } else {
      console.warn(
        `DATA WS: unhandled close code [code="${event.code}", reason="${event.reason}"]`
      );
    }
  };

  ws.onmessage = function (event) {
    console.debug("DATA WS: message", event.data);

    let session: Session;
    try {
      session = JSON.parse(event.data);
    } catch (error) {
      console.warn("DATA WS: failed to parse message", event.data);
      return;
    }

    queryClient.setQueryData(queryKey(session.id), session);
  };
}
