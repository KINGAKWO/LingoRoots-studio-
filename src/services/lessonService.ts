'use server';

import { db } from '@/lib/firebase/config';
import type { Lesson } from '@/types';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export async function getLessons(language: string): Promise<Lesson[]> {
  const lessonsCol = collection(db, `languages/${language}/lessons`);
  const q = query(lessonsCol, orderBy('order', 'asc'));
  const lessonSnapshot = await getDocs(q);

  if (lessonSnapshot.empty) {
    console.warn("No lesson documents found in the 'lessons' collection or query returned empty.");
    return [];
  }

  const lessonList = lessonSnapshot.docs.map(doc => {
    const data = doc.data();
    return { id: doc.id, ...data } as Lesson;
  });

  return lessonList;
}

export async function getLessonById(language: string, lessonId: string): Promise<Lesson | null> {
  try {
    const lessonRef = doc(db, `languages/${language}/lessons/${lessonId}`);
    const lessonSnapshot = await getDoc(lessonRef);

    if (!lessonSnapshot.exists()) {
      console.error(`Lesson not found: ${lessonId}`);
      return null;
    }

    const lessonData = lessonSnapshot.data();
    return { id: lessonSnapshot.id, ...lessonData } as Lesson;
  } catch (error: any) {
    console.error("Error fetching lesson from Firestore:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Full error object:", error);
    return null;
  }
}