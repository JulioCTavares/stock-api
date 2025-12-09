import pino from "pino";
import { env } from "@/config/env/env";

const isDev = env.NODE_ENV === "development";
const level = process.env.LOG_LEVEL ?? (isDev ? "debug" : "info");

export const logger = pino({
  level,
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname"
        }
      }
    : undefined
});

