import { resolve } from "path";
import { runCommand } from "./lib/runCommand";
import { sendToServer } from "./lib/sendToServer";
import { ARTIFACT_ROOT } from "./index";

(async () => {
  // Run everything from the project root directory
  process.chdir(resolve(__dirname, ".."));

  console.log("Cleanup build artifacts");
  await runCommand([`rm -rf ${resolve(ARTIFACT_ROOT, "server")}`]);
  await runCommand([`mkdir -p ${resolve(ARTIFACT_ROOT, "server")}`]);

  console.log("Create production build images");
  await runCommand(["bin/dcp-prod build", "server"]);

  console.log("Building server dist....");
  await runCommand([
    "bin/dcp-prod",
    "run",
    "--rm",
    `--volume=${resolve(ARTIFACT_ROOT, "server")}:/artifacts`,
    "server",
    `sh -c "cd dist && tar -zcvf ../dist.tgz . && cd - ; cp dist.tgz /artifacts ; chown -R $(id -u):$(id -g) /artifacts"`,
  ]);

  console.log("Sending server dist to host...");
  await sendToServer(resolve(ARTIFACT_ROOT, "server"), "/home/node/dist");

  console.log("Running PM2 deployment...");
  await runCommand([
    `cd ${resolve(__dirname, "../projects/server")} ; npm run deploy`,
  ]);
})();
