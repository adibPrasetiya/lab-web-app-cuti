import { redirect } from '@sveltejs/kit';
import { session } from '#lib/api.js';

// Halaman tamu (login/registrasi): yang sudah login langsung ke dashboard.
export function load() {
  if (session.token) redirect(307, '/');
}
