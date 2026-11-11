import { AppError } from "../../errors/app-error.js";
import type { CartRepository } from "./cart.repository.js";
import type {
  AddCartItemBody,
  CartResult,
  UpdateCartItemBody,
} from "./cart.types.js";

export class CartService {
  public constructor(private readonly cartRepository: CartRepository) {}

  public async getCart(userId: number): Promise<CartResult> {
    const cart = await this.getOrCreateCart(userId);

    const items = cart.items.map((item) => {
      const price = Number(item.product.price);

      return {
        id: item.id,
        product_id: item.productId,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          title: item.product.title,
          price,
          image: item.product.images[0] ?? "",
          stock_quantity: item.product.stockQuantity,
        },
        line_total: price * item.quantity,
      };
    });

    return {
      id: cart.id,
      items,
      total_price: items.reduce((sum, item) => sum + item.line_total, 0),
    };
  }

  public async addItem(userId: number, input: AddCartItemBody): Promise<CartResult> {
    const product = await this.cartRepository.findProduct(input.product_id);

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    const cart = await this.getOrCreateCart(userId);
    const existingItem = await this.cartRepository.findItem(cart.id, product.id);
    const quantity = (existingItem?.quantity ?? 0) + input.quantity;

    if (quantity > product.stockQuantity) {
      throw new AppError(400, "Requested quantity exceeds available stock");
    }

    await this.cartRepository.saveItem(cart.id, product.id, quantity);

    return this.getCart(userId);
  }

  public async updateItem(
    userId: number,
    itemId: number,
    input: UpdateCartItemBody,
  ): Promise<CartResult> {
    const item = await this.cartRepository.findItemByIdForUser(itemId, userId);

    if (!item) {
      throw new AppError(404, "Cart item not found");
    }

    if (input.quantity > item.product.stockQuantity) {
      throw new AppError(400, "Requested quantity exceeds available stock");
    }

    await this.cartRepository.updateItemQuantity(item.id, input.quantity);

    return this.getCart(userId);
  }

  public async deleteItem(userId: number, itemId: number): Promise<CartResult> {
    const item = await this.cartRepository.findItemByIdForUser(itemId, userId);

    if (!item) {
      throw new AppError(404, "Cart item not found");
    }

    await this.cartRepository.deleteItem(item.id);

    return this.getCart(userId);
  }

  private async getOrCreateCart(userId: number) {
    const cart = await this.cartRepository.findByUserId(userId);
    return cart ?? this.cartRepository.createForUser(userId);
  }
}
