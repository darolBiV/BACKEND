import bcrypt from "bcrypt";

import { AppError } from "../../errors/app-error.js";
import type { AuthRepository } from "./auth.repository.js";
import type { RegisterBody, RegisteredUser } from "./auth.types.js";

export class AuthService {
  public constructor(private readonly authRepository: AuthRepository) {}

  public async register(input: RegisterBody): Promise<RegisteredUser> {
    const email = input.email.trim().toLowerCase();
    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(409, "A user with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.authRepository.createCustomer(email, passwordHash);

    return {
      id: user.id,
      email: user.email,
      role: "customer",
      created_at: user.createdAt.toISOString(),
    };
  }
}
