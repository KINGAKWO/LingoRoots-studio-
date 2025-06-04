
import type { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile extends FirebaseUser {
  id: string;
  firstName?: string;
  lastName?: string;
  progress?: UserProgress; 
  role?: 'learner' | 'contentCreator' | 'admin';
  selectedLanguageId?: string; 
  createdAt?: Date; 
}

export interface UserProgress {
  completedLessons: string[]; 
  quizScores: Record<string, number>; 
  badges: string[]; 
  currentStreak: number;
  points: number;
}

export interface Language {
  id: string; 
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  lessonCount?: number; 
}

export interface VocabularyItem {
  term: string;
  translation: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
  dataAiHint?: string; // Added for specific image hints
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
  category?: string; 
  order: number; // Make sure this is part of your Firestore data if you order by it
  estimatedTimeMinutes?: number; 

  vocabulary?: VocabularyItem[];
  dialogues?: DialogueLine[];
  culturalTips?: string;
  youtubeVideoUrl?: string;
}

export interface Question {
  id: string;
  text: string; 
  type: 'multiple-choice' | 'fill-blank' | 'matching';
  options: string[]; 
  correctAnswer: string | string[]; 
  points: number; 
  explanation?: string; 
}

export interface Quiz {
  id:string;
  lessonId: string; 
  languageId?: string; 
  title: string;
  description?: string;
  questions: Question[];
  passingScore?: number; 
  lessonTitle?: string; // Added to store the title of the related lesson
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
