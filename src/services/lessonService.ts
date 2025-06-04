
'use server';

import { db } from '@/lib/firebase/config';
import type { Lesson } from '@/types';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export async function getLessons(): Promise<Lesson[]> {
  console.log("Attempting to fetch lessons from Firestore...");
  try {
    const lessonsCol = collection(db, 'lessons');
    const q = query(lessonsCol, orderBy('order', 'asc'));
    const lessonSnapshot = await getDocs(q);

    console.log(`Fetched ${lessonSnapshot.size} lesson documents.`);

    if (lessonSnapshot.empty) {
      console.warn("No lesson documents found in the 'lessons' collection or query returned empty.");
      return [];
    }

    const lessonList = lessonSnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Mapping lesson document: ID=${doc.id}, Title=${data.title}`);
      return { id: doc.id, ...data } as Lesson;
    });

    console.log(`Successfully mapped ${lessonList.length} lessons.`);
    return lessonList;
  } catch (error) {
    console.error("Error fetching lessons from Firestore:", error);
    // It's good to log the full error object, as it might contain more details like permission issues
    if (error instanceof Error && 'code' in error) {
        console.error("Firebase error code:", (error as any).code);
        console.error("Firebase error message:", (error as any).message);
    }
    return []; // Return empty array on error
  }
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  console.log(`Attempting to fetch lesson by ID: ${lessonId}`);
  try {
    const lessonRef = doc(db, 'lessons', lessonId);
    const lessonSnap = await getDoc(lessonRef);
    if (lessonSnap.exists()) {
      console.log(`Lesson found: ID=${lessonSnap.id}, Title=${lessonSnap.data().title}`);
      return { id: lessonSnap.id, ...lessonSnap.data() } as Lesson;
    } else {
      console.warn(`No lesson found with ID: ${lessonId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching lesson with ID ${lessonId}:`, error);
     if (error instanceof Error && 'code' in error) {
        console.error("Firebase error code:", (error as any).code);
        console.error("Firebase error message:", (error as any).message);
    }
    return null; // Return null on error
  }
}

