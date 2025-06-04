
'use server';

import { db } from '@/lib/firebase/config';
import type { Lesson } from '@/types';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export async function getLessons(): Promise<Lesson[]> {
  try {
    const lessonsCol = collection(db, 'lessons');
    const q = query(lessonsCol, orderBy('order', 'asc'));
    const lessonSnapshot = await getDocs(q);
    const lessonList = lessonSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
    return lessonList;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return []; // Return empty array on error
  }
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  try {
    const lessonRef = doc(db, 'lessons', lessonId);
    const lessonSnap = await getDoc(lessonRef);
    if (lessonSnap.exists()) {
      return { id: lessonSnap.id, ...lessonSnap.data() } as Lesson;
    } else {
      console.warn(`No lesson found with ID: ${lessonId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching lesson with ID ${lessonId}:`, error);
    return null; // Return null on error
  }
}
