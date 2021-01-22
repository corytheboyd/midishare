const path = require("path");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    libraryTarget: "commonjs",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
  },
};
