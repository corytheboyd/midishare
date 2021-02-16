module.exports = {
  apps: [
    {
      name: "server",
      script: "./node_modules/.bin/ts-node src/devServer.ts",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
