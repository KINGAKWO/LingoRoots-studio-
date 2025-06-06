"use client";

import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import type { UserProfile, UserProgress } from '@/types';
import { onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail as firebaseSendPasswordResetEmail, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth'; 

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
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // --- Set up real-time listener for user document ---
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const profile: UserProfile = {
              ...firebaseUser, // Include firebaseUser properties
              id: firebaseUser.uid,
              firstName: userData.firstName || '', // Get from Firestore or use default
              lastName: userData.lastName || '', // Get from Firestore or use default
              role: userData.role || 'learner', // Get from Firestore or use default
              selectedLanguageId: userData.selectedLanguageId || undefined, // Get from Firestore
              createdAt: userData.createdAt?.toDate() || undefined, // Convert Firestore timestamp to Date
              progress: userData.progress as UserProgress || { // Get progress or use default empty progress
                completedLessons: [],
                quizScores: {},
                badges: [],
                currentStreak: 0,
                points: 0,
              },
            };
            setUser(profile);
          } else {
            // User document doesn't exist yet, create a basic one
            setDoc(userDocRef, {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: 'learner', // Default role
              createdAt: serverTimestamp(),
              progress: { // Initialize empty progress
                completedLessons: [],
                quizScores: {},
                badges: [],
                currentStreak: 0,
                points: 0,
              }
            }).then(() => {
              console.log("New user document created with initial progress.");
              // After creating, refetch or let the listener update the state
            }).catch(error => {
              console.error("Error creating initial user document:", error);
            });

            // Set user state with basic info while document is being created
            const basicProfile: UserProfile = {
              ...firebaseUser,
              id: firebaseUser.uid,
              firstName: firebaseUser.displayName?.split(" ")[0] || '',
              lastName: firebaseUser.displayName?.split(" ").slice(1).join(" ") || '',
              role: 'learner',
              // progress will be added by the listener after creation
            };
            setUser(basicProfile);
          }
          setLoading(false); // Set loading to false after first data load
        }, (error) => {
          console.error("Error listening to user document:", error);
          setError(error as AuthError);
          setLoading(false);
        });

        // Return unsubscribe function for both auth and firestore listeners
        return () => {
          unsubscribeAuth();
          unsubscribeFirestore();
        };
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribeAuth;
  }, []); // Empty dependency array ensures this effect runs only once on mount

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