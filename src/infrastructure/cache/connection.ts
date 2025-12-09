import type { RedisClient } from "bun";
import type { ICache } from "./interfaces/cache.interface";



export class RedisCache implements ICache {
    constructor(private readonly redis: RedisClient) {}

    async get(key: string): Promise<string | null> {
        return await this.redis.get(key);
    }

    async set(key: string, value: string, ttl: number): Promise<void> {
        await this.redis.set(key, value, ttl.toString());
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }
}