import ncc from "@vercel/ncc";
import { resolve } from "path";

const compiler = ncc(resolve(__dirname, "index.ts"), {
  sourceMap: true,
  watch: true,
  cache: process.env.NCC_CACHE_PATH,
  v8cache: true,
});

const initialBuildStartTime = new Date().getTime();
let incrementalBuildStartTime: number;

compiler.handler(({ err }) => {
  if (err) {
    console.error("Build error!");
    console.error(err);
    return;
  }

  let elapsed: number;
  if (incrementalBuildStartTime) {
    elapsed = new Date().getTime() - incrementalBuildStartTime;
  } else {
    elapsed = new Date().getTime() - initialBuildStartTime;
  }

  console.log(`Build finished. ${elapsed}(S)`);
});

compiler.rebuild(() => {
  console.debug("Rebuild triggered...");
  incrementalBuildStartTime = new Date().getTime();
});
