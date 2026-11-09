import type { FastifyInstance } from "fastify";

import { AuthController } from "./auth.controller.js";
import { AuthRepository } from "./auth.repository.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { AuthService } from "./auth.service.js";
import type { LoginBody, RegisterBody } from "./auth.types.js";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

export const authRoutes = async (app: FastifyInstance): Promise<void> => {
  app.post<{ Body: RegisterBody }>(
    "/register",
    { schema: registerSchema },
    authController.register,
  );

  app.post<{ Body: LoginBody }>(
    "/login",
    { schema: loginSchema },
    authController.login,
  );
};
