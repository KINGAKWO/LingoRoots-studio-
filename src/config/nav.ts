
import type { NavItem } from "@/types";
import { LayoutGrid, BookOpenText, HelpCircle, Award, DatabaseZap, User, Settings, Globe, Users, LanguagesIcon, Trophy } from "lucide-react";

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Select Language",
    href: "/select-language",
    icon: LanguagesIcon,
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
    title: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
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
    icon: DatabaseZap,
    adminOnly: true,
  },
  {
    title: "User Management",
    href: "/admin/user-management",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Language Management",
    href: "/admin/language-management",
    icon: Globe,
    adminOnly: true,
  },
];
