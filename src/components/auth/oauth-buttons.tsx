"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebook } from "react-icons/fa"; // Example, ensure react-icons is installed or use SVGs/lucide if preferred

// Placeholder functions for OAuth - implement with Firebase providers
// import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "@/lib/firebase/config";

export function OAuthButtons() {
  const router = useRouter();
  const { toast } = useToast();
  // const { signInWithProvider } = useAuth(); // Assume useAuth provides this

  const handleOAuthSignIn = async (providerName: "google" | "facebook") => {
    toast({ title: "OAuth In Progress", description: `Signing in with ${providerName}...` });
    // Example for Google:
    // const provider = new GoogleAuthProvider();
    // try {
    //   const result = await signInWithPopup(auth, provider);
    //   if (result.user) {
    //      toast({ title: "Signed In", description: "Welcome!" });
    //      router.push("/dashboard");
    //    }
    // } catch (error: any) {
    //   toast({ title: "OAuth Error", description: error.message, variant: "destructive" });
    // }
    console.warn(`OAuth with ${providerName} not implemented yet.`);
    toast({ title: "Not Implemented", description: `OAuth with ${providerName} is a placeholder.`, variant: "destructive" });
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthSignIn("google")}
        data-ai-hint="Google login"
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthSignIn("facebook")}
        data-ai-hint="Facebook login"
      >
        <FaFacebook className="mr-2 h-4 w-4" />
        Sign in with Facebook
      </Button>
    </div>
  );
}
