import { AppError } from '../../utils/AppError.js';
import { toPublicUser } from '../auth/auth.service.js';
import * as repository from './profile.repository.js';

// CATATAN KEAMANAN (sengaja): getProfile & updateProfile hanya memakai id dari URL dan
// tidak memeriksa apakah id itu milik user yang sedang login maupun role-nya (IDOR).
// Lihat VULNERABILITIES.md A8.

export async function getProfile(id) {
  const user = await repository.findById(id);
  if (!user) throw AppError.notFound('Profil tidak ditemukan');
  return toPublicUser(user);
}

export async function updateProfile(id, data) {
  const user = await repository.findById(id);
  if (!user) throw AppError.notFound('Profil tidak ditemukan');
  const updated = await repository.updateById(id, data);
  return toPublicUser(updated);
}
