<script>
  import Icon from '#lib/components/Icon.svelte';

  let { data } = $props();

  const isApprover = $derived(data.user.role === 'atasan' || data.user.role === 'admin');
  const isAdmin = $derived(data.user.role === 'admin');

  const actions = $derived([
    { href: '/cuti/baru', icon: 'plus', title: 'Ajukan Cuti', desc: 'Buat pengajuan cuti baru' },
    { href: '/cuti', icon: 'clipboard', title: 'Pengajuan Saya', desc: 'Lihat riwayat pengajuan' },
    { href: '/kalender', icon: 'calendar', title: 'Kalender', desc: 'Jadwal cuti bulanan' },
    ...(isApprover ? [{ href: '/approvals', icon: 'check', title: 'Approval', desc: 'Tinjau pengajuan pegawai' }] : []),
    ...(isAdmin ? [{ href: '/users', icon: 'users', title: 'Manajemen Pengguna', desc: 'Kelola akun & role' }] : []),
  ]);
</script>

<svelte:head><title>Dashboard · Aplikasi Cuti</title></svelte:head>

<div class="rounded-md border border-slate-200 bg-white p-6">
  <p class="text-sm text-slate-500">Selamat datang,</p>
  <h1 class="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900">{data.user.nama}</h1>
  <div class="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
    <div><span class="text-slate-500">Username:</span> <span class="font-medium text-slate-800">{data.user.username}</span></div>
    <div><span class="text-slate-500">NIP:</span> <span class="font-medium text-slate-800">{data.user.nip}</span></div>
    <div>
      <span class="text-slate-500">Role:</span>
      <span class="font-medium text-slate-800 capitalize">{data.user.role}</span>
    </div>
  </div>
</div>

<h2 class="mt-6 mb-3 text-sm font-semibold tracking-wider text-slate-400 uppercase">Aksi Cepat</h2>
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#each actions as a (a.href)}
    <a
      href={a.href}
      class="group flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4 transition hover:border-primary/40 hover:shadow-sm"
    >
      <span class="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary-ink">
        <Icon name={a.icon} size={20} />
      </span>
      <span>
        <span class="block font-medium text-slate-800 group-hover:text-primary-ink">{a.title}</span>
        <span class="block text-sm text-slate-500">{a.desc}</span>
      </span>
    </a>
  {/each}
</div>
