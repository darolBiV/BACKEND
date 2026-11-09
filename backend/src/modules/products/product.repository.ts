import type { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import type { ProductInput, ProductQuery } from "./product.types.js";

export class ProductRepository {
  public async findMany(query: ProductQuery) {
    const where: Prisma.ProductWhereInput = {
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
      price: {
        ...(query.min_price !== undefined ? { gte: query.min_price } : {}),
        ...(query.max_price !== undefined ? { lte: query.max_price } : {}),
      },
      ...(query.min_rating !== undefined ? { rating: { gte: query.min_rating } } : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [query.sort_by]: query.order,
    };

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total };
  }

  public async findById(id: number) {
    return prisma.product.findUnique({ where: { id } });
  }

  public async create(input: ProductInput) {
    return prisma.product.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        rating: input.rating,
        images: input.images,
        stockQuantity: input.stock_quantity,
      },
    });
  }

  public async update(id: number, input: ProductInput) {
    return prisma.product.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        rating: input.rating,
        images: input.images,
        stockQuantity: input.stock_quantity,
      },
    });
  }

  public async delete(id: number): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
