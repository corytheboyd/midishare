import { resolve } from "path";
import { config } from "dotenv";

config({
  path: resolve(__dirname, ".env"),
});

export const ARTIFACT_ROOT = resolve(__dirname, "..", "dist");
