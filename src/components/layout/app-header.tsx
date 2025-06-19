"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { UserNav } from "./user-nav";
import { Logo } from "../logo";
import Link from "next/link";
import { Button } from "../ui/button";
import useAuth from "@/hooks/use-auth"; // Client-side hook

type AppHeaderProps = {
  // Props can be added if needed, e.g. for breadcrumbs
};

export function AppHeader({}: AppHeaderProps) {
  // Cannot use useAuth directly in Server Component
  // UserNav will handle auth state client-side
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger menu icon for mobile */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Open menu"
            type="button"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          {/* SidebarTrigger can be kept for accessibility or removed if not needed */}
          {/* <SidebarTrigger className="md:hidden" /> */}
          <div className="hidden md:block">
            <Logo iconSize={24} textSize="text-xl" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Placeholder for global search or actions */}
          {/* <Input placeholder="Search..." className="hidden md:block w-64" /> */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
