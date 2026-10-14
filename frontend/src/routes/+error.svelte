<script>
  import { page } from '$app/state';

  const notFound = $derived(page.status === 404);
</script>

<svelte:head><title>{notFound ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan'} · Aplikasi Cuti</title></svelte:head>

<main class="flex min-h-screen items-center justify-center px-4">
  <div class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
    <h1 class="text-xl font-semibold">{notFound ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan'}</h1>
    <p class="mt-1 text-sm text-gray-500">
      {notFound ? 'Halaman yang Anda cari tidak tersedia.' : (page.error?.message ?? 'Coba muat ulang halaman.')}
    </p>
    <a href="/" class="mt-6 block text-sm font-medium text-primary-ink hover:underline">Kembali ke beranda</a>
  </div>
</main>
