<script>
  import { session } from '#lib/api.js';
  import PageHeader from '#lib/components/PageHeader.svelte';
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import { durasiHari, formatTanggal, jenisLabel } from '#lib/cuti.js';
  import { semuaCuti } from '#lib/services/cuti.js';

  const role = session.user?.role;
  // Status yang menjadi tanggung jawab approver ini.
  const myPending = role === 'admin' ? 'menunggu_admin' : 'menunggu_atasan';

  const TABS = [
    { key: 'tindakan', label: 'Perlu Tindakan' },
    { key: 'disetujui', label: 'Disetujui' },
    { key: 'ditolak', label: 'Ditolak' },
    { key: 'semua', label: 'Semua' },
  ];

  let items = $state([]);
  let loading = $state(true);
  let error = $state('');
  let tab = $state('tindakan');

  const counts = $derived({
    tindakan: items.filter((i) => i.status === myPending).length,
    disetujui: items.filter((i) => i.status === 'disetujui').length,
    ditolak: items.filter((i) => i.status === 'ditolak').length,
    semua: items.length,
  });

  const filtered = $derived(
    tab === 'semua'
      ? items
      : tab === 'tindakan'
        ? items.filter((i) => i.status === myPending)
        : items.filter((i) => i.status === tab),
  );

  async function load() {
    loading = true;
    error = '';
    try {
      items = await semuaCuti();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  load();
</script>

<svelte:head><title>Approval · Aplikasi Cuti</title></svelte:head>

<PageHeader title="Approval" subtitle="Tinjau dan kelola pengajuan cuti pegawai" />

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
    </div>
  {:else}
    <div class="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-left text-xs tracking-wide text-slate-500 uppercase">
          <tr>
            <th class="px-4 py-3 font-medium">Pemohon</th>
            <th class="px-4 py-3 font-medium">NIP</th>
            <th class="px-4 py-3 font-medium">Jenis</th>
            <th class="px-4 py-3 font-medium">Periode</th>
            <th class="px-4 py-3 font-medium">Durasi</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#each filtered as item (item.id)}
            {@const actionable = item.status === myPending}
            <tr class="hover:bg-slate-50">
              <td class="px-4 py-3 font-medium text-slate-800">{item.pemohon.nama}</td>
              <td class="px-4 py-3 text-slate-600">{item.pemohon.nip}</td>
              <td class="px-4 py-3 text-slate-600">{jenisLabel(item.jenis)}</td>
              <td class="px-4 py-3 text-slate-600">{formatTanggal(item.startDate)} – {formatTanggal(item.endDate)}</td>
              <td class="px-4 py-3 text-slate-600">{durasiHari(item.startDate, item.endDate)} hari</td>
              <td class="px-4 py-3"><StatusBadge status={item.status} /></td>
              <td class="px-4 py-3 text-right">
                <a href="/cuti/{item.id}" class="font-medium {actionable ? 'text-primary-ink' : 'text-slate-500'} hover:underline">
                  {actionable ? 'Tinjau' : 'Lihat'}
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
{/if}
