import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import helmet from "helmet";
import { api } from "./lib/api/v1";
import { auth, ConfigParams as AuthConfigParams } from "express-openid-connect";
import cors, { CorsOptions } from "cors";
import { Server as WebSocketServer } from "ws";
import cookieParser from "cookie-parser";
import { register } from "./lib/ws/register";
import { ServerResponse } from "http";
import { handleShutdown } from "./lib/handleShutdown";
import { db, dbOpen } from "./lib/state/db";
import { healthCheck } from "./lib/healthCheck";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import { config as dotenvConfig } from "dotenv";
dotenvConfig();

(async () => {
  try {
    await dbOpen;
  } catch (err) {
    console.error("Failed to open sqlite database", err);
    process.kill(process.pid, "SIGTERM");
  }

  try {
    await db.migrate({
      migrationsPath: process.env.SQLITE_MIGRATIONS_PATH,
    });
  } catch (err) {
    console.error("Failed to run database migrations", err);
    process.kill(process.pid, "SIGTERM");
  }
})();

const authConfig: AuthConfigParams = {
  issuerBaseURL: "https://midishare.us.auth0.com",
  clientID: process.env.AUTH0_CLIENT_ID,
  errorOnRequiredAuth: true,
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH_SECRET,
  routes: {
    login: "/auth/login",
    logout: "/auth/logout",
    callback: "/auth/callback",
    postLogoutRedirect: process.env.CLIENT_URL,
  },
  /**
   * After tons of mucking around, realized this is the correct method of
   * overriding the login oidc params. At first, tried adding my own
   * /auth/login middleware to call through to oidc.login({ returnTo }), which
   * was not working as documented for whatever reason.
   * */
  getLoginState: () => {
    return {
      returnTo: process.env.CLIENT_URL,
    };
  },
  /**
   * Function for custom callback handling after receiving tokens and before
   * redirecting This can be used for handling token storage, making userinfo
   * calls, claim validation, etc.
   *
   * If you see an infinite redirect loop after login, look here
   * */
  afterCallback: async (req, res, session) => {
    // TODO we may want to store the session here. might make sense when
    //  revisiting coturn
    return session;
  },
};

const corsConfig: CorsOptions = {
  origin: [
    process.env.CLIENT_URL as string,
    authConfig.issuerBaseURL as string,
  ],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
};

const port = parseInt(process.env.PORT as string, 10);

const app = express() as Express & {
  /**
   * For some reason this is missing from the types. Maybe should contribute
   * to the types hah, but for now leaving it alone.
   *
   * The handle function was seen in the wild in this example:
   * https://github.com/adamjmcgrath/eoidc-testing-example/blob/ws/index.js
   *
   * @todo Add missing types to @types/express
   * */
  handle: (
    req: Request,
    res: Response | ServerResponse,
    handler: () => void
  ) => void;
};

Sentry.init({
  dsn:
    "https://27a122c6e06d470dbf51418ae6c0ba8a@o559557.ingest.sentry.io/5694473",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  release: process.env.GIT_REV || process.env.NODE_ENV,
  environment: process.env.NODE_ENV,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Third-party middlewares
app.use(helmet());
app.use(cors(corsConfig));
app.use(auth(authConfig));
app.use(cookieParser(process.env.AUTH_SECRET as string));

// Application middlewares
app.use("/_health", healthCheck());
app.use("/api/v1", api());

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(req, res) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.header(
    "X-Sentry-Error-ID",
    (res as typeof res & { sentry: string }).sentry
  );
});

const httpServer = createServer(app);

const webSocketServer = new WebSocketServer({
  noServer: true,
});

register(httpServer, webSocketServer, app);

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Listening on http://0.0.0.0:${port}`);
});

/**
 * TODO Expand on this, rethink when doing production
 *
 * TODO Doesn't work with nodemon on server exit, boo.
 *
 * @see https://github.com/remy/nodemon/issues/1705
 * */
process.once("SIGUSR2", async () => {
  console.log("Restart signal received, shutting down");
  try {
    handleShutdown("SIGUSR2");
  } catch (err) {
    console.error("SHUTDOWN HANDLER ERROR", err);
  } finally {
    process.kill(process.pid, "SIGUSR2");
  }
});
