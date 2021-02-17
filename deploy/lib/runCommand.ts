import { spawn } from "child_process";

export async function runCommand(command: string[]): Promise<void> {
  const stringCommand = command.join(" ");
  console.debug("RUN COMMAND", stringCommand);

  const task = spawn(stringCommand, {
    shell: true,
    env: process.env,
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
