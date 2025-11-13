"use server"

import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"

export async function addPurchase(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const item = formData.get("item") as string
  const quantity = formData.get("quantity") as string
  const price = formData.get("price") as string
  const date = formData.get("date") as string

  if (!item || !quantity || !price || !date) {
    return { error: "All fields are required" }
  }

  try {
    const db = await getDatabase()

    await db.collection("purchases").insertOne({
      userId: user._id,
      item,
      quantity: Number.parseInt(quantity),
      price: Number.parseFloat(price),
      purchaseDate: new Date(date),
      createdAt: new Date(),
    })

    revalidatePath("/groceries")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("[v0] Add purchase error:", error)
    return { error: "Failed to add purchase" }
  }
}

export async function deletePurchase(purchaseId: string) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  try {
    const db = await getDatabase()

    const purchase = await db.collection("purchases").findOne({ _id: new ObjectId(purchaseId) })

    if (!purchase) {
      return { error: "Purchase not found" }
    }

    if (purchase.userId.toString() !== user._id.toString()) {
      return { error: "You can only delete your own purchases" }
    }

    await db.collection("purchases").deleteOne({ _id: new ObjectId(purchaseId) })

    revalidatePath("/groceries")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("[v0] Delete purchase error:", error)
    return { error: "Failed to delete purchase" }
  }
}

export async function updatePurchase(purchaseId: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const item = formData.get("item") as string
  const quantity = formData.get("quantity") as string
  const price = formData.get("price") as string
  const date = formData.get("date") as string

  if (!item || !quantity || !price || !date) {
    return { error: "All fields are required" }
  }

  try {
    const db = await getDatabase()

    const purchase = await db.collection("purchases").findOne({ _id: new ObjectId(purchaseId) })

    if (!purchase) {
      return { error: "Purchase not found" }
    }

    if (purchase.userId.toString() !== user._id.toString()) {
      return { error: "You can only edit your own purchases" }
    }

    await db.collection("purchases").updateOne(
      { _id: new ObjectId(purchaseId) },
      {
        $set: {
          item,
          quantity: Number.parseInt(quantity),
          price: Number.parseFloat(price),
          purchaseDate: new Date(date),
          updatedAt: new Date(),
        },
      },
    )

    revalidatePath("/groceries")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("[v0] Update purchase error:", error)
    return { error: "Failed to update purchase" }
  }
}
