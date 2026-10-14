# Aplikasi Cuti

Aplikasi simulasi pengajuan surat cuti pegawai (dengan upload lampiran) untuk **bimbingan teknis audit keamanan**.

> ⚠️ **Aplikasi ini SENGAJA mengandung kerentanan.** Jalankan hanya di lingkungan lab/lokal yang terisolasi.
> Jangan di-deploy ke server publik dan jangan memakai data asli.

Struktur project mengikuti `kapi/kappee-lite`.

| Bagian | Stack | Port dev |
| --- | --- | --- |
| `backend/` | Node.js ≥ 20.6 (ESM), Express 5, Drizzle ORM, MySQL | 3200 |
| `frontend/` | SvelteKit 3 (SPA) + Svelte 5, Tailwind CSS v4 | 5176 |

## Menjalankan

### Backend
```bash
cd backend
npm install
cp .env.example .env        # sesuaikan DATABASE_URL
npm run db:create           # buat database bila belum ada
npm run db:migrate          # buat tabel
npm run db:seed             # akun awal admin, atasan, pegawai
npm run dev                 # http://localhost:3200/health
```

Alur skema database: ubah `src/db/schema.js` → `npm run db:generate` → `npm run db:migrate`
(`db:migrate` baru bisa dijalankan setelah migrasi pertama dibuat di folder `drizzle/`).

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5176 (request /api & /uploads diteruskan ke backend)
```

## Dokumentasi API

Spesifikasi OpenAPI 3 ada di `backend/docs/openapi.yaml`. Saat backend berjalan, Swagger UI tersedia di
`http://localhost:3200/api/v1/docs` (atau `http://localhost:5176/api/v1/docs` lewat proxy frontend). Untuk mencoba
endpoint yang butuh login: jalankan `POST /auth/login`, salin `token`, lalu klik **Authorize**.

## Autentikasi

Login memakai username & password. Session berupa UUID v4 yang disimpan di tabel `sessions` (backend)
dan `localStorage` (frontend), dikirim lewat header `Authorization: Bearer <uuid>`.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | `{ username, password, nama, nip }` → user baru (role `pegawai`) |
| POST | `/api/v1/auth/login` | `{ username, password }` → `{ token, user }` |
| GET | `/api/v1/auth/me` | user yang sedang login (wajib session) |
| POST | `/api/v1/auth/logout` | hapus session (wajib session) |
| POST | `/api/v1/auth/password` | ganti password sendiri `{ password }` (tanpa password lama) |
| GET | `/api/v1/profile/:id` | lihat profil user (wajib session) |
| PUT | `/api/v1/profile/:id` | ubah profil `{ nama, nip }` (wajib session) |
| POST | `/api/v1/cuti` | ajukan cuti (multipart: `jenis, startDate, endDate, alasan` + file `surat`) |
| GET | `/api/v1/cuti/saya` | daftar pengajuan cuti milik sendiri |
| GET | `/api/v1/cuti/antrian` | antrian approval (atasan: menunggu atasan; admin: menunggu admin) |
| GET | `/api/v1/cuti/kalender?month=YYYY-MM` | pengajuan dalam satu bulan (pegawai: miliknya; atasan/admin: semua) |
| GET | `/api/v1/cuti/semua` | seluruh pengajuan untuk riwayat approval (atasan/admin) |
| GET | `/api/v1/cuti/:id` | detail pengajuan |
| POST | `/api/v1/cuti/:id/approve` | setujui (atasan → menunggu admin; admin → disetujui) |
| POST | `/api/v1/cuti/:id/reject` | tolak `{ catatan? }` |

Lampiran surat cuti menerima **PDF, JPG, PNG** (maks. `MAX_UPLOAD_SIZE_MB`). Alur approval berjenjang:
`menunggu_atasan` → (atasan setuju) `menunggu_admin` → (admin setuju) `disetujui`; penolakan di tahap mana pun → `ditolak`.

Manajemen pengguna (**hanya admin**):

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| GET | `/api/v1/users` | daftar semua pengguna |
| POST | `/api/v1/users` | buat pengguna `{ username, password, nama, nip, role }` |
| GET | `/api/v1/users/:id` | detail pengguna |
| PUT | `/api/v1/users/:id` | ubah `{ nama, nip, role }` |
| POST | `/api/v1/users/:id/reset-password` | reset password `{ password }` (fitur lupa password oleh admin) |
| DELETE | `/api/v1/users/:id` | hapus pengguna (tidak bisa menghapus diri sendiri) |

Akun seed (`npm run db:seed`, aman dijalankan ulang — data & password akun seed dikembalikan ke awal):

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `Admin@123` | admin |
| `atasan` | `Atasan@123` | atasan |
| `pegawai` | `Pegawai@123` | pegawai |

## Struktur

```
backend/src/
  main.js                 CLI: serve | migrate | seed
  index.js                start server + graceful shutdown
  app/app.js              express app & mounting router
  config/env.js           validasi environment (Joi)
  db/                     koneksi, schema, migrasi
  router/                 public.routes.js, protected.routes.js
  middleware/             errorHandler, notFound, validate, requestLogger
  features/<fitur>/       <fitur>.{route,controller,service,repository,validation}.js
  utils/                  AppError, response, logger

frontend/src/
  routes/                 (guest)/ halaman tanpa login, (app)/ halaman setelah login
  lib/api.js              fetch client ke backend
  lib/services/           satu modul API per fitur backend
  lib/components/         komponen bersama
```
