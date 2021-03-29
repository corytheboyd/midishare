import { Application, Router } from "./deps.ts";
import { cors } from "./middleware/cors.ts";

const router = new Router();

router.get("/api/v1/profiles/me", (context) => {
  context.response.status = 200;
  context.response.body = {
    foo: "bar",
  };
});

/**
 * TODO
 * -[ ] /api/v1/* routes, implementations
 * -[ ] wss: read args, authenticate, upgrade
 * -[ ] anonymous user id cookie support
 * -[x] cors configuration
 * -[ ] express helmet, default security measures
 * -[ ] sqlite migrate/connect
 * -[ ] _health check endpoint
 * -[ ] dotenv read (development only)
 * -[ ] auth0 integration
 * -[ ] sentry integration
 * -[ ] sentry X-Sentry-Error-ID middleware at end of chain
 * */
const app = new Application();

app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening on http://localhost:3000");
await app.listen({ port: 3000 });
console.log("Server closed");
