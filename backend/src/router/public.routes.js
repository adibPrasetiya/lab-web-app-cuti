import { Router } from 'express';
import { authPublicRoutes } from '../features/auth/auth.route.js';

// Route tanpa login.
const router = Router();

router.use('/auth', authPublicRoutes);

export default router;
