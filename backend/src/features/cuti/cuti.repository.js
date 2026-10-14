import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { leaveRequests, users } from '../../db/schema.js';

// Kolom pemohon yang ikut ditampilkan (tanpa hash password).
const pemohon = { id: users.id, nama: users.nama, nip: users.nip, username: users.username, role: users.role };

export async function create(data) {
  const [result] = await db.insert(leaveRequests).values(data);
  return findById(result.insertId);
}

export async function findById(id) {
  const [row] = await db
    .select({ cuti: leaveRequests, pemohon })
    .from(leaveRequests)
    .innerJoin(users, eq(users.id, leaveRequests.userId))
    .where(eq(leaveRequests.id, id))
    .limit(1);
  return row ? { ...row.cuti, pemohon: row.pemohon } : null;
}

export async function listByUser(userId) {
  const rows = await db
    .select({ cuti: leaveRequests, pemohon })
    .from(leaveRequests)
    .innerJoin(users, eq(users.id, leaveRequests.userId))
    .where(eq(leaveRequests.userId, userId))
    .orderBy(desc(leaveRequests.id));
  return rows.map((row) => ({ ...row.cuti, pemohon: row.pemohon }));
}

export async function listAll() {
  const rows = await db
    .select({ cuti: leaveRequests, pemohon })
    .from(leaveRequests)
    .innerJoin(users, eq(users.id, leaveRequests.userId))
    .orderBy(desc(leaveRequests.id));
  return rows.map((row) => ({ ...row.cuti, pemohon: row.pemohon }));
}

export async function listByStatus(status) {
  const rows = await db
    .select({ cuti: leaveRequests, pemohon })
    .from(leaveRequests)
    .innerJoin(users, eq(users.id, leaveRequests.userId))
    .where(eq(leaveRequests.status, status))
    .orderBy(desc(leaveRequests.id));
  return rows.map((row) => ({ ...row.cuti, pemohon: row.pemohon }));
}

// Pengajuan yang beririsan dengan rentang [startOfMonth, endOfMonth] (inklusif).
// Bila userId diberikan, dibatasi ke pemohon tersebut.
export async function listOverlappingMonth(startOfMonth, endOfMonth, userId) {
  const overlap = and(lte(leaveRequests.startDate, endOfMonth), gte(leaveRequests.endDate, startOfMonth));
  const where = userId ? and(overlap, eq(leaveRequests.userId, userId)) : overlap;
  const rows = await db
    .select({ cuti: leaveRequests, pemohon })
    .from(leaveRequests)
    .innerJoin(users, eq(users.id, leaveRequests.userId))
    .where(where)
    .orderBy(desc(leaveRequests.id));
  return rows.map((row) => ({ ...row.cuti, pemohon: row.pemohon }));
}

export async function update(id, patch) {
  await db.update(leaveRequests).set(patch).where(eq(leaveRequests.id, id));
  return findById(id);
}
