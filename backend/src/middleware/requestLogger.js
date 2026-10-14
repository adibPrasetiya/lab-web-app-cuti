import { logger } from '../utils/logger.js';

/** Catat setiap request beserta durasinya. */
export function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`, {
      ip: req.ip,
      headers: req.headers,
      body: req.body,
    });
  });
  next();
}
