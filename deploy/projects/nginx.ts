import { resolve } from "path";
import { runCommand } from "../lib/runCommand";
import { ARTIFACT_ROOT } from "../index";
import { sendToServer } from "../lib/sendToServer";
import { execOnServer } from "../lib/execOnServer";

(async () => {
  // Run everything from the project root directory
  process.chdir(resolve(__dirname, "../.."));

  console.log("Cleanup build artifacts...");
  await runCommand([`rm -rf ${resolve(ARTIFACT_ROOT, "nginx")}`]);
  await runCommand([`mkdir -p ${resolve(ARTIFACT_ROOT, "nginx")}`]);

  console.log("Create production build image...");
  await runCommand(["bin/dcp-prod build", "nginx"]);

  console.log("Writing configuration files to dist...");
  await runCommand([
    "bin/dcp-prod",
    "run",
    "--rm",
    `--volume=${resolve(ARTIFACT_ROOT, "nginx")}:/artifacts`,
    "nginx",
    `sh -c "cp -R /etc/nginx/conf.d /etc/nginx/sites-available /etc/nginx/nginx.conf /artifacts ; chown -R $(id -u):$(id -g) /artifacts"`,
  ]);

  console.log("Syncing configuration files to host...");
  await sendToServer(
    resolve(ARTIFACT_ROOT, "nginx"),
    "/etc/",
    process.env.NGINX_USER_ADDRESS
  );

  console.log("Verifying configuration on host...");
  await execOnServer(["nginx -t"], process.env.NGINX_USER_ADDRESS);

  console.log("Restarting nginx on host...");
  await execOnServer(["service nginx restart"], process.env.NGINX_USER_ADDRESS);
})();
