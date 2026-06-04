import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';

// Zaciągnij zmienne z .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Brak danych logowania Turso w pliku .env');
  process.exit(1);
}

const client = createClient({
  url,
  authToken,
});

async function main() {
  try {
    console.log('Nawiązywanie połączenia z Turso...');
    
    // Wdrożenie tabeli dla bazy
    const sql = `
      CREATE TABLE IF NOT EXISTS "QuoteRequest" (
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "brandModel" TEXT NOT NULL,
          "year" TEXT,
          "engine" TEXT,
          "price" TEXT,
          "city" TEXT,
          "phone" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "description" TEXT,
          "imagesCount" INTEGER NOT NULL DEFAULT 0,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.execute(sql);
    console.log('Sukces! Tabela QuoteRequest została utworzona w bazie produkcyjnej Turso.');
    
  } catch (error) {
    console.error('Błąd podczas tworzenia tabeli:', error);
  }
}

main();
