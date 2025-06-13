"use client";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebarNav } from "./app-sidebar-nav";
import { mainNavItems, adminNavItems, userNavItems } from "@/config/nav";
import { Logo } from "../logo";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import { Separator } from "../ui/separator";

export function AppSidebar() {
  const { signOut, user } = useAuth();
  const { setOpenMobile } = useSidebar();

  // Only admins and content creators see the admin section
  const canAccessAdmin = user?.role === "admin" || user?.role === "contentCreator";

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="flex-1 p-0">
        <SidebarGroup className="p-2">
          <AppSidebarNav items={mainNavItems} onLinkClick={handleLinkClick} />
        </SidebarGroup>
        {canAccessAdmin && (
          <>
            <Separator className="my-2" />
            <SidebarGroup className="p-2">
              <span className="px-2 text-xs font-medium text-muted-foreground">Admin</span>
              <AppSidebarNav items={adminNavItems} onLinkClick={handleLinkClick} />
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <AppSidebarNav items={userNavItems} onLinkClick={handleLinkClick} />
        <Button variant="ghost" className="w-full justify-start mt-2" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function ContentManagementPage() {
  const { user } = useAuth();
  if (!user || (user.role !== "admin" && user.role !== "contentCreator")) {
    return <p className="p-8 text-center text-destructive">Access denied.</p>;
  }

  return <div>/* Your content management page code here */</div>;
}
