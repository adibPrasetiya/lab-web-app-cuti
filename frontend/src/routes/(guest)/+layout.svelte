<script>
  import { checkHealth } from '#lib/services/health.js';

  let { children } = $props();

  let status = $state('memeriksa');

  checkHealth()
    .then((data) => (status = data.status))
    .catch(() => (status = 'tidak terhubung'));
</script>

<main class="flex min-h-screen flex-col items-center justify-center px-4 py-10">
  <div class="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 shadow-sm">
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-semibold">Aplikasi Cuti</h1>
      <p class="mt-1 text-sm text-slate-500">Pengajuan surat cuti pegawai</p>
    </div>
    {@render children()}
  </div>
  <p class="mt-4 text-xs text-slate-500">
    Status backend:
    <span class="font-medium {status === 'ok' ? 'text-green-600' : 'text-red-600'}">{status}</span>
  </p>
</main>
