import { resolve } from "path";
import { config } from "dotenv";
import { runCommand } from "./lib/runCommand";

config({
  path: resolve(__dirname, ".env"),
});

export const ARTIFACT_ROOT = resolve(__dirname, "..", "dist");

// (async () => {
//   // Run everything from the project root directory
//   process.chdir(resolve(__dirname, ".."));
//
//   //////////////
//   // COMMON
//   //////////////
//
//   await (async () => {
//     console.log("Cleanup build artifacts");
//     await runCommand([`rm -rf ${ARTIFACT_ROOT}`, `mkdir ${ARTIFACT_ROOT}`]);
//
//     console.log("Create production build images");
//     await runCommand(["bin/dcp-prod build", "client", "server"]);
//   })();
//
//   //////////////
//   // CLIENT
//   //////////////
//
//   // await (async () => {
//   //   console.log("Collect build artifacts");
//   //   await runCommand([
//   //     "bin/dcp-prod",
//   //     "run",
//   //     "--rm",
//   //
//   //     /**
//   //      * Note: This volume is used in the below inline shell command string as
//   //      * the destination for the archived build `dist` directory.
//   //      * */
//   //     `--volume=${ARTIFACT_ROOT}:/artifacts`,
//   //
//   //     "client",
//   //
//   //     /**
//   //      * Note: This depends on the dcp-prod version of the image setting the
//   //      * final workdir to the directory from which artifacts should be extracted.
//   //      * For example. if the build artifacts are written to `/code/app/dist` the
//   //      * workdir should be set to `/code/app/dist`.
//   //      *
//   //      * 1. Create an archive of the dist directory named `client.tar`
//   //      * 2. Move the archived file to the mounted /artifacts host-bind volume
//   //      * 3. Ensure that the host user is the owner of the /artifacts directory
//   //      * */
//   //     `sh -c "cd dist; tar -cvf client.tar .; cp client.tar /artifacts; chown -R $(id -u):$(id -g) /artifacts;"`,
//   //   ]);
//   //
//   //   console.log("Unpacking archive");
//   //   await runCommand(["mkdir", "-p", resolve(ARTIFACT_ROOT, "client")]);
//   //   await runCommand([
//   //     "tar",
//   //     "-xvf",
//   //     resolve(ARTIFACT_ROOT, "client.tar"),
//   //     "--directory",
//   //     resolve(ARTIFACT_ROOT, "client"),
//   //   ]);
//   //
//   //   console.log("Upload artifacts to CDN");
//   //   await uploadDirectory(resolve(ARTIFACT_ROOT, "client"));
//   //
//   //   console.log("Uploading static assets to CDN");
//   //   await uploadDirectory(resolve(__dirname, "..", "assets"));
//   // })();
//
//   console.log("Done!");
// })();
