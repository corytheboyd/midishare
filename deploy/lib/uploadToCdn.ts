import { resolve } from "path";
import * as Client from "ftp";
import { opendir } from "fs/promises";

if (!process.argv[2]) {
  console.error("Usage: npm run deploy [path to dist]");
  process.exit(1);
}
const rootPath = resolve(process.argv[2]);

const client = new Client();

client.on("ready", async () => {
  console.log("ready");

  const dir = await opendir(rootPath);
  for await (const dirent of dir) {
    console.log(dirent.name, dirent.isDirectory());
  }

  client.end();
});

client.connect({
  host: "la.storage.bunnycdn.com",
  port: 21,
  user: "midishare",
  password: "81d01efe-bb74-4e4d-84c579ec9750-7558-430d",
});
