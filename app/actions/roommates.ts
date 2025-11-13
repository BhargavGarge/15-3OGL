"use server"

import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"

export async function updateRoommate(userId: string, formData: FormData) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return { error: "Unauthorized" }
  }

  // Users can only update their own profile
  if (userId !== currentUser._id.toString()) {
    return { error: "You can only update your own profile" }
  }

  const name = formData.get("name") as string

  if (!name) {
    return { error: "Name is required" }
  }

  try {
    const db = await getDatabase()

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          name,
          updatedAt: new Date(),
        },
      },
    )

    revalidatePath("/roommates")
    revalidatePath("/dashboard")
    revalidatePath("/groceries")
    revalidatePath("/cleaning")

    return { success: true }
  } catch (error) {
    console.error("[v0] Update roommate error:", error)
    return { error: "Failed to update profile" }
  }
}

export async function deleteRoommate(userId: string) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return { error: "Unauthorized" }
  }

  // Users can only delete their own account
  if (userId !== currentUser._id.toString()) {
    return { error: "You can only delete your own account" }
  }

  try {
    const db = await getDatabase()

    // Check if this is the last user
    const userCount = await db.collection("users").countDocuments()
    if (userCount === 1) {
      return { error: "Cannot delete the last user in the household" }
    }

    // Delete user and their related data
    await Promise.all([
      db.collection("users").deleteOne({ _id: new ObjectId(userId) }),
      db.collection("purchases").deleteMany({ userId: new ObjectId(userId) }),
      db.collection("task_history").deleteMany({ userId: new ObjectId(userId) }),
    ])

    // Update task rotations to skip deleted user
    const tasks = await db.collection("tasks").find({}).toArray()
    const remainingUsers = await db.collection("users").find({}).toArray()

    for (const task of tasks) {
      if (task.currentTurnUserId.toString() === userId && remainingUsers.length > 0) {
        // Assign to first remaining user
        await db.collection("tasks").updateOne(
          { _id: task._id },
          {
            $set: {
              currentTurnUserId: remainingUsers[0]._id,
              rotationIndex: 0,
            },
          },
        )
      }
    }

    revalidatePath("/roommates")
    revalidatePath("/dashboard")
    revalidatePath("/groceries")
    revalidatePath("/cleaning")

    return { success: true, redirect: "/login" }
  } catch (error) {
    console.error("[v0] Delete roommate error:", error)
    return { error: "Failed to delete account" }
  }
}
