import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import * as controller from './profile.controller.js';
import { idParamSchema, updateProfileSchema } from './profile.validation.js';

// Semua route di sini sudah di belakang middleware authenticate (lihat protected.routes.js).
// Sengaja: id profil diambil dari URL tanpa dibandingkan dengan user yang login (IDOR, A8).
export const profileRoutes = Router();

profileRoutes.get('/:id', validate(idParamSchema, 'params'), controller.getProfile);
profileRoutes.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateProfileSchema),
  controller.updateProfile,
);
