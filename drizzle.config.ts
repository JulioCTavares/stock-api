import { env } from "@/config/env/env";
import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./src/infrastructure/db/drizzle/schemas/**/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: "./src/infrastructure/db/drizzle/migrations",
  
});