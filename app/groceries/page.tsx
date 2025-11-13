import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { DashboardHeader } from "@/components/dashboard-header";
import { GroceryList } from "@/components/grocery-list";
import { AddPurchaseButton } from "@/components/add-purchase-button";
import { PurchaseStats } from "@/components/purchase-stats";

interface Purchase {
  _id: any;
  item: string;
  quantity: number;
  price: number;
  userId: any;
  createdAt: Date;
  purchaseDate: Date;
}

interface User {
  _id: any;
  name: string;
  createdAt: Date;
}

export default async function GroceriesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const db = await getDatabase();

  // Fetch all purchases and users for stats
  const [purchases, users] = await Promise.all([
    db.collection("purchases").find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("users").find({}).toArray(),
  ]);

  const serializedPurchases = (purchases as Purchase[]).map(
    (purchase: Purchase) => ({
      _id: purchase._id.toString(),
      item: purchase.item,
      quantity: purchase.quantity,
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

  const serializedUsers = (users as User[]).map((u: User) => ({
    _id: u._id.toString(),
    name: u.name,
    createdAt:
      u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
  }));

  // Calculate purchase stats per user
  const purchaseStats = serializedUsers.map((u) => ({
    userId: u._id,
    name: u.name,
    count: serializedPurchases.filter((p) => p.userId === u._id).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Grocery Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Track who bought what and manage turn rotation
            </p>
          </div>
          <AddPurchaseButton userId={user._id.toString()} />
        </div>

        <PurchaseStats stats={purchaseStats} />

        <GroceryList
          purchases={serializedPurchases}
          currentUserId={user._id.toString()}
        />
      </main>
    </div>
  );
}
