
/**
 * @fileOverview Script to seed Firestore database with mock data.
 * 
 * This script is intended to be run by a developer from the command line.
 * It uses the Firebase Admin SDK to bypass security rules and directly write data.
 * 
 * IMPORTANT:
 * 1. Set up Firebase Admin SDK:
 *    - Go to your Firebase project settings > Service accounts.
 *    - Generate a new private key (JSON file).
 *    - !! KEEP THIS FILE SECURE AND DO NOT COMMIT IT TO GIT !!
 *    - Place this file in the `.secure/serviceAccountKey.json` (this path is gitignored).
 *      Ensure you replace the placeholder content in `.secure/serviceAccountKey.json` with your actual key.
 *    - Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of this JSON file.
 *      Example (in your terminal, before running the script):
 *      export GOOGLE_APPLICATION_CREDENTIALS=".secure/serviceAccountKey.json"
 *      (On Windows, use `set GOOGLE_APPLICATION_CREDENTIALS=".secure\serviceAccountKey.json"`)
 *      Using GOOGLE_APPLICATION_CREDENTIALS is the recommended approach.
 *
 * 2. To run this script:
 *    npm run seed:firestore
 *    (Ensure "tsx", "firebase-admin" are in devDependencies in package.json)
 */

import * as admin from 'firebase-admin';
import { mockLessons } from '../src/data/mock/lessons';
import { mockQuizzes } from '../src/data/mock/quizzes';
// Import other mock data as needed
// import { mockUserAchievements, mockAllPossibleAchievements } from '../src/data/mock/achievements';

// Initialize Firebase Admin SDK
try {
  if (admin.apps.length === 0) {
    admin.initializeApp();
    console.log("Firebase Admin SDK initialized. It will use GOOGLE_APPLICATION_CREDENTIALS if set, or attempt to find default credentials.");
  } else {
    console.log("Firebase Admin SDK already initialized.");
  }
} catch (error: any) {
  console.error("Error initializing Firebase Admin SDK. Ensure GOOGLE_APPLICATION_CREDENTIALS is set correctly, or provide a service account object directly if needed.", error);
  process.exit(1);
}


const db = admin.firestore();

async function seedLessons() {
  console.log('Seeding lessons...');
  for (const lesson of mockLessons) {
    if (!lesson.languageId) {
      console.error(`Skipping lesson "${lesson.title}" due to missing languageId.`);
      continue;
    }
    try {
      const lessonDocRef = db.collection('languages').doc(lesson.languageId).collection('lessons').doc(lesson.id);
      await lessonDocRef.set(lesson);
      console.log(`Added lesson: ${lesson.title} (ID: ${lesson.id}) to language ${lesson.languageId}`);
    } catch (error) {
      console.error(`Error adding lesson ${lesson.title} to language ${lesson.languageId}:`, error);
    }
  }
  console.log('Lessons seeding completed.');
}

async function seedQuizzes() {
  console.log('Seeding quizzes...');
  for (const quiz of mockQuizzes) {
    try {
      const lesson = mockLessons.find(l => l.id === quiz.lessonId);
      if (!lesson || !lesson.languageId) {
        console.error(`Skipping quiz "${quiz.title}" due to missing lesson or lesson languageId.`);
        continue;
      }
      const quizDataWithLessonTitle = {
        ...quiz,
        lessonTitle: lesson.title, // lesson.title is already present in mockLessons
        languageId: lesson.languageId,
      };
      const quizDocRef = db.collection('languages').doc(lesson.languageId).collection('quizzes').doc(quiz.id);
      await quizDocRef.set(quizDataWithLessonTitle);
      console.log(`Added quiz: ${quiz.title} (ID: ${quiz.id}) for lesson: ${quizDataWithLessonTitle.lessonTitle} to language ${lesson.languageId}`);
    } catch (error) {
      console.error(`Error adding quiz ${quiz.title}:`, error);
    }
  }
  console.log('Quizzes seeding completed.');
}

// Add more seeding functions here for other data types (achievements, etc.)
// async function seedAchievements() { ... }

async function main() {
  console.log('Starting Firestore data seeding process...');
  
  await seedLessons();
  await seedQuizzes();
  // await seedAchievements(); // Uncomment when ready

  console.log('Firestore data seeding process finished.');
}

main().catch(error => {
  console.error('Error during seeding process:', error);
  process.exit(1);
});
