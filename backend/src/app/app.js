import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from '../config/env.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { notFound } from '../middleware/notFound.js';
import { requestLogger } from '../middleware/requestLogger.js';
import protectedRoutes from '../router/protected.routes.js';
import publicRoutes from '../router/public.routes.js';

// Relatif terhadap folder kerja aplikasi.
export const UPLOAD_ROOT = path.resolve(process.cwd(), env.upload.dir);

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// File lampiran pengajuan cuti.
app.use('/uploads', express.static(UPLOAD_ROOT, { dotfiles: 'allow' }));

// Dokumentasi API (OpenAPI 3): file spec + Swagger UI. Dipasang sebelum router protected agar tanpa login.
const OPENAPI_FILE = fileURLToPath(new URL('../../docs/openapi.yaml', import.meta.url));
app.get('/api/v1/docs/openapi.yaml', (req, res) => res.sendFile(OPENAPI_FILE));
app.use(
  '/api/v1/docs',
  swaggerUi.serve,
  swaggerUi.setup(null, {
    customSiteTitle: 'Aplikasi Cuti API',
    // validatorUrl null: jangan kirim URL spec ke validator.swagger.io (tidak bisa menembus gerbang akses lab).
    swaggerOptions: { url: '/api/v1/docs/openapi.yaml', persistAuthorization: true, validatorUrl: null },
  }),
);

app.use('/api/v1', publicRoutes);
app.use('/api/v1', protectedRoutes);

app.use(notFound);
app.use(errorHandler);
