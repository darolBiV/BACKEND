import type { RedisClientType } from "redis";

import type { ProductListResult, ProductQuery } from "./product.types.js";

const PRODUCT_CACHE_PREFIX = "products:list:";
const PRODUCT_CACHE_TTL_SECONDS = 90;

export class ProductCache {
  public constructor(private readonly redis: RedisClientType) {}

  public async get(query: ProductQuery): Promise<ProductListResult | null> {
    const key = this.createKey(query);
    const cached = await this.redis.get(key);

    if (cached === null) {
      return null;
    }

    return JSON.parse(cached) as ProductListResult;
  }

  public async set(query: ProductQuery, result: ProductListResult): Promise<void> {
    await this.redis.set(this.createKey(query), JSON.stringify(result), {
      EX: PRODUCT_CACHE_TTL_SECONDS,
    });
  }

  public async invalidate(): Promise<void> {
    for await (const keys of this.redis.scanIterator({
      MATCH: `${PRODUCT_CACHE_PREFIX}*`,
      COUNT: 100,
    })) {
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
    }
  }

  private createKey(query: ProductQuery): string {
    const parameters = {
      page: query.page,
      limit: query.limit,
      search: query.search,
      min_price: query.min_price,
      max_price: query.max_price,
      min_rating: query.min_rating,
      sort_by: query.sort_by,
      order: query.order,
    };

    return `${PRODUCT_CACHE_PREFIX}${JSON.stringify(parameters)}`;
  }
}
