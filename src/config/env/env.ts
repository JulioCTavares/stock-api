import z from "zod";
import { config } from "dotenv";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
  PORT: z.coerce.number().default(4000),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DB: z.string().optional(),
  POSTGRES_HOST: z.string().optional().default("localhost"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  DATABASE_URL: z.string().optional(),
  REDIS_HOST: z.string().optional().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_URL: z.string().optional(),
  RABBITMQ_PORT: z.coerce.number().default(5672),
  RABBITMQ_MANAGEMENT_PORT: z.coerce.number().default(15672)
});

const parsedEnv = envSchema.parse(config().parsed);

function buildDatabaseUrl(): string {
  if (parsedEnv.DATABASE_URL) {
    return parsedEnv.DATABASE_URL;
  }

  const user = parsedEnv.POSTGRES_USER || "postgres";
  const password = parsedEnv.POSTGRES_PASSWORD || "postgres";
  const host = parsedEnv.POSTGRES_HOST || "localhost";
  const port = parsedEnv.POSTGRES_PORT || 5432;
  const database = parsedEnv.POSTGRES_DB || "stock_db";

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

function buildRedisUrl(): string {
  if (parsedEnv.REDIS_URL) {
    return parsedEnv.REDIS_URL;
  }

  const host = parsedEnv.REDIS_HOST || "localhost";
  const port = parsedEnv.REDIS_PORT || 6379;
  const password = parsedEnv.REDIS_PASSWORD;

  if (password) {
    return `redis://:${password}@${host}:${port}`;
  }

  return `redis://${host}:${port}`;
}

export const env = {
  ...parsedEnv,
  DATABASE_URL: buildDatabaseUrl(),
  REDIS_URL: buildRedisUrl()
};

export type Env = typeof env;