<script>
  import { goto } from '$app/navigation';
  import { session } from '#lib/api.js';
  import Icon from '#lib/components/Icon.svelte';
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import { addMonth, monthLabel, monthMatrix, splitIntoWeeks, toDateKey, toMonthParam, weekSegments } from '#lib/calendar.js';
  import { formatTanggal, jenisLabel, STATUS_META, statusMeta } from '#lib/cuti.js';
  import { kalender } from '#lib/services/cuti.js';

  const role = session.user?.role;
  const isApprover = role === 'atasan' || role === 'admin';
  const DOW = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const MAX_LANES = 3;

  const today = new Date();
  const todayKey = toDateKey(today);

  let year = $state(today.getFullYear());
  let monthIndex = $state(today.getMonth());
  let items = $state([]);
  let loading = $state(true);
  let error = $state('');

  const weeks = $derived(splitIntoWeeks(monthMatrix(year, monthIndex)));
  // Daftar cuti bulan ini (hanya yang mulai di bulan tampil), urut tanggal.
  const monthList = $derived(
    [...items].sort((a, b) => a.startDate.localeCompare(b.startDate)),
  );

  const labelOf = (item) => (isApprover ? item.pemohon.nama : jenisLabel(item.jenis));

  async function load(y, m) {
    loading = true;
    error = '';
    try {
      items = await kalender(toMonthParam(y, m));
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    load(year, monthIndex);
  });

  function shift(delta) {
    ({ year, monthIndex } = addMonth(year, monthIndex, delta));
  }
  function goToday() {
    year = today.getFullYear();
    monthIndex = today.getMonth();
  }
</script>

<svelte:head><title>Kalender Cuti · Aplikasi Cuti</title></svelte:head>

<div class="mb-5 flex flex-wrap items-center justify-between gap-4">
  <div>
    <h1 class="text-xl font-semibold tracking-tight text-slate-900">Kalender Cuti</h1>
    <p class="mt-1 text-sm text-slate-500">{isApprover ? 'Cuti seluruh pegawai' : 'Jadwal cuti Anda'}</p>
  </div>
  <div class="flex items-center gap-2">
    <button type="button" class="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50" onclick={goToday}>
      Hari ini
    </button>
    <div class="flex items-center rounded-md border border-slate-300 bg-white">
      <button type="button" class="px-2 py-1.5 text-slate-500 hover:bg-slate-50" aria-label="Bulan sebelumnya" onclick={() => shift(-1)}>
        <Icon name="chevron-left" size={18} />
      </button>
      <span class="min-w-40 text-center text-sm font-semibold text-slate-800">{monthLabel(year, monthIndex)}</span>
      <button type="button" class="px-2 py-1.5 text-slate-500 hover:bg-slate-50" aria-label="Bulan berikutnya" onclick={() => shift(1)}>
        <Icon name="chevron-right" size={18} />
      </button>
    </div>
  </div>
</div>

{#if error}
  <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
{:else}
  <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
    <!-- Kalender -->
    <div class="overflow-hidden rounded-md border border-slate-200 bg-white {loading ? 'opacity-60' : ''}">
      <div class="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {#each DOW as d (d)}
          <div class="px-2 py-2.5 text-center">{d.slice(0, 3)}</div>
        {/each}
      </div>

      {#each weeks as week, wi (wi)}
        {@const segs = weekSegments(week, items)}
        {@const lanes = segs.slice(0, MAX_LANES)}
        {@const overflow = segs.length - lanes.length}
        <div class="relative min-h-28 border-b border-slate-100 last:border-b-0">
          <!-- Latar sel hari (border & arsiran luar bulan) -->
          <div class="absolute inset-0 grid grid-cols-7">
            {#each week as cell, di (di)}
              {@const inMonth = cell.getMonth() === monthIndex}
              <div class="{di !== 6 ? 'border-r border-slate-100' : ''} {inMonth ? '' : 'bg-slate-50/50'}"></div>
            {/each}
          </div>

          <!-- Nomor tanggal -->
          <div class="relative grid grid-cols-7">
            {#each week as cell, di (di)}
              {@const key = toDateKey(cell)}
              {@const inMonth = cell.getMonth() === monthIndex}
              {@const isToday = key === todayKey}
              <div class="flex justify-end px-1.5 pt-1.5">
                <span
                  class="flex size-6 items-center justify-center rounded-full text-xs {isToday
                    ? 'bg-primary font-semibold text-white'
                    : inMonth
                      ? 'text-slate-600'
                      : 'text-slate-300'}"
                >
                  {cell.getDate()}
                </span>
              </div>
            {/each}
          </div>

          <!-- Bar cuti melintang -->
          <div class="relative mt-1 space-y-1 px-1 pb-2">
            {#each lanes as seg (seg.item.id)}
              {@const meta = statusMeta(seg.item.status)}
              <div class="grid grid-cols-7">
                <button
                  type="button"
                  onclick={() => goto(`/cuti/${seg.item.id}`)}
                  title="{labelOf(seg.item)} · {meta.label}"
                  style="grid-column: {seg.colStart} / span {seg.span};"
                  class="mx-0.5 truncate px-2 py-0.5 text-left text-xs font-medium {meta.bar} {seg.isStart
                    ? 'rounded-l'
                    : ''} {seg.isEnd ? 'rounded-r' : ''}"
                >
                  {seg.isStart ? labelOf(seg.item) : ' '}
                </button>
              </div>
            {/each}
            {#if overflow > 0}
              <p class="px-1.5 text-xs text-slate-400">+{overflow} lainnya</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Panel samping: daftar cuti bulan ini -->
    <aside class="rounded-md border border-slate-200 bg-white">
      <div class="border-b border-slate-200 px-4 py-3">
        <h2 class="text-sm font-semibold text-slate-800">Cuti · {monthLabel(year, monthIndex)}</h2>
        <p class="mt-0.5 text-xs text-slate-500">{monthList.length} pengajuan</p>
      </div>
      <div class="max-h-[32rem] divide-y divide-slate-100 overflow-y-auto">
        {#if monthList.length === 0}
          <p class="px-4 py-8 text-center text-sm text-slate-400">Tidak ada cuti bulan ini.</p>
        {:else}
          {#each monthList as item (item.id)}
            {@const meta = statusMeta(item.status)}
            <button type="button" onclick={() => goto(`/cuti/${item.id}`)} class="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50">
              <span class="mt-1 size-2.5 shrink-0 rounded-full {meta.dot}"></span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-slate-800">{labelOf(item)}</span>
                <span class="block text-xs text-slate-500">{formatTanggal(item.startDate)} – {formatTanggal(item.endDate)}</span>
                {#if isApprover}<span class="mt-0.5 block text-xs text-slate-400">{jenisLabel(item.jenis)}</span>{/if}
              </span>
            </button>
          {/each}
        {/if}
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200 px-4 py-3">
        {#each Object.entries(STATUS_META) as [status, meta] (status)}
          <span class="flex items-center gap-1.5 text-xs text-slate-600">
            <span class="size-2.5 rounded-full {meta.dot}"></span>
            {meta.label}
          </span>
        {/each}
      </div>
    </aside>
  </div>
{/if}
