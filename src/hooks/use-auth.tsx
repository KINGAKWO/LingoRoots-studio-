
"use client";

import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config'; // Added db
import type { UserProfile } from '@/types';
import { onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail as firebaseSendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Added doc, setDoc, serverTimestamp
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: AuthError | null;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<FirebaseUser | null>;
  signIn: (email: string, password: string) => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
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
        // Potentially fetch additional user profile data from Firestore here to get the role
        // For now, role is hardcoded as 'learner' client-side.
        // Once Firestore user document is reliably created on sign-up,
        // this is where you'd fetch doc(db, "users", firebaseUser.uid) to get the role.
        const profile: UserProfile = {
          ...firebaseUser,
          id: firebaseUser.uid,
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          // lastName: firebaseUser.displayName?.split(' ')[1] || '', // Example
          role: 'learner', // Default role as per spec, this should be updated from Firestore or custom claims
        };
        setUser(profile);
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
        await updateProfile(firebaseUser, {
          displayName: newDisplayName
        });

        // Create user document in Firestore
        await setDoc(doc(db, "users", firebaseUser.uid), {
          email: firebaseUser.email,
          displayName: newDisplayName,
          role: 'learner', // Default role
          createdAt: serverTimestamp()
        });
      }
      // onAuthStateChanged will handle setting the user state
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
      // The onAuthStateChanged listener will pick up the user.
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
      setUser(null);
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
      throw e; // Re-throw to be caught by form
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signUp, signIn, signOut, sendPasswordResetEmail }}>
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
