import ncc from "@vercel/ncc";
import { resolve } from "path";

// TODO not sure if this was a good idea.. was thinking of using it to
//  gracefully start a server once the build is finished, but it's a big
//  complex..

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
  process.send!("ready");
});

compiler.rebuild(() => {
  console.debug("Rebuild triggered...");
  incrementalBuildStartTime = new Date().getTime();
});
