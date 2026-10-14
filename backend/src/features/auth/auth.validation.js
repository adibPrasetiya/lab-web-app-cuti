import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().trim().max(50).required(),
  // Aturan kekuatan password hanya ada di frontend.
  password: Joi.string().required(),
  nama: Joi.string().trim().max(100).required(),
  nip: Joi.string().trim().max(30).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().required(),
});

// Ganti password sendiri: SENGAJA tanpa field current password (lihat A11).
export const changePasswordSchema = Joi.object({
  password: Joi.string().required(),
});
