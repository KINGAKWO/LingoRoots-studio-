"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { OAuthButtons } from "./oauth-buttons";

const formSchemaBase = {
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
};

const signUpSchema = z.object({
  ...formSchemaBase,
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
});

const loginSchema = z.object(formSchemaBase);

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});


type AuthFormProps = {
  mode: "login" | "signup" | "forgot-password";
};

export function AuthForm({ mode }: AuthFormProps) {
  const { signUp, signIn, sendPasswordResetEmail, error: authError } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const currentSchema = mode === "signup" ? signUpSchema : mode === 'login' ? loginSchema : forgotPasswordSchema;
  type CurrentFormValues = z.infer<typeof currentSchema>;

  const form = useForm<CurrentFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: mode === 'signup' 
      ? { email: "", password: "", firstName: "", lastName: "" } 
      : { email: "", password: "" },
  });

  async function onSubmit(values: CurrentFormValues) {
    setIsLoading(true);
    try {
      if (mode === "signup") {
        const { email, password, firstName, lastName } = values as z.infer<typeof signUpSchema>;
        const user = await signUp(email, password, firstName, lastName);
        if (user) {
          toast({ title: "Account Created", description: "Welcome to LingoRoots!" });
          router.push("/dashboard");
        }
      } else if (mode === "login") {
        const { email, password } = values as z.infer<typeof loginSchema>;
        const user = await signIn(email, password);
        if (user) {
          toast({ title: "Signed In", description: "Welcome back!" });
          router.push("/dashboard");
        }
      } else if (mode === "forgot-password") {
        const { email } = values as z.infer<typeof forgotPasswordSchema>;
        await sendPasswordResetEmail(email);
        toast({ title: "Password Reset Email Sent", description: "Check your inbox for instructions to reset your password." });
        form.reset();
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-card shadow-xl rounded-xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary font-headline">
          {mode === "login" && "Welcome Back!"}
          {mode === "signup" && "Create Your Account"}
          {mode === "forgot-password" && "Reset Your Password"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "login" && "Sign in to continue your Duala learning journey."}
          {mode === "signup" && "Join LingoRoots and start learning Duala today."}
          {mode === "forgot-password" && "Enter your email to receive a password reset link."}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {mode === "signup" && (
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {mode !== "forgot-password" && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {authError && <p className="text-sm text-destructive">{authError.message}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" && "Sign In"}
            {mode === "signup" && "Sign Up"}
            {mode === "forgot-password" && "Send Reset Link"}
          </Button>
        </form>
      </Form>

      {mode !== 'forgot-password' && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <OAuthButtons />
        </>
      )}


      <div className="mt-6 text-center text-sm">
        {mode === "login" && (
          <>
            Don't have an account?{" "}
            <Button variant="link" asChild className="px-0 text-primary">
              <Link href="/signup">Sign up</Link>
            </Button>
            <br />
            <Button variant="link" asChild className="px-0 text-sm text-muted-foreground">
              <Link href="/forgot-password">Forgot password?</Link>
            </Button>
          </>
        )}
        {mode === "signup" && (
          <>
            Already have an account?{" "}
            <Button variant="link" asChild className="px-0 text-primary">
              <Link href="/login">Sign in</Link>
            </Button>
          </>
        )}
        {mode === "forgot-password" && (
           <Button variant="link" asChild className="px-0 text-primary">
             <Link href="/login">Back to Sign In</Link>
           </Button>
        )}
      </div>
    </div>
  );
}
