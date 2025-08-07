"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";

interface AppSidebarNavProps {
  items: NavItem[];
  onLinkClick?: () => void; // For mobile sidebar to close on click
}

export function AppSidebarNav({ items, onLinkClick }: AppSidebarNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
        return item.href ? (
          <SidebarMenuItem key={index}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                asChild
                variant="default"
                size="default"
                isActive={isActive}
                className={cn(
                  "justify-start",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
                onClick={onLinkClick}
                tooltip={item.title}
              >
                <span>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                  {item.label && (
                    <span className="ml-auto text-xs">{item.label}</span>
                  )}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ) : null;
      })}
    </SidebarMenu>
  );
}
