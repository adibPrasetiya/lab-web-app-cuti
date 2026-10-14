import { request } from '../api.js';

/** Ambil profil berdasarkan id user. */
export async function getProfile(id) {
  const { data } = await request('GET', `/profile/${id}`, { auth: true });
  return data;
}

/** Perbarui profil (nama, nip) berdasarkan id user. */
export async function updateProfile(id, data) {
  const { data: user } = await request('PUT', `/profile/${id}`, { auth: true, body: data });
  return user;
}
