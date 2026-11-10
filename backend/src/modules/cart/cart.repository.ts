import { prisma } from "../../config/database.js";

const cartInclude = {
  items: {
    include: {
      product: true,
    },
    orderBy: {
      id: "asc" as const,
    },
  },
};

export class CartRepository {
  public async findByUserId(userId: number) {
    return prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  }

  public async createForUser(userId: number) {
    return prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  }

  public async findProduct(productId: number) {
    return prisma.product.findUnique({ where: { id: productId } });
  }

  public async findItem(cartId: number, productId: number) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId, productId },
      },
    });
  }

  public async saveItem(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<void> {
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId, productId },
      },
      create: { cartId, productId, quantity },
      update: { quantity },
    });
  }
}
