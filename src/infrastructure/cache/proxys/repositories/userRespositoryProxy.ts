import type { IUserRepository } from "@/infrastructure/repositories/user/user.repository";
import type { ICache } from "@/infrastructure/cache/interfaces/cache.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { logger, CACHE_KEYS, CACHE_TTL } from "@/utils";

export class UserRepositoryProxy implements IUserRepository {
  constructor(private readonly userRepository: IUserRepository, private readonly cache: ICache) {}

  private async cacheGetOrSet<T>(
    key: string,
    fetcher: () => Promise<T | null>,
    ttlSeconds = CACHE_TTL.ONE_DAY
  ): Promise<T | null> {
    const cached = await this.cache.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    const result = await fetcher();
    if (result !== null && result !== undefined) {
      await this.cache.set(key, JSON.stringify(result), ttlSeconds);
    }
    return result;
  }

  private async invalidateUserKeys(user: UserEntity): Promise<void> {
    const keys = [
      this.keyById(user.id),
      this.keyByEmail(user.email),
      this.keyAll()
    ];
    await Promise.all(keys.map((key) => this.cache.delete(key)));
  }

  private keyByEmail(email: string): string {
    return CACHE_KEYS.USER_BY_EMAIL(email);
  }

  private keyById(id: string): string {
    return CACHE_KEYS.USER_BY_ID(id);
  }

  private keyAll(params?: { limit?: number; offset?: number }): string {
    return `users:all:${params?.limit ?? ""}:${params?.offset ?? ""}`;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    logger.info(`Finding user by email ${email} in cache`);
    return this.cacheGetOrSet<UserEntity>(
      this.keyByEmail(email),
      async () => {
        const user = await this.userRepository.findByEmail(email);
        return user ? new UserEntity(user) : null;
      }
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    logger.info(`Finding user by id ${id} in cache`);
    return this.cacheGetOrSet<UserEntity>(
      this.keyById(id),
      async () => {
        const user = await this.userRepository.findById(id);
        return user ? new UserEntity(user) : null;
      }
    );
  }

  async findAll(params?: { limit?: number; offset?: number }): Promise<UserEntity[]> {
    logger.info(`Finding all users in cache`);
    const key = this.keyAll(params);
    const cached = await this.cache.get(key);
    if (cached) {
      return JSON.parse(cached) as UserEntity[];
    }

    const users = await this.userRepository.findAll(params);
    await this.cache.set(key, JSON.stringify(users.map((user) => new UserEntity(user))), CACHE_TTL.ONE_DAY);
    return users;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    logger.info(`Saving user ${user.username} to database`);
    const saved = await this.userRepository.save(user);
    await this.invalidateUserKeys(saved);
    return saved;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    logger.info(`Updating user ${user.username} in database`);
    const updated = await this.userRepository.update(user);
    await this.invalidateUserKeys(updated);
    return updated;
  }

  async delete(id: string): Promise<void> { 
    logger.info(`Deleting user ${id} in database`);
    const existing = await this.userRepository.findById(id);
    if (existing) {
      await this.invalidateUserKeys(existing);
    }
    await this.userRepository.delete(id);
  }
}