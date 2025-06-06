
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Achievement } from "@/types";
import { Award, ShieldCheck, Star, Zap, BookOpenText, Target, Languages, Globe, CalendarCheck, MessageSquare } from "lucide-react";
import { mockUserAchievements, mockAllPossibleAchievements } from "@/data/mock/achievements";

const IconMap: { [key: string]: React.ElementType } = {
  Star: Star,
  BookOpenText: BookOpenText, 
  Target: Target, 
  Languages: Languages, 
  Zap: Zap,
  Globe: Globe,
  CalendarCheck: CalendarCheck,
  MessageSquare: MessageSquare,
  Default: Award, 
};

export default function AchievementsPage() {
  // Use centralized mock data
  const userAchievements = mockUserAchievements;
  const allPossibleAchievements = mockAllPossibleAchievements;

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
              data-ai-hint={`achievement badge ${achievement.name.toLowerCase()}`}
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
