<script>
  import Button from '#lib/components/Button.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import PageHeader from '#lib/components/PageHeader.svelte';
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import { durasiHari, formatTanggal, jenisLabel } from '#lib/cuti.js';
  import { listSaya } from '#lib/services/cuti.js';

  const TABS = [
    { key: 'semua', label: 'Semua' },
    { key: 'menunggu', label: 'Menunggu' },
    { key: 'disetujui', label: 'Disetujui' },
    { key: 'ditolak', label: 'Ditolak' },
  ];

  let items = $state([]);
  let loading = $state(true);
  let error = $state('');
  let tab = $state('semua');

  const counts = $derived({
    semua: items.length,
    menunggu: items.filter((i) => i.status.startsWith('menunggu')).length,
    disetujui: items.filter((i) => i.status === 'disetujui').length,
    ditolak: items.filter((i) => i.status === 'ditolak').length,
  });

  const filtered = $derived(
    tab === 'semua'
      ? items
      : tab === 'menunggu'
        ? items.filter((i) => i.status.startsWith('menunggu'))
        : items.filter((i) => i.status === tab),
  );

  async function load() {
    loading = true;
    error = '';
    try {
      items = await listSaya();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  load();
</script>

<svelte:head><title>Pengajuan Cuti · Aplikasi Cuti</title></svelte:head>

<PageHeader title="Pengajuan Cuti" subtitle="Riwayat seluruh pengajuan cuti Anda">
  {#snippet actions()}
    <a href="/cuti/baru">
      <Button type="button" full={false}>
        <Icon name="plus" size={16} />
        Ajukan Cuti
      </Button>
    </a>
  {/snippet}
</PageHeader>

{#if loading}
  <p class="text-sm text-slate-500">Memuat...</p>
{:else if error}
  <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
{:else}
  <div class="mb-4 flex flex-wrap gap-1 border-b border-slate-200">
    {#each TABS as t (t.key)}
      <button
        type="button"
        onclick={() => (tab = t.key)}
        class="-mb-px border-b-2 px-3 py-2 text-sm font-medium transition {tab === t.key
          ? 'border-primary text-primary-ink'
          : 'border-transparent text-slate-500 hover:text-slate-800'}"
      >
        {t.label}
        <span class="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">{counts[t.key]}</span>
      </button>
    {/each}
  </div>

  {#if filtered.length === 0}
    <div class="rounded-md border border-dashed border-slate-300 bg-white p-12 text-center">
      <p class="text-sm text-slate-500">Tidak ada pengajuan pada kategori ini.</p>
      <a href="/cuti/baru" class="mt-3 inline-block text-sm font-medium text-primary-ink hover:underline">Buat pengajuan</a>
    </div>
  {:else}
    <div class="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-left text-xs tracking-wide text-slate-500 uppercase">
          <tr>
            <th class="px-4 py-3 font-medium">Jenis</th>
            <th class="px-4 py-3 font-medium">Tanggal Mulai</th>
            <th class="px-4 py-3 font-medium">Tanggal Selesai</th>
            <th class="px-4 py-3 font-medium">Durasi</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#each filtered as item (item.id)}
            <tr class="hover:bg-slate-50">
              <td class="px-4 py-3 font-medium text-slate-800">{jenisLabel(item.jenis)}</td>
              <td class="px-4 py-3 text-slate-600">{formatTanggal(item.startDate)}</td>
              <td class="px-4 py-3 text-slate-600">{formatTanggal(item.endDate)}</td>
              <td class="px-4 py-3 text-slate-600">{durasiHari(item.startDate, item.endDate)} hari</td>
              <td class="px-4 py-3"><StatusBadge status={item.status} /></td>
              <td class="px-4 py-3 text-right">
                <a href="/cuti/{item.id}" class="font-medium text-primary-ink hover:underline">Detail</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
{/if}
