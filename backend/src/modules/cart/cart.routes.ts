import type { FastifyInstance } from "fastify";

import { authenticate } from "../auth/auth.middleware.js";
import { CartController } from "./cart.controller.js";
import { CartRepository } from "./cart.repository.js";
import { addCartItemSchema, getCartSchema } from "./cart.schema.js";
import { CartService } from "./cart.service.js";
import type { AddCartItemBody } from "./cart.types.js";

const cartRepository = new CartRepository();
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

export const cartRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get(
    "/",
    { schema: getCartSchema, preHandler: authenticate },
    cartController.getCart,
  );

  app.post<{ Body: AddCartItemBody }>(
    "/items",
    { schema: addCartItemSchema, preHandler: authenticate },
    cartController.addItem,
  );
};
