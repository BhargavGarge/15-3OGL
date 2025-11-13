import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy } from "lucide-react"

interface RoommateStat {
  _id: any
  name: string
  purchaseCount: number
  taskCount: number
  totalContributions: number
}

interface RoommateStatsProps {
  stats: RoommateStat[]
}

export function RoommateStats({ stats }: RoommateStatsProps) {
  const sortedStats = [...stats].sort((a, b) => b.totalContributions - a.totalContributions)
  const topContributor = sortedStats[0]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Contributor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topContributor ? (
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {topContributor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{topContributor.name}</p>
                <p className="text-sm text-muted-foreground">{topContributor.totalContributions} total contributions</p>
                <p className="text-xs text-muted-foreground">
                  {topContributor.purchaseCount} purchases • {topContributor.taskCount} tasks
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data yet</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Household Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Roommates</span>
              <span className="font-semibold">{stats.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Purchases</span>
              <span className="font-semibold">{stats.reduce((sum, s) => sum + s.purchaseCount, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Tasks Completed</span>
              <span className="font-semibold">{stats.reduce((sum, s) => sum + s.taskCount, 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
