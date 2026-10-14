import { goto } from '$app/navigation';
import { pushServerError } from './serverError.svelte.js';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
// Session ID (UUID v4) dari backend & data user yang sedang login.
const TOKEN_KEY = 'cuti.session';
const USER_KEY = 'cuti.user';

export class ApiError extends Error {
  constructor(status, message, errors = [], code = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

/** Ubah `errors[]` dari backend menjadi { field: pesan } untuk ditampilkan di bawah input. */
export function fieldErrors(error) {
  const result = {};
  for (const { field, message } of error?.errors ?? []) {
    if (field && !result[field]) result[field] = message;
  }
  return result;
}

export const session = {
  set(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    if (user) this.user = user;
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  get token() {
    return localStorage.getItem(TOKEN_KEY);
  },
  get user() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },
  set user(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

/** URL file dari backend (mis. `/uploads/...`); ikut origin API bila VITE_API_BASE_URL berupa URL lengkap. */
export function assetUrl(path) {
  if (!path) return null;
  return /^https?:\/\//.test(BASE_URL) ? new URL(path, BASE_URL).href : path;
}

/** `responseType: 'blob'` untuk mengunduh file; selain itu respons JSON standar backend. */
export async function request(method, path, { body, auth = false, responseType = 'json' } = {}) {
  const headers = { Accept: 'application/json' };
  // FormData (upload file): browser yang mengisi Content-Type beserta boundary-nya.
  const isForm = body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  if (auth && session.token) headers.Authorization = `Bearer ${session.token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.');
  }

  if (responseType === 'blob' && response.ok) return response.blob();

  // Session sudah tidak berlaku di backend (mis. sudah logout): bersihkan lalu kembali ke login.
  if (auth && response.status === 401) {
    session.clear();
    goto('/login');
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    // Error server 5xx: backend sengaja menyertakan stack → tampilkan via overlay global (F4).
    if (response.status >= 500) {
      pushServerError({
        status: response.status,
        message: payload?.message ?? `HTTP ${response.status}`,
        stack: payload?.errors?.[0]?.stack ?? null,
        method,
        path,
      });
    }
    throw new ApiError(
      response.status,
      payload?.message ?? `Terjadi kesalahan (${response.status}). Coba lagi nanti.`,
      payload?.errors ?? [],
      payload?.code ?? null,
    );
  }
  return payload;
}
