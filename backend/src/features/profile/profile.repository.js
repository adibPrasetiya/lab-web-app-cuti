import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';

export async function findById(id) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

export async function updateById(id, data) {
  await db.update(users).set(data).where(eq(users.id, id));
  return findById(id);
}
