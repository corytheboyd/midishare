import { runCommand } from "./runCommand";

export async function sendToServer(
  sourcePath: string,
  destPath: string,
  address: string = process.env.NODE_USER_ADDRESS as string
): Promise<void> {
  return runCommand([
    /**
     * Note: this assumes that the machine being deployed from has their
     * public SSH key in the remote host's authorized_keys.
     *
     * rsync -e "ssh -i ~/.ssh/id_rsa.pub" -ap dist/server nodejs@143.110.152.162:~
     * */
    `rsync -e "ssh"`,
    "--verbose --stats --compress --archive --human-readable -P",
    `-ap ${sourcePath}`,
    `${address}:${destPath}`,
  ]);
}
