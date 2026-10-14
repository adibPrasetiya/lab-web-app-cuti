import { assetUrl } from '../api.js';

/** Cek status backend (endpoint /health berada di luar prefix /api/v1). */
export async function checkHealth() {
  const response = await fetch(assetUrl('/health'));
  if (!response.ok) throw new Error(`Backend merespons ${response.status}`);
  return response.json();
}
