import { serve, Response } from "./deps.ts";
import { cors } from "./middleware/cors.ts";

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
  const response = {
    headers: new Headers(),
  };

  cors(request, response);

  request.respond(response);
}
