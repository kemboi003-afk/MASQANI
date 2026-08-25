import { initializeDatabase, pool, query } from "./pool.js";

await initializeDatabase();
const result = await query("select count(*)::int as properties from properties");
console.log(`Local MASQANI database ready with ${result.rows[0].properties} properties.`);
await pool.end();
