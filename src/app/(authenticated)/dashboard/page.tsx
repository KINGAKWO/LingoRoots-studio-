
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenText, CheckCircle2, Target, Zap, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { UserProgress } from "@/types"; // UserProgress for mock data

// Mock data - replace with actual data fetching
const userProgressData: UserProgress = {
  points: 1250,
  completedLessons: ["1", "2", "3"], // Example lesson IDs
  quizScores: { "quiz-1": 90, "quiz-2": 75 }, // quizId: score
  currentStreak: 7, // days
  badgesEarned: ["1", "2", "3"], // Example badge IDs
};

const lessonsCompletedCount = userProgressData.completedLessons.length;
const badgesEarnedCount = userProgressData.badgesEarned.length;


const recentActivity = [
  { id: 1, type: "lesson", title: "Basic Greetings", date: "2 days ago" },
  { id: 2, type: "quiz", title: "Vocabulary Quiz 1", date: "1 day ago", score: "90%" },
  { id: 3, type: "badge", title: "Quick Learner", date: "1 day ago" },
];

const featuredLesson = {
  id: "1", // Matches one of the mock lessons
  title: "Understanding Noun Classes",
  description: "Dive deep into the fascinating world of Duala noun classes.",
  imageUrl: "https://placehold.co/600x400.png",
  dataAiHint: "african study language",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Your LingoRoots Dashboard</h1>
        <Link href="/lessons" passHref>
          <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <BookOpenText className="mr-2 h-4 w-4" />
            Start New Lesson
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Points"
          value={userProgressData.points}
          icon={Zap}
          description="Keep learning to earn more!"
          dataAiHint="points score"
        />
        <StatsCard
          title="Lessons Completed"
          value={lessonsCompletedCount}
          icon={CheckCircle2}
          description="Great progress!"
          dataAiHint="lessons completed"
        />
        <StatsCard
          title="Current Streak"
          value={`${userProgressData.currentStreak} days`}
          icon={Target}
          description="Don't break the chain!"
          dataAiHint="learning streak"
        />
        <StatsCard
          title="Badges Earned"
          value={badgesEarnedCount}
          icon={Award}
          description="Collect them all!"
          dataAiHint="achievement badge"
        />
      </div>

      {/* Main content area - can be split further */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Featured Lesson / Next Up */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Featured Lesson: {featuredLesson.title}</CardTitle>
            <CardDescription>{featuredLesson.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg">
              <Image 
                src={featuredLesson.imageUrl} 
                alt={featuredLesson.title} 
                width={600} 
                height={400} 
                className="object-cover w-full h-full"
                data-ai-hint={featuredLesson.dataAiHint} 
              />
            </div>
            <Link href={`/lessons/${featuredLesson.id}`} passHref>
              <Button className="w-full sm:w-auto">
                Start Learning
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentActivity.map((activity) => (
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
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity yet. Start a lesson!</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
