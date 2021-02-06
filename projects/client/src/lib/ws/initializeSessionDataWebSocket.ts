import { queryClient } from "../queryClient";
import { Session, WebSocketCloseCode } from "@midishare/common";
import { queryKey } from "../queries/getSession";

type UnsubscribeFunction = () => void;

export function initializeSessionDataWebSocket(
  sessionId: string
): UnsubscribeFunction {
  let ws: WebSocket;
  try {
    const url = new URL(process.env.WS_URL as string);
    url.searchParams.append("type", "sessionData");
    url.searchParams.append("sessionId", sessionId);
    ws = new WebSocket(url.toString());
  } catch (error) {
    console.error("WS INIT FAILED", error);
    return () => {};
  }
  registerEventListeners(ws, sessionId);
  return () => ws.close();
}

function registerEventListeners(ws: WebSocket, sessionId: string): void {
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

      setTimeout(() => {
        const attempts = 1;
        initializeSessionDataWebSocket(sessionId);
      }, 1000);
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
