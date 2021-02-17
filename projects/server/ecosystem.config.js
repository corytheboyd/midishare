// Note: only using this on production
module.exports = {
  apps: [
    {
      name: "server",
      interpreter: "./node_modules/.bin/ts-node",
      script: "src/index.ts",
      watch: ["src/**/*", "/db/migrations/**/*", "/code/common/**/*"],
      env: {
        NODE_ENV: "development",
        ADDRESS: "server",
        PORT: "4001",
        BASE_URL: "https://localhost:4000",
        CLIENT_URL: "https://localhost:3000",
        SQLITE_DATABASE: "/home/node/db/database.db",
        DB_MIGRATIONS_PATH: "/home/node/db/migrations",
      },
      env_production: {
        NODE_ENV: "production",
        ADDRESS: "127.0.0.1",
        PORT: "4001",
        BASE_URL: "https://api.midishare.app",
        CLIENT_URL: "https://midishare.app",
        SQLITE_DATABASE: "/home/node/db/database.db",
        DB_MIGRATIONS_PATH: "/home/node/db/migrations",
      },
    },
  ],
};
