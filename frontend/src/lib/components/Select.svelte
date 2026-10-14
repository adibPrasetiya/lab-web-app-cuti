<script>
  import Icon from './Icon.svelte';

  // options: [{ value, label }]
  let { id, label = '', value = $bindable(''), options = [], error = '', ...rest } = $props();
</script>

<div>
  {#if label}
    <label for={id} class="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
  {/if}
  <div class="relative">
    <select
      {id}
      name={id}
      bind:value
      aria-invalid={error ? 'true' : undefined}
      class="block w-full appearance-none rounded-md border bg-white py-2.5 pr-10 pl-3 text-sm text-slate-900 transition outline-none focus:ring-2 disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-500 {error
        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
        : 'border-slate-300 focus:border-primary focus:ring-primary/25'}"
      {...rest}
    >
      {#each options as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
    <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
      <Icon name="chevron-down" size={16} />
    </span>
  </div>
  {#if error}
    <p class="mt-1.5 text-xs text-red-600">{error}</p>
  {/if}
</div>
