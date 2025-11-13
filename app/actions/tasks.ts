"use server";

import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function addTask(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!name || !description || !dueDate) {
    return { error: "All fields are required" };
  }

  try {
    const db = await getDatabase();

    // Get all users to set up rotation
    const users = await db.collection("users").find({}).toArray();

    if (users.length === 0) {
      return { error: "No users found" };
    }

    await db.collection("tasks").insertOne({
      name,
      description,
      dueDate: new Date(dueDate),
      currentTurnUserId: users[0]._id,
      rotationIndex: 0,
      createdAt: new Date(),
    });

    revalidatePath("/cleaning");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[v0] Add task error:", error);
    return { error: "Failed to add task" };
  }
}

export async function completeTask(taskId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDatabase();

    const task = await db
      .collection("tasks")
      .findOne({ _id: new ObjectId(taskId) });

    if (!task) {
      return { error: "Task not found" };
    }

    // Only the current turn user can complete the task
    if (task.currentTurnUserId.toString() !== user._id.toString()) {
      return { error: "It is not your turn for this task" };
    }

    const recentCompletion = await db.collection("task_history").findOne({
      taskId: task._id,
      userId: user._id,
      completedAt: { $gte: new Date(Date.now() - 60000) }, // Within last 60 seconds
    });

    if (recentCompletion) {
      return { error: "Task already completed" };
    }

    // Get all users for rotation
    const users = await db.collection("users").find({}).toArray();
    const nextIndex = (task.rotationIndex + 1) % users.length;
    const nextUserId = users[nextIndex]._id;

    // Record completion in history
    await db.collection("task_history").insertOne({
      taskId: task._id,
      userId: user._id,
      completed: true,
      completedAt: new Date(),
    });

    // Update task with next person's turn
    await db.collection("tasks").updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: {
          currentTurnUserId: nextUserId,
          rotationIndex: nextIndex,
          lastCompletedAt: new Date(),
        },
      }
    );

    revalidatePath("/cleaning");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[v0] Complete task error:", error);
    return { error: "Failed to complete task" };
  }
}

export async function deleteTask(taskId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDatabase();

    // Delete task and its history
    await Promise.all([
      db.collection("tasks").deleteOne({ _id: new ObjectId(taskId) }),
      db
        .collection("task_history")
        .deleteMany({ taskId: new ObjectId(taskId) }),
    ]);

    revalidatePath("/cleaning");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[v0] Delete task error:", error);
    return { error: "Failed to delete task" };
  }
}

export async function updateTask(taskId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!name || !description || !dueDate) {
    return { error: "All fields are required" };
  }

  try {
    const db = await getDatabase();

    await db.collection("tasks").updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: {
          name,
          description,
          dueDate: new Date(dueDate),
          updatedAt: new Date(),
        },
      }
    );

    revalidatePath("/cleaning");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[v0] Update task error:", error);
    return { error: "Failed to update task" };
  }
}
