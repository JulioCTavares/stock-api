import z from "zod";
import { config } from "dotenv";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.coerce.number().default(5432),
  DATABASE_URL: z.string(),
  REDIS_PORT: z.coerce.number().default(6379),
  RABBITMQ_PORT: z.coerce.number().default(5672),
  RABBITMQ_MANAGEMENT_PORT: z.coerce.number().default(15672),
  REDIS_URL: z.string(),
});


export const env = envSchema.parse(config().parsed);
export type Env = z.infer<typeof envSchema>;