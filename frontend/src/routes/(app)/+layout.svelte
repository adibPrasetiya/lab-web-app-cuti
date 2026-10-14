<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Icon from '#lib/components/Icon.svelte';
  import { logout } from '#lib/services/auth.js';
  import { toast } from '#lib/toast.svelte.js';

  let { data, children } = $props();

  let leaving = $state(false);
  let menuOpen = $state(false);
  let menuRef;

  const isApprover = $derived(data.user.role === 'atasan' || data.user.role === 'admin');
  const isAdmin = $derived(data.user.role === 'admin');

  const nav = $derived([
    { href: '/', label: 'Dashboard', icon: 'dashboard' },
    { href: '/kalender', label: 'Kalender', icon: 'calendar' },
    { href: '/cuti', label: 'Pengajuan Cuti', icon: 'clipboard' },
    ...(isApprover ? [{ href: '/approvals', label: 'Approval', icon: 'check' }] : []),
    ...(isAdmin ? [{ href: '/users', label: 'Manajemen Pengguna', icon: 'users' }] : []),
  ]);

  // Judul halaman aktif untuk ditampilkan di header.
  const pageTitle = $derived(
    nav.find((item) => isActive(item.href))?.label ??
      (page.url.pathname.startsWith('/profile') ? 'Profil' : 'Aplikasi Cuti'),
  );

  // Cocokkan path saat ini dengan item nav (root hanya cocok persis).
  function isActive(href) {
    return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
  }

  // Tutup dropdown saat klik di luar area menu.
  function onWindowClick(event) {
    if (menuOpen && menuRef && !menuRef.contains(event.target)) menuOpen = false;
  }

  function onWindowKeydown(event) {
    if (event.key === 'Escape') menuOpen = false;
  }

  async function signOut() {
    menuOpen = false;
    leaving = true;
    try {
      await logout();
    } catch {
      // Session lokal tetap dihapus walau request logout gagal.
    }
    toast('Anda telah keluar');
    await goto('/login');
  }
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} />

<div class="flex min-h-screen">
  <aside class="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
    <div class="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
      <span class="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">C</span>
      <a href="/" class="text-base font-semibold tracking-tight text-slate-900">Aplikasi Cuti</a>
    </div>

    <nav class="flex-1 px-3 py-4">
      <p class="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Menu</p>
      <div class="space-y-0.5">
        {#each nav as item (item.href)}
          <a
            href={item.href}
            class="flex items-center gap-3 border-l-2 py-2 pr-3 pl-3 text-sm font-medium transition {isActive(item.href)
              ? 'border-primary bg-primary/5 text-primary-ink'
              : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </a>
        {/each}
      </div>
    </nav>
  </aside>

  <div class="flex min-w-0 flex-1 flex-col">
    <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 class="text-base font-semibold text-slate-800">{pageTitle}</h1>

      <div class="relative" bind:this={menuRef}>
        <button
          type="button"
          class="flex items-center gap-2 rounded-md border border-slate-200 py-1 pr-2 pl-1 text-sm transition hover:bg-slate-50"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onclick={() => (menuOpen = !menuOpen)}
        >
          <span class="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary-ink">
            <Icon name="user" size={18} />
          </span>
          <span class="hidden max-w-32 truncate font-medium text-slate-700 sm:block">{data.user.nama}</span>
          <Icon name="chevron-down" size={16} class="text-slate-400" />
        </button>

        {#if menuOpen}
          <div
            class="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg"
            role="menu"
          >
            <div class="border-b border-slate-100 px-4 py-3">
              <p class="truncate text-sm font-medium">{data.user.nama}</p>
              <p class="text-xs text-slate-500 capitalize">{data.user.role}</p>
            </div>
            <a
              href="/profile"
              class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              role="menuitem"
              onclick={() => (menuOpen = false)}
            >
              <Icon name="user" size={16} />
              Profil
            </a>
            <button
              type="button"
              class="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
              role="menuitem"
              onclick={signOut}
              disabled={leaving}
            >
              <Icon name="logout" size={16} />
              Keluar
            </button>
          </div>
        {/if}
      </div>
    </header>

    <main class="w-full flex-1 overflow-x-hidden px-6 py-6">
      {@render children()}
    </main>
  </div>
</div>
