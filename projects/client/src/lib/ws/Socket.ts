import {
  WebSocketCloseCode,
  WebSocketSessionDataArgs,
  WebSocketSignalingArgs,
  WebSocketSubType,
  WebSocketSubTypeArgs,
} from "@midishare/common";

export class Socket {
  private static instanceMap: {
    [WebSocketSubType.SIGNALING]?: Socket;
    [WebSocketSubType.SESSION_DATA]?: Socket;
  } = {};

  private readonly ws: WebSocket;
  private readonly args: WebSocketSubTypeArgs;
  private readonly onMessageCallbacks: ((data: string) => void)[];

  public static instance(args: WebSocketSubTypeArgs): Socket {
    if (this.instanceMap[args.type]) {
      return this.instanceMap[args.type]!;
    }

    const ws = new WebSocket(this.buildUrl(args));
    const instance = new this(ws, args);

    const reset = () =>
      (ws.onclose = ws.onerror = ws.onopen = ws.onmessage = null);

    ws.onopen = () => {
      reset();
      this.instanceMap[args.type] = instance;
    };

    ws.onclose = ws.onerror = () => {
      reset();
    };

    return instance;
  }

  public static destroy(type: WebSocketSubType): void {
    const instance = this.instanceMap[type];
    instance?.close(WebSocketCloseCode.NORMAL_CLOSURE);
  }

  private static buildUrl(args: WebSocketSubTypeArgs): string {
    const url = new URL(process.env.WS_URL as string);
    url.searchParams.append("type", args.type);

    if (args.type === WebSocketSubType.SESSION_DATA) {
      const { sessionId } = args as WebSocketSessionDataArgs;
      url.searchParams.append("sessionId", sessionId);
    } else if (args.type === WebSocketSubType.SIGNALING) {
      const { sessionId } = args as WebSocketSignalingArgs;
      url.searchParams.append("sessionId", sessionId);
    }

    return url.toString();
  }

  private constructor(ws: WebSocket, args: WebSocketSubTypeArgs) {
    this.ws = ws;
    this.args = args;
    this.onMessageCallbacks = [];

    ws.onmessage = (event) => {
      this.onMessageCallbacks.forEach((cb) => cb(event.data));
    };
  }

  public onMessage(callback: (data: string) => void): void {
    this.onMessageCallbacks.push(callback);
  }

  public send(data: string): void {
    this.ws.send(data);
  }

  private close(code: WebSocketCloseCode, reason?: string): void {
    this.ws.close(code, reason);
  }
}

// export const WS_MAX_RETRY_CONNECT_ATTEMPTS = 4;
// export const WS_INITIAL_RETRY_DELAY = 2000;
// export const WS_RETRY_DELAY_MS = (attempts: number): number =>
//   2 ** (attempts - 1) * 1000;
//
// const reconnect = async (retries = 0): Promise<void> => {
//   console.info(
//     `WS[type="${args.type}"]: retry connection [retries="${retries}"]`
//   );
//   await reset(args.type);
//   await sleep(WS_RETRY_DELAY_MS(retries));
//   const { ws } = create(args);
//   if (!(await ws)) {
//     if (retries === WS_MAX_RETRY_CONNECT_ATTEMPTS) {
//       console.warn(
//         `WS[type="${args.type}"]: reconnect timeout [retries=${retries}]`
//       );
//       return;
//     } else {
//       console.info(`WS[type="${args.type}"] retry reconnect`);
//       await reset(args.type);
//       await reconnect(retries + 1);
//     }
//   }
// };
//
// if (event.code === WebSocketCloseCode.SERVICE_RESTART) {
//   setTimeout(reconnect, WS_INITIAL_RETRY_DELAY);
// } else {
//   console.warn(
//     `WS[type="${args.type}"]: unhandled close code [code="${event.code}", reason="${event.reason}"]`
//   );
// }
