import express from "express";
import { createServer, ServerOptions } from "https";
import { readFileSync } from "fs";
import helmet from "helmet";
import { api } from "./lib/api/v1";
import { auth, ConfigParams as AuthConfigParams } from "express-openid-connect";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";

const authConfig: AuthConfigParams = {
  authRequired: false,
  auth0Logout: true,
  issuerBaseURL: "https://midishare.us.auth0.com",
  clientID: "2rIFY7EvPtPahpILRu657x8Bk0BiXiLf",
  baseURL: process.env.BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH_SECRET,
};

const serverConfig: ServerOptions = {
  cert: readFileSync(process.env.SSL_CERT_PATH as string),
  key: readFileSync(process.env.SSL_KEY_PATH as string),
};

const corsConfig: CorsOptions = {
  origin: [
    process.env.CLIENT_ORIGIN as string,
    authConfig.issuerBaseURL as string,
  ],
};

const port = parseInt(process.env.PORT as string, 10);
const address = process.env.ADDRESS as string;

const app = express();

// Third-party middlewares
app.use(helmet());
app.use(cors(corsConfig));
app.use(morgan("combined"));
app.use(auth(authConfig));

// Application middlewares
app.use("/api/v1", api());

const server = createServer(serverConfig, app);
server.listen(port, address, () => {
  console.log(`Listening on https://${address}:${port}`);
});
