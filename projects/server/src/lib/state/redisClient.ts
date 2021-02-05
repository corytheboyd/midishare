import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL as string,
});
