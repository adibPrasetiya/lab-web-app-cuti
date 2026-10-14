<script>
  import { fade, fly } from 'svelte/transition';
  import { clearServerErrors, dismissServerError, serverErrors } from '../serverError.svelte.js';
  import Icon from './Icon.svelte';

  // Tampilkan error 5xx terakhir.
  const current = $derived(serverErrors[serverErrors.length - 1] ?? null);

  function onKeydown(event) {
    if (event.key === 'Escape' && current) dismissServerError(current.id);
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if current}
  <div class="fixed inset-0 z-[70] flex items-center justify-center p-4" transition:fade={{ duration: 120 }}>
    <button
      type="button"
      class="absolute inset-0 cursor-default bg-black/40"
      aria-label="Tutup kesalahan server"
      onclick={() => dismissServerError(current.id)}
    ></button>
    <div
      class="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-red-200 bg-white shadow-2xl"
      role="alertdialog"
      aria-modal="true"
      aria-label="Kesalahan server"
      transition:fly={{ y: 16, duration: 160 }}
    >
      <div class="flex items-start justify-between gap-4 border-b border-red-100 bg-red-50 px-5 py-3">
        <div class="flex items-center gap-2 text-red-700">
          <Icon name="alert-circle" size={20} />
          <div>
            <p class="text-sm font-semibold">HTTP {current.status} · Internal Server Error</p>
            <p class="font-mono text-xs text-red-600/80">{current.method} {current.path}</p>
          </div>
        </div>
        <button type="button" class="text-red-400 hover:text-red-700" aria-label="Tutup" onclick={() => dismissServerError(current.id)}>
          <Icon name="x" size={18} />
        </button>
      </div>

      <div class="overflow-auto px-5 py-4">
        <p class="mb-3 text-sm font-medium text-gray-800">{current.message}</p>
        {#if current.stack}
          <pre class="overflow-auto rounded-md bg-gray-900 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-100">{current.stack}</pre>
        {:else}
          <p class="text-xs text-gray-500">Tidak ada stack trace pada respons.</p>
        {/if}
      </div>

      <div class="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">
        {#if serverErrors.length > 1}
          <button type="button" class="rounded-md px-3 py-2 text-sm text-gray-500 hover:text-gray-800" onclick={clearServerErrors}>
            Tutup semua ({serverErrors.length})
          </button>
        {/if}
        <button
          type="button"
          class="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          onclick={() => dismissServerError(current.id)}
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
{/if}
