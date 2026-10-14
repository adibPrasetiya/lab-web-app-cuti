import { sql } from 'drizzle-orm';
import { md5 } from '../features/auth/auth.service.js';
import { db } from './index.js';
import { users } from './schema.js';

// Akun awal lab, satu per role. Password memenuhi aturan kekuatan di frontend.
export const SEED_USERS = [
  { username: 'admin', password: 'Admin@123', nama: 'Administrator', nip: '198001012005011001', role: 'admin' },
  { username: 'atasan', password: 'Atasan@123', nama: 'Budi Santoso', nip: '198203152008011002', role: 'atasan' },
  { username: 'pegawai', password: 'Pegawai@123', nama: 'Siti Rahayu', nip: '199005202015032003', role: 'pegawai' },
];

/** Buat akun seed; bila username sudah ada, data & password dikembalikan ke nilai awal. */
export async function runSeed() {
  for (const { password, ...user } of SEED_USERS) {
    await db
      .insert(users)
      .values({ ...user, passwordHash: md5(password) })
      .onDuplicateKeyUpdate({
        set: {
          passwordHash: sql`values(${users.passwordHash})`,
          nama: sql`values(${users.nama})`,
          nip: sql`values(${users.nip})`,
          role: sql`values(${users.role})`,
        },
      });
  }
  return SEED_USERS.map(({ username, role }) => ({ username, role }));
}
