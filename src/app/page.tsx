import { AuthRedirect } from "@/components/auth-redirect";

export default function HomePage() {
  return (
    <AuthRedirect redirectTo="/dashboard" requireAuth={false} authPath="/login">
      {/* This content will ideally not be shown as redirect should happen */}
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading LingoRoots...</p>
      </div>
    </AuthRedirect>
  );
}
