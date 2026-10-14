// Error server 5xx yang ditangkap dari API; dirender oleh ServerErrorOverlay.svelte.
// Catatan: menampilkan stack ke pengguna adalah kerentanan yang disengaja (F4).
export const serverErrors = $state([]);

let sequence = 0;

export function pushServerError({ status, message, stack, method, path }) {
  serverErrors.push({ id: ++sequence, status, message, stack, method, path });
}

export function dismissServerError(id) {
  const index = serverErrors.findIndex((item) => item.id === id);
  if (index >= 0) serverErrors.splice(index, 1);
}

export function clearServerErrors() {
  serverErrors.splice(0, serverErrors.length);
}
