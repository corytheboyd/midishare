import express from "express";
import {
  auth,
  ConfigParams as AuthConfigParams,
  RequestContext,
} from "express-openid-connect";
import { createServer, ServerOptions } from "https";
import { readFileSync } from "fs";
import helmet from "helmet";

const authConfig: AuthConfigParams = {
  authRequired: false,
  auth0Logout: true,
  issuerBaseURL: "https://midishare.us.auth0.com",
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH_SECRET,
};

const serverConfig: ServerOptions = {
  cert: readFileSync(process.env.SSL_CERT_PATH as string),
  key: readFileSync(process.env.SSL_KEY_PATH as string),
};

const port = parseInt(process.env.PORT as string, 10);
const address = process.env.ADDRESS as string;

const app = express();
app.use(helmet());
app.use(auth(authConfig));

app.get("/", (req, res) => {
  // TODO revisit.. or don't. Not sure if any amount of TS tomfoolery would
  //  even make this cleaner.
  const request = (req as unknown) as { oidc: RequestContext };

  res.send(request.oidc.isAuthenticated() ? "Logged In" : "Logged Out");
});

const server = createServer(serverConfig, app);
server.listen(port, address, () => {
  console.log(`Listening on https://${address}:${port}`);
});
