import { runCommand } from "./runCommand";

export async function sendToServer(
  sourcePath: string,
  destPath: string
): Promise<void> {
  return runCommand([
    /**
     * Note: this assumes that the machine being deployed from has their
     * public SSH key in the remote host's authorized_keys.
     *
     * rsync -e "ssh -i ~/.ssh/id_rsa.pub" -ap dist/server nodejs@143.110.152.162:~
     * */
    `rsync -e "ssh -i ${process.env.SSH_KEY_PATH}"`,
    "--verbose --stats --compress --archive --human-readable -P",
    `-ap ${sourcePath}`,
    `${process.env.SERVER_SSH_ADDRESS}:${destPath}`,
  ]);
}
