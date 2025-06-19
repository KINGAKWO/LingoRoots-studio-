
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Quiz } from "@/types";
import { HelpCircle, ListChecks, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getQuizzes } from "@/services/quizService";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedLanguageId } = useLanguage();

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (selectedLanguageId) {
        setIsLoading(true);
        try {
          const fetchedQuizzes = await getQuizzes(selectedLanguageId);
          setQuizzes(fetchedQuizzes);
        } catch (error) {
          console.error("Error fetching quizzes:", error);
          setQuizzes([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setQuizzes([]);
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, [selectedLanguageId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Quizzes</h1>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading quizzes...</p>
        </div>
      ) : quizzes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-primary leading-tight">{quiz.title}</CardTitle>
                {quiz.lessonTitle && (
                  <Badge variant="secondary" className="mt-1 w-fit text-xs">
                    Related Lesson: {quiz.lessonTitle}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{quiz.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <ListChecks className="mr-1 h-3 w-3" />
                  {quiz.questions.length} Question{quiz.questions.length !== 1 ? 's' : ''}
                </div>
                <Link href={`/quizzes/${quiz.id}`} passHref legacyBehavior>
                  <Button size="sm" variant="default">
                    Start Quiz
                    <HelpCircle className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10">
          {selectedLanguageId ? "No quizzes available for the selected language yet." : "Please select a language to see quizzes."}
        </p>
      )}
    </div>
  );
}
