
"use client";

import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import type { UserProfile, UserProgress } from '@/types';
import { onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail as firebaseSendPasswordResetEmail, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: AuthError | null;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<FirebaseUser | null>;
  signIn: (email: string, password: string) => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updateUserInContextAndFirestore: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as UserProfile;
          setUser({
            ...firebaseUser, // Base Firebase user props
            id: firebaseUser.uid,
            firstName: userData.firstName || firebaseUser.displayName?.split(" ")[0] || "",
            lastName: userData.lastName || firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
            email: firebaseUser.email!,
            role: userData.role || 'learner',
            progress: userData.progress || { points: 0, completedLessons: [], quizScores: {}, currentStreak: 0, badges: [] },
            selectedLanguageId: userData.selectedLanguageId,
            createdAt: userData.createdAt,
          });
        } else {
          // This case should ideally be handled by signup, but as a fallback:
           const nameParts = firebaseUser.displayName?.split(" ") || ["", ""];
           const initialProgress: UserProgress = { points: 0, completedLessons: [], quizScores: {}, currentStreak: 0, badges: [] };
           const newUserProfile: UserProfile = {
            ...firebaseUser,
            id: firebaseUser.uid,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: firebaseUser.email!,
            role: 'learner',
            progress: initialProgress,
            createdAt: new Date(), // Using client date, serverTimestamp would be better if creating here
          };
          setUser(newUserProfile);
          // Optionally create the doc here if it's missing, though signup should do it
          // await setDoc(userDocRef, { email: newUserProfile.email, displayName: newUserProfile.displayName, role: 'learner', createdAt: serverTimestamp(), progress: initialProgress });

        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      if (firebaseUser) {
        const newDisplayName = `${firstName || ''} ${lastName || ''}`.trim();
        await firebaseUpdateProfile(firebaseUser, {
          displayName: newDisplayName
        });

        const initialProgress: UserProgress = {
          points: 0,
          completedLessons: [],
          quizScores: {},
          currentStreak: 0,
          badges: []
        };

        await setDoc(doc(db, "users", firebaseUser.uid), {
          email: firebaseUser.email,
          displayName: newDisplayName,
          firstName: firstName || "",
          lastName: lastName || "",
          role: 'learner', 
          createdAt: serverTimestamp(),
          progress: initialProgress,
          selectedLanguageId: null, // Initialize selectedLanguageId
        });
      }
      setLoading(false);
      return firebaseUser;
    } catch (e) {
      setError(e as AuthError);
      setLoading(false);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      return userCredential.user;
    } catch (e) {
      setError(e as AuthError);
      setLoading(false);
      return null;
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null); // Clear user state immediately
      setLoading(false);
      router.push('/login');
    } catch (e) {
      setError(e as AuthError);
      setLoading(false);
    }
  };
  
  const sendPasswordResetEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      setLoading(false);
    } catch (e) {
      setError(e as AuthError);
      setLoading(false);
      throw e; 
    }
  };

  const updateUserInContextAndFirestore = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, updates);
      setUser(prevUser => prevUser ? ({ ...prevUser, ...updates }) : null);
      setLoading(false);
    } catch (e) {
      setError(e as AuthError);
      setLoading(false);
      console.error("Error updating user profile in Firestore and context:", e);
    }
  }, [user]);


  return (
    <AuthContext.Provider value={{ user, loading, error, signUp, signIn, signOut, sendPasswordResetEmail, updateUserInContextAndFirestore }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
