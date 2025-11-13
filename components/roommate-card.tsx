"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ShoppingCart, CheckCircle } from "lucide-react"
import { deleteRoommate, updateRoommate } from "@/app/actions/roommates"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RoommateCardProps {
  roommate: {
    _id: string
    name: string
    email: string
    purchaseCount: number
    taskCount: number
  }
  isCurrentUser: boolean
}

export function RoommateCard({ roommate, isCurrentUser }: RoommateCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")

  const initials = roommate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteRoommate(roommate._id)
    setIsDeleting(false)

    if (result?.error) {
      setError(result.error)
    } else if (result?.redirect) {
      router.push(result.redirect)
      router.refresh()
    } else {
      setShowDeleteDialog(false)
    }
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsEditing(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const result = await updateRoommate(roommate._id, formData)

    if (result?.error) {
      setError(result.error)
      setIsEditing(false)
    } else {
      setShowEditDialog(false)
      setIsEditing(false)
      router.refresh()
    }
  }

  return (
    <>
      <Card className={isCurrentUser ? "border-primary" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{roommate.name}</h3>
                {isCurrentUser && <Badge variant="secondary">You</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{roommate.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-chart-1/10">
                <ShoppingCart className="h-4 w-4 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold">{roommate.purchaseCount}</p>
                <p className="text-xs text-muted-foreground">Purchases</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-chart-2/10">
                <CheckCircle className="h-4 w-4 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">{roommate.taskCount}</p>
                <p className="text-xs text-muted-foreground">Tasks Done</p>
              </div>
            </div>
          </div>

          {isCurrentUser && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? All your data will be removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" name="name" defaultValue={roommate.name} required disabled={isEditing} />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)} disabled={isEditing}>
                Cancel
              </Button>
              <Button type="submit" disabled={isEditing}>
                {isEditing ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
