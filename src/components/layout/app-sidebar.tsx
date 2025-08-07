import type { NavItem } from '@/types';
import useAuth from '@/hooks/use-auth';
import { useSidebar } from '@/components/ui/sidebar';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup } from '@/components/ui/sidebar';
import { AppSidebarNav } from './app-sidebar-nav';
import { mainNavItems, adminNavItems, userNavItems } from '@/config/nav';
import { Logo } from '../logo';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { Separator } from '../ui/separator';

interface AppSidebarProps {
  navItems: NavItem[];
  onLinkClick: () => void;
}

export function AppSidebar({ navItems, onLinkClick }: AppSidebarProps) {
  const { signOut, user } = useAuth();
  const { setOpenMobile } = useSidebar();

  // Only admins and content creators see the admin section
  const canAccessAdmin = user?.role === 'admin' || user?.role === 'contentCreator';

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setOpenMobile(false);
    }
    onLinkClick();
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="flex-1 p-0">
        <SidebarGroup className="p-2">
          <AppSidebarNav items={navItems} onLinkClick={handleLinkClick} />
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