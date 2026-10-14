import { AppError } from '../utils/AppError.js';

/** Izinkan hanya role tertentu. Dipasang setelah middleware authenticate. */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return next(AppError.forbidden());
    return next();
  };
}
