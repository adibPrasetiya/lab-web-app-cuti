import path from 'node:path';
import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// Relatif terhadap folder kerja aplikasi.
export const LOG_ROOT = path.resolve(process.cwd(), env.log.dir);

const devFormat = printf(({ level, message, timestamp: time, stack }) => `${time} ${level}: ${stack ?? message}`);

const isTest = env.nodeEnv === 'test';

const transports = [
  new winston.transports.Console({
    format: env.isProduction ? json() : combine(colorize(), timestamp({ format: 'HH:mm:ss' }), devFormat),
    handleExceptions: true,
    handleRejections: true,
  }),
];

// Satu file JSON (satu baris = satu entri).
if (!isTest) {
  transports.push(new winston.transports.File({ filename: path.join(LOG_ROOT, 'app.log'), format: json() }));
}

export const logger = winston.createLogger({
  level: env.log.level,
  silent: isTest,
  format: combine(timestamp(), errors({ stack: true })),
  transports,
});
