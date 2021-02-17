import { resolve } from "path";
import { runCommand } from "../lib/runCommand";
import { ARTIFACT_ROOT } from "../index";
import { sendToServer } from "../lib/sendToServer";
import { execOnServer } from "../lib/execOnServer";

const DIST_FILE = "dist.tgz";

(async () => {
  // Run everything from the project root directory
  process.chdir(resolve(__dirname, "../.."));

  console.log("Cleanup build artifacts...");
  await runCommand([`rm -rf ${resolve(ARTIFACT_ROOT, "server")}`]);
  await runCommand([`mkdir -p ${resolve(ARTIFACT_ROOT, "server")}`]);

  console.log("Create production build image...");
  await runCommand(["bin/dcp-prod build", "server"]);

  console.log("Building dist....");
  await runCommand([
    "bin/dcp-prod",
    "run",
    "--rm",
    `--volume=${resolve(ARTIFACT_ROOT, "server")}:/artifacts`,
    "server",
    `sh -c "cd dist && tar -zcvf ../${DIST_FILE} . && cd - ; cp ${DIST_FILE} /artifacts ; chown -R $(id -u):$(id -g) /artifacts"`,
  ]);

  console.log("Sending dist to host...");
  await sendToServer(resolve(ARTIFACT_ROOT, "server"), "/home/node/dist");

  console.log("Unpacking dist on host...");
  await execOnServer([
    `tar -xvf /home/node/dist/server/${DIST_FILE} ; rm /home/node/dist/server/${DIST_FILE}`,
  ]);

  console.log("Sending .env to host...");
  await sendToServer(
    resolve(__dirname, "../../projects/server/.env.production"),
    "/home/node/"
  );

  // TODO honestly, this doesn't do anything anymore lol. We're completely
  //  handling it on our own anyway. Remove and just run the post deploy
  //  commands manually
  console.log("Running PM2 deployment...");
  await runCommand([
    `cd ${resolve(__dirname, "../../projects/server")} ; npm run deploy`,
  ]);
})();
