import { useState, useEffect } from 'react';
import useAuth from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import type { Lesson } from '@/types';

interface LessonClientContentProps {
  lesson: Lesson;
}

export default function LessonClientContent({ lesson }: LessonClientContentProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isComplete, setIsComplete] = useState(false);

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

    try {
      const userRef = doc(db, `users/${user.uid}`);
      await updateDoc(userRef, {
        completedLessons: arrayUnion(lesson.id),
        points: increment(50),
      });
      setIsComplete(true);
      toast({ title: 'Lesson Completed', description: 'You have successfully completed this lesson!', variant: 'default' });
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      toast({ title: 'Error', description: 'Could not save lesson progress.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>
      <button onClick={handleCompleteLesson} disabled={isComplete}>
        {isComplete ? 'Completed' : 'Complete Lesson'}
      </button>
    </div>
  );
}