import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Quiz } from "@/types";
import { HelpCircle, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual data fetching
const quizzes: Quiz[] = [
  { 
    id: "quiz-1", 
    lessonId: "1", 
    title: "Greetings Quiz", 
    description: "Test your knowledge of basic Duala greetings.", 
    questions: [
      { id: "q1", questionText: "How do you say 'Hello'?", options: ["M̀bɔ́lɔ", "Na som", "Pɛlɛpɛlɛ"], correctAnswer: "M̀bɔ́lɔ", points: 10 },
    ],
    passingScore: 70 
  },
  { 
    id: "quiz-2", 
    lessonId: "2", 
    title: "Alphabet Challenge", 
    description: "Check your understanding of the Duala alphabet.", 
    questions: [], 
    passingScore: 80 
  },
  { 
    id: "quiz-3", 
    lessonId: "3", 
    title: "Restaurant Phrases Quiz", 
    description: "Can you order food in Duala?", 
    questions: [], 
    passingScore: 75 
  },
];

const getLessonTitle = async (lessonId: string): Promise<string> => {
  // In a real app, fetch this from your data source
  const lessonTitles: Record<string, string> = {
    "1": "Basic Duala Greetings",
    "2": "Duala Alphabet and Pronunciation",
    "3": "Ordering Food in Duala",
  };
  return lessonTitles[lessonId] || "Related Lesson";
};

export default async function QuizzesPage() {
  // Enhance quizzes with lesson titles (example of async data fetching for related data)
  const quizzesWithLessonTitles = await Promise.all(
    quizzes.map(async (quiz) => ({
      ...quiz,
      lessonTitle: await getLessonTitle(quiz.lessonId),
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Quizzes</h1>
        {/* Filter/Sort options could go here */}
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
      {quizzes.length === 0 && (
        <p className="text-center text-muted-foreground py-10">No quizzes available yet. Complete some lessons first!</p>
      )}
    </div>
  );
}
