import { UserId } from "@midishare/common";
import WebSocket from "ws";
import { WSSubType } from "../types";

/**
 * Mapping of sockets by type to user to sockets.
 *
 * Yes, sockets plural. It's possible for the user to have more than one
 * session by type running. If it's garbage collection of old sessions you are
 * worried about, that is taken care of by the keepAlive ping/pong/kill logic.
 * */
export const connectionMap: Record<WSSubType, Record<UserId, WebSocket[]>> = {
  sessionData: {},
};
console.debug("WS CONNECTION MAP", connectionMap);
