import { serve } from "./deps.ts";

/**
 * TODO
 * -[ ] /api/v1/* routes, implementations
 * -[ ] wss: read args, authenticate, upgrade
 * -[ ] anonymous user id cookie support
 * -[ ] cors configuration
 * -[ ] express helmet, default security measures
 * -[ ] sqlite migrate/connect
 * -[ ] _health check endpoint
 * -[ ] dotenv read (development only)
 * -[ ] auth0 integration
 * -[ ] sentry integration
 * -[ ] sentry X-Sentry-Error-ID middleware at end of chain
 * */
const server = serve({ port: 3000 });
console.log("Listening on http://localhost:3000");

for await (const request of server) {
  request.respond({ status: 200, body: "yeet" });
}
