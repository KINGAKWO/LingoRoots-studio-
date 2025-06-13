"use client";

import  useAuth  from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AuthRedirectProps {
  children?: React.ReactNode;
  redirectTo?: string; // Path to redirect to if authenticated (e.g., for login page)
  requireAuth?: boolean; // If true, redirects to login if not authenticated
  authPath?: string; // Path to redirect to if not authenticated (e.g., /login)
}

export function AuthRedirect({ children, redirectTo, requireAuth, authPath = "/login" }: AuthRedirectProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (user && redirectTo && pathname !== redirectTo) {
      // If user is logged in and we are on a page like /login or /signup (redirectTo is defined)
      router.replace(redirectTo);
    } else if (!user && requireAuth && pathname !== authPath) {
      // If user is not logged in and the page requires auth
      router.replace(authPath);
    }
  }, [user, loading, router, redirectTo, requireAuth, authPath, pathname]);

  if (loading || (user && redirectTo && pathname !== redirectTo) || (!user && requireAuth && pathname !== authPath)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
