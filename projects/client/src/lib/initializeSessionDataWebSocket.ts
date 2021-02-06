import { queryClient } from "./queryClient";
import { Session } from "@midishare/common";
import { queryKey } from "./queries/getSession";

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
  registerEventListeners(ws);
  return () => ws.close();
}

function registerEventListeners(ws: WebSocket): void {
  ws.onopen = function () {
    console.info("DATA WS OPEN", this);
  };

  ws.onerror = function (event) {
    console.error("DATA WS ERROR", this, event);
  };

  ws.onclose = function (event) {
    console.warn("DATA WS CLOSE", this, event);
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
