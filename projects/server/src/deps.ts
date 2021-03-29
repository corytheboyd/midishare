// https://github.com/oakserver/oak
import { Application, Middleware } from "https://deno.land/x/oak/mod.ts";
export { Application };
export type { Middleware };

// // https://deno.land/std@0.91.0/ws
// import {
//   acceptWebSocket,
//   isWebSocketCloseEvent,
//   isWebSocketPingEvent,
//   WebSocket,
// } from "https://deno.land/std@0.91.0/ws/mod.ts";
//
// // Can't re-export types as-is with the default deno TS configuration, need
// // to explicitly do so like this.
// // See: https://github.com/eveningkid/denodb/issues/146#issuecomment-752661954
// export type { WebSocket };
// export { acceptWebSocket, isWebSocketCloseEvent, isWebSocketPingEvent };
