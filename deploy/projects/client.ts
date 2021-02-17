import { resolve } from "path";
import { runCommand } from "../lib/runCommand";
import { ARTIFACT_ROOT } from "../index";
import { uploadDirectory } from "../lib/cdn/uploadDirectory";

(async () => {
  process.chdir(resolve(__dirname, "../.."));

  console.log("Cleanup build artifacts");
  await runCommand([`rm -rf ${ARTIFACT_ROOT}`, `mkdir ${ARTIFACT_ROOT}`]);

  console.log("Create production build images");
  await runCommand(["bin/dcp-prod build", "client"]);

  console.log("Collect build artifacts");
  await runCommand([
    "bin/dcp-prod run",
    "--rm",
    `--volume=${ARTIFACT_ROOT}:/artifacts`,
    "client",
    `sh -c "cd dist; tar -cvf client.tar .; cp client.tar /artifacts; chown -R $(id -u):$(id -g) /artifacts;"`,
  ]);

  console.log("Unpacking archive");
  await runCommand(["mkdir", "-p", resolve(ARTIFACT_ROOT, "client")]);
  await runCommand([
    "tar -xvf",
    resolve(ARTIFACT_ROOT, "client.tar"),
    "--directory",
    resolve(ARTIFACT_ROOT, "client"),
  ]);

  console.log("Upload artifacts to CDN");
  await uploadDirectory(resolve(ARTIFACT_ROOT, "client"));

  console.log("Uploading static assets to CDN");
  await uploadDirectory(resolve(__dirname, "../..", "assets"));
})();
