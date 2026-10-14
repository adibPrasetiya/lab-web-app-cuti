// Notifikasi singkat global; dirender oleh Toaster.svelte di +layout.svelte.
export const toasts = $state([]);

let sequence = 0;

export function toast(message, variant = 'success', timeout = 4000) {
  const id = ++sequence;
  toasts.push({ id, message, variant });
  setTimeout(() => dismissToast(id), timeout);
}

export function dismissToast(id) {
  const index = toasts.findIndex((item) => item.id === id);
  if (index >= 0) toasts.splice(index, 1);
}
