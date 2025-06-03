import { AuthRedirect } from "@/components/auth-redirect";

export default function HomePage() {
  return (
    <AuthRedirect redirectTo="/dashboard" requireAuth={true} authPath="/login">
      {/* This content will ideally not be shown as AuthRedirect's internal loader will take precedence during redirection. */}
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading LingoRoots...</p>
      </div>
    </AuthRedirect>
  );
}
