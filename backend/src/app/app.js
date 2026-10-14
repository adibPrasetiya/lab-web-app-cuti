import path from 'node:path';
import cors from 'cors';
import express from 'express';
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

app.use('/api/v1', publicRoutes);
app.use('/api/v1', protectedRoutes);

app.use(notFound);
app.use(errorHandler);
