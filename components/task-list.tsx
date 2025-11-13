"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskItem } from "@/components/task-item";

interface Task {
  _id: string;
  name: string;
  description: string;
  dueDate: string;
  currentTurnUserId: string;
  lastCompletedAt?: string;
}

type User = {
  _id: string;
  name: string;
  email?: string;
  createdAt: string;
};

interface TaskListProps {
  tasks: Task[];
  users: User[];
  currentUserId: string;
}

export function TaskList({ tasks, users, currentUserId }: TaskListProps) {
  const usersMap = new Map(users.map((u) => [u._id, u]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tasks yet. Click "Add Task" to create your first cleaning task.
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const currentTurnUser = usersMap.get(task.currentTurnUserId);
              const isYourTurn = task.currentTurnUserId === currentUserId;

              return (
                <TaskItem
                  key={task._id}
                  task={{
                    _id: task._id,
                    name: task.name,
                    description: task.description,
                    dueDate: new Date(task.dueDate),
                    lastCompletedAt: task.lastCompletedAt
                      ? new Date(task.lastCompletedAt)
                      : undefined,
                  }}
                  currentTurnUser={currentTurnUser}
                  isYourTurn={isYourTurn}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
