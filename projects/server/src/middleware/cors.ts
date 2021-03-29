import { Middleware } from "../deps.ts";

export const cors: () => Middleware = () => (context, next) => {
  const clientUrl = Deno.env.get("CLIENT_URL");
  if (!clientUrl) {
    throw new Error("CLIENT_URL not set");
  }

  context.response.headers.append("Access-Control-Allow-Credentials", "true");
  context.response.headers.append("Access-Control-Allow-Origin", clientUrl);

  next();
};
