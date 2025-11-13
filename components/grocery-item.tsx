"use client";

import type React from "react";

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { deletePurchase, updatePurchase } from "@/app/actions/purchases";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GroceryItemProps {
  purchase: {
    _id: string;
    item: string;
    quantity: number;
    price: number;
    purchaseDate: Date;
    createdAt: Date;
    userId: string;
  };
  user: any;
  isOwner: boolean;
}

export function GroceryItem({ purchase, user, isOwner }: GroceryItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setIsDeleting(true);
    await deletePurchase(purchase._id);
    setIsDeleting(false);
    setShowDeleteDialog(false);
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsEditing(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await updatePurchase(purchase._id, formData);

    if (result?.error) {
      setError(result.error);
      setIsEditing(false);
    } else {
      setShowEditDialog(false);
      setIsEditing(false);
    }
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <>
      <div className="flex items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-3">
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{purchase.item}</p>
              <span className="text-sm text-muted-foreground">
                • Qty: {purchase.quantity}
              </span>
              <span className="text-sm font-semibold text-primary">
                ${purchase.price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {user?.name || "Unknown"} •{" "}
              {format(new Date(purchase.purchaseDate), "MMM d, yyyy")}
            </p>
            <p className="text-xs text-muted-foreground">
              Added{" "}
              {formatDistanceToNow(new Date(purchase.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this purchase? This action cannot
              be undone.
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
            <DialogTitle>Edit Purchase</DialogTitle>
            <DialogDescription>
              Update the details of your purchase
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-item">Item Name</Label>
              <Input
                id="edit-item"
                name="item"
                defaultValue={purchase.item}
                required
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                name="quantity"
                type="number"
                min="1"
                defaultValue={purchase.quantity}
                required
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                defaultValue={purchase.price}
                required
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Purchase Date</Label>
              <Input
                id="edit-date"
                name="date"
                type="date"
                defaultValue={format(
                  new Date(purchase.purchaseDate),
                  "yyyy-MM-dd"
                )}
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
