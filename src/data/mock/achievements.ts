
import type { Achievement } from "@/types";

export const mockUserAchievements: Achievement[] = [
  { id: "1", name: "Welcome Aboard!", description: "Joined LingoRoots and started your journey.", icon: "Star", dateEarned: new Date("2024-07-15") },
  { id: "2", name: "First Lesson Complete", description: "Completed your first Duala lesson.", icon: "BookOpenText", dateEarned: new Date("2024-07-16") },
  { id: "3", name: "Quiz Whiz", description: "Scored 100% on your first quiz.", icon: "Target", dateEarned: new Date("2024-07-17") },
  { id: "4", name: "Vocabulary Virtuoso", description: "Mastered 50 new vocabulary words.", icon: "Languages", dateEarned: new Date("2024-07-20") },
  { id: "5", name: "Streak Starter", description: "Maintained a 3-day learning streak.", icon: "Zap", dateEarned: new Date("2024-07-18") },
];

export const mockAllPossibleAchievements: Achievement[] = [
  ...mockUserAchievements, 
  { id: "6", name: "Cultural Explorer", description: "Completed a cultural insight lesson.", icon: "Globe" },
  { id: "7", name: "Perfect Week", description: "Maintained a 7-day learning streak.", icon: "CalendarCheck" },
  { id: "8", name: "Dialogue Debutant", description: "Completed your first dialogue practice.", icon: "MessageSquare" },
];
