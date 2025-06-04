
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Quiz } from "@/types";
import { HelpCircle, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockQuizzes } from "@/data/mock/quizzes";
import { mockLessons } from "@/data/mock/lessons"; // To get lesson titles

// Helper function to get lesson title from mockLessons
const getLessonTitle = (lessonId: string): string => {
  const lesson = mockLessons.find(l => l.id === lessonId);
  return lesson ? lesson.title : "Related Lesson";
};

export default function QuizzesPage() {
  // Enhance quizzes with lesson titles using the centralized mock data
  const quizzesWithLessonTitles = mockQuizzes.map(quiz => ({
    ...quiz,
    lessonTitle: getLessonTitle(quiz.lessonId),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Quizzes</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzesWithLessonTitles.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-primary leading-tight">{quiz.title}</CardTitle>
              <Badge variant="secondary" className="mt-1 w-fit text-xs">
                Related Lesson: {quiz.lessonTitle}
              </Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">{quiz.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-3">
              <div className="flex items-center text-xs text-muted-foreground">
                <ListChecks className="mr-1 h-3 w-3" />
                {quiz.questions.length} Question{quiz.questions.length !== 1 ? 's' : ''}
              </div>
              <Link href={`/quizzes/${quiz.id}`} passHref>
                <Button size="sm" variant="default">
                  Start Quiz
                  <HelpCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {mockQuizzes.length === 0 && (
        <p className="text-center text-muted-foreground py-10">No quizzes available yet. Complete some lessons first!</p>
      )}
    </div>
  );
}
