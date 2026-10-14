<script>
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import { dismissToast, toasts } from '../toast.svelte.js';
  import Icon from './Icon.svelte';

  const styles = {
    success: { icon: 'check', color: 'text-green-600' },
    error: { icon: 'alert-circle', color: 'text-red-600' },
    info: { icon: 'mail', color: 'text-yellow-600' },
  };
</script>

<div class="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-full max-w-sm flex-col gap-2" aria-live="polite">
  {#each toasts as item (item.id)}
    <div
      class="pointer-events-auto flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg"
      role={item.variant === 'error' ? 'alert' : 'status'}
      in:fly={{ y: 12, duration: 180 }}
      out:fly={{ x: 24, duration: 150 }}
      animate:flip={{ duration: 180 }}
    >
      <Icon name={styles[item.variant].icon} size={18} class="mt-0.5 {styles[item.variant].color}" />
      <p class="flex-1 text-sm text-gray-700">{item.message}</p>
      <button type="button" class="text-gray-400 hover:text-gray-600" aria-label="Tutup" onclick={() => dismissToast(item.id)}>
        <Icon name="x" size={16} />
      </button>
    </div>
  {/each}
</div>
