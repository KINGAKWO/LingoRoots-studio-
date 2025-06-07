
'use server';

import { db } from '@/lib/firebase/config';
import type { Quiz } from '@/types';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

export async function getQuizzes(language: string): Promise<Quiz[]> {
  console.log("Attempting to fetch quizzes from Firestore...");
  try {
    const quizzesCol = collection(db, `languages/${language}/quizzes`);
    // Consider adding an orderBy clause if a specific order is desired, e.g., orderBy('title', 'asc')
    const quizSnapshot = await getDocs(quizzesCol);
     console.log(`Fetched ${quizSnapshot.size} quiz documents.`);

    if (quizSnapshot.empty) {
      console.warn("No quiz documents found in the 'quizzes' collection or query returned empty.");
      return [];
    }

    const quizList = quizSnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Mapping quiz document: ID=${doc.id}, Title=${data.title}`);
      return { id: doc.id, ...data } as Quiz;
    });
     console.log(`Successfully mapped ${quizList.length} quizzes.`);
    return quizList;
  } catch (error: any) {
    console.error("Error fetching quizzes from Firestore:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Full error object:", error);
    return [];
  }
}

export async function getQuizById(language: string, quizId: string): Promise<Quiz | null> {
  console.log(`Attempting to fetch quiz by ID: ${quizId}`);
  try {
    const quizRef = doc(db, `languages/${language}/quizzes`, quizId);
    const quizSnap = await getDoc(quizRef);
    if (quizSnap.exists()) {
      const data = quizSnap.data();
      console.log(`Quiz found: ID=${quizSnap.id}, Title=${data.title}`);
      return { id: quizSnap.id, ...data } as Quiz;
    } else {
      console.warn(`No quiz found with ID: ${quizId}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error fetching quiz with ID ${quizId}:`);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Full error object:", error);
    return null;
  }
}

export async function getQuizByLessonId(language: string, lessonId: string): Promise<Quiz | null> {
  console.log(`Attempting to fetch quiz by lessonId: ${lessonId}`);
  try {
    const quizzesCol = collection(db, `languages/${language}/quizzes`);
    const q = query(quizzesCol, where('lessonId', '==', lessonId));
    const quizSnapshot = await getDocs(q);
    if (!quizSnapshot.empty) {
      // Assuming one quiz per lesson for now, take the first one
      const quizDoc = quizSnapshot.docs[0];
      const data = quizDoc.data();
      console.log(`Quiz found for lessonId ${lessonId}: ID=${quizDoc.id}, Title=${data.title}`);
      return { id: quizDoc.id, ...data } as Quiz;
    } else {
      console.warn(`No quiz found for lesson ID: ${lessonId}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error fetching quiz for lesson ID ${lessonId}:`);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Full error object:", error);
    return null;
  }
}
