import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { createDefaultRateLimiter } from "@/shared/factories/rateLimiter/createRateLimiter";

export async function rateLimiterPlugin(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  const rateLimiter = createDefaultRateLimiter();

  fastify.addHook("onRequest", async (request, reply) => {
    await rateLimiter.byIP(request, reply);
  });
}

