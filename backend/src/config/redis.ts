import { createClient } from "redis";

import { env } from "./env.js";

export const redis = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 200, 5000),
  },
});

// Managed Redis providers close idle connections; without a listener the
// emitted "error" event would crash the process instead of reconnecting.
redis.on("error", (error: unknown) => {
  console.error("Redis client error:", error);
});
