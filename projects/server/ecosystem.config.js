// Note: only using this on production
module.exports = {
  apps: [
    {
      name: "server",
      script: "index.js",
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
  deploy: {
    production: {
      user: process.env.DEPLOY_SSH_USER,
      host: [process.env.DEPLOY_SSH_HOST],
      ref: "origin/rewrite",
      repo: "git@github.com:corytheboyd/midishare.git",
      path: "/var/www/midishare",
      "pre-deploy-local": "",
      "post-deploy": "pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
