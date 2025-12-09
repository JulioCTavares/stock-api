import type { IUserRepository } from "@/infrastructure/repositories/user/user.repository";
import type { IHashStrategy } from "@/infrastructure/hash/hashStrategy";
import { UserEntity } from "@/domain/entities/user.entity";
import { randomUUID } from "crypto";

type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  role?: string;
};

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashStrategy: IHashStrategy
  ) {}

  async create(input: CreateUserInput): Promise<UserEntity> {
    const hashed = await this.hashStrategy.hash(input.password);
    const user = new UserEntity({
      id: randomUUID(),
      username: input.username,
      email: input.email,
      password: hashed,
      role: input.role ?? "user",
      createdAt: new Date(),
      updatedAt: new Date()
    } as UserEntity);

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async list(params?: { limit?: number; offset?: number }): Promise<UserEntity[]> {
    
    const repo = this.userRepository as IUserRepository & {
      findAll?: (p?: { limit?: number; offset?: number }) => Promise<UserEntity[]>;
    };
    if (typeof repo.findAll === "function") {
      return repo.findAll(params);
    }
    return this.userRepository.findAll();
  }

  async updatePassword(id: string, newPassword: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const hashed = await this.hashStrategy.hash(newPassword);
    user.password = hashed;
    user.updatedAt = new Date();
    return this.userRepository.update(user);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}

