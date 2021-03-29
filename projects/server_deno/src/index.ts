import { serve } from "./deps.ts";

const server = serve({ port: 3000 });
console.log("Server running");

for await (const request of server) {
  request.respond({ status: 200, body: "A-OK" });
}
