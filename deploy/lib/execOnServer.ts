import { runCommand } from "./runCommand";

export async function execOnServer(command: string[]): Promise<void> {
  await runCommand([
    `ssh -t ${process.env.SERVER_SSH_ADDRESS}`,
    `"${command.join(" ")}"`,
  ]);
}
