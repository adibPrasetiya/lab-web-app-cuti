import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import * as controller from './cuti.controller.js';
import { uploadSurat } from './cuti.upload.js';
import { calendarQuerySchema, createSchema, idParamSchema, rejectSchema } from './cuti.validation.js';

// Semua route di sini sudah di belakang middleware authenticate (lihat protected.routes.js).
export const cutiRoutes = Router();

// uploadSurat (multer) mengisi req.body & req.file sebelum validate body.
cutiRoutes.post('/', uploadSurat, validate(createSchema), controller.create);
cutiRoutes.get('/saya', controller.listMine);
cutiRoutes.get('/antrian', controller.queue);
// Didaftarkan sebelum '/:id' agar tidak tertangkap sebagai id.
cutiRoutes.get('/kalender', validate(calendarQuerySchema, 'query'), controller.calendar);
// Daftar seluruh pengajuan untuk approver (riwayat). Sebelum '/:id'.
cutiRoutes.get('/semua', controller.allApprovals);
cutiRoutes.get('/:id', validate(idParamSchema, 'params'), controller.detail);
cutiRoutes.post('/:id/approve', validate(idParamSchema, 'params'), controller.approve);
cutiRoutes.post('/:id/reject', validate(idParamSchema, 'params'), validate(rejectSchema), controller.reject);
