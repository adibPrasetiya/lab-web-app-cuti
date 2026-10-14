import { request, session } from '../api.js';

export async function register(data) {
  const { data: user } = await request('POST', '/auth/register', { body: data });
  return user;
}

/** Simpan session ID (UUID) & data user ke localStorage setelah login berhasil. */
export async function login(username, password) {
  const { data } = await request('POST', '/auth/login', { body: { username, password } });
  session.set(data.token, data.user);
  return data.user;
}

/** Ambil ulang data user yang login sekaligus memastikan session masih berlaku. */
export async function me() {
  const { data: user } = await request('GET', '/auth/me', { auth: true });
  session.user = user;
  return user;
}

/** Ganti password sendiri (tanpa password lama). */
export async function ubahPassword(password) {
  await request('POST', '/auth/password', { auth: true, body: { password } });
}

export async function logout() {
  try {
    await request('POST', '/auth/logout', { auth: true });
  } finally {
    session.clear();
  }
}
