"use server"

import { getDatabase } from "@/lib/mongodb"
import { hashPassword, verifyPassword, createToken, setAuthCookie, removeAuthCookie } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { error: "All fields are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  try {
    const db = await getDatabase()

    // Check if user exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return { error: "User already exists" }
    }

    // Create user
    const hashedPassword = await hashPassword(password)
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    // Create token and set cookie
    const token = await createToken(result.insertedId.toString())
    await setAuthCookie(token)

    return { success: true }
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return { error: "Failed to create account" }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "All fields are required" }
  }

  try {
    const db = await getDatabase()

    // Find user
    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return { error: "Invalid credentials" }
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return { error: "Invalid credentials" }
    }

    // Create token and set cookie
    const token = await createToken(user._id.toString())
    await setAuthCookie(token)

    return { success: true }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { error: "Failed to login" }
  }
}

export async function logout() {
  await removeAuthCookie()
  redirect("/login")
}
