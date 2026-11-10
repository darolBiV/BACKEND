import type { Product } from "@prisma/client";

import { AppError } from "../../errors/app-error.js";
import type { ProductCache } from "./product.cache.js";
import type { ProductRepository } from "./product.repository.js";
import type {
  ProductInput,
  ProductListItem,
  ProductListResult,
  ProductQuery,
} from "./product.types.js";

export class ProductService {
  public constructor(
    private readonly productRepository: ProductRepository,
    private readonly productCache: ProductCache,
  ) {}

  public async findMany(query: ProductQuery): Promise<ProductListResult> {
    if (
      query.min_price !== undefined &&
      query.max_price !== undefined &&
      query.min_price > query.max_price
    ) {
      throw new AppError(400, "min_price cannot be greater than max_price");
    }

    const cached = await this.productCache.get(query);

    if (cached !== null) {
      return cached;
    }

    const { items, total } = await this.productRepository.findMany(query);

    const result: ProductListResult = {
      items: items.map((product) => this.serialize(product)),
      meta: {
        total_items: total,
        total_pages: Math.ceil(total / query.limit),
        current_page: query.page,
        limit: query.limit,
      },
    };

    await this.productCache.set(query, result);

    return result;
  }

  public async create(input: ProductInput): Promise<ProductListItem> {
    const product = await this.productRepository.create(input);
    await this.productCache.invalidate();

    return this.serialize(product);
  }

  public async update(id: number, input: ProductInput): Promise<ProductListItem> {
    await this.ensureExists(id);

    const product = await this.productRepository.update(id, input);
    await this.productCache.invalidate();

    return this.serialize(product);
  }

  public async delete(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.productRepository.delete(id);
    await this.productCache.invalidate();
  }

  private async ensureExists(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError(404, "Product not found");
    }
  }

  private serialize(product: Product): ProductListItem {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: Number(product.price),
      rating: product.rating,
      images: product.images,
      stock_quantity: product.stockQuantity,
      created_at: product.createdAt.toISOString(),
    };
  }
}
