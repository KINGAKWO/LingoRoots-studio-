import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Achievement } from "@/types";
import { Award, ShieldCheck, Star, Zap } from "lucide-react"; // Example icons

// Mock data - replace with actual data fetching
const userAchievements: Achievement[] = [
  { id: "1", name: "Welcome Aboard!", description: "Joined LingoRoots and started your journey.", icon: "Star", dateEarned: new Date("2024-07-15") },
  { id: "2", name: "First Lesson Complete", description: "Completed your first Duala lesson.", icon: "BookOpenText", dateEarned: new Date("2024-07-16") },
  { id: "3", name: "Quiz Whiz", description: "Scored 100% on your first quiz.", icon: "Target", dateEarned: new Date("2024-07-17") },
  { id: "4", name: "Vocabulary Virtuoso", description: "Mastered 50 new vocabulary words.", icon: "Languages", dateEarned: new Date("2024-07-20") },
  { id: "5", name: "Streak Starter", description: "Maintained a 3-day learning streak.", icon: "Zap", dateEarned: new Date("2024-07-18") },
];

const allPossibleAchievements: Achievement[] = [
  ...userAchievements, // Include earned ones
  { id: "6", name: "Cultural Explorer", description: "Completed a cultural insight lesson.", icon: "Globe" },
  { id: "7", name: "Perfect Week", description: "Maintained a 7-day learning streak.", icon: "CalendarCheck" },
  { id: "8", name: "Dialogue Debutant", description: "Completed your first dialogue practice.", icon: "MessageSquare" },
];


const IconMap: { [key: string]: React.ElementType } = {
  Star: Star,
  BookOpenText: Award, // Using Award for lesson completion
  Target: ShieldCheck, // Using ShieldCheck for quiz mastery
  Languages: Award, // Using Award for vocab
  Zap: Zap,
  Globe: Award,
  CalendarCheck: Award,
  MessageSquare: Award,
  Default: Award,
};


export default function AchievementsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Your Achievements</h1>
      <p className="text-muted-foreground">
        Celebrate your progress! Here are the badges you've earned and others you can unlock.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allPossibleAchievements.map((achievement) => {
          const IconComponent = IconMap[achievement.icon] || IconMap.Default;
          const isEarned = !!achievement.dateEarned;
          return (
            <Card 
              key={achievement.id} 
              className={`flex flex-col items-center p-6 text-center shadow-lg transition-all duration-300 ${
                isEarned ? 'border-2 border-primary bg-primary/5' : 'bg-card opacity-70 hover:opacity-100'
              }`}
              data-ai-hint="achievement badge"
            >
              <IconComponent className={`h-16 w-16 mb-4 ${isEarned ? 'text-primary' : 'text-muted-foreground'}`} />
              <CardTitle className={`text-lg font-semibold ${isEarned ? 'text-primary' : 'text-foreground'}`}>{achievement.name}</CardTitle>
              <CardDescription className="text-xs mt-1 flex-grow">
                {achievement.description}
              </CardDescription>
              {isEarned && achievement.dateEarned && (
                <p className="text-xs text-primary mt-3 pt-3 border-t border-primary/20 w-full">
                  Earned: {achievement.dateEarned.toLocaleDateString()}
                </p>
              )}
              {!isEarned && (
                 <p className="text-xs text-muted-foreground mt-3 pt-3 border-t w-full">
                  Locked
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
