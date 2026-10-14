import { request } from '../api.js';

/** Kirim pengajuan cuti beserta lampiran surat (FormData: surat + field). */
export async function ajukan(formData) {
  const { data } = await request('POST', '/cuti', { auth: true, body: formData });
  return data;
}

export async function listSaya() {
  const { data } = await request('GET', '/cuti/saya', { auth: true });
  return data;
}

export async function antrian() {
  const { data } = await request('GET', '/cuti/antrian', { auth: true });
  return data;
}

/** Pengajuan cuti yang beririsan dengan bulan `YYYY-MM`. */
export async function kalender(month) {
  const { data } = await request('GET', `/cuti/kalender?month=${month}`, { auth: true });
  return data;
}

/** Seluruh pengajuan (semua status) untuk approver — riwayat approval. */
export async function semuaCuti() {
  const { data } = await request('GET', '/cuti/semua', { auth: true });
  return data;
}

export async function detail(id) {
  const { data } = await request('GET', `/cuti/${id}`, { auth: true });
  return data;
}

export async function approve(id) {
  const { data } = await request('POST', `/cuti/${id}/approve`, { auth: true });
  return data;
}

export async function tolak(id, catatan) {
  const { data } = await request('POST', `/cuti/${id}/reject`, { auth: true, body: { catatan } });
  return data;
}
