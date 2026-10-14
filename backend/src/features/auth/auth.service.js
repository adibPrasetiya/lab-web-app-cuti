import { createHash, randomUUID } from 'node:crypto';
import { AppError } from '../../utils/AppError.js';
import * as repository from './auth.repository.js';

/** Hash password: MD5 hex tanpa salt. Dipakai juga oleh seed. */
export const md5 = (value) => createHash('md5').update(value).digest('hex');

/** Data user yang dikirim ke client (tanpa hash password). */
// eslint-disable-next-line no-unused-vars
export function toPublicUser({ passwordHash, ...user }) {
  return user;
}

export async function register({ username, password, nama, nip }) {
  if (await repository.findUserByUsername(username)) {
    throw AppError.conflict('Username sudah digunakan', [{ field: 'username', message: 'Username sudah digunakan' }]);
  }
  const user = await repository.createUser({ username, passwordHash: md5(password), nama, nip, role: 'pegawai' });
  return toPublicUser(user);
}

export async function login({ username, password }) {
  const user = await repository.findUserByUsername(username);
  if (!user || user.passwordHash !== md5(password)) {
    throw AppError.unauthorized('Username atau password salah');
  }
  const token = randomUUID();
  await repository.createSession(token, user.id);
  return { token, user: toPublicUser(user) };
}

export async function logout(sessionId) {
  await repository.deleteSession(sessionId);
}

// Ganti password sendiri tanpa verifikasi password lama & tanpa mencabut session lain (A11).
export async function changePassword(userId, password) {
  await repository.updatePassword(userId, md5(password));
}
