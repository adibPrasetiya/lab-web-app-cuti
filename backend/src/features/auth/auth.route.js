import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import * as controller from './auth.controller.js';
import { changePasswordSchema, loginSchema, registerSchema } from './auth.validation.js';

export const authPublicRoutes = Router();
authPublicRoutes.post('/register', validate(registerSchema), controller.register);
authPublicRoutes.post('/login', validate(loginSchema), controller.login);

// Dipasang di belakang middleware authenticate (lihat protected.routes.js).
export const authProtectedRoutes = Router();
authProtectedRoutes.get('/me', controller.me);
authProtectedRoutes.post('/logout', controller.logout);
authProtectedRoutes.post('/password', validate(changePasswordSchema), controller.changePassword);
