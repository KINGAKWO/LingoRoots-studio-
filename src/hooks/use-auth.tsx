"use client";
import { useEffect, useState, useContext, createContext, useCallback } from "react";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import {
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import type { UserProfile } from "@/types";

// Auth context type
type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  addPoints: (amount: number) => Promise<void>;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<UserProfile | null>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: "learner" | "contentCreator"
  ) => Promise<UserProfile | null>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updateUserInContextAndFirestore: (updates: Partial<UserProfile>) => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        setUser({
          ...firebaseUser,
          ...userData,
          id: firebaseUser.uid,
        } as UserProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Add points to Firestore and update local state
  const addPoints = useCallback(async (amount: number) => {
    if (!user) return;
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, {
      "progress.points": increment(amount),
    });
    setUser((prev) =>
      prev
        ? {
            ...prev,
            progress: {
              ...prev.progress,
              points: (prev.progress?.points ?? 0) + amount,
              completedLessons: prev.progress?.completedLessons ?? [],
              quizScores: prev.progress?.quizScores ?? {},
              badges: prev.progress?.badges ?? [],
              currentStreak: prev.progress?.currentStreak ?? 0,
            },
          }
        : prev
    );
  }, [user]);

  // Sign out function
  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      const profile: UserProfile = {
        ...firebaseUser,
        ...userData,
        id: firebaseUser.uid,
      } as UserProfile;
      setUser(profile);
      return profile;
    } catch (err) {
      return null;
    }
  }, []);

  // Sign up function
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      role: "learner" | "contentCreator"
    ) => {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: `${firstName} ${lastName}` });
        const userDocRef = doc(db, "users", result.user.uid);
        // Use setDoc to create the document if it doesn't exist
        await setDoc(userDocRef, {
          firstName,
          lastName,
          email,
          role, // Store the role
          progress: { points: 0, completedLessons: [], currentStreak: 0 },
        });
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : {};
        const profile: UserProfile = {
          ...result.user,
          ...userData,
          id: result.user.uid,
        } as UserProfile;
        setUser(profile);
        return profile;
      } catch (err) {
        return null;
      }
    },
    []
  );

  // Password reset function
  const sendPasswordResetEmail = useCallback(async (email: string) => {
    await firebaseSendPasswordResetEmail(auth, email);
  }, []);

  // Update user in context and Firestore
  const updateUserInContextAndFirestore = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) return;
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, updates);
      setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        addPoints,
        signOut,
        signIn,
        signUp,
        sendPasswordResetEmail,
        updateUserInContextAndFirestore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook (default export)
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}