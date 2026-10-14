import { AppError } from '../../utils/AppError.js';
import { md5 } from '../auth/auth.service.js';
import * as repository from './users.repository.js';

export function list() {
  return repository.list();
}

export async function getDetail(id) {
  const user = await repository.findById(id);
  if (!user) throw AppError.notFound('Pengguna tidak ditemukan');
  return user;
}

export async function create({ username, password, nama, nip, role }) {
  if (await repository.findByUsername(username)) {
    throw AppError.conflict('Username sudah digunakan', [{ field: 'username', message: 'Username sudah digunakan' }]);
  }
  return repository.create({ username, passwordHash: md5(password), nama, nip, role });
}

export async function update(id, { nama, nip, role }) {
  await getDetail(id);
  return repository.update(id, { nama, nip, role });
}

// Admin menyetel password baru pengguna (alur "lupa password").
export async function resetPassword(id, password) {
  await getDetail(id);
  await repository.update(id, { passwordHash: md5(password) });
}

export async function remove(id, currentUser) {
  if (id === currentUser.id) throw AppError.badRequest('Tidak dapat menghapus akun sendiri');
  await getDetail(id);
  await repository.remove(id);
}
