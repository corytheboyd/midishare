import { resolve } from "path";
import { runCommand } from "../lib/runCommand";
import { ARTIFACT_ROOT } from "../index";
import { sendToServer } from "../lib/sendToServer";
import { execOnServer } from "../lib/execOnServer";

const DIST_FILE = "server.tgz";

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

  console.log("Sending dist to server...");
  await execOnServer(["mkdir -p /home/node/midishare/dist/"]);
  await sendToServer(
    resolve(ARTIFACT_ROOT, `server/${DIST_FILE}`),
    "/home/node/midishare/dist/"
  );

  console.log("Unpacking dist on server...");
  await execOnServer([
    `cd /home/node/midishare/dist/ ; tar -xvf ${DIST_FILE} ; rm ${DIST_FILE}`,
  ]);

  console.log("Sending .env to server...");
  await sendToServer(
    resolve(__dirname, "../../projects/server/.env.production"),
    "/home/node/midishare/"
  );

  console.log("Sending db to server....");
  await execOnServer(["mkdir -p /home/node/midishare/db/migrations/"]);
  await sendToServer(
    resolve(__dirname, "../../db/migrations"),
    "/home/node/midishare/db/"
  );

  console.log("Deploying and restarting server with PM2...");
  await runCommand(["cd projects/server ;", "npm run deploy -- --force"]);
})();
