import type { FastifyInstance } from "fastify";

export const healthRoute = async (app: FastifyInstance): Promise<void> => {
  app.get(
    "/api/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Check application status",
        response: {
          200: {
            type: "object",
            required: ["status"],
            properties: {
              status: { type: "string", enum: ["ok"] },
            },
          },
        },
      },
    },
    async () => ({ status: "ok" }),
  );
};
