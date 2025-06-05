
'use server';

import { db } from '@/lib/firebase/config';
import type { UserProfile, LeaderboardUser } from '@/types';
import { collection, getDocs, query, orderBy, limit as firestoreLimit } from 'firebase/firestore';

function getInitials(name?: string | null): string {
  if (!name) return "LR";
  const parts = name.split(" ");
  if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  if (parts[0] && parts[0].length >=2) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return "??";
}


export async function getLeaderboardUsers(count: number = 10): Promise<LeaderboardUser[]> {
  console.log(`Attempting to fetch top ${count} users for leaderboard...`);
  try {
    const usersCol = collection(db, 'users');
    // Firestore queries for ordering require the field to exist on documents.
    // 'progress.points' is the path to the nested points field.
    const q = query(usersCol, orderBy('progress.points', 'desc'), firestoreLimit(count));
    
    const userSnapshot = await getDocs(q);
    console.log(`Fetched ${userSnapshot.size} user documents for leaderboard.`);

    if (userSnapshot.empty) {
      console.warn("No user documents found for leaderboard or query returned empty.");
      return [];
    }

    const leaderboardUsers: LeaderboardUser[] = userSnapshot.docs.map((doc, index) => {
      const data = doc.data() as UserProfile; // Assuming users collection stores UserProfile
      console.log(`Mapping user: ID=${doc.id}, Name=${data.displayName}, Points=${data.progress?.points}`);
      return {
        id: doc.id,
        rank: index + 1,
        displayName: data.displayName || "Anonymous User",
        points: data.progress?.points || 0,
        // avatarUrl: data.photoURL, // Assuming photoURL might be stored from Firebase Auth user
        avatarFallback: getInitials(data.displayName),
      };
    });

    console.log(`Successfully mapped ${leaderboardUsers.length} users for leaderboard.`);
    return leaderboardUsers;
  } catch (error: any) {
    console.error("Error fetching leaderboard users from Firestore:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Full error object:", error);
    // This error might indicate a missing Firestore index. 
    // Firestore usually logs a link in the console to create it.
    if (error.code === 'failed-precondition') {
      console.error("This error often means you need to create a composite index in Firestore. Check the Firebase console for a link to create it for the 'users' collection ordered by 'progress.points'.");
    }
    return []; // Return empty array on error
  }
}
