import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as path from 'path';
import * as dotenv from 'dotenv';
import { getAllCities } from "../src/lib/cities";

// Explicitly load .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

const tursoUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log(`Seed: TURSO_DATABASE_URL=${tursoUrl ? tursoUrl.split('?')[0] : 'NOT SET'}`);
console.log(`Seed: TURSO_AUTH_TOKEN=${authToken ? 'SET' : 'NOT SET'}`);

// ─── Schema creation SQL (only City & GlobalSettings needed now) ───
// Brands, Models, and Series are read directly from JSON files.
const CREATE_TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS "City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "City_name_key" ON "City"("name")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "City_slug_key" ON "City"("slug")`,

  `CREATE TABLE IF NOT EXISTS "GlobalSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'settings',
    "companyName" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "krs" TEXT NOT NULL,
    "regon" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
  )`,
];

// ─── Initialize connection ───
let prisma: PrismaClient;
let rawClient: ReturnType<typeof createClient> | null = null;

if (tursoUrl && authToken) {
  console.log('Using Turso/LibSQL adapter...');
  rawClient = createClient({ url: tursoUrl, authToken });
  const adapter = new PrismaLibSql({ url: tursoUrl, authToken });
  prisma = new PrismaClient({ adapter });
} else {
  console.log('Using local better-sqlite3 adapter...');
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const localUrl = process.env.DATABASE_URL || 'file:./dev.db';
  const adapter = new PrismaBetterSqlite3({ url: localUrl });
  prisma = new PrismaClient({ adapter });
}

async function createSchema() {
  if (!rawClient) {
    console.log('Skipping schema creation (using local SQLite with existing schema).');
    return;
  }
  
  console.log('Creating tables on Turso...');
  for (const sql of CREATE_TABLES_SQL) {
    try {
      await rawClient.execute(sql);
    } catch (e) {
      console.warn(`Schema SQL warning: ${(e as any).message}`);
    }
  }
  console.log('Tables created successfully!');
}

async function cleanupOldTables() {
  console.log('Cleaning up old Brand/Model/Series data...');
  
  // Try deleting data via Prisma first (works for both local and Turso)
  try { await (prisma as any).series.deleteMany(); console.log('  ✓ Series data cleared'); } catch (e) { /* table may not exist */ }
  try { await (prisma as any).model.deleteMany(); console.log('  ✓ Model data cleared'); } catch (e) { /* table may not exist */ }
  try { await (prisma as any).brand.deleteMany(); console.log('  ✓ Brand data cleared'); } catch (e) { /* table may not exist */ }

  // Drop the tables entirely on Turso
  if (rawClient) {
    const dropSql = [
      'DROP TABLE IF EXISTS "Series"',
      'DROP TABLE IF EXISTS "Model"',
      'DROP TABLE IF EXISTS "Brand"',
    ];
    for (const sql of dropSql) {
      try { await rawClient.execute(sql); } catch (e) { /* ignore */ }
    }
    console.log('  ✓ Old tables dropped from Turso');
  }

  console.log('Cleanup complete!');
}

async function main() {
  await createSchema();
  await cleanupOldTables();

  // Seed GlobalSettings
  console.log('Seeding Global Settings...');
  await (prisma as any).globalSettings.upsert({
    where: { id: 'settings' },
    update: {
      companyName: 'Krzysztof Piesio WIKOL',
      nip: '8262147079',
      krs: '',
      regon: '381131959',
      address: 'ul. Brzozowa 16, 05-462 Kąck',
      phone: '+48 664 946 209',
      email: 'kontakt@webwawa.pl',
    },
    create: {
      id: 'settings',
      companyName: 'Krzysztof Piesio WIKOL',
      nip: '8262147079',
      krs: '',
      regon: '381131959',
      address: 'ul. Brzozowa 16, 05-462 Kąck',
      phone: '+48 664 946 209',
      email: 'kontakt@webwawa.pl',
    }
  });

  // Seed Cities
  console.log('Seeding cities...');
  const citiesData = getAllCities();

  for (const city of citiesData) {
    await (prisma as any).city.upsert({
      where: { slug: city.slug },
      update: { name: city.name },
      create: {
        name: city.name,
        slug: city.slug,
      }
    });
  }

  console.log('Seeding complete! (Brands/Models/Series are read from JSON files at runtime)');
}

main()
  .catch((e) => {
    console.error("Fatal seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
