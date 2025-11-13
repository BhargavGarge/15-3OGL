"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, ShoppingCart, CheckSquare, Users, Menu } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useState } from "react";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-lg md:text-xl"
          >
            <Home className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <span className="hidden sm:inline">15-3OGL Manager</span>
            <span className="sm:hidden">RoomMate</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/groceries">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Groceries
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cleaning">
                <CheckSquare className="h-4 w-4 mr-2" />
                Cleaning
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/roommates">
                <Users className="h-4 w-4 mr-2" />
                Roommates
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <Home className="h-5 w-5 text-primary" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  href="/groceries"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="font-medium">Groceries</span>
                </Link>
                <Link
                  href="/cleaning"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <span className="font-medium">Cleaning</span>
                </Link>
                <Link
                  href="/roommates"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">Roommates</span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 md:h-10 md:w-10 rounded-full"
              >
                <Avatar className="h-9 w-9 md:h-10 md:w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action={logout}>
                <button type="submit" className="w-full">
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
