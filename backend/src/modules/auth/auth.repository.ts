import { Role } from "@prisma/client";

import { prisma } from "../../config/database.js";

export class AuthRepository {
  public async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  public async createCustomer(email: string, passwordHash: string) {
    return prisma.user.create({
      data: {
        email,
        passwordHash,
        role: Role.CUSTOMER,
      },
    });
  }
}
