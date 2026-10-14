<script>
  import '@fontsource-variable/inter';
  import '../app.css';
  import ServerErrorOverlay from '#lib/components/ServerErrorOverlay.svelte';
  import Toaster from '#lib/components/Toaster.svelte';

  let { children } = $props();
</script>

<Toaster />
<ServerErrorOverlay />

{@render children()}
