const { browser } = require("@bugsnag/source-maps");
const { resolve } = require("path");

(async () => {
  const config = {
    apiKey: "acdecfdca0546bbd2ea06683ef2754be",
    appVersion: process.env.GIT_REV,
    directory: "/usr/share/nginx/html",
    overwrite: true,
  };
  console.log("Uploading source maps to Bugsnag", config);
  await node.uploadMultiple(config);
})();
