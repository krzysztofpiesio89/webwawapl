import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const tursoUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const getAdapter = () => {
  // If we have valid Turso credentials, use LibSQL adapter
  if (tursoUrl && authToken && tursoUrl.startsWith('libsql://')) {

    // PrismaLibSql v7 expects a config object { url, authToken }, NOT a Client instance
    return new PrismaLibSql({ url: tursoUrl, authToken });
  }

  // Fallback for local development
  try {
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const localUrl = process.env.DATABASE_URL || 'file:./dev.db';

    return new PrismaBetterSqlite3({ url: localUrl });
  } catch (e) {

    // Expected during Vercel build if better-sqlite3 is not available
    return undefined;
  }
};

const adapter = getAdapter();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(adapter ? { adapter } : undefined);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
