import type { FastifyReply, FastifyRequest } from "fastify";

import type { AuthTokenPayload } from "../auth/auth.types.js";
import type { CartService } from "./cart.service.js";
import type { AddCartItemBody } from "./cart.types.js";

export class CartController {
  public constructor(private readonly cartService: CartService) {}

  public getCart = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const user = request.user as AuthTokenPayload;
    const cart = await this.cartService.getCart(user.id);
    await reply.status(200).send(cart);
  };

  public addItem = async (
    request: FastifyRequest<{ Body: AddCartItemBody }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const user = request.user as AuthTokenPayload;
    const cart = await this.cartService.addItem(user.id, request.body);
    await reply.status(200).send(cart);
  };
}
