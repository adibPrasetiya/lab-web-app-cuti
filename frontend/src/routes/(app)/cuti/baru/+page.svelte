<script>
  import { goto } from '$app/navigation';
  import { fieldErrors } from '#lib/api.js';
  import Button from '#lib/components/Button.svelte';
  import DatePicker from '#lib/components/DatePicker.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import Select from '#lib/components/Select.svelte';
  import { JENIS_LABEL } from '#lib/cuti.js';
  import { ajukan } from '#lib/services/cuti.js';
  import { toast } from '#lib/toast.svelte.js';

  const jenisOptions = Object.entries(JENIS_LABEL).map(([value, label]) => ({ value, label }));

  let form = $state({ jenis: 'tahunan', startDate: '', endDate: '', alasan: '' });
  // File surat disimpan di sini saat dipilih; TIDAK diunggah sampai klik "Kirim".
  let file = $state(null);
  let fileInput = $state();
  let saving = $state(false);
  let errors = $state({});
  let message = $state('');

  function onFileChange(event) {
    file = event.currentTarget.files?.[0] ?? null;
  }

  function clearFile() {
    file = null;
    if (fileInput) fileInput.value = '';
  }

  async function submit(event) {
    event.preventDefault();
    errors = {};
    message = '';
    if (!file) {
      errors = { surat: 'Surat cuti wajib diunggah' };
      return;
    }
    saving = true;
    try {
      // FormData baru dibangun di sini: file dikirim hanya saat submit.
      const payload = new FormData();
      payload.append('jenis', form.jenis);
      payload.append('startDate', form.startDate);
      payload.append('endDate', form.endDate);
      payload.append('alasan', form.alasan);
      payload.append('surat', file);
      await ajukan(payload);
      toast('Pengajuan cuti terkirim');
      await goto('/cuti');
    } catch (e) {
      errors = fieldErrors(e);
      message = e.message;
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head><title>Ajukan Cuti · Aplikasi Cuti</title></svelte:head>

<div class="mx-auto max-w-xl">
  <a href="/cuti" class="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
    <Icon name="arrow-left" size={16} /> Kembali
  </a>
  <div class="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
    <h1 class="text-xl font-semibold">Ajukan Cuti</h1>
    <p class="mt-1 mb-6 text-sm text-slate-500">Lengkapi data dan unggah surat cuti.</p>

    <form class="space-y-4" onsubmit={submit} novalidate>
      {#if message}
        <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{message}</p>
      {/if}

      <Select id="jenis" label="Jenis cuti" bind:value={form.jenis} options={jenisOptions} />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DatePicker id="startDate" label="Tanggal mulai" bind:value={form.startDate} error={errors.startDate} />
        <DatePicker id="endDate" label="Tanggal selesai" bind:value={form.endDate} error={errors.endDate} min={form.startDate} />
      </div>

      <div>
        <label for="alasan" class="mb-1.5 block text-sm font-medium text-slate-700">Alasan</label>
        <textarea
          id="alasan"
          bind:value={form.alasan}
          rows="3"
          class="block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 {errors.alasan
            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-300 focus:border-primary-hover focus:ring-primary/30'}"
        ></textarea>
        {#if errors.alasan}<p class="mt-1.5 text-xs text-red-600">{errors.alasan}</p>{/if}
      </div>

      <div>
        <span class="mb-1.5 block text-sm font-medium text-slate-700">Surat cuti</span>
        {#if file}
          <div class="flex items-center justify-between gap-3 rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm">
            <span class="flex items-center gap-2 truncate text-slate-700">
              <Icon name="clipboard" size={16} />
              <span class="truncate">{file.name}</span>
              <span class="shrink-0 text-xs text-slate-400">({Math.ceil(file.size / 1024)} KB)</span>
            </span>
            <button type="button" class="shrink-0 text-slate-400 hover:text-red-600" aria-label="Hapus file" onclick={clearFile}>
              <Icon name="x" size={16} />
            </button>
          </div>
        {:else}
          <label
            class="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500 hover:border-primary hover:text-primary-ink"
          >
            <Icon name="upload" size={18} />
            Pilih file (PDF, JPG, atau PNG)
            <input bind:this={fileInput} type="file" accept=".pdf,.jpg,.jpeg,.png" class="hidden" onchange={onFileChange} />
          </label>
        {/if}
        {#if errors.surat}<p class="mt-1.5 text-xs text-red-600">{errors.surat}</p>{/if}
      </div>

      <Button loading={saving} loadingText="Mengirim...">Kirim</Button>
    </form>
  </div>
</div>
