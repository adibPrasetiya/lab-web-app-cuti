import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';

// Kolom publik (tanpa hash password).
const publicCols = {
  id: users.id,
  username: users.username,
  nama: users.nama,
  nip: users.nip,
  role: users.role,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export async function list() {
  return db.select(publicCols).from(users).orderBy(desc(users.id));
}

export async function findById(id) {
  const [user] = await db.select(publicCols).from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

export async function findByUsername(username) {
  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return user ?? null;
}

export async function create(data) {
  const [result] = await db.insert(users).values(data);
  return findById(result.insertId);
}

export async function update(id, patch) {
  await db.update(users).set(patch).where(eq(users.id, id));
  return findById(id);
}

export async function remove(id) {
  await db.delete(users).where(eq(users.id, id));
}
