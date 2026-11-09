import type { FastifyInstance } from "fastify";

import { redis } from "../../config/redis.js";
import { authenticate, authorizeAdmin } from "../auth/auth.middleware.js";
import { ProductCache } from "./product.cache.js";
import { ProductController } from "./product.controller.js";
import { ProductRepository } from "./product.repository.js";
import {
  productCreateSchema,
  productDeleteSchema,
  productListSchema,
  productUpdateSchema,
} from "./product.schema.js";
import { ProductService } from "./product.service.js";
import type { ProductInput, ProductParams, ProductQuery } from "./product.types.js";

const productRepository = new ProductRepository();
const productCache = new ProductCache(redis);
const productService = new ProductService(productRepository, productCache);
const productController = new ProductController(productService);

export const productRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get<{ Querystring: ProductQuery }>(
    "/",
    { schema: productListSchema },
    productController.findMany,
  );

  app.post<{ Body: ProductInput }>(
    "/",
    { schema: productCreateSchema, preHandler: [authenticate, authorizeAdmin] },
    productController.create,
  );

  app.put<{ Params: ProductParams; Body: ProductInput }>(
    "/:id",
    { schema: productUpdateSchema, preHandler: [authenticate, authorizeAdmin] },
    productController.update,
  );

  app.delete<{ Params: ProductParams }>(
    "/:id",
    { schema: productDeleteSchema, preHandler: [authenticate, authorizeAdmin] },
    productController.delete,
  );
};
