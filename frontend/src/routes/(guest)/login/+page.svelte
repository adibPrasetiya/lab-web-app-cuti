<script>
  import { goto } from '$app/navigation';
  import { fieldErrors } from '#lib/api.js';
  import Button from '#lib/components/Button.svelte';
  import TextField from '#lib/components/TextField.svelte';
  import { login } from '#lib/services/auth.js';
  import { toast } from '#lib/toast.svelte.js';

  let username = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let errors = $state({});
  let message = $state('');

  async function submit(event) {
    event.preventDefault();
    loading = true;
    errors = {};
    message = '';
    try {
      const user = await login(username, password);
      toast(`Selamat datang, ${user.nama}`);
      await goto('/');
    } catch (error) {
      errors = fieldErrors(error);
      message = error.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head><title>Masuk · Aplikasi Cuti</title></svelte:head>

<form class="space-y-4" onsubmit={submit} novalidate>
  {#if message}
    <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{message}</p>
  {/if}

  <TextField id="username" label="Username" bind:value={username} error={errors.username} autocomplete="username" required />
  <TextField
    id="password"
    label="Password"
    type={showPassword ? 'text' : 'password'}
    bind:value={password}
    error={errors.password}
    autocomplete="current-password"
    required
  />
  <label class="flex items-center gap-2 text-sm text-slate-600">
    <input type="checkbox" bind:checked={showPassword} class="rounded border-slate-300" />
    Tampilkan password
  </label>

  <Button {loading}>Masuk</Button>
</form>

<p class="mt-6 text-center text-sm text-slate-500">
  Belum punya akun?
  <a href="/register" class="font-medium text-primary-ink hover:underline">Daftar</a>
</p>
