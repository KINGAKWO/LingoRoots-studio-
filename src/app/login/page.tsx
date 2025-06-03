import { AuthForm } from "@/components/auth/auth-form";
import { AuthRedirect } from "@/components/auth-redirect";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <AuthRedirect redirectTo="/dashboard">
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-secondary/30">
        <Logo className="mb-8" iconSize={40} textSize="text-4xl"/>
        <AuthForm mode="login" />
      </main>
    </AuthRedirect>
  );
}
