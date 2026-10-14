<script>
  import { statusMeta } from '#lib/cuti.js';

  let { status, size = 'sm' } = $props();

  const meta = $derived(statusMeta(status));
  const pad = $derived(size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs');
</script>

<span class="inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap {pad} {meta.badge}">
  <span class="size-1.5 rounded-full bg-current opacity-70"></span>
  {meta.label}
</span>
