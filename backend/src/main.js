// Entry tunggal aplikasi: `node src/main.js [serve|migrate|seed]`.
import { pool } from './db/index.js';
import { runMigrations } from './db/migrate.js';
import { runSeed } from './db/seed.js';
import { startServer } from './index.js';

const COMMANDS = {
  serve: () => startServer(),

  async migrate() {
    await runMigrations();
    console.log('Migrasi database selesai');
  },

  async seed() {
    const seeded = await runSeed();
    console.log(`Seed selesai: ${seeded.map(({ username, role }) => `${username} (${role})`).join(', ')}`);
  },
};

// Perintah selain `serve` selesai sekali jalan, jadi koneksi DB ditutup setelahnya.
const ONE_SHOT = new Set(['migrate', 'seed']);

const command = process.argv[2] ?? 'serve';
const run = COMMANDS[command];

if (!run) {
  console.error(`Perintah "${command}" tidak dikenal. Gunakan: ${Object.keys(COMMANDS).join(' | ')}`);
  process.exit(1);
}

async function main() {
  try {
    await run();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    if (ONE_SHOT.has(command)) await pool.end();
  }
}

main();
