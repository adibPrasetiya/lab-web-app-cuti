<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { fieldErrors, session } from '#lib/api.js';
  import Button from '#lib/components/Button.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import Select from '#lib/components/Select.svelte';
  import TextField from '#lib/components/TextField.svelte';
  import { isStrongPassword, PASSWORD_RULES } from '#lib/password.js';
  import { detailUser, removeUser, resetUserPassword, updateUser } from '#lib/services/users.js';
  import { toast } from '#lib/toast.svelte.js';

  const ROLE_OPTIONS = [
    { value: 'pegawai', label: 'Pegawai' },
    { value: 'atasan', label: 'Atasan' },
    { value: 'admin', label: 'Admin' },
  ];
  const userId = Number(page.params.id);
  const isSelf = $derived(session.user?.id === userId);

  let user = $state(null);
  let loading = $state(true);
  let loadError = $state('');

  // Form data & role
  let form = $state({ nama: '', nip: '', role: 'pegawai' });
  let savingProfile = $state(false);
  let profileErrors = $state({});

  // Reset password (admin menyetel password baru)
  let pw = $state('');
  let pwConfirm = $state('');
  let showPw = $state(false);
  let savingPw = $state(false);
  const pwStrong = $derived(isStrongPassword(pw));
  const canSavePw = $derived(pwStrong && pw.length > 0 && pw === pwConfirm);

  // Hapus
  let confirmDelete = $state(false);
  let deleting = $state(false);

  async function load() {
    loading = true;
    loadError = '';
    try {
      user = await detailUser(userId);
      form = { nama: user.nama, nip: user.nip, role: user.role };
    } catch (e) {
      loadError = e.message;
    } finally {
      loading = false;
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    savingProfile = true;
    profileErrors = {};
    try {
      user = await updateUser(userId, form);
      form = { nama: user.nama, nip: user.nip, role: user.role };
      if (isSelf) session.user = { ...session.user, ...user };
      toast('Data pengguna diperbarui');
    } catch (e) {
      profileErrors = fieldErrors(e);
      if (!Object.keys(profileErrors).length) toast(e.message, 'error');
    } finally {
      savingProfile = false;
    }
  }

  async function savePassword(event) {
    event.preventDefault();
    if (!canSavePw) return;
    savingPw = true;
    try {
      await resetUserPassword(userId, pw);
      pw = '';
      pwConfirm = '';
      toast('Password pengguna direset');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      savingPw = false;
    }
  }

  async function doDelete() {
    deleting = true;
    try {
      await removeUser(userId);
      toast('Pengguna dihapus');
      await goto('/users');
    } catch (e) {
      toast(e.message, 'error');
      deleting = false;
    }
  }

  load();
</script>

<svelte:head><title>Kelola Pengguna · Aplikasi Cuti</title></svelte:head>

<div class="mx-auto max-w-xl">
  <a href="/users" class="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
    <Icon name="arrow-left" size={16} /> Kembali
  </a>

  {#if loading}
    <p class="text-sm text-slate-500">Memuat...</p>
  {:else if loadError}
    <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{loadError}</p>
  {:else if user}
    <div class="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-xl font-semibold">{user.nama}</h1>
      <p class="mt-1 mb-6 text-sm text-slate-500">{user.username}</p>

      <form class="space-y-4" onsubmit={saveProfile} novalidate>
        <TextField id="nama" label="Nama lengkap" bind:value={form.nama} error={profileErrors.nama} required />
        <TextField id="nip" label="NIP" bind:value={form.nip} error={profileErrors.nip} required />
        <Select id="role" label="Role" bind:value={form.role} options={ROLE_OPTIONS} />
        <Button loading={savingProfile}>Simpan Perubahan</Button>
      </form>
    </div>

    <div class="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold">Reset Password</h2>
      <p class="mt-1 mb-4 text-sm text-slate-500">Setel password baru untuk pengguna ini (alur lupa password).</p>

      <form class="space-y-4" onsubmit={savePassword} novalidate>
        <TextField id="rpw" label="Password baru" type={showPw ? 'text' : 'password'} bind:value={pw} autocomplete="new-password" required />
        <ul class="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
          {#each PASSWORD_RULES as rule (rule.label)}
            {@const passed = rule.test(pw)}
            <li class="flex items-center gap-1.5 {passed ? 'text-green-600' : 'text-slate-500'}">
              <Icon name={passed ? 'check' : 'minus'} size={14} />
              {rule.label}
            </li>
          {/each}
        </ul>
        <TextField
          id="rpwc"
          label="Konfirmasi password baru"
          type={showPw ? 'text' : 'password'}
          bind:value={pwConfirm}
          error={pwConfirm && pwConfirm !== pw ? 'Konfirmasi password tidak sama' : ''}
          autocomplete="new-password"
          required
        />
        <label class="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" bind:checked={showPw} class="rounded border-slate-300" />
          Tampilkan password
        </label>
        <Button loading={savingPw} disabled={!canSavePw}>Reset Password</Button>
      </form>
    </div>

    {#if !isSelf}
      <div class="mt-6 rounded-md border border-red-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-red-700">Hapus Pengguna</h2>
        <p class="mt-1 mb-4 text-sm text-slate-500">Tindakan ini permanen dan tidak dapat dibatalkan.</p>
        {#if confirmDelete}
          <p class="mb-3 text-sm text-slate-700">Yakin menghapus <strong>{user.nama}</strong>?</p>
          <div class="flex gap-3">
            <Button type="button" variant="secondary" onclick={() => (confirmDelete = false)} disabled={deleting}>Batal</Button>
            <Button type="button" variant="danger" loading={deleting} onclick={doDelete}>Ya, Hapus</Button>
          </div>
        {:else}
          <Button type="button" variant="danger" full={false} onclick={() => (confirmDelete = true)}>
            <Icon name="trash" size={16} /> Hapus Pengguna
          </Button>
        {/if}
      </div>
    {/if}
  {/if}
</div>
