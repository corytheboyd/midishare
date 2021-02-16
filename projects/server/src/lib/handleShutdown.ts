/**
 * Function called from server index on receipt of the shutdown signal.
 * */
import { close } from "./ws/connections/close";
import { WebSocketCloseCode } from "@midishare/common";

export function handleShutdown(signal: NodeJS.Signals): void {
  // Development server restart signal
  // See: https://github.com/remy/nodemon#controlling-shutdown-of-your-script
  if (signal === "SIGUSR2") {
    close(WebSocketCloseCode.SERVICE_RESTART);
  }
}
