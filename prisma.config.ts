import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    // Local SQLite for Prisma CLI commands (generate, etc.)
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
});
