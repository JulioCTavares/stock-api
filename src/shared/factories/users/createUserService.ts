import { env } from "@/config/env/env";
import { RedisCache } from "@/infrastructure/cache/connection";
import { UserRepositoryProxy } from "@/infrastructure/cache/proxys/repositories/userRespositoryProxy";
import { UserDrizzleRepository } from "@/infrastructure/db/drizzle/repositories/user-drizzle.repository";
import { ArgonHasher } from "@/infrastructure/hash/argon/argonHasher";
import { UserService } from "@/application/services/user.service";
import { RedisClient } from "bun";
import { drizzle } from "drizzle-orm/node-postgres";


export const createUserService = () => {
    const redis = new RedisClient(env.REDIS_URL);
    const userRepository = new UserDrizzleRepository(drizzle(env.DATABASE_URL));
    const userRepositoryProxy = new UserRepositoryProxy(userRepository, new RedisCache(redis));
    const hashStrategy = new ArgonHasher();
    const userService = new UserService(userRepositoryProxy, hashStrategy);

    return userService;
}