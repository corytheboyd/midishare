import { Server as HttpServer } from "https";
import { ServerResponse } from "http";
import { getCurrentUserId } from "../getCurrentUserId";
import { getSession } from "../state/getSession";
import { Server as WebSocketServer } from "ws";
import { Express, Request, Response } from "express";
import { add } from "./connections/add";
import { SessionDataWebSocketArgs, WebSocketSubType } from "@midishare/common";

export function register(
  httpServer: HttpServer,
  webSocketServer: WebSocketServer,
  app: Express & {
    /**
     * For some reason this is missing from the types. Maybe should contribute
     * to the types hah, but for now leaving it alone.
     *
     * The handle function was seen in the wild in this example:
     * https://github.com/adamjmcgrath/eoidc-testing-example/blob/ws/index.js
     *
     * @todo Add missing types to @types/express
     * */
    handle: (
      req: Request,
      res: Response | ServerResponse,
      handler: () => void
    ) => void;
  }
): void {
  webSocketServer.on("connection", (ws, req) => {
    const userId = getCurrentUserId(req as Request);
    const query = (req as Request).query;
    const { type } = query as { type: WebSocketSubType };
    add(type, userId, ws);
  });

  httpServer.on("upgrade", (req, socket, head) => {
    const res = new ServerResponse(req);
    res.assignSocket(socket);
    res.on("finish", () => res.socket?.destroy());
    app.handle(req, res, async () => {
      const unauthorized = () => {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
      };

      // Require that incoming WebSocket connections specify a type and optional
      // arguments as query parameters.
      const { type } = req.query as { type: WebSocketSubType };
      if (!type) {
        console.warn("WS UNAUTHORIZED: malformed sub type args");
        return unauthorized();
      }

      // If the request has no userId, that means they have never been assigned
      // our userId cookie, so just reject the websocket upgrade. Do this before
      // we even touch Redis to mitigate abuse vectors.
      const userId = getCurrentUserId(req);
      if (!userId) {
        console.warn("WS UNAUTHORIZED: missing user id");
        return unauthorized();
      }

      if (type === WebSocketSubType.SIGNALING) {
        // TODO Just make sure the user is in a session, we don't need to add
        //  the overhead of a specific session. For now just let anyone create
        //  a signaling socket.
      } else if (type === WebSocketSubType.SESSION_DATA) {
        const { sessionId } = req.query as SessionDataWebSocketArgs;

        // Make sure the session exists, and that the user is actually a member
        // of it.
        // Note: this is interacting with Redis, which is why it's the final
        // check.
        const session = await getSession(sessionId);
        if (
          session.participants.host !== userId &&
          session.participants.guest !== userId
        ) {
          console.warn(
            `WS UNAUTHORIZED: not member of session [userId="${userId}", sessionId="${sessionId}"]`
          );
          return unauthorized();
        }
      } else {
        console.warn("WS UNAUTHORIZED: unhandled socket subType");
        return unauthorized();
      }

      webSocketServer.handleUpgrade(req, socket, head, (ws) => {
        /**
         * This is where we set the arguments that are yielded to the
         * connection callback above
         * */
        webSocketServer.emit("connection", ws, req);
      });
    });
  });
}
