import type { FastifyInstance } from "fastify";

export const healthRoute = async (app: FastifyInstance): Promise<void> => {
  app.get("/api/health", async () => ({ status: "ok" }));
};
