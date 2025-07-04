
"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpenText, Clock, Loader2 } from "lucide-react"; // Added Loader2
import { Badge } from "@/components/ui/badge";
import type { Lesson } from "@/types";
import { getLessons } from "@/services/lessonService";
import { useEffect, useState } from "react";
import { useLanguage } from '@/context/LanguageContext';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Initialize isLoading to true
  const { selectedLanguageId } = useLanguage();
  
  useEffect(() => {
    const fetchLessons = async () => {
      console.log(`LessonsPage: useEffect triggered. current selectedLanguageId: ${selectedLanguageId}`);
      if (selectedLanguageId) {
        setIsLoading(true); 
        console.log(`LessonsPage: Fetching lessons for language ID: ${selectedLanguageId}`);
        try {
          const fetchedLessons = await getLessons(selectedLanguageId);
          // Log more details about fetched lessons for debugging
          console.log(`LessonsPage: Fetched ${fetchedLessons.length} lessons. Titles: ${fetchedLessons.map(l => l.title).join(', ')}`);
          setLessons(fetchedLessons);
        } catch (error) {
          console.error("LessonsPage: Error fetching lessons:", error);
          setLessons([]); 
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("LessonsPage: No selectedLanguageId. Clearing lessons and setting isLoading to false.");
        setLessons([]);
        setIsLoading(false); 
      }
    };
    fetchLessons();
  }, [selectedLanguageId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          {selectedLanguageId ? `Loading lessons for language: ${selectedLanguageId}...` : "Please select a language to see lessons."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Interactive Lessons</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <Card key={lesson.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="line-clamp-2">{lesson.title}</CardTitle>
                {lesson.category && (
                  <Badge variant="outline" className="mt-1 w-fit">
                    {lesson.category}
                  </Badge>
                )}
              </CardHeader>
              <div className="relative h-40 w-full bg-secondary/20 flex items-center justify-center" data-ai-hint={`lesson ${lesson.category?.toLowerCase()} abstract`}>
                <BookOpenText className="w-16 h-16 text-primary/50" />
              </div>
              <CardContent className="flex-grow pt-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{lesson.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-3">
                {lesson.estimatedTimeMinutes && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {lesson.estimatedTimeMinutes} min
                  </div>
                )}
                <Link href={`/lessons/${lesson.id}`} passHref legacyBehavior>
                  <Button size="sm" variant="default">
                    Start Lesson
                    <BookOpenText className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-10">
            {selectedLanguageId ? "No lessons available for the selected language yet. Check back soon!" : "Please select a language to see lessons."}
          </p>
        )}
      </div>
    </div>
  );
}
