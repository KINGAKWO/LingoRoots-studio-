
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
 *    - Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of this JSON file.
 *      Example (in your terminal, before running the script):
 *      export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"
 *      (On Windows, use `set GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\serviceAccountKey.json"`)
 *
 * 2. To run this script:
 *    npm run seed:firestore
 *    (Ensure "tsx" and "firebase-admin" are in devDependencies in package.json)
 */

import * as admin from 'firebase-admin';
import { mockLessons } from '../src/data/mock/lessons'; // Adjust path as necessary
import { mockQuizzes } from '../src/data/mock/quizzes'; // Adjust path as necessary
// Import other mock data as needed
// import { mockUserAchievements, mockAllPossibleAchievements } from '../src/data/mock/achievements';

// Initialize Firebase Admin SDK
// If GOOGLE_APPLICATION_CREDENTIALS is set, it will be used automatically.
// Otherwise, you might need to initialize with a service account object:
// const serviceAccount = require('/path/to/your/serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
try {
  admin.initializeApp();
  console.log("Firebase Admin SDK initialized successfully.");
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    console.log("Firebase Admin SDK already initialized.");
  } else {
    console.error("Error initializing Firebase Admin SDK:", error);
    process.exit(1);
  }
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
