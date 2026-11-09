import type { FastifyReply, FastifyRequest } from "fastify";

import type { AuthService } from "./auth.service.js";
import type { RegisterBody } from "./auth.types.js";

export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  public register = async (
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const user = await this.authService.register(request.body);
    await reply.status(201).send(user);
  };
}
