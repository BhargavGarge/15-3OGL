"use client";

import type React from "react";

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Trash2, Edit, Calendar } from "lucide-react";
import { completeTask, deleteTask, updateTask } from "@/app/actions/tasks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TaskItemProps {
  task: {
    _id: string;
    name: string;
    description: string;
    dueDate: Date;
    lastCompletedAt?: Date;
  };
  currentTurnUser: any;
  isYourTurn: boolean;
}

export function TaskItem({ task, currentTurnUser, isYourTurn }: TaskItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");

  async function handleComplete() {
    if (isCompleting || isCompleted) return;

    setIsCompleting(true);
    const result = await completeTask(task._id);

    if (result?.error) {
      setError(result.error);
      setIsCompleting(false);
    } else {
      setIsCompleted(true);
      setIsCompleting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    await deleteTask(task._id);
    setIsDeleting(false);
    setShowDeleteDialog(false);
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsEditing(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await updateTask(task._id, formData);

    if (result?.error) {
      setError(result.error);
      setIsEditing(false);
    } else {
      setShowEditDialog(false);
      setIsEditing(false);
    }
  }

  const isOverdue = new Date(task.dueDate) < new Date();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="font-medium text-lg">{task.name}</p>
            {isYourTurn && <Badge variant="default">Your Turn</Badge>}
            {isOverdue && <Badge variant="destructive">Overdue</Badge>}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {task.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
            </div>
            <span>•</span>
            <span>
              Turn:{" "}
              <span className="font-medium">
                {currentTurnUser?.name || "Unknown"}
              </span>
            </span>
            {task.lastCompletedAt && (
              <>
                <span>•</span>
                <span>
                  Last done{" "}
                  {formatDistanceToNow(new Date(task.lastCompletedAt), {
                    addSuffix: true,
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {isYourTurn && !isCompleted && (
            <Button size="sm" onClick={handleComplete} disabled={isCompleting}>
              <CheckCircle2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">
                {isCompleting ? "Completing..." : "Mark Done"}
              </span>
            </Button>
          )}
          {isCompleted && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? All history will be
              lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name">Task Name</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={task.name}
                required
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={task.description}
                required
                disabled={isEditing}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                name="dueDate"
                type="date"
                defaultValue={format(new Date(task.dueDate), "yyyy-MM-dd")}
                required
                disabled={isEditing}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isEditing}
              >
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
  );
}
