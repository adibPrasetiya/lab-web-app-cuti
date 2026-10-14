import Joi from 'joi';

// Hanya data profil yang boleh diubah user (bukan username, password, atau role).
export const updateProfileSchema = Joi.object({
  nama: Joi.string().trim().max(100).required(),
  nip: Joi.string().trim().max(30).required(),
});

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
