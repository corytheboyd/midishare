import express from "express";
import { createServer, ServerOptions } from "https";
import { readFileSync } from "fs";
import helmet from "helmet";
import { api } from "./lib/api/v1";
import { auth, ConfigParams as AuthConfigParams } from "express-openid-connect";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import { Server as WebSocketServer } from "ws";

const authConfig: AuthConfigParams = {
  issuerBaseURL: "https://midishare.us.auth0.com",
  clientID: "2rIFY7EvPtPahpILRu657x8Bk0BiXiLf",
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
   * If you see an infinite redirect loop after login, look here.
   * */
  afterCallback: async (req, res, session) => {
    // TODO we may want to store the session here. might make sense when
    //  revisiting coturn
    return session;
  },
};

const serverConfig: ServerOptions = {
  cert: readFileSync(process.env.SSL_CERT_PATH as string),
  key: readFileSync(process.env.SSL_KEY_PATH as string),
};

const corsConfig: CorsOptions = {
  origin: [
    process.env.CLIENT_URL as string,
    authConfig.issuerBaseURL as string,
  ],
  credentials: true,
};

const port = parseInt(process.env.PORT as string, 10);
const address = process.env.ADDRESS as string;

const app = express();

// Third-party middlewares
app.use(morgan("combined"));
app.use(helmet());
app.use(cors(corsConfig));
app.use(auth(authConfig));

// Application middlewares
app.use("/api/v1", api());

const httpServer = createServer(serverConfig, app);

const webSocketServer = new WebSocketServer({
  noServer: true,
});

webSocketServer.on("connection", (ws) => {
  console.debug("CONNECTED");

  ws.on("message", (data) => {
    console.debug("MESSAGE", data);
  });

  const intervalId = setInterval(() => {
    ws.ping(null, false, (error) => {
      if (error) {
        console.debug("PING FAIL, CLOSE CONNECTION");
        ws.close();
        clearInterval(intervalId);
      }
    });
  }, 1000);
});

httpServer.on("upgrade", (req, socket, head) => {
  webSocketServer.handleUpgrade(req, socket, head, (ws) => {
    webSocketServer.emit("connection", ws);
  });
});

httpServer.listen(port, address, () => {
  console.log(`Listening on https://${address}:${port}`);
});
