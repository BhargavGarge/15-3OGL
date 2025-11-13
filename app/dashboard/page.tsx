import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { DashboardHeader } from "@/components/dashboard-header";
import { StatsCards } from "@/components/stats-cards";
import { RecentActivity } from "@/components/recent-activity";
import { UpcomingTasks } from "@/components/upcoming-tasks";

interface Task {
  _id: any;
  name: string;
  description: string;
  dueDate: Date;
  userId?: any;
  createdAt: Date;
}

interface Purchase {
  _id: any;
  item: string;
  quantity: number;
  price: number;
  userId: any;
  createdAt: Date;
  purchaseDate: Date;
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const db = await getDatabase();

  // Fetch stats
  const [purchases, tasks, roommates] = await Promise.all([
    db
      .collection("purchases")
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray(),
    db.collection("tasks").find({}).toArray(),
    db.collection("users").find({}).toArray(),
  ]);

  // Calculate user stats
  const userPurchaseCount = await db
    .collection("purchases")
    .countDocuments({ userId: user._id });
  const userTasksCompleted = await db
    .collection("task_history")
    .countDocuments({
      userId: user._id,
      completed: true,
    });

  const serializedPurchases = (purchases as Purchase[]).map(
    (purchase: Purchase) => ({
      _id: purchase._id.toString(),
      item: purchase.item,
      quantity: purchase.quantity.toString(),
      price: purchase.price,
      userId: purchase.userId.toString(),
      createdAt:
        purchase.createdAt instanceof Date
          ? purchase.createdAt.toISOString()
          : purchase.createdAt,
      purchaseDate:
        purchase.purchaseDate instanceof Date
          ? purchase.purchaseDate.toISOString()
          : purchase.purchaseDate,
    })
  );

  const serializedTasks = (tasks as Task[]).map((task: Task) => ({
    _id: task._id.toString(),
    name: task.name,
    description: task.description || "",
    dueDate:
      task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
    userId: task.userId?.toString(),
    createdAt:
      task.createdAt instanceof Date
        ? task.createdAt.toISOString()
        : task.createdAt,
  }));

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.name}
            </p>
          </div>
        </div>

        <StatsCards
          purchaseCount={userPurchaseCount}
          tasksCompleted={userTasksCompleted}
          roommateCount={roommates.length}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <RecentActivity purchases={serializedPurchases} />
          <UpcomingTasks tasks={serializedTasks} userId={user._id.toString()} />
        </div>
      </main>
    </div>
  );
}
