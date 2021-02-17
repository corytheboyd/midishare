import { runCommand } from "./runCommand";

export async function execOnServer(
  command: string[],
  address: string = process.env.NODE_USER_ADDRESS as string
): Promise<void> {
  await runCommand([`ssh -t ${address}`, `"${command.join(" ")}"`]);
}
