import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare } from "lucide-react"

interface Task {
  _id: any
  name: string
  currentTurnUserId?: any
}

interface UpcomingTasksProps {
  tasks: Task[]
  userId: string
}

export function UpcomingTasks({ tasks, userId }: UpcomingTasksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Your Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tasks yet. Create cleaning tasks to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isYourTurn = task.currentTurnUserId?.toString() === userId
              return (
                <div key={task._id.toString()} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{task.name}</span>
                  {isYourTurn && <Badge variant="default">Your Turn</Badge>}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
