import type { FastifyInstance } from "fastify";

import { authenticate } from "../auth/auth.middleware.js";
import { CartController } from "./cart.controller.js";
import { CartRepository } from "./cart.repository.js";
import {
  addCartItemSchema,
  applyPromoSchema,
  deleteCartItemSchema,
  getCartSchema,
  updateCartItemSchema,
} from "./cart.schema.js";
import { CartService } from "./cart.service.js";
import type {
  AddCartItemBody,
  ApplyPromoBody,
  CartItemParams,
  UpdateCartItemBody,
} from "./cart.types.js";

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

  app.patch<{ Params: CartItemParams; Body: UpdateCartItemBody }>(
    "/items/:id",
    { schema: updateCartItemSchema, preHandler: authenticate },
    cartController.updateItem,
  );

  app.delete<{ Params: CartItemParams }>(
    "/items/:id",
    { schema: deleteCartItemSchema, preHandler: authenticate },
    cartController.deleteItem,
  );

  app.post<{ Body: ApplyPromoBody }>(
    "/apply-promo",
    { schema: applyPromoSchema, preHandler: authenticate },
    cartController.applyPromo,
  );
};
