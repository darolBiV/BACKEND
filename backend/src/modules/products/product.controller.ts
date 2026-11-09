import type { FastifyReply, FastifyRequest } from "fastify";

import type { ProductService } from "./product.service.js";
import type { ProductStorage } from "./product.storage.js";
import type { ProductInput, ProductParams, ProductQuery } from "./product.types.js";

export class ProductController {
  public constructor(
    private readonly productService: ProductService,
    private readonly productStorage: ProductStorage,
  ) {}

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

  public uploadImage = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const file = await request.file();

    if (!file) {
      await reply.status(400).send({ message: "Image file is required" });
      return;
    }

    const url = await this.productStorage.upload(file);
    await reply.status(201).send({ url });
  };
}
