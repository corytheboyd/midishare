import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
    sourcemap: true,
    preserveModules: true,
  },
  watch: {
    clearScreen: false,
  },
  external: [],
  plugins: [
    nodeResolve({ moduleDirectories: ["node_modules"] }),
    commonjs(),
    typescript(),
  ],
};
