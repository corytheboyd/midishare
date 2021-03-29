// https://deno.land/std@0.91.0/http
export { serve } from "https://deno.land/std@0.91.0/http/server.ts";

// https://deno.land/std@0.91.0/ws
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket,
} from "https://deno.land/std@0.91.0/ws/mod.ts";

// Can't re-export types as-is with the default deno TS configuration, need
// to explicitly do so like this.
// See: https://github.com/eveningkid/denodb/issues/146#issuecomment-752661954
export type { WebSocket };
export { acceptWebSocket, isWebSocketCloseEvent, isWebSocketPingEvent };
