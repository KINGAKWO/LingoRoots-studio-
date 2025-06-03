import type { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile extends FirebaseUser {
  // Custom fields for user profile
  id: string;
  firstName?: string;
  lastName?: string;
  progress?: UserProgress;
  // role?: 'learner' | 'creator'; // If needed for CMS
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  category?: string; // e.g., Vocabulary, Dialogues, Culture
  content: string; // Could be markdown or structured content
  estimatedTimeMinutes?: number;
  icon?: string; // Icon name or path
  order: number;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string; // or index of correct option
  points: number;
  explanation?: string;
}

export interface Quiz {
  id:string;
  lessonId: string; // Associated lesson
  title: string;
  description?: string;
  questions: Question[];
  passingScore?: number; // Percentage
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name or path
  dateEarned?: Date;
}

export interface UserProgress {
  completedLessons: string[]; // Array of lesson IDs
  completedQuizzes: Record<string, { score: number; dateCompleted: Date }>; // QuizId -> score
  points: number;
  streaks: {
    current: number;
    longest: number;
    lastActivityDate?: Date;
  };
  badges: string[]; // Array of achievement IDs
}

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  adminOnly?: boolean; // For CMS link
};
