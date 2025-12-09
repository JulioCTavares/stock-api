import { createRateLimiter, createAuthRateLimiter, createPublicRateLimiter } from "@/presentation/http/middlewares/rateLimiter";
import { env } from "@/config/env/env";
import Redis from "ioredis";
import { logger } from "@/utils/logger";

let redisClient: Redis | undefined;

/**
 * Factory para criar instância do Redis (singleton)
 * Usa ioredis para rate-limiter-flexible
 */
const getRedisClient = (): Redis | undefined => {
  if (!redisClient && env.REDIS_URL) {
    try {
      redisClient = new Redis(env.REDIS_URL, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3
      });

      redisClient.on("error", (error) => {
        logger.error({ error }, "Redis connection error no rate limiter");
      });

      redisClient.on("connect", () => {
        logger.info("Redis conectado para rate limiting");
      });
    } catch (error) {
      logger.error({ error }, "Failed to create Redis client para rate limiter");
      return undefined;
    }
  }
  return redisClient;
};

/**
 * Factory para criar rate limiter padrão
 */
export const createDefaultRateLimiter = () => {
  const redis = getRedisClient();
  return createRateLimiter(redis);
};

/**
 * Factory para criar rate limiter de autenticação (mais restritivo)
 */
export const createAuthRateLimiterFactory = () => {
  const redis = getRedisClient();
  return createAuthRateLimiter(redis);
};

/**
 * Factory para criar rate limiter público (menos restritivo)
 */
export const createPublicRateLimiterFactory = () => {
  const redis = getRedisClient();
  return createPublicRateLimiter(redis);
};

