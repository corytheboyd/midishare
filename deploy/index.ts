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
  const task = spawn(command.join(" "), {
    shell: true,
  });

  task.stdout.pipe(process.stdout);
  task.stderr.pipe(process.stderr);

  return new Promise((resolve) => {
    task.on("close", (code) => {
      if (code !== 0) {
        console.error(`Command exited with non-zero code`);
        process.exit(code);
      } else {
        console.log("Command exited successfully");
      }
      resolve();
    });
  });
}

(async () => {
  // console.log("Cleanup build artifacts");
  // await runCommand([`rm -rf ${ARTIFACT_ROOT}`, `mkdir ${ARTIFACT_ROOT}`]);

  console.log("Create production build artifacts");
  await runCommand(["bin/dcp-prod", "build", "client"]);

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

  console.log("Unpack archived artifacts");
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

  console.log("Done!");
})();
