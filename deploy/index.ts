import { spawn } from "child_process";
import { resolve } from "path";

const ARTIFACT_ROOT = resolve(__dirname, "..", "dist");

// Run everything from the project root directory
process.chdir(resolve(__dirname, ".."));

async function runCommand(name: string, command: string[]): Promise<void> {
  console.log(`Run command: ${name}`);

  const task = spawn(command.join(" "), {
    shell: true,
  });

  task.stdout.pipe(process.stdout);
  task.stderr.pipe(process.stderr);

  return new Promise((resolve) => {
    task.on("close", (code) => {
      if (code !== 0) {
        console.error(`Command exited with non-zero code: ${name}`);
        process.exit(code);
      } else {
        console.log("Command exited successfully");
      }
      resolve();
    });
  });
}

(async () => {
  await runCommand("Cleanup build artifacts", [
    `rm -rf ${ARTIFACT_ROOT}`,
    `mkdir ${ARTIFACT_ROOT}`,
  ]);

  await runCommand("Create production build artifacts", [
    "bin/dcp-prod",
    "build",
    "client",
  ]);

  await runCommand("Collect build artifacts", [
    "bin/dcp-prod",
    "run",
    "--rm",
    `--volume=${ARTIFACT_ROOT}:/artifacts`,
    "client",
    'sh -c "tar -cvf client.tar dist; cp client.tar /artifacts; chown -R $(id -u):$(id -g) /artifacts;"',
  ]);
})();
