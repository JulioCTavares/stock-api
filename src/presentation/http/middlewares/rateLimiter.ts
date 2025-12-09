import type { FastifyRequest, FastifyReply } from "fastify";
import { RateLimiterRedis, RateLimiterMemory } from "rate-limiter-flexible";
import type Redis from "ioredis";
import { logger } from "@/utils/logger";
import { HTTP_STATUS } from "@/utils/constants";

export interface RateLimiterConfig {
  points: number;
  duration: number;
  blockDuration?: number;
}

export class RateLimiterMiddleware {
  private limiter: RateLimiterRedis | RateLimiterMemory;

  constructor(redis?: Redis, config?: RateLimiterConfig) {
    const defaultConfig: RateLimiterConfig = {
      points: 100,
      duration: 60,
      blockDuration: 60
    };

    const finalConfig = { ...defaultConfig, ...config };

    if (redis) {
      this.limiter = new RateLimiterRedis({
        storeClient: redis,
        keyPrefix: "rl",
        points: finalConfig.points,
        duration: finalConfig.duration,
        blockDuration: finalConfig.blockDuration
      });
    } else {
      this.limiter = new RateLimiterMemory({
        points: finalConfig.points,
        duration: finalConfig.duration,
        blockDuration: finalConfig.blockDuration
      });
    }
  }

  async byIP(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const key = this.getClientIP(req);

    try {
      await this.limiter.consume(key);
    } catch (rateLimiterRes) {
      const remainingTime = Math.round((rateLimiterRes as { msBeforeNext: number }).msBeforeNext / 1000) || 1;

      logger.warn(
        {
          ip: key,
          path: req.url,
          method: req.method
        },
        "Rate limit excedido"
      );

      res.status(HTTP_STATUS.FORBIDDEN).send({
        success: false,
        error: "Muitas requisições. Tente novamente mais tarde.",
        retryAfter: remainingTime
      });
    }
  }

  async byRoute(req: FastifyRequest, res: FastifyReply, route: string): Promise<void> {
    const key = `${this.getClientIP(req)}:${route}`;

    try {
      await this.limiter.consume(key);
    } catch (rateLimiterRes) {
      const remainingTime = Math.round((rateLimiterRes as { msBeforeNext: number }).msBeforeNext / 1000) || 1;

      logger.warn(
        {
          ip: this.getClientIP(req),
          route,
          path: req.url,
          method: req.method
        },
        "Rate limit excedido para rota"
      );

      res.status(HTTP_STATUS.FORBIDDEN).send({
        success: false,
        error: "Muitas requisições para esta rota. Tente novamente mais tarde.",
        retryAfter: remainingTime
      });
    }
  }

  async byUser(req: FastifyRequest, res: FastifyReply, userId: string): Promise<void> {
    const key = `user:${userId}`;

    try {
      await this.limiter.consume(key);
    } catch (rateLimiterRes) {
      const remainingTime = Math.round((rateLimiterRes as { msBeforeNext: number }).msBeforeNext / 1000) || 1;

      logger.warn(
        {
          userId,
          path: req.url,
          method: req.method
        },
        "Rate limit excedido para usuário"
      );

      res.status(HTTP_STATUS.FORBIDDEN).send({
        success: false,
        error: "Muitas requisições. Tente novamente mais tarde.",
        retryAfter: remainingTime
      });
    }
  }

  private getClientIP(req: FastifyRequest): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
      const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
      if (ips) {
        const firstIP = ips.split(",")[0];
        if (firstIP) {
          return firstIP.trim();
        }
      }
    }

    const realIP = req.headers["x-real-ip"];
    if (realIP) {
      const ip = Array.isArray(realIP) ? realIP[0] : realIP;
      if (ip) {
        return ip;
      }
    }

    return req.socket.remoteAddress || "unknown";
  }
}

export const createRateLimiter = (
  redis?: Redis,
  config?: RateLimiterConfig
): RateLimiterMiddleware => {
  return new RateLimiterMiddleware(redis, config);
};

export const createAuthRateLimiter = (redis?: Redis): RateLimiterMiddleware => {
  return new RateLimiterMiddleware(redis, {
    points: 5,
    duration: 60,
    blockDuration: 300
  });
};

export const createPublicRateLimiter = (redis?: Redis): RateLimiterMiddleware => {
  return new RateLimiterMiddleware(redis, {
    points: 100,
    duration: 60,
    blockDuration: 60
  });
};

