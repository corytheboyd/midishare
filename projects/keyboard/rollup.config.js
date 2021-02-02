import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
    preserveModules: true,
  },
  watch: {
    clearScreen: false,
  },
  external: [
    "react",
    "react-dom",

    // This matches both the main three import as well as the
    // three/examples imports
    /^three(?:\/.*)?$/,
  ],
  plugins: [
    nodeResolve({ moduleDirectories: ["node_modules"] }),
    commonjs(),
    typescript(),
  ],
};
