import { Middleware } from "../deps.ts";

export const cors: () => Middleware = () => (ctx) => {
  const clientUrl = Deno.env.get("CLIENT_URL");
  if (!clientUrl) {
    throw new Error("CLIENT_URL not set");
  }

  ctx.response.headers.append("Access-Control-Allow-Credentials", "true");
  ctx.response.headers.append("Access-Control-Allow-Origin", clientUrl);
};
