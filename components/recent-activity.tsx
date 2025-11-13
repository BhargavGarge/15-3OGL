import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Purchase {
  _id: string;
  item: string;
  quantity: string;
  price: number;
  userId: string;
  createdAt: string;
  purchaseDate: string;
}

interface RecentActivityProps {
  purchases: Purchase[];
}

export function RecentActivity({ purchases }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Recent Purchases
        </CardTitle>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No purchases yet. Add your first purchase to get started!
          </p>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase._id.toString()}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{purchase.item}</p>
                  <p className="text-sm text-muted-foreground">
                    {purchase.quantity}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(purchase.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
