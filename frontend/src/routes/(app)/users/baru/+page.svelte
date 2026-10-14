<script>
  import { goto } from '$app/navigation';
  import { fieldErrors } from '#lib/api.js';
  import Button from '#lib/components/Button.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import Select from '#lib/components/Select.svelte';
  import TextField from '#lib/components/TextField.svelte';
  import { isStrongPassword, PASSWORD_RULES } from '#lib/password.js';
  import { createUser } from '#lib/services/users.js';
  import { toast } from '#lib/toast.svelte.js';

  const ROLE_OPTIONS = [
    { value: 'pegawai', label: 'Pegawai' },
    { value: 'atasan', label: 'Atasan' },
    { value: 'admin', label: 'Admin' },
  ];

  let form = $state({ nama: '', nip: '', username: '', password: '', role: 'pegawai' });
  let confirmPassword = $state('');
  let showPassword = $state(false);
  let saving = $state(false);
  let errors = $state({});
  let message = $state('');

  const strong = $derived(isStrongPassword(form.password));
  const canSubmit = $derived(
    form.nama.trim() && form.nip.trim() && form.username.trim() && strong && confirmPassword === form.password,
  );

  async function submit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    saving = true;
    errors = {};
    message = '';
    try {
      await createUser(form);
      toast('Pengguna berhasil dibuat');
      await goto('/users');
    } catch (error) {
      errors = fieldErrors(error);
      message = error.message;
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head><title>Tambah Pengguna · Aplikasi Cuti</title></svelte:head>

<div class="mx-auto max-w-xl">
  <a href="/users" class="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
    <Icon name="arrow-left" size={16} /> Kembali
  </a>
  <div class="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
    <h1 class="text-xl font-semibold">Tambah Pengguna</h1>
    <p class="mt-1 mb-6 text-sm text-slate-500">Buat akun baru dan tentukan role-nya.</p>

    <form class="space-y-4" onsubmit={submit} novalidate>
      {#if message}
        <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{message}</p>
      {/if}

      <TextField id="nama" label="Nama lengkap" bind:value={form.nama} error={errors.nama} required />
      <TextField id="nip" label="NIP" bind:value={form.nip} error={errors.nip} inputmode="numeric" required />
      <TextField id="username" label="Username" bind:value={form.username} error={errors.username} required />

      <Select id="role" label="Role" bind:value={form.role} options={ROLE_OPTIONS} />

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
        error={confirmPassword && confirmPassword !== form.password ? 'Konfirmasi password tidak sama' : ''}
        autocomplete="new-password"
        required
      />
      <label class="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" bind:checked={showPassword} class="rounded border-slate-300" />
        Tampilkan password
      </label>

      <Button loading={saving} disabled={!canSubmit}>Simpan</Button>
    </form>
  </div>
</div>
