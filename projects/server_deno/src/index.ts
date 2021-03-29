import { Application } from "./deps.ts";

const app = new Application();

app.use((context) => {
  context.response.body = "yeet";
});

app.listen({ port: 3000 });
