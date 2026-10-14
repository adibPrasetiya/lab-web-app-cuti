<script>
  let { id, label, type = 'text', value = $bindable(''), error = '', ...rest } = $props();
</script>

<div>
  <label for={id} class="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
  <input
    {id}
    name={id}
    {type}
    bind:value
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={error ? `${id}-error` : undefined}
    class="block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition outline-none focus:ring-2 disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-500 {error
      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-300 focus:border-primary focus:ring-primary/25'}"
    {...rest}
  />
  {#if error}
    <p id="{id}-error" class="mt-1.5 text-xs text-red-600">{error}</p>
  {/if}
</div>
