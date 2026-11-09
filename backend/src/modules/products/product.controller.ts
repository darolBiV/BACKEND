import type { FastifyReply, FastifyRequest } from "fastify";

import type { ProductService } from "./product.service.js";
import type { ProductQuery } from "./product.types.js";

export class ProductController {
  public constructor(private readonly productService: ProductService) {}

  public findMany = async (
    request: FastifyRequest<{ Querystring: ProductQuery }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const result = await this.productService.findMany(request.query);
    await reply.status(200).send(result);
  };
}
