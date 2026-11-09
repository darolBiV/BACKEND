import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";

import { prisma } from "./config/database.js";
import { env } from "./config/env.js";
import { AppError } from "./errors/app-error.js";
import { productRoutes } from "./modules/products/product.routes.js";
import { healthRoute } from "./routes/health.route.js";

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: env.NODE_ENV !== "test",
  });

  await prisma.$connect();

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  await app.register(cors, {
    origin: env.CORS_ORIGIN,
  });

  app.setNotFoundHandler(async (_request, reply) => {
    return reply.status(404).send({ message: "Route not found" });
  });

  app.setErrorHandler(async (error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message });
    }

    if (typeof error === "object" && error !== null && "validation" in error) {
      return reply.status(400).send({ message: "Invalid request parameters" });
    }

    request.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  });

  await app.register(healthRoute);
  await app.register(productRoutes, { prefix: "/api/products" });

  return app;
};
