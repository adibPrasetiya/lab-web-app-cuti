<script>
  let { title, subtitle = '', actions } = $props();
</script>

<div class="mb-5 flex flex-wrap items-end justify-between gap-4">
  <div>
    <h1 class="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
    {#if subtitle}
      <p class="mt-1 text-sm text-slate-500">{subtitle}</p>
    {/if}
  </div>
  {#if actions}
    <div class="flex items-center gap-2">{@render actions()}</div>
  {/if}
</div>
