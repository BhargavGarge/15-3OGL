import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, CheckCircle, Users } from "lucide-react"

interface StatsCardsProps {
  purchaseCount: number
  tasksCompleted: number
  roommateCount: number
}

export function StatsCards({ purchaseCount, tasksCompleted, roommateCount }: StatsCardsProps) {
  const stats = [
    {
      title: "Your Purchases",
      value: purchaseCount,
      icon: ShoppingCart,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Tasks Completed",
      value: tasksCompleted,
      icon: CheckCircle,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Roommates",
      value: roommateCount,
      icon: Users,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
