import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { DashboardHeader } from "@/components/dashboard-header";
import { RoommateList } from "@/components/roommate-list";
import { RoommateStats } from "@/components/roommate-stats";

export default async function RoommatesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const db = await getDatabase();

  // Fetch all users and their stats
  const [users, purchases, taskHistory] = await Promise.all([
    db.collection("users").find({}).toArray(),
    db.collection("purchases").find({}).toArray(),
    db.collection("task_history").find({ completed: true }).toArray(),
  ]);

  // Calculate comprehensive stats for each roommate
  const roommateStats = users.map((roommate) => {
    const purchaseCount = purchases.filter(
      (p) => p.userId.toString() === roommate._id.toString()
    ).length;
    const taskCount = taskHistory.filter(
      (h) => h.userId?.toString() === roommate._id.toString()
    ).length;

    return {
      _id: roommate._id.toString(),
      name: roommate.name,
      email: roommate.email,
      createdAt:
        roommate.createdAt instanceof Date
          ? roommate.createdAt.toISOString()
          : roommate.createdAt,
      purchaseCount,
      taskCount,
      totalContributions: purchaseCount + taskCount,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Roommates</h1>
            <p className="text-muted-foreground mt-1">
              Manage household members and view their contributions
            </p>
          </div>
        </div>

        <RoommateStats stats={roommateStats} />

        <RoommateList
          roommates={roommateStats}
          currentUserId={user._id.toString()}
        />
      </main>
    </div>
  );
}
