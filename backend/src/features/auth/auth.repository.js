import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { sessions, users } from '../../db/schema.js';

export async function findUserByUsername(username) {
  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return user ?? null;
}

export async function findUserById(id) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

export async function createUser(data) {
  const [result] = await db.insert(users).values(data);
  return findUserById(result.insertId);
}

export async function createSession(id, userId) {
  await db.insert(sessions).values({ id, userId });
}

export async function findSessionWithUser(id) {
  const [row] = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, id))
    .limit(1);
  return row ?? null;
}

export async function deleteSession(id) {
  await db.delete(sessions).where(eq(sessions.id, id));
}

export async function updatePassword(userId, passwordHash) {
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}
