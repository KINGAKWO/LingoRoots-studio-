
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
 *    - A common practice is to place this file in a gitignored directory,
 *      for example, `.secure/serviceAccountKey.json` at the project root.
 *      Ensure `.secure/` is added to your `.gitignore` file.
 *    - Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of this JSON file.
 *      Example (in your terminal, before running the script):
 *      export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/.secure/serviceAccountKey.json"
 *      (On Windows, use `set GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\.secure\serviceAccountKey.json"`)
 *
 * 2. To run this script:
 *    npm run seed:firestore
 *    (Ensure "tsx" and "firebase-admin" are in devDependencies in package.json)
 */

import * as admin from 'firebase-admin';
import { mockLessons } from '../src/data/mock/lessons';
import { mockQuizzes } from '../src/data/mock/quizzes';
// Import other mock data as needed
// import { mockUserAchievements, mockAllPossibleAchievements } from '../src/data/mock/achievements';

// Initialize Firebase Admin SDK
// If GOOGLE_APPLICATION_CREDENTIALS is set, it will be used automatically.
// Alternatively, if you have placed your service account key at a known path like `.secure/serviceAccountKey.json`
// (and that path is gitignored), you could load it like this:
//
// import serviceAccountKey from '../.secure/serviceAccountKey.json'; // Adjust path if needed
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccountKey)
// });
//
// However, using GOOGLE_APPLICATION_CREDENTIALS is generally preferred for flexibility.
try {
  if (admin.apps.length === 0) {
    admin.initializeApp();
    console.log("Firebase Admin SDK initialized successfully using GOOGLE_APPLICATION_CREDENTIALS.");
  } else {
    console.log("Firebase Admin SDK already initialized.");
  }
} catch (error: any) {
  console.error("Error initializing Firebase Admin SDK. Ensure GOOGLE_APPLICATION_CREDENTIALS is set correctly, or provide a service account object directly.", error);
  process.exit(1);
}


const db = admin.firestore();

async function seedLessons() {
  const lessonsCollection = db.collection('lessons');
  console.log('Seeding lessons...');
  for (const lesson of mockLessons) {
    try {
      // Use lesson.id as the document ID
      await lessonsCollection.doc(lesson.id).set(lesson);
      console.log(`Added lesson: ${lesson.title} (ID: ${lesson.id})`);
    } catch (error) {
      console.error(`Error adding lesson ${lesson.title}:`, error);
    }
  }
  console.log('Lessons seeding completed.');
}

async function seedQuizzes() {
  const quizzesCollection = db.collection('quizzes');
  console.log('Seeding quizzes...');
  for (const quiz of mockQuizzes) {
    try {
      // Use quiz.id as the document ID
      await quizzesCollection.doc(quiz.id).set(quiz);
      console.log(`Added quiz: ${quiz.title} (ID: ${quiz.id})`);
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
