<script>
  import { goto } from '$app/navigation';
  import { fieldErrors } from '#lib/api.js';
  import Button from '#lib/components/Button.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import TextField from '#lib/components/TextField.svelte';
  import { isStrongPassword, PASSWORD_RULES } from '#lib/password.js';
  import { register } from '#lib/services/auth.js';
  import { toast } from '#lib/toast.svelte.js';

  let form = $state({ nama: '', nip: '', username: '', password: '' });
  let confirmPassword = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let errors = $state({});
  let message = $state('');

  const strong = $derived(isStrongPassword(form.password));
  const confirmError = $derived(confirmPassword && confirmPassword !== form.password ? 'Konfirmasi password tidak sama' : '');
  const canSubmit = $derived(
    form.nama.trim() && form.nip.trim() && form.username.trim() && strong && confirmPassword === form.password,
  );

  async function submit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    loading = true;
    errors = {};
    message = '';
    try {
      await register(form);
      toast('Registrasi berhasil, silakan masuk');
      await goto('/login');
    } catch (error) {
      errors = fieldErrors(error);
      message = error.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head><title>Daftar · Aplikasi Cuti</title></svelte:head>

<form class="space-y-4" onsubmit={submit} novalidate>
  {#if message}
    <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{message}</p>
  {/if}

  <TextField id="nama" label="Nama lengkap" bind:value={form.nama} error={errors.nama} autocomplete="name" required />
  <TextField id="nip" label="NIP" bind:value={form.nip} error={errors.nip} inputmode="numeric" required />
  <TextField id="username" label="Username" bind:value={form.username} error={errors.username} autocomplete="username" required />
  <TextField
    id="password"
    label="Password"
    type={showPassword ? 'text' : 'password'}
    bind:value={form.password}
    error={errors.password}
    autocomplete="new-password"
    required
  />

  <ul class="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
    {#each PASSWORD_RULES as rule (rule.label)}
      {@const passed = rule.test(form.password)}
      <li class="flex items-center gap-1.5 {passed ? 'text-green-600' : 'text-slate-500'}">
        <Icon name={passed ? 'check' : 'minus'} size={14} />
        {rule.label}
      </li>
    {/each}
  </ul>

  <TextField
    id="confirmPassword"
    label="Konfirmasi password"
    type={showPassword ? 'text' : 'password'}
    bind:value={confirmPassword}
    error={confirmError}
    autocomplete="new-password"
    required
  />
  <label class="flex items-center gap-2 text-sm text-slate-600">
    <input type="checkbox" bind:checked={showPassword} class="rounded border-slate-300" />
    Tampilkan password
  </label>

  <Button {loading} disabled={!canSubmit}>Daftar</Button>
</form>

<p class="mt-6 text-center text-sm text-slate-500">
  Sudah punya akun?
  <a href="/login" class="font-medium text-primary-ink hover:underline">Masuk</a>
</p>
