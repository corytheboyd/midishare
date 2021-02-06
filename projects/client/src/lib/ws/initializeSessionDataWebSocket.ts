import { queryClient } from "../queryClient";
import { Session, WebSocketCloseCode } from "@midishare/common";
import { queryKey } from "../queries/getSession";

type UnsubscribeFunction = () => void;

const DATA_WS_MAX_RETRY_CONNECT_ATTEMPTS = 5;
const DATA_WS_RETRY_DELAY_MS = (attempts: number) => (2 ** attempts - 1) * 1000;

/**
 * @throws Error When failed to open on create
 * */
export function initializeSessionDataWebSocket(
  sessionId: string
): [UnsubscribeFunction, Promise<WebSocket>] {
  const url = new URL(process.env.WS_URL as string);
  url.searchParams.append("type", "sessionData");
  url.searchParams.append("sessionId", sessionId);

  const deferredWs = new Promise<WebSocket>((resolve, reject) => {
    const ws = new WebSocket(url.toString());
    ws.onopen = () => resolve(ws);
    ws.onerror = () =>
      reject(new Error(`Failed to open WebSocket: ${url.toString()}`));
  });

  deferredWs
    .then((ws) => registerEventListeners(ws, sessionId))
    .catch((error) => console.error(error));

  return [() => deferredWs.then((ws) => ws.close()), deferredWs];
}

function registerEventListeners(ws: WebSocket, sessionId: string): void {
  console.debug("REGISTER EVENT LISTENERS");

  ws.onopen = function () {
    console.info("DATA WS OPEN", this);
  };

  ws.onerror = function (event) {
    console.error("DATA WS ERROR", this, event);
    // TODO maybe initiate retry here too... but be careful
  };

  ws.onclose = function (event) {
    console.warn(
      `DATA WS CLOSE [code="${event.code}", reason="${event.reason}"]`
    );
    ws.onopen = ws.onerror = ws.onclose = ws.onmessage = null;

    if (event.code === WebSocketCloseCode.SERVICE_RESTART) {
      console.debug("Closed because of server restart, attempt reconnection");

      const sleep = (duration: number): Promise<void> =>
        new Promise((resolve) => {
          setTimeout(resolve, duration);
        });

      const reconnect = async (retries = 0): Promise<void> => {
        console.debug("TRY RECONNECT");

        await sleep(DATA_WS_RETRY_DELAY_MS(retries));
        const [, deferredWs] = initializeSessionDataWebSocket(sessionId);

        try {
          await deferredWs;
          console.debug("RECONNECT SUCCESS");
        } catch (error) {
          if (retries === DATA_WS_MAX_RETRY_CONNECT_ATTEMPTS) {
            throw new Error(
              `Data WebSocket Failed to reconnect after ${retries} attempts`
            );
          }
          await reconnect(retries + 1);
        }
      };

      setTimeout(reconnect, 2000);
    } else {
      console.warn("DATA WS CLOSE: Unhandled code", event.code, event.reason);
    }
  };

  ws.onmessage = function (event) {
    console.debug("DATA WS MESSAGE", this, event.data);

    let session: Session;
    try {
      session = JSON.parse(event.data);
    } catch (error) {
      console.warn("WS FAILED TO PARSE MESSAGE", this, event.data);
      return;
    }

    queryClient.setQueryData(queryKey(session.id), session);
  };
}
