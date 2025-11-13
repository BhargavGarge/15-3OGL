import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GroceryItem } from "@/components/grocery-item";
import { SerializedPurchase } from "@/types";
interface Purchase {
  _id: string;
  item: string;
  quantity: number;
  price: number;
  userId: string;
  createdAt: string;
  purchaseDate: string;
}

interface GroceryListProps {
  purchases: SerializedPurchase[];
  currentUserId: string;
}
export async function GroceryList({
  purchases,
  currentUserId,
}: GroceryListProps) {
  const { getDatabase } = await import("@/lib/mongodb");
  const db = await getDatabase();
  const users = await db.collection("users").find({}).toArray();

  const usersMap = new Map(users.map((u) => [u._id.toString(), u]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No purchases yet. Click "Add Purchase" to record your first grocery
            item.
          </p>
        ) : (
          <div className="space-y-3">
            {purchases.map((purchase) => {
              const purchaseUser = usersMap.get(purchase.userId.toString());
              return (
                <GroceryItem
                  key={purchase._id.toString()}
                  purchase={{
                    _id: purchase._id.toString(),
                    item: purchase.item,
                    quantity: purchase.quantity,
                    price: purchase.price,
                    purchaseDate: new Date(purchase.purchaseDate),
                    createdAt: new Date(purchase.createdAt),
                    userId: purchase.userId.toString(),
                  }}
                  user={purchaseUser}
                  isOwner={purchase.userId.toString() === currentUserId}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
