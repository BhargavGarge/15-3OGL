"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { addPurchase } from "@/app/actions/purchases";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddPurchaseButtonProps {
  userId: string;
}

export function AddPurchaseButton({ userId }: AddPurchaseButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await addPurchase(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setOpen(false);
      setIsLoading(false);
      e.currentTarget.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Purchase
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Purchase</DialogTitle>
          <DialogDescription>
            Record a grocery item you bought for the household
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="item">Item Name</Label>
            <Input
              id="item"
              name="item"
              placeholder="e.g., Potatoes"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              placeholder="e.g., 2"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g., 12.50"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Purchase Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              disabled={isLoading}
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Purchase"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
