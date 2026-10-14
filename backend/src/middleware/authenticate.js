import { findSessionWithUser } from '../features/auth/auth.repository.js';
import { toPublicUser } from '../features/auth/auth.service.js';
import { AppError } from '../utils/AppError.js';

/** Session dikirim lewat header `Authorization: Bearer <uuid>` lalu dicocokkan ke tabel sessions. */
export async function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) return next(AppError.unauthorized());

  const row = await findSessionWithUser(token);
  if (!row) return next(AppError.unauthorized('Session tidak valid, silakan login kembali'));

  req.user = toPublicUser(row.user);
  req.sessionId = row.session.id;
  return next();
}
