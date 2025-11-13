import { hash, compare } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export interface User {
  _id: ObjectId
  name: string
  email: string
  password?: string
  createdAt: Date
  householdId?: ObjectId
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

export async function createToken(userId: string): Promise<string> {
  return await new SignJWT({ userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getAuthCookie() {
  const cookieStore = await cookies()
  return cookieStore.get("auth-token")?.value
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = await getAuthCookie()
    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload || !payload.userId) return null

    const db = await getDatabase()
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(payload.userId as string) }, { projection: { password: 0 } })

    return user as User | null
  } catch {
    return null
  }
}
