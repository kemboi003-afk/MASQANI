import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { initializeDatabase, pool } from "./db/pool.js";

const app = createApp();
let server;

async function start() {
  await initializeDatabase();
  server = app.listen(env.PORT, () => {
    console.log(`MASQANI API listening on :${env.PORT}`);
  });
}

function shutdown(signal) {
  console.log(`${signal} received. Closing MASQANI API.`);
  if (!server) return process.exit(0);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start().catch((error) => {
  console.error("MASQANI API could not start", error);
  process.exit(1);
});
