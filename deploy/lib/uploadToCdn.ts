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
  host: process.env.BUNNY_FTP_HOST,
  port: parseInt(process.env.BUNNY_FTP_PORT, 10),
  user: process.env.BUNNY_FTP_USERNAME,
  password: process.env.BUNNY_FTP_PASSWORD,
});
