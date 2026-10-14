<script>
  import { page } from '$app/state';
  import { assetUrl, session } from '#lib/api.js';
  import Button from '#lib/components/Button.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import { durasiHari, formatTanggal, jenisLabel } from '#lib/cuti.js';
  import { approve, detail, tolak } from '#lib/services/cuti.js';
  import { toast } from '#lib/toast.svelte.js';

  const role = session.user?.role;

  let cuti = $state(null);
  let loading = $state(true);
  let error = $state('');
  let acting = $state(false);
  let showReject = $state(false);
  let catatan = $state('');

  const canAct = $derived(
    cuti &&
      ((role === 'atasan' && cuti.status === 'menunggu_atasan') ||
        (role === 'admin' && cuti.status === 'menunggu_admin')),
  );

  async function load() {
    loading = true;
    error = '';
    try {
      cuti = await detail(page.params.id);
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function doApprove() {
    acting = true;
    try {
      cuti = await approve(cuti.id);
      toast('Pengajuan disetujui');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      acting = false;
    }
  }

  async function doReject() {
    acting = true;
    try {
      cuti = await tolak(cuti.id, catatan);
      showReject = false;
      catatan = '';
      toast('Pengajuan ditolak');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      acting = false;
    }
  }

  load();
</script>

<svelte:head><title>Detail Cuti · Aplikasi Cuti</title></svelte:head>

<div class="mx-auto max-w-2xl">
  <a href="/cuti" class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
    <Icon name="arrow-left" size={16} /> Kembali
  </a>

  {#if loading}
    <p class="text-sm text-gray-500">Memuat...</p>
  {:else if error}
    <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
  {:else if cuti}
    <div class="rounded-md border border-slate-200 bg-white p-6">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-slate-900">{jenisLabel(cuti.jenis)}</h1>
          <p class="mt-1 text-sm text-slate-500">Diajukan oleh {cuti.pemohon.nama} · {cuti.pemohon.nip}</p>
        </div>
        <StatusBadge status={cuti.status} />
      </div>

      <dl class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt class="text-slate-500">Tanggal mulai</dt>
          <dd class="font-medium text-slate-800">{formatTanggal(cuti.startDate)}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Tanggal selesai</dt>
          <dd class="font-medium text-slate-800">{formatTanggal(cuti.endDate)}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Durasi</dt>
          <dd class="font-medium text-slate-800">{durasiHari(cuti.startDate, cuti.endDate)} hari</dd>
        </div>
        <div>
          <dt class="text-slate-500">Surat cuti</dt>
          <dd>
            <a
              href={assetUrl(`/uploads/${cuti.attachmentFilename}`)}
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1 font-medium text-primary-ink hover:underline"
            >
              <Icon name="clipboard" size={15} />
              {cuti.attachmentOriginalName}
            </a>
          </dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-slate-500">Alasan</dt>
          <dd class="font-medium whitespace-pre-line text-slate-800">{cuti.alasan}</dd>
        </div>
      </dl>

      {#if cuti.atasanActedAt || cuti.adminActedAt}
        <div class="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm">
          {#if cuti.atasanActedAt}
            <p class="text-slate-600">
              <span class="font-medium">Atasan:</span>
              {cuti.ditolakOleh === 'atasan' ? 'menolak' : 'menyetujui'}
              {#if cuti.atasanNote}— "{cuti.atasanNote}"{/if}
            </p>
          {/if}
          {#if cuti.adminActedAt}
            <p class="text-slate-600">
              <span class="font-medium">Admin:</span>
              {cuti.ditolakOleh === 'admin' ? 'menolak' : 'menyetujui'}
              {#if cuti.adminNote}— "{cuti.adminNote}"{/if}
            </p>
          {/if}
        </div>
      {/if}

      {#if canAct}
        <div class="mt-6 border-t border-slate-100 pt-4">
          {#if showReject}
            <label for="catatan" class="mb-1.5 block text-sm font-medium text-gray-700">Catatan penolakan (opsional)</label>
            <textarea
              id="catatan"
              bind:value={catatan}
              rows="2"
              class="mb-3 block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-hover focus:ring-2 focus:ring-primary/30"
            ></textarea>
            <div class="flex gap-3">
              <Button type="button" variant="secondary" onclick={() => (showReject = false)} disabled={acting}>Batal</Button>
              <Button type="button" variant="danger" loading={acting} onclick={doReject}>Konfirmasi Tolak</Button>
            </div>
          {:else}
            <div class="flex gap-3">
              <Button type="button" variant="danger" onclick={() => (showReject = true)} disabled={acting}>
                <Icon name="ban" size={16} /> Tolak
              </Button>
              <Button type="button" loading={acting} onclick={doApprove}>
                <Icon name="check" size={16} /> Setujui
              </Button>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
