import { redirect } from '@sveltejs/kit';
import { ApiError, session } from '#lib/api.js';
import { me } from '#lib/services/auth.js';

// Halaman setelah login: wajib punya session yang masih tercatat di backend.
export async function load() {
  if (!session.token) redirect(307, '/login');

  try {
    return { user: await me() };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(307, '/login');
    // Backend tidak terjangkau: tetap tampilkan data user terakhir yang tersimpan.
    if (session.user) return { user: session.user };
    throw error;
  }
}
