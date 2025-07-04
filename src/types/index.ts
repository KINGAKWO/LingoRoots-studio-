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
  status: 'draft' | 'published'; // <-- added
  createdBy: string;             // <-- added (user id)
  validatedBy?: string;          // <-- optional, admin id
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
  languageId: string; 
  title: string;
  description?: string;
  category?: string; 
  order: number; 
  estimatedTimeMinutes?: number; 
  vocabulary?: VocabularyItem[];
  dialogues?: DialogueLine[];
  culturalTips?: string;
  youtubeVideoUrl?: string;
  status: 'draft' | 'published'; // <-- added
  createdBy: string;             // <-- added (user id)
  validatedBy?: string;          // <-- optional, admin id
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
  lessonTitle?: string; 
  status: 'draft' | 'published'; // <-- added
  createdBy: string;             // <-- added (user id)
  validatedBy?: string;          // <-- optional, admin id
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

export interface LeaderboardUser {
  id: string;
  rank: number;
  displayName: string;
  points: number;
  avatarUrl?: string; // Optional: if you want to display user avatars
  avatarFallback: string;
}
