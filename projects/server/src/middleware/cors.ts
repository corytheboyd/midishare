import { HttpMiddleware } from "../types.ts";

export const cors: HttpMiddleware = (request, response) => {
  const clientUrl = Deno.env.get("CLIENT_URL");
  if (!clientUrl) {
    throw new Error("CLIENT_URL not set");
  }

  response.headers.append("Access-Control-Allow-Credentials", "true");
  response.headers.append("Access-Control-Allow-Origin", clientUrl);
};
