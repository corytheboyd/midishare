const { node } = require("@bugsnag/source-maps");
const { resolve } = require("path");

(async () => {
  const config = {
    apiKey: "bf9d63908437155509e0c62d25d64d69",
    appVersion: process.env.GIT_REV,
    directory: resolve(__dirname, "../dist"),
    overwrite: true,
    projectRoot: resolve(__dirname, "../dist"),
  };
  console.log("Uploading source maps to Bugsnag", config);
  await node.uploadMultiple(config);
})();
