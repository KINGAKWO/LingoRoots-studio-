import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin SDK
// Ensure you have set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// to the path of your service account key JSON file.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL, // Optional: if you use Realtime Database
  });
}

const db = admin.firestore();

// Define the path to your JSON file
const contentFilePath = path.resolve(__dirname, './duala_content.json');

// Define the Firestore collection paths
const lessonsCollectionPath = 'languages/dua/lessons';
const quizzesCollectionPath = 'languages/dua/quizzes';

interface Lesson {
  id: string;
  languageId: string;
  title: string;
  description: string;
  category: string;
  order: number;
  estimatedTimeMinutes: number;
  vocabulary?: { term: string; translation: string; imageUrl: string; dataAiHint?: string }[];
  dialogues?: { speaker: string; line: string }[];
  culturalTips?: string;
  youtubeVideoUrl?: string;
}

interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: {
    id: string;
    type: string;
    text: string;
    options: string[];
    correctAnswer: string;
    points: number;
    explanation?: string;
  }[];
  passingScore: number;
}

interface ContentData {
  Lessons: Lesson[];
  mockQuizzes: Quiz[];
}


async function seedFirestore() {
  try {
    // Read the JSON file
    const contentData: ContentData = JSON.parse(fs.readFileSync(contentFilePath, 'utf8'));

    // Seed Lessons
    console.log(`Seeding lessons into ${lessonsCollectionPath}...`);
    const lessonBatch = db.batch();
    for (const lesson of contentData.Lessons) {
      const lessonRef = db.collection(lessonsCollectionPath).doc(lesson.id);
      lessonBatch.set(lessonRef, lesson);
    }
    await lessonBatch.commit();
    console.log(`Successfully seeded ${contentData.Lessons.length} lessons.`);

    // Seed Quizzes
    console.log(`Seeding quizzes into ${quizzesCollectionPath}...`);
    const quizBatch = db.batch();
    for (const quiz of contentData.mockQuizzes) { // Note: Using mockQuizzes key from JSON
      const quizRef = db.collection(quizzesCollectionPath).doc(quiz.id);
      quizBatch.set(quizRef, quiz);
    }
    await quizBatch.commit();
    console.log(`Successfully seeded ${contentData.mockQuizzes.length} quizzes.`);

    console.log('Firestore seeding complete.');

  } catch (error) {
    console.error('Error seeding Firestore:', error);
    process.exit(1); // Exit with a non-zero code to indicate an error
  }
}

seedFirestore();