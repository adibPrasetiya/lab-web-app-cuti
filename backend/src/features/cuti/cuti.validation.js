import Joi from 'joi';
import { LEAVE_TYPES } from '../../db/schema.js';

export const createSchema = Joi.object({
  jenis: Joi.string()
    .valid(...LEAVE_TYPES)
    .required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  alasan: Joi.string().trim().max(500).required(),
});

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const rejectSchema = Joi.object({
  catatan: Joi.string().trim().max(500).allow('').optional(),
});

export const calendarQuerySchema = Joi.object({
  month: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
    .required()
    .messages({ 'string.pattern.base': 'Format month harus YYYY-MM' }),
});
