import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

if (process.env.DATABASE_DRIVER !== "postgres") throw new Error("db:migrate requires DATABASE_DRIVER=postgres");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for db:migrate");
const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "../../../..");
const schema = await readFile(resolve(root, "packages/database/schema.sql"), "utf8");
const seed = await readFile(resolve(root, "packages/database/seed.sql"), "utf8");
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase poolers use TLS; a CA file can be supplied later when the host requires strict validation.
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
try {
  await pool.query(schema);
  await pool.query(seed);
  console.log("MASQANI database migration completed.");
} finally {
  await pool.end();
}
