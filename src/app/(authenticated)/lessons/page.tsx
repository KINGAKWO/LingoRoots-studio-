
"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpenText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Lesson } from "@/types";
import { getLessons } from "@/services/lessonService"; // Corrected import
import { useEffect, useState, useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { selectedLanguageId } = useContext(LanguageContext);

  useEffect(() => {
    const fetchLessons = async () => {
      if (selectedLanguageId) {
        try {
          const fetchedLessons = await getLessons(selectedLanguageId); // Corrected call
          setLessons(fetchedLessons);
        } catch (error) {
          console.error("Error fetching lessons:", error);
          setLessons([]);
        }
      } else {
        setLessons([]);
      }
    };
    fetchLessons();
  }, [selectedLanguageId]);

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
                <Link href={`/lessons/${lesson.id}`} passHref>
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
