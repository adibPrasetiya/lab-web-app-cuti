import 'dotenv/config';
import Joi from 'joi';

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(3200),
  DATABASE_URL: Joi.string().uri({ scheme: ['mysql'] }).required(),
  CORS_ORIGIN: Joi.string().default('*'),
  // Folder file lampiran upload, relatif terhadap folder kerja aplikasi.
  UPLOAD_DIR: Joi.string().default('uploads'),
  MAX_UPLOAD_SIZE_MB: Joi.number().min(0.1).default(10),
  // Folder file log & level minimal yang dicatat.
  LOG_DIR: Joi.string().default('logs'),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'debug').allow(''),
}).unknown(true);

const { value, error } = schema.validate(process.env, { abortEarly: false, convert: true });

if (error) {
  console.error('Konfigurasi environment tidak valid:');
  for (const detail of error.details) console.error(`  - ${detail.message}`);
  process.exit(1);
}

export const env = Object.freeze({
  nodeEnv: value.NODE_ENV,
  isProduction: value.NODE_ENV === 'production',
  port: value.PORT,
  databaseUrl: value.DATABASE_URL,
  corsOrigin: value.CORS_ORIGIN === '*' ? '*' : value.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  upload: {
    dir: value.UPLOAD_DIR,
    maxBytes: Math.round(value.MAX_UPLOAD_SIZE_MB * 1024 * 1024),
    maxSizeMb: value.MAX_UPLOAD_SIZE_MB,
  },
  log: {
    dir: value.LOG_DIR,
    level: value.LOG_LEVEL || (value.NODE_ENV === 'production' ? 'info' : 'debug'),
  },
});
