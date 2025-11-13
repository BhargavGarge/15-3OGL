"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoommateCard } from "@/components/roommate-card"

interface Roommate {
  _id: any
  name: string
  email: string
  purchaseCount: number
  taskCount: number
  totalContributions: number
}

interface RoommateListProps {
  roommates: Roommate[]
  currentUserId: string
}

export function RoommateList({ roommates, currentUserId }: RoommateListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Roommates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roommates.map((roommate) => (
            <RoommateCard
              key={roommate._id.toString()}
              roommate={{
                _id: roommate._id.toString(),
                name: roommate.name,
                email: roommate.email,
                purchaseCount: roommate.purchaseCount,
                taskCount: roommate.taskCount,
              }}
              isCurrentUser={roommate._id.toString() === currentUserId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
