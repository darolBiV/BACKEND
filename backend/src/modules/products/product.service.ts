import { AppError } from "../../errors/app-error.js";
import type { ProductCache } from "./product.cache.js";
import type { ProductRepository } from "./product.repository.js";
import type { ProductListResult, ProductQuery } from "./product.types.js";

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
      items: items.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        rating: product.rating,
        images: product.images,
        stock_quantity: product.stockQuantity,
        created_at: product.createdAt.toISOString(),
      })),
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
}
