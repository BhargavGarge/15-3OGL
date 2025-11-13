import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { DashboardHeader } from "@/components/dashboard-header";
import { AddTaskButton } from "@/components/add-task-button";
import { TaskList } from "@/components/task-list";
import { TaskStats } from "@/components/task-stats";

interface Task {
  _id: any;
  name: string;
  description: string;
  dueDate: Date;
  userId?: any;
  currentTurnUserId: any;
  createdAt: Date;
  lastCompletedAt?: Date;
}

interface User {
  _id: any;
  name: string;
  email?: string;
  createdAt: Date;
}

export default async function CleaningPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const db = await getDatabase();

  // Fetch all tasks and task history
  const [tasks, taskHistory, users] = await Promise.all([
    db.collection<Task>("tasks").find({}).toArray(),
    db.collection("task_history").find({}).sort({ completedAt: -1 }).toArray(),
    db.collection<User>("users").find({}).toArray(),
  ]);

  const serializedTasks = tasks.map((task: Task) => ({
    _id: task._id.toString(),
    name: task.name,
    description: task.description || "",
    dueDate:
      task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
    userId: task.userId?.toString(),
    currentTurnUserId: task.currentTurnUserId?.toString(),
    createdAt:
      task.createdAt instanceof Date
        ? task.createdAt.toISOString()
        : task.createdAt,
    lastCompletedAt:
      task.lastCompletedAt instanceof Date
        ? task.lastCompletedAt.toISOString()
        : task.lastCompletedAt,
  }));

  const serializedUsers = users.map((u: User) => ({
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    createdAt:
      u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
  }));

  // Calculate completion stats per user
  const completionStats = users.map((u: User) => ({
    userId: u._id.toString(),
    name: u.name,
    count: taskHistory.filter(
      (h: any) => h.userId?.toString() === u._id.toString() && h.completed
    ).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Cleaning Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage chores and track turn rotation
            </p>
          </div>
          <AddTaskButton />
        </div>

        <TaskStats stats={completionStats} />

        <TaskList
          tasks={serializedTasks}
          users={serializedUsers}
          currentUserId={user._id.toString()}
        />
      </main>
    </div>
  );
}
