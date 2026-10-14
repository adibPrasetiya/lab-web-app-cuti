// Seluruh tabel didefinisikan di file ini. Kolom snake_case di database, camelCase di JS.
// Setelah menambah/mengubah tabel: `npm run db:generate` lalu `npm run db:migrate`.
import { sql } from 'drizzle-orm';
import { bigint, char, date, datetime, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

const id = () => bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey();
const createdAt = () => datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`);
const updatedAt = () =>
  datetime('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date());

export const USER_ROLES = ['pegawai', 'atasan', 'admin'];

export const users = mysqlTable('users', {
  id: id(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  // MD5 hex tanpa salt.
  passwordHash: char('password_hash', { length: 32 }).notNull(),
  nama: varchar('nama', { length: 100 }).notNull(),
  nip: varchar('nip', { length: 30 }).notNull(),
  role: mysqlEnum('role', USER_ROLES).notNull().default('pegawai'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// Session login: id berupa UUID v4, tanpa masa berlaku (hanya dihapus saat logout).
export const sessions = mysqlTable('sessions', {
  id: char('id', { length: 36 }).primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: createdAt(),
});

export const LEAVE_TYPES = ['tahunan', 'sakit', 'penting'];
export const LEAVE_STATUS = ['menunggu_atasan', 'menunggu_admin', 'disetujui', 'ditolak'];

const approverId = (column) => bigint(column, { mode: 'number', unsigned: true }).references(() => users.id);

// Pengajuan cuti + lampiran surat. Approval berjenjang: atasan lalu admin.
export const leaveRequests = mysqlTable('leave_requests', {
  id: id(),
  userId: bigint('user_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  jenis: mysqlEnum('jenis', LEAVE_TYPES).notNull(),
  startDate: date('start_date', { mode: 'string' }).notNull(),
  endDate: date('end_date', { mode: 'string' }).notNull(),
  alasan: varchar('alasan', { length: 500 }).notNull(),
  // Lampiran surat: nama acak di disk, nama & mime asli dari unggahan (lihat A10).
  attachmentFilename: varchar('attachment_filename', { length: 255 }).notNull(),
  attachmentOriginalName: varchar('attachment_original_name', { length: 255 }).notNull(),
  attachmentMime: varchar('attachment_mime', { length: 150 }).notNull(),
  status: mysqlEnum('status', LEAVE_STATUS).notNull().default('menunggu_atasan'),
  ditolakOleh: mysqlEnum('ditolak_oleh', ['atasan', 'admin']),
  atasanId: approverId('atasan_id'),
  atasanNote: varchar('atasan_note', { length: 500 }),
  atasanActedAt: datetime('atasan_acted_at'),
  adminId: approverId('admin_id'),
  adminNote: varchar('admin_note', { length: 500 }),
  adminActedAt: datetime('admin_acted_at'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
