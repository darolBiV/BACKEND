import type { FastifyInstance } from "fastify";

import { ProductController } from "./product.controller.js";
import { ProductRepository } from "./product.repository.js";
import { productListSchema } from "./product.schema.js";
import { ProductService } from "./product.service.js";
import type { ProductQuery } from "./product.types.js";

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

export const productRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get<{ Querystring: ProductQuery }>(
    "/",
    { schema: productListSchema },
    productController.findMany,
  );
};
