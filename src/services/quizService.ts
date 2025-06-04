
'use server';

import { db } from '@/lib/firebase/config';
import type { Quiz } from '@/types';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

export async function getQuizzes(): Promise<Quiz[]> {
  try {
    const quizzesCol = collection(db, 'quizzes');
    // Consider adding an orderBy clause if a specific order is desired, e.g., orderBy('title', 'asc')
    const quizSnapshot = await getDocs(quizzesCol);
    const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
    return quizList;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
}

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizSnap = await getDoc(quizRef);
    if (quizSnap.exists()) {
      return { id: quizSnap.id, ...quizSnap.data() } as Quiz;
    } else {
      console.warn(`No quiz found with ID: ${quizId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching quiz with ID ${quizId}:`, error);
    return null;
  }
}

export async function getQuizByLessonId(lessonId: string): Promise<Quiz | null> {
  try {
    const quizzesCol = collection(db, 'quizzes');
    const q = query(quizzesCol, where('lessonId', '==', lessonId));
    const quizSnapshot = await getDocs(q);
    if (!quizSnapshot.empty) {
      // Assuming one quiz per lesson for now, take the first one
      const quizDoc = quizSnapshot.docs[0];
      return { id: quizDoc.id, ...quizDoc.data() } as Quiz;
    } else {
      console.warn(`No quiz found for lesson ID: ${lessonId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching quiz for lesson ID ${lessonId}:`, error);
    return null;
  }
}
