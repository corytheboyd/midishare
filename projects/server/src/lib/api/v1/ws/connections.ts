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

console.debug("WS CONNECTION MAP", connectionMap);

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
  console.debug(
    `WS ADD [type=${subType}, userId=${userId}]`,
    subType,
    userId,
    connectionMap
  );
}

export function kill(
  subType: WSSubType,
  userId: UserId,
  socket: WebSocket
): void {
  if (!connectionMap[subType][userId]) {
    connectionMap[subType][userId] = [];
  }
  connectionMap[subType][userId] = connectionMap[subType][userId].filter(
    (ws) => ws !== socket
  );
  socket.close();

  // Prevent memory leak of empty list after killing all sockets for this
  // subtype/user. Instead, rely on lazily creating the array.
  if (connectionMap[subType][userId].length === 0) {
    delete connectionMap[subType][userId];
  }

  console.debug("WS KILL", subType, userId, connectionMap);
}

export function send(subType: WSSubType, userId: UserId, data: string): void {
  if (!connectionMap[subType][userId]) {
    connectionMap[subType][userId] = [];
  }
  for (const socket of connectionMap[subType][userId]) {
    socket.send(data);
  }
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

/**
 * TODO and a BIG one! close sockets on server restart with appropriate codes
 *  to signal that the client should or should not attempt a reconnect.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#status_codes
 * */
export function close(
  code: number,
  subType?: WSSubType,
  userId?: UserId
): void {
  if (subType && userId) {
    if (!connectionMap[subType][userId]) {
      return;
    }
    for (const socket of connectionMap[subType][userId]) {
      socket.close();
    }
  } else if (subType) {
    for (const socket of Array.prototype.concat.apply(
      [],
      Object.values(connectionMap[subType])
    )) {
      socket.close();
    }
  } else {
    for (const socket of Array.prototype.concat.apply(
      [],
      Object.values(Object.values(connectionMap))
    )) {
      socket.close();
    }
  }
}
