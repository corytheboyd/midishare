import { spawn } from "child_process";
import { resolve } from "path";
import { uploadDirectory } from "./lib/cdn/uploadDirectory";
import { config } from "dotenv";

config({
  path: resolve(__dirname, ".env"),
});

const ARTIFACT_ROOT = resolve(__dirname, "..", "dist");

// Run everything from the project root directory
process.chdir(resolve(__dirname, ".."));

async function runCommand(command: string[]): Promise<void> {
  const stringCommand = command.join(" ");
  console.debug("RUN COMMAND", stringCommand);

  const task = spawn(stringCommand, {
    shell: true,
  });

  task.stdout.pipe(process.stdout);
  task.stderr.pipe(process.stderr);

  return new Promise((resolve) => {
    task.on("close", (code) => {
      if (code !== 0) {
        console.error(`Command exited with non-zero code`);
        process.exit(code || 1);
      } else {
        console.log("Command exited successfully");
      }
      resolve();
    });
  });
}

(async () => {
  console.log("Cleanup build artifacts");
  await runCommand([`rm -rf ${ARTIFACT_ROOT}`, `mkdir ${ARTIFACT_ROOT}`]);

  console.log("Create production build images");
  await runCommand(["bin/dcp-prod", "build", "client", "server"]);

  console.log("Collect build artifacts");
  await runCommand([
    "bin/dcp-prod",
    "run",
    "--rm",

    /**
     * Note: This volume is used in the below inline shell command string as
     * the destination for the archived build `dist` directory.
     * */
    `--volume=${ARTIFACT_ROOT}:/artifacts`,

    "client",

    /**
     * Note: This depends on the dcp-prod version of the image setting the
     * final workdir to the directory from which artifacts should be extracted.
     * For example. if the build artifacts are written to `/code/app/dist` the
     * workdir should be set to `/code/app/dist`.
     *
     * 1. Create an archive of the dist directory named `client.tar`
     * 2. Move the archived file to the mounted /artifacts host-bind volume
     * 3. Ensure that the host user is the owner of the /artifacts directory
     * */
    `sh -c "cd dist; tar -cvf client.tar .; cp client.tar /artifacts; chown -R $(id -u):$(id -g) /artifacts;"`,
  ]);

  console.log("Unpacking archive");
  await runCommand(["mkdir", "-p", resolve(ARTIFACT_ROOT, "client")]);
  await runCommand([
    "tar",
    "-xvf",
    resolve(ARTIFACT_ROOT, "client.tar"),
    "--directory",
    resolve(ARTIFACT_ROOT, "client"),
  ]);

  console.log("Upload artifacts to CDN");
  await uploadDirectory(resolve(ARTIFACT_ROOT, "client"));

  console.log("Uploading static assets to CDN");
  await uploadDirectory(resolve(__dirname, "..", "assets"));

  console.log("Building server script");
  await runCommand([
    "bin/dcp-prod",
    "run",
    "--rm",
    `--volume=${ARTIFACT_ROOT}:/artifacts`,
    "server",
    `sh -c "cd dist; tar -cvf server.tar .; cp server.tar /artifacts; chown -R $(id -u):$(id -g) /artifacts;"`,
  ]);

  console.log("Unpacking server archive");
  await runCommand(["mkdir", "-p", resolve(ARTIFACT_ROOT, "server")]);
  await runCommand([
    "tar",
    "-xvf",
    resolve(ARTIFACT_ROOT, "server.tar"),
    "--directory",
    resolve(ARTIFACT_ROOT, "server"),
  ]);

  console.log("Adding server static files to unpacked archive before sync");
  await runCommand([
    "cp",
    "projects/server-app/.nvmrc",
    "projects/server-app/.npmrc",
    "projects/server-app/.env",
    resolve(ARTIFACT_ROOT, "server"),
  ]);

  console.log("Syncing server files");
  await runCommand([
    /**
     * Note: this assumes that the machine being deployed from has their
     * public SSH key in the remote host's authorized_keys.
     *
     * rsync -e "ssh -i ~/.ssh/id_rsa.pub" -ap dist/server nodejs@143.110.152.162:~
     * */
    `rsync -e "ssh -i ${process.env.SSH_KEY_PATH}"`,
    "--verbose --stats --compress --archive --human-readable -P",
    `-ap ${resolve(ARTIFACT_ROOT, "server")}`,
    `${process.env.SERVER_SSH_ADDRESS}:~`,
  ]);

  console.log("Done!");
})();
