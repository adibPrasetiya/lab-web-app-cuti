<script>
  import { addMonth, monthLabel, monthMatrix, toDateKey } from '#lib/calendar.js';
  import { formatTanggal } from '#lib/cuti.js';
  import Icon from './Icon.svelte';

  let { id, label = '', value = $bindable(''), error = '', min = '', placeholder = 'Pilih tanggal' } = $props();

  const DOW = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  const today = toDateKey(new Date());

  let open = $state(false);
  let root;

  // Bulan yang sedang ditampilkan di popover (default: dari value, atau hari ini).
  let viewY = $state(new Date().getFullYear());
  let viewM = $state(new Date().getMonth());

  function openPopover() {
    const base = value ? new Date(`${value}T00:00:00`) : new Date();
    viewY = base.getFullYear();
    viewM = base.getMonth();
    open = true;
  }

  function pick(cell) {
    value = toDateKey(cell);
    open = false;
  }

  function shift(delta) {
    ({ year: viewY, monthIndex: viewM } = addMonth(viewY, viewM, delta));
  }

  function onWindowClick(event) {
    if (open && root && !root.contains(event.target)) open = false;
  }
  function onWindowKeydown(event) {
    if (event.key === 'Escape') open = false;
  }

  const cells = $derived(monthMatrix(viewY, viewM));
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} />

<div class="relative" bind:this={root}>
  {#if label}
    <label for={id} class="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
  {/if}
  <button
    {id}
    type="button"
    aria-haspopup="dialog"
    aria-expanded={open}
    onclick={() => (open ? (open = false) : openPopover())}
    class="flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2.5 text-left text-sm transition outline-none focus:ring-2 {error
      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-300 focus:border-primary focus:ring-primary/25'}"
  >
    <span class={value ? 'text-slate-900' : 'text-slate-400'}>{value ? formatTanggal(value) : placeholder}</span>
    <Icon name="calendar" size={16} class="text-slate-400" />
  </button>

  {#if open}
    <div class="absolute z-40 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-lg" role="dialog">
      <div class="mb-2 flex items-center justify-between">
        <button type="button" class="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Bulan sebelumnya" onclick={() => shift(-1)}>
          <Icon name="chevron-left" size={18} />
        </button>
        <span class="text-sm font-semibold text-slate-800">{monthLabel(viewY, viewM)}</span>
        <button type="button" class="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Bulan berikutnya" onclick={() => shift(1)}>
          <Icon name="chevron-right" size={18} />
        </button>
      </div>
      <div class="grid grid-cols-7 text-center text-[11px] font-medium text-slate-400">
        {#each DOW as d, i (i)}<div class="py-1">{d}</div>{/each}
      </div>
      <div class="grid grid-cols-7 gap-0.5">
        {#each cells as cell, i (i)}
          {@const key = toDateKey(cell)}
          {@const inMonth = cell.getMonth() === viewM}
          {@const disabled = min && key < min}
          <button
            type="button"
            {disabled}
            onclick={() => pick(cell)}
            class="flex h-8 items-center justify-center rounded text-sm transition
              {key === value
              ? 'bg-primary font-semibold text-white'
              : key === today
                ? 'font-semibold text-primary-ink ring-1 ring-primary/40'
                : inMonth
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-slate-300 hover:bg-slate-50'}
              {disabled ? 'cursor-not-allowed opacity-30 hover:bg-transparent' : ''}"
          >
            {cell.getDate()}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  {#if error}
    <p class="mt-1.5 text-xs text-red-600">{error}</p>
  {/if}
</div>
