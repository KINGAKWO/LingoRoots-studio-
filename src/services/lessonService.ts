
'use server';

import { db } from '@/lib/firebase/config';
import type { Lesson } from '@/types';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export async function getLessons(language: string): Promise<Lesson[]> {
  console.log(`Attempting to fetch lessons for language: ${language} with ordering...`);
  try {
    const lessonsCol = collection(db, `languages/${language}/lessons`);
    // Ensure you have an index for 'order' if needed. Firebase will log an error with a link if an index is missing.
    const q = query(lessonsCol, orderBy('order', 'asc')); 
    const lessonSnapshot = await getDocs(q);

    console.log(`Fetched ${lessonSnapshot.size} lesson documents.`);

    if (lessonSnapshot.empty) {
      console.warn("No lesson documents found in the 'lessons' collection or query returned empty.");
      return [];
    }

    const lessonList = lessonSnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Mapping lesson document for language ${language}: ID=${doc.id}, Title=${data.title}, Order=${data.order}`);
      return { id: doc.id, ...data } as Lesson;
    });

    console.log(`Successfully mapped ${lessonList.length} lessons.`);
    return lessonList;
  } catch (error: any) {
    console.error("Error fetching lessons from Firestore:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Full error object:", error);
    return []; // Return empty array on error
  }
}

export async function getLessonById(language: string, lessonId: string): Promise<Lesson | null> {
  console.log(`Attempting to fetch lesson for language ${language} by ID: ${lessonId}`);
  try {
    const lessonRef = doc(db, `languages/${language}/lessons`, lessonId);
    const lessonSnap = await getDoc(lessonRef);
    if (lessonSnap.exists()) {
      const data = lessonSnap.data();
      console.log(`Lesson found: ID=${lessonSnap.id}, Title=${data.title}`);
      return { id: lessonSnap.id, ...data } as Lesson;
    } else {
      console.warn(`No lesson found with ID: ${lessonId}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error fetching lesson with ID ${lessonId}:`);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Full error object:", error);
    return null; // Return null on error
  }
}
