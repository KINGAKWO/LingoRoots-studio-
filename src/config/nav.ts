import type { NavItem } from "@/types";
import { LayoutGrid, BookOpenText, HelpCircle, Award, DatabaseZap, User, Settings } from "lucide-react";

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Lessons",
    href: "/lessons",
    icon: BookOpenText,
  },
  {
    title: "Quizzes",
    href: "/quizzes",
    icon: HelpCircle,
  },
  {
    title: "Achievements",
    href: "/achievements",
    icon: Award,
  },
];

export const userNavItems: NavItem[] = [
   {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

export const adminNavItems: NavItem[] = [
  {
    title: "Content Management",
    href: "/admin/content-management",
    icon: DatabaseZap, // or Settings
    adminOnly: true,
  },
];
