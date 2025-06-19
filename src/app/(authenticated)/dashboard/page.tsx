"use client";
import { useEffect, useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenText, CheckCircle2, Target, Zap, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { UserProgress, Lesson } from "@/types";
import { mockRecentActivity } from "@/data/mock/dashboard";
import { getLessons } from "@/services/lessonService";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import useAuth from "@/hooks/use-auth";

// Remove mock userProgressData and counts
// const userProgressData: UserProgress = { ... }

export default function DashboardPage() {
  const [points, setPoints] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLessonToDisplay, setFeaturedLessonToDisplay] = useState<Lesson | null>(null);

  useEffect(() => {
    async function fetchUserProgress() {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const progress = data.progress || {};
          setPoints(progress.points ?? 0);
          setCompletedLessons(progress.completedLessons ?? []);
          setCurrentStreak(progress.currentStreak ?? 0);
          setBadges(progress.badges ?? []);
        }
      }
      setLoading(false);
    }

    async function fetchLessons() {
      const allLessons: Lesson[] = await getLessons();
      setFeaturedLessonToDisplay(allLessons.length > 0 ? allLessons[0] : null);
    }

    fetchUserProgress();
    fetchLessons();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Your LingoRoots Dashboard</h1>
        <Link href="/lessons" passHref legacyBehavior>
          <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <BookOpenText className="mr-2 h-4 w-4" />
            Start New Lesson
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Points"
          value={loading ? "..." : points}
          icon={Zap}
          description="Keep learning to earn more!"
          dataAiHint="points score"
        />
        <StatsCard
          title="Lessons Completed"
          value={loading ? "..." : completedLessons.length}
          icon={CheckCircle2}
          description="Great progress!"
          dataAiHint="lessons completed"
        />
        <StatsCard
          title="Current Streak"
          value={loading ? "..." : `${currentStreak} days`}
          icon={Target}
          description="Don't break the chain!"
          dataAiHint="learning streak"
        />
        <StatsCard
          title="Badges Earned"
          value={loading ? "..." : badges.length}
          icon={Award}
          description="Collect them all!"
          dataAiHint="achievement badge"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">
              Featured Lesson: {featuredLessonToDisplay ? featuredLessonToDisplay.title : "No lessons available"}
            </CardTitle>
            <CardDescription>
              {featuredLessonToDisplay ? featuredLessonToDisplay.description : "Check back soon for new lessons!"}
            </CardDescription>
          </CardHeader>
          {featuredLessonToDisplay && (
            <CardContent className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-lg">
                <Image
                  src={featuredLessonToDisplay.vocabulary?.[0]?.imageUrl || "https://placehold.co/600x400.png"}
                  alt={featuredLessonToDisplay.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                  data-ai-hint={featuredLessonToDisplay.category ? `lesson ${featuredLessonToDisplay.category.toLowerCase()}` : "language lesson"}
                />
              </div>
              <Link href={`/lessons/${featuredLessonToDisplay.id}`} passHref legacyBehavior>
                <Button className="w-full sm:w-auto">
                  Start Learning
                </Button>
              </Link>
            </CardContent>
          )}
          {!featuredLessonToDisplay && (
            <CardContent>
              <p className="text-muted-foreground">Come back later for exciting lessons!</p>
            </CardContent>
          )}
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <li key={activity.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.date} {activity.type === 'quiz' && activity.score ? `- Score: ${activity.score}` : ''}</p>
                  </div>
                  {activity.type === 'lesson' && <BookOpenText className="h-5 w-5 text-accent" />}
                  {activity.type === 'quiz' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {activity.type === 'badge' && <Award className="h-5 w-5 text-yellow-500" />}
                </li>
              ))}
              {mockRecentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity yet. Start a lesson!</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type ProtectedRouteProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <p className="p-8 text-center text-destructive">Access denied.</p>;
  }
  return <>{children}</>;
}