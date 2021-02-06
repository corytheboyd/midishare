import { UserId } from "@midishare/common";
import WebSocket from "ws";
import { WSSubType } from "./types";

const WS_KEEPALIVE_TIMEOUT_MS = 1000;

/**
 * Mapping of sockets by type to user to sockets.
 *
 * Yes, sockets plural. It's possible for the user to have more than one
 * session by type running. If it's garbage collection of old sessions you are
 * worried about, that is taken care of by the keepAlive ping/pong/kill logic.
 * */
const connectionMap: Record<WSSubType, Record<UserId, WebSocket[]>> = {
  sessionData: {},
};

export function add(
  subType: WSSubType,
  userId: UserId,
  socket: WebSocket
): void {
  if (!connectionMap[subType][userId]) {
    connectionMap[subType][userId] = [];
  }

  socket.on("close", (code, reason) => {
    console.warn(`WS CLOSE EVENT [code=${code}, reason=${reason}]`);
    kill(subType, userId, socket);
  });
  socket.on("error", (error) => {
    console.warn(`WS ERROR EVENT [code=${error.message}]`, error);
    kill(subType, userId, socket);
  });

  keepAlive(subType, userId, socket);

  connectionMap[subType][userId].push(socket);
  console.debug("WS ADD", subType, userId, connectionMap);
}

export function kill(
  subType: WSSubType,
  userId: UserId,
  socket: WebSocket
): void {
  if (!connectionMap[subType][userId]) {
    console.warn("User does not have a WebSocket registered", userId, subType);
    return;
  }
  socket.close();
  connectionMap[subType][userId] = connectionMap[subType][userId].filter(
    (ws) => ws !== socket
  );
  console.debug("WS KILL", subType, userId, connectionMap);
}

function keepAlive(
  subType: WSSubType,
  userId: UserId,
  socket: WebSocket
): void {
  const intervalId = setInterval(() => {
    socket.ping(null, false, (error) => {
      if (error) {
        kill(subType, userId, socket);
        clearInterval(intervalId);
      }
    });
  }, WS_KEEPALIVE_TIMEOUT_MS);
}
