
"use client";
import { useState, useEffect } from 'react';
import useAuth from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import type { Lesson } from '@/types';

interface LessonClientContentProps {
  lesson: Lesson;
}

// Helper to validate lessonId (basic alphanumeric check)
function isValidLessonId(id: string) {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

export default function LessonClientContent({ lesson }: LessonClientContentProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.progress?.completedLessons?.includes(lesson.id)) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [user, lesson.id]);

  const handleCompleteLesson = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to complete a lesson.', variant: 'destructive' });
      return;
    }
    // Authorization: Only allow the user to update their own progress
    if (!user.uid) {
      toast({ title: 'Error', description: 'Invalid user session.', variant: 'destructive' });
      return;
    }
    // Input validation for lessonId
    if (!isValidLessonId(lesson.id)) {
      toast({ title: 'Error', description: 'Invalid lesson ID.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, `users/${user.uid}`);
      await updateDoc(userRef, {
        'progress.completedLessons': arrayUnion(lesson.id),
        'progress.points': increment(50),
      });
      setIsComplete(true);
      toast({ title: 'Lesson Completed', description: 'You have successfully completed this lesson!', variant: 'default' });
    } catch (error: any) {
      console.error('Error marking lesson as complete:', error);
      toast({ title: 'Error', description: error?.message || 'Could not save lesson progress.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>
      <button onClick={handleCompleteLesson} disabled={isComplete || loading}>
        {isComplete ? 'Completed' : loading ? 'Saving...' : 'Complete Lesson'}
      </button>
    </div>
  );
}