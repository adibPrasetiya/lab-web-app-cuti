import { app } from './app/app.js';
import { env } from './config/env.js';
import { pool } from './db/index.js';
import { LOG_ROOT, logger } from './utils/logger.js';

export function startServer() {
  const server = app.listen(env.port, () => {
    logger.info(`Aplikasi Cuti API berjalan di http://localhost:${env.port} (${env.nodeEnv}), log: ${LOG_ROOT}`);
  });

  function shutdown(signal) {
    logger.info(`${signal} diterima, mematikan server...`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
