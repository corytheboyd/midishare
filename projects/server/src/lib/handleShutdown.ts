/**
 * Function called from server index on receipt of the shutdown signal.
 *
 * TODO figure out why I cannot reference @midishare/common here to use the
 *  WebSocketCloseCode enum??
 * */
import { close } from "./ws/connections/close";

export async function handleShutdown(signal: NodeJS.Signals): Promise<void> {
  // Development server restart signal
  // See: https://github.com/remy/nodemon#controlling-shutdown-of-your-script
  if (signal === "SIGUSR2") {
    close(1012, "Development server restart");
  }
}
