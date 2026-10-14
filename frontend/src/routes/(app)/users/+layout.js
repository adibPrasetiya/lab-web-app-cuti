import { redirect } from '@sveltejs/kit';
import { session } from '#lib/api.js';

// Manajemen pengguna hanya untuk admin.
export function load() {
  if (session.user?.role !== 'admin') redirect(307, '/');
}
