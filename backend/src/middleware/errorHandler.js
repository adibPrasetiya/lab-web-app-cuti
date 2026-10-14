import multer from 'multer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
import { failure } from '../utils/response.js';

const MULTER_MESSAGES = {
  LIMIT_FILE_SIZE: () => `Ukuran file maksimal ${env.upload.maxSizeMb} MB`,
  LIMIT_FILE_COUNT: () => 'Jumlah file melebihi batas',
  LIMIT_UNEXPECTED_FILE: () => 'File dikirim pada field yang tidak dikenali',
};

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Error upload dari multer selalu 400 (tak berubah).
  if (err instanceof multer.MulterError) {
    const message = MULTER_MESSAGES[err.code]?.() ?? 'Data upload tidak valid';
    return failure(res, { statusCode: 400, message, errors: [{ field: err.field ?? 'file', message }] });
  }

  const isApp = err instanceof AppError;
  const statusCode = isApp ? err.statusCode : (err.status ?? err.statusCode ?? 500);

  // Error 5xx: catat lengkap ke log (termasuk body sensitif, F7) DAN sengaja bocorkan
  // message asli + stack ke klien (F4). Error < 500 tidak pernah menyertakan stack.
  if (statusCode >= 500) {
    logger.error(err?.message ?? String(err), {
      stack: err?.stack,
      method: req.method,
      path: req.originalUrl,
      body: req.body,
    });
    return failure(res, {
      statusCode,
      message: err?.message ?? 'Internal Server Error',
      errors: [{ message: err?.message ?? String(err), stack: err?.stack }],
      code: isApp ? err.code : undefined,
    });
  }

  return failure(res, {
    statusCode,
    message: err.message,
    errors: isApp ? err.details : undefined,
    code: isApp ? err.code : undefined,
  });
}
