import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
  },
  watch: {
    clearScreen: false,
  },
  external: ["react", "react-dom", "three"],
  plugins: [commonjs(), nodeResolve(), typescript()],
};
