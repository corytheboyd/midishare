import { spawn } from "child_process";
import { resolve } from "path";

process.chdir("..");

console.log("Creating base images for deployment tasks...");

const task = spawn("bin/dcp-prod build client", {
  shell: true,
});
task.stdout.pipe(process.stdout);
task.stderr.pipe(process.stderr);

task.on("close", (code) => {
  if (code !== 0) {
    console.error("Previous task exited with non-zero code");
    process.exit(code);
  } else {
    console.log("Success!");
  }

  console.log("Running some more...");
  const command = [
    "bin/dcp-prod",
    "run",
    "--rm",
    `--volume=${resolve(__dirname, "tmp")}:/artifacts`,
    "client",
    'sh -c "cp -R dist /artifacts; chown -R $(id -u):$(id -g) /artifacts"',
  ];
  const task = spawn(command.join(" "), {
    shell: true,
  });
  task.stdout.pipe(process.stdout);
  task.stderr.pipe(process.stderr);

  task.on("close", (code) => {
    if (code !== 0) {
      console.error("Previous task exited with non-zero code");
      process.exit(code);
    } else {
      console.log("Success!");
    }
  });
});
