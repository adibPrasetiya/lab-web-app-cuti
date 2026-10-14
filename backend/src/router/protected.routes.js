import { Router } from 'express';
import { authProtectedRoutes } from '../features/auth/auth.route.js';
import { cutiRoutes } from '../features/cuti/cuti.route.js';
import { profileRoutes } from '../features/profile/profile.route.js';
import { userRoutes } from '../features/users/users.route.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

// Route yang wajib login. `authenticate` dipasang per mount agar endpoint tak dikenal tetap 404, bukan 401.
const router = Router();

router.use('/auth', authenticate, authProtectedRoutes);
router.use('/profile', authenticate, profileRoutes);
router.use('/cuti', authenticate, cutiRoutes);
router.use('/users', authenticate, authorize('admin'), userRoutes);

export default router;
