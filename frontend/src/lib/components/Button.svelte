<script>
  let {
    type = 'submit',
    variant = 'primary',
    full = true,
    loading = false,
    loadingText = 'Memproses...',
    disabled = false,
    children,
    ...rest
  } = $props();

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary/40',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300',
  };
</script>

<button
  {type}
  disabled={disabled || loading}
  class="flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 {variants[
    variant
  ]} {full ? 'w-full' : ''}"
  {...rest}
>
  {#if loading}
    <span class="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" aria-hidden="true"></span>
    {loadingText}
  {:else}
    {@render children()}
  {/if}
</button>
