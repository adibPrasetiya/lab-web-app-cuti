import { request } from '../api.js';

export async function listUsers() {
  const { data } = await request('GET', '/users', { auth: true });
  return data;
}

export async function detailUser(id) {
  const { data } = await request('GET', `/users/${id}`, { auth: true });
  return data;
}

export async function createUser(body) {
  const { data } = await request('POST', '/users', { auth: true, body });
  return data;
}

export async function updateUser(id, body) {
  const { data } = await request('PUT', `/users/${id}`, { auth: true, body });
  return data;
}

/** Admin menyetel password baru untuk pengguna (alur lupa password). */
export async function resetUserPassword(id, password) {
  await request('POST', `/users/${id}/reset-password`, { auth: true, body: { password } });
}

export async function removeUser(id) {
  await request('DELETE', `/users/${id}`, { auth: true });
}
