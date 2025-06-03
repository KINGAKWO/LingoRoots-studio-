
import type { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile extends FirebaseUser {
  id: string;
  firstName?: string;
  lastName?: string;
  progress?: UserProgress; // Kept embedded for now, subcollection fetching can be later
  role?: 'learner' | 'contentCreator' | 'admin';
  selectedLanguageId?: string; 
  createdAt?: Date; // FirebaseUser.metadata.creationTime can be used
}

export interface UserProgress {
  completedLessons: string[]; // Array of lesson IDs
  quizScores: Record<string, number>; // quizId: score
  badges: string[]; // Array of achievement IDs
  currentStreak: number;
  points: number;
}

export interface Language {
  id: string; // Corresponds to languageId
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  lessonCount?: number; // Denormalized, useful for display
}

export interface VocabularyItem {
  term: string;
  translation: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface DialogueLine {
  speaker: string;
  line: string;
  audioUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  category?: string; // e.g., Vocabulary, Dialogues, Culture - Kept as it's useful for filtering
  order: number;
  estimatedTimeMinutes?: number; // Kept as it's useful

  // New structured content fields based on schema
  vocabulary?: VocabularyItem[];
  dialogues?: DialogueLine[];
  culturalTips?: string;
  youtubeVideoUrl?: string;
}

export interface Question {
  id: string;
  text: string; // Changed from questionText
  type: 'multiple-choice' | 'fill-blank' | 'matching';
  options: string[]; // Specific to multiple-choice
  correctAnswer: string | string[]; // Can be array for matching
  points: number; // Kept as it's useful for scoring
  explanation?: string; // Kept for feedback
}

export interface Quiz {
  id:string;
  lessonId: string; // Associated lesson
  languageId?: string; // Added for context
  title: string;
  description?: string;
  questions: Question[];
  passingScore?: number; // Percentage
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; 
  dateEarned?: Date;
}

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  adminOnly?: boolean;
};
