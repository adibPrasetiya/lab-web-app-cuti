import Joi from 'joi';
import { USER_ROLES } from '../../db/schema.js';

export const createSchema = Joi.object({
  username: Joi.string().trim().max(50).required(),
  // Aturan kekuatan password hanya ada di frontend (konsisten dengan registrasi).
  password: Joi.string().required(),
  nama: Joi.string().trim().max(100).required(),
  nip: Joi.string().trim().max(30).required(),
  role: Joi.string()
    .valid(...USER_ROLES)
    .default('pegawai'),
});

export const updateSchema = Joi.object({
  nama: Joi.string().trim().max(100).required(),
  nip: Joi.string().trim().max(30).required(),
  role: Joi.string()
    .valid(...USER_ROLES)
    .required(),
});

// Reset password oleh admin (fitur "lupa password"): cukup password baru.
export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
});

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
