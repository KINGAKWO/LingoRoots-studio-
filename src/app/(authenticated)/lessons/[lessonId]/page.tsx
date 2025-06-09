
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getLessonById } from '@/services/lessonService';
import type { Lesson } from '@/types';
import LessonClientContent from '@/components/lessons/LessonClientContent';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LessonDetailPage() {
  const params = useParams();
  const { selectedLanguageId } = useLanguage();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lessonId = params.lessonId as string;

  useEffect(() => {
    if (selectedLanguageId && lessonId) {
      setIsLoading(true);
      setError(null);
      getLessonById(selectedLanguageId, lessonId)
        .then((data) => {
          if (data) {
            setLesson(data);
          } else {
            setError(`Lesson with ID "${lessonId}" not found for the selected language.`);
          }
        })
        .catch((err) => {
          console.error("Error fetching lesson:", err);
          setError("Failed to load lesson data. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!selectedLanguageId) {
      setError("No language selected. Please select a language first.");
      setIsLoading(false);
    } else {
      setIsLoading(false); // Should not happen if lessonId is always present
    }
  }, [selectedLanguageId, lessonId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Lesson</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/lessons" passHref legacyBehavior>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Button>
        </Link>
        {!selectedLanguageId && (
            <Link href="/select-language" passHref legacyBehavior>
                <Button variant="default" className="mt-2">
                    Select Language
                </Button>
            </Link>
        )}
      </div>
    );
  }

  if (!lesson) {
    // This case should ideally be caught by the error state if lesson is not found
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Link href="/lessons" passHref legacyBehavior>
         <Button variant="outline" className="mt-4">
           <ArrowLeft className="mr-2 h-4 w-4" />
           Back to Lessons
         </Button>
       </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Link
        href="/lessons"
        className="inline-flex items-center text-sm text-accent hover:underline mb-6 print:hidden"
        legacyBehavior>
       <ArrowLeft className="mr-2 h-4 w-4" />
       Back to All Lessons
     </Link>
      <LessonClientContent lesson={lesson} />
    </div>
  );
}
