<script>
  import { page } from '$app/state';
  import { fieldErrors, session } from '#lib/api.js';
  import Button from '#lib/components/Button.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import TextField from '#lib/components/TextField.svelte';
  import { isStrongPassword, PASSWORD_RULES } from '#lib/password.js';
  import { ubahPassword } from '#lib/services/auth.js';
  import { getProfile, updateProfile } from '#lib/services/profile.js';
  import { toast } from '#lib/toast.svelte.js';

  const currentId = session.user?.id;

  // Profil yang dibuka diambil dari ?id= (default: user yang login).
  // Karena endpoint rentan IDOR, id siapa pun bisa dibuka & diubah.
  const viewedId = $derived(Number(page.url.searchParams.get('id')) || currentId);
  const isSelf = $derived(viewedId === currentId);

  let profile = $state(null);
  let form = $state({ nama: '', nip: '' });
  let loading = $state(true);
  let loadError = $state('');
  let editing = $state(false);
  let saving = $state(false);
  let errors = $state({});

  async function load(id) {
    loading = true;
    loadError = '';
    editing = false;
    try {
      profile = await getProfile(id);
      form = { nama: profile.nama, nip: profile.nip };
    } catch (error) {
      profile = null;
      loadError = error.message;
    } finally {
      loading = false;
    }
  }

  // Muat ulang tiap kali id di URL berubah.
  $effect(() => {
    load(viewedId);
  });

  function startEdit() {
    errors = {};
    form = { nama: profile.nama, nip: profile.nip };
    editing = true;
  }

  function cancelEdit() {
    editing = false;
    errors = {};
    form = { nama: profile.nama, nip: profile.nip };
  }

  async function save(event) {
    event.preventDefault();
    saving = true;
    errors = {};
    try {
      profile = await updateProfile(viewedId, form);
      if (isSelf) session.user = profile;
      editing = false;
      toast('Profil berhasil diperbarui');
    } catch (error) {
      errors = fieldErrors(error);
      if (!Object.keys(errors).length) toast(error.message, 'error');
    } finally {
      saving = false;
    }
  }

  // --- Ganti password sendiri (tanpa password lama) ---
  let pw = $state('');
  let pwConfirm = $state('');
  let showPw = $state(false);
  let savingPw = $state(false);

  const pwStrong = $derived(isStrongPassword(pw));
  const pwMatch = $derived(pwConfirm === pw);
  const canSavePw = $derived(pwStrong && pwMatch && pw.length > 0);

  async function savePassword(event) {
    event.preventDefault();
    if (!canSavePw) return;
    savingPw = true;
    try {
      await ubahPassword(pw);
      pw = '';
      pwConfirm = '';
      toast('Password berhasil diperbarui');
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      savingPw = false;
    }
  }
</script>

<svelte:head><title>Profil · Aplikasi Cuti</title></svelte:head>

<div class="mx-auto max-w-xl">
  <div class="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold">Profil</h1>
        <p class="mt-1 text-sm text-slate-500">
          {isSelf ? 'Data akun Anda' : `Melihat profil user #${viewedId}`}
        </p>
      </div>
      {#if profile && !editing}
        <Button type="button" variant="secondary" full={false} onclick={startEdit}>
          <Icon name="edit" size={16} />
          Ubah
        </Button>
      {/if}
    </div>

    {#if loading}
      <p class="text-sm text-slate-500">Memuat...</p>
    {:else if loadError}
      <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{loadError}</p>
    {:else if profile}
      <form class="space-y-4" onsubmit={save} novalidate>
        <TextField id="username" label="Username" value={profile.username} disabled />
        <TextField id="role" label="Role" value={profile.role} disabled />
        <TextField id="nama" label="Nama lengkap" bind:value={form.nama} error={errors.nama} disabled={!editing} required />
        <TextField id="nip" label="NIP" bind:value={form.nip} error={errors.nip} disabled={!editing} required />

        {#if editing}
          <div class="flex gap-3">
            <Button type="button" variant="secondary" onclick={cancelEdit} disabled={saving}>Batal</Button>
            <Button loading={saving}>Simpan</Button>
          </div>
        {/if}
      </form>
    {/if}
  </div>

  {#if isSelf}
    <div class="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold">Ubah Password</h2>
      <p class="mt-1 mb-4 text-sm text-slate-500">Masukkan password baru. Tidak perlu password lama.</p>

      <form class="space-y-4" onsubmit={savePassword} novalidate>
        <TextField
          id="new-password"
          label="Password baru"
          type={showPw ? 'text' : 'password'}
          bind:value={pw}
          autocomplete="new-password"
          required
        />

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
          id="confirm-password"
          label="Konfirmasi password baru"
          type={showPw ? 'text' : 'password'}
          bind:value={pwConfirm}
          error={pwConfirm && !pwMatch ? 'Konfirmasi password tidak sama' : ''}
          autocomplete="new-password"
          required
        />
        <label class="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" bind:checked={showPw} class="rounded border-slate-300" />
          Tampilkan password
        </label>

        <Button loading={savingPw} disabled={!canSavePw}>Perbarui Password</Button>
      </form>
    </div>
  {/if}
</div>
