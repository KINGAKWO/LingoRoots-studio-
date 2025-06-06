"use client";

import { useAuth } from "@/hooks/use-auth";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Edit3, Zap, CheckCircle2, Target } from "lucide-react";
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config"; // Ensure db is imported here
import { doc, getDoc } from 'firebase/firestore'; // Import doc and getDoc from firestore
import { StatsCard } from "@/components/dashboard/stats-card";
import type { UserProgress } from "@/types";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine(data => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to change password.",
  path: ["currentPassword"],
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match.",
  path: ["confirmNewPassword"],
}).refine(data => {
  if (data.newPassword && data.newPassword.length < 6) {
    return false;
  }
  return true;
}, {
  message: "New password must be at least 6 characters.",
  path: ["newPassword"],
});

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const getInitials = (name?: string | null) => {
    if (!name) return "LR";
    const parts = name.split(" ");
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user || !auth.currentUser) {
      toast({ title: "Error", description: "User not found.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      const newDisplayName = `${values.firstName} ${values.lastName}`.trim();
      if (newDisplayName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: newDisplayName });
      }

      if (values.email !== user.email && values.currentPassword) {
         const credential = EmailAuthProvider.credential(user.email!, values.currentPassword);
         await reauthenticateWithCredential(auth.currentUser, credential);
         await updateEmail(auth.currentUser, values.email);
      } else if (values.email !== user.email && !values.currentPassword) {
        toast({ title: "Info", description: "To change email, please provide your current password.", variant: "default" });
      }

      if (values.newPassword && values.currentPassword) {
        const credential = EmailAuthProvider.credential(user.email!, values.currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, values.newPassword);
      }
      
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
      setIsEditing(false); 
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({ title: "Update Failed", description: error.message || "Could not update profile.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      form.reset({ ...values, currentPassword: "", newPassword: "", confirmNewPassword: "" });
    }
  }

  if (authLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Your Profile</h1>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="gap-2">
          <Edit3 size={16} /> {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader className="items-center text-center border-b pb-6">
          <Avatar className="h-24 w-24 mb-4 border-2 border-primary ring-2 ring-primary/50 ring-offset-2">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} data-ai-hint="user portrait" />
            <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.displayName}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
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
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-sm text-muted-foreground pt-2">To change email or password, please enter your current password.</p>
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl><Input type="password" {...field} placeholder="Required to change email/password" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password (optional)</FormLabel>
                      <FormControl><Input type="password" {...field} placeholder="Leave blank to keep current" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => {setIsEditing(false); form.reset();}}>Cancel</Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-2 text-sm">
              <p><strong>First Name:</strong> {form.getValues("firstName")}</p>
              <p><strong>Last Name:</strong> {form.getValues("lastName")}</p>
              <p><strong>Email:</strong> {form.getValues("email")}</p>
              <p className="text-xs text-muted-foreground mt-4">Last Login: {new Date(user.metadata.lastSignInTime || Date.now()).toLocaleString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {!isEditing && (
        <>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-primary font-headline">Your Progress</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                title="Total Points"
                value={user?.progress?.points ?? 0}
                icon={Zap}
                description="Points earned from lessons and quizzes."
                dataAiHint="progress points"
              />
              <StatsCard
                title="Lessons Completed"
                value={user?.progress?.completedLessons?.length ?? 0}
                icon={CheckCircle2}
                description="Keep up the great work!"
                dataAiHint="progress lessons"
              />
              <StatsCard
                title="Current Streak"
                value={`${user?.progress?.currentStreak ?? 0} days`}
                icon={Target}
                description="Maintain your learning consistency."
                dataAiHint="progress streak"
              />
            </div>
            {/* Future: Could add a list of badges earned or recent quiz scores here */}
          </div>
        </>
      )}
    </div>
  );
}
