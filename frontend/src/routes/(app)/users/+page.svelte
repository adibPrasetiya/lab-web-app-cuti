<script>
  import Button from '#lib/components/Button.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import PageHeader from '#lib/components/PageHeader.svelte';
  import { listUsers } from '#lib/services/users.js';

  const ROLE_BADGE = {
    admin: 'bg-violet-100 text-violet-700',
    atasan: 'bg-blue-100 text-blue-700',
    pegawai: 'bg-slate-100 text-slate-600',
  };

  let items = $state([]);
  let loading = $state(true);
  let error = $state('');

  async function load() {
    loading = true;
    error = '';
    try {
      items = await listUsers();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  load();
</script>

<svelte:head><title>Manajemen Pengguna · Aplikasi Cuti</title></svelte:head>

<PageHeader title="Manajemen Pengguna" subtitle="Kelola akun, role, dan reset password">
  {#snippet actions()}
    <a href="/users/baru">
      <Button type="button" full={false}>
        <Icon name="plus" size={16} />
        Tambah Pengguna
      </Button>
    </a>
  {/snippet}
</PageHeader>

{#if loading}
  <p class="text-sm text-slate-500">Memuat...</p>
{:else if error}
  <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
{:else}
  <div class="overflow-x-auto rounded-md border border-slate-200 bg-white">
    <table class="w-full text-sm">
      <thead class="border-b border-slate-200 bg-slate-50 text-left text-xs tracking-wide text-slate-500 uppercase">
        <tr>
          <th class="px-4 py-3 font-medium">Nama</th>
          <th class="px-4 py-3 font-medium">Username</th>
          <th class="px-4 py-3 font-medium">NIP</th>
          <th class="px-4 py-3 font-medium">Role</th>
          <th class="px-4 py-3 text-right font-medium">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        {#each items as u (u.id)}
          <tr class="hover:bg-slate-50">
            <td class="px-4 py-3 font-medium text-slate-800">{u.nama}</td>
            <td class="px-4 py-3 text-slate-600">{u.username}</td>
            <td class="px-4 py-3 text-slate-600">{u.nip}</td>
            <td class="px-4 py-3">
              <span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {ROLE_BADGE[u.role]}">
                {u.role}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <a href="/users/{u.id}" class="font-medium text-primary-ink hover:underline">Kelola</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
