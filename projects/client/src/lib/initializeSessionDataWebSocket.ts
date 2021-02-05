let ws: WebSocket;

export function initializeSessionDataWebSocket(sessionId: string): void {
  if (!ws) {
    try {
      const url = new URL(process.env.WS_URL as string);
      url.searchParams.append("type", "sessionData");
      url.searchParams.append("sessionId", sessionId);
      ws = new WebSocket(url.toString());
      registerEventListeners(ws);
    } catch (error) {
      return;
    }
  }
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
  };
}
