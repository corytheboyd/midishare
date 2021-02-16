module.exports = {
  apps: [
    {
      name: "server",
      interpreter: "./node_modules/.bin/ts-node",
      args: "run",
      script: "src/index.ts",
      watch: ["./src/**/*", "/code/common/dist/**/*", "/db/migrations/**/*"],
      env_development: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
