import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import * as controller from './users.controller.js';
import { createSchema, idParamSchema, resetPasswordSchema, updateSchema } from './users.validation.js';

// Semua route hanya untuk admin (authenticate + authorize dipasang di protected.routes.js).
export const userRoutes = Router();

userRoutes.get('/', controller.list);
userRoutes.post('/', validate(createSchema), controller.create);
userRoutes.get('/:id', validate(idParamSchema, 'params'), controller.detail);
userRoutes.put('/:id', validate(idParamSchema, 'params'), validate(updateSchema), controller.update);
userRoutes.post('/:id/reset-password', validate(idParamSchema, 'params'), validate(resetPasswordSchema), controller.resetPassword);
userRoutes.delete('/:id', validate(idParamSchema, 'params'), controller.remove);
