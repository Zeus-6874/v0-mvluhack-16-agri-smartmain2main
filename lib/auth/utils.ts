import { getSession } from "./session"

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession()
  return session?.userId || null
}

export async function requireAuth() {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error("Unauthorized")
  }
  return userId
}
