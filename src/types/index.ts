
import type { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile extends FirebaseUser {
  id: string;
  firstName?: string;
  lastName?: string;
  progress?: UserProgress; 
  role?: 'learner' | 'contentCreator' | 'admin';
  selectedLanguageId?: string; // Added
  createdAt?: Date; 
}

export interface UserProgress {
  completedLessons: string[]; 
  quizScores: Record<string, number>; // quizId: score
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
  dataAiHint?: string; 
}

export interface DialogueLine {
  speaker: string;
  line: string;
  audioUrl?: string;
}

export interface Lesson {
  id: string;
  languageId: string; // Added
  title: string;
  description?: string;
  category?: string; 
  order: number; 
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
  languageId?: string; // Can also be on quiz for filtering if needed
  title: string;
  description?: string;
  questions: Question[];
  passingScore?: number; 
  lessonTitle?: string; 
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
