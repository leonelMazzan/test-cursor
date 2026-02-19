import { db } from '@/common/db'
import type { AuthUser } from '@/common/types/user'

// NOTE: passwords are stored in plain text — this is a client-side demo only.
// In a real app, use a server-side hash (bcrypt, argon2, etc.).

export const registerUser = async (email: string, password: string): Promise<AuthUser> => {
  const existing = await db.users.where('email').equals(email).first()
  if (existing) {
    throw new Error('An account with this email already exists.')
  }

  const id = await db.users.add({ email, passwordHash: password })
  return { id: id as number, email }
}

export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
  const user = await db.users.where('email').equals(email).first()
  if (!user || user.passwordHash !== password) {
    throw new Error('Invalid email or password.')
  }
  return { id: user.id as number, email: user.email }
}
