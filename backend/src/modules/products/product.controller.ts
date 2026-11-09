import type { FastifyReply, FastifyRequest } from "fastify";

import type { ProductService } from "./product.service.js";
import type { ProductInput, ProductParams, ProductQuery } from "./product.types.js";

export class ProductController {
  public constructor(private readonly productService: ProductService) {}

  public findMany = async (
    request: FastifyRequest<{ Querystring: ProductQuery }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const result = await this.productService.findMany(request.query);
    await reply.status(200).send(result);
  };

  public create = async (
    request: FastifyRequest<{ Body: ProductInput }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const product = await this.productService.create(request.body);
    await reply.status(201).send(product);
  };

  public update = async (
    request: FastifyRequest<{ Params: ProductParams; Body: ProductInput }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const product = await this.productService.update(request.params.id, request.body);
    await reply.status(200).send(product);
  };

  public delete = async (
    request: FastifyRequest<{ Params: ProductParams }>,
    reply: FastifyReply,
  ): Promise<void> => {
    await this.productService.delete(request.params.id);
    await reply.status(204).send();
  };
}
