import type { FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "../../errors/app-error.js";
import type { AuthTokenPayload } from "./auth.types.js";

export const authenticate = async (
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> => {
  try {
    await request.jwtVerify<AuthTokenPayload>();
  } catch {
    throw new AppError(401, "Unauthorized");
  }
};

export const authorizeAdmin = async (
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> => {
  const user = request.user as AuthTokenPayload;

  if (user.role !== "admin") {
    throw new AppError(403, "Forbidden");
  }
};
