import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "./user-nav";
import { Logo } from "../logo";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth"; // Client-side hook

type AppHeaderProps = {
  // Props can be added if needed, e.g. for breadcrumbs
};

export function AppHeader({}:AppHeaderProps) {
  // Cannot use useAuth directly in Server Component
  // UserNav will handle auth state client-side

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
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
