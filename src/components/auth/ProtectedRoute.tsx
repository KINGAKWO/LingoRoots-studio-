"use client";
import useAuth from "@/hooks/use-auth";

type ProtectedRouteProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <p className="p-8 text-center text-destructive">Access denied.</p>;
  }
  return <>{children}</>;
}