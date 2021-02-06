/**
 * Function called from server index on receipt of the shutdown signal.
 * */
import { close } from "./ws/connections/close";
import { CloseCode } from "./ws/connections/types";

export async function handleShutdown(signal: NodeJS.Signals): Promise<void> {
  // Development server restart signal
  // See: https://github.com/remy/nodemon#controlling-shutdown-of-your-script
  if (signal === "SIGUSR2") {
    close(CloseCode.SERVICE_RESTART, "Development server restart");
  }
}
