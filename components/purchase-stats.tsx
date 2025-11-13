import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface PurchaseStat {
  userId: string
  name: string
  count: number
}

interface PurchaseStatsProps {
  stats: PurchaseStat[]
}

export function PurchaseStats({ stats }: PurchaseStatsProps) {
  const total = stats.reduce((sum, stat) => sum + stat.count, 0)
  const maxCount = Math.max(...stats.map((s) => s.count), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fairness Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
        ) : (
          stats.map((stat) => (
            <div key={stat.userId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stat.name}</span>
                <span className="text-muted-foreground">{stat.count} purchases</span>
              </div>
              <Progress value={(stat.count / maxCount) * 100} className="h-2" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
