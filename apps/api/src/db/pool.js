import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import { env, isProduction } from "../config/env.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(here, "../../../..");
const usingPGlite = env.DATABASE_DRIVER === "pglite";
const { Pool } = pg;

const pglite = usingPGlite ? new PGlite(resolve(projectRoot, env.LOCAL_DATABASE_PATH)) : null;
const postgresPool = usingPGlite
  ? null
  : new Pool({
      connectionString: env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: true } : false,
      max: 12,
      idleTimeoutMillis: 30_000
    });

export const pool = {
  async query(text, params) {
    return usingPGlite ? pglite.query(text, params) : postgresPool.query(text, params);
  },
  async end() {
    return usingPGlite ? pglite.close() : postgresPool.end();
  }
};

export function query(text, params) {
  return pool.query(text, params);
}

export async function withTransaction(callback) {
  if (!usingPGlite) {
    const client = await postgresPool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  await pglite.exec("BEGIN");
  try {
    const result = await callback({ query: (text, params) => pglite.query(text, params) });
    await pglite.exec("COMMIT");
    return result;
  } catch (error) {
    await pglite.exec("ROLLBACK");
    throw error;
  }
}

export async function initializeDatabase() {
  if (!usingPGlite) return;
  const schema = await readFile(resolve(projectRoot, "packages/database/schema.sql"), "utf8");
  const seed = await readFile(resolve(projectRoot, "packages/database/seed.sql"), "utf8");
  const demoListings = await readFile(resolve(projectRoot, "packages/database/demo-listings.sql"), "utf8");
  // PGlite includes gen_random_uuid() but does not include the pgcrypto extension bundle.
  await pglite.exec(schema.replace(/^create extension if not exists pgcrypto;\s*/m, ""));
  await pglite.exec(seed);
  await pglite.exec(demoListings);
}
