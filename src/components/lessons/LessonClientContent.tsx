"use client";

import { Badge } from "@/components/ui/badge";
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CheckCircle, Youtube, Volume2, BookOpen, Lightbulb } from "lucide-react";
import type { Lesson, VocabularyItem, DialogueLine } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";


const getYouTubeEmbedUrl = (videoUrl: string): string => {
  let videoId: string | null = null;
  try {
    const urlObj = new URL(videoUrl);

    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.substring(1);
    } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      if (urlObj.pathname === '/watch') {
        videoId = urlObj.searchParams.get('v');
      } else if (urlObj.pathname.startsWith('/embed/')) {
        videoId = urlObj.pathname.substring('/embed/'.length);
      }
    }
  } catch (e) {
    console.error("Invalid YouTube URL passed to getYouTubeEmbedUrl:", videoUrl, e);
    if (/^[a-zA-Z0-9_-]{11}$/.test(videoUrl)) {
        return `https://www.youtube.com/embed/${videoUrl}`;
    }
    return 'about:blank';
  }

  if (videoId) {
    const queryIndex = videoId.indexOf('?');
    if (queryIndex !== -1) {
      videoId = videoId.substring(0, queryIndex);
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }

  console.warn("Could not extract YouTube video ID from URL:", videoUrl);
  return 'about:blank';
};


const YouTubeEmbed = ({ videoUrl }: { videoUrl: string }) => {
  const embedSrc = getYouTubeEmbedUrl(videoUrl);
  if (embedSrc === 'about:blank') {
    return <div className="aspect-video bg-muted flex items-center justify-center rounded-lg shadow-lg my-4 text-destructive-foreground">Could not load video. Check URL.</div>;
  }
  return (
    <div className="aspect-video overflow-hidden rounded-lg shadow-lg my-4" data-ai-hint="language lesson video">
      <iframe
        width="100%"
        height="100%"
        src={embedSrc}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

interface LessonClientContentProps {
  lesson: Lesson;
}

export default function LessonClientContent({ lesson }: LessonClientContentProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isComplete, setIsComplete] = useState(false);

  // Check if the lesson is already completed by the user
  useEffect(() => {
    if (user?.progress?.completedLessons?.includes(lesson.id)) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [user, lesson.id]);


  const handleCompleteLesson = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to complete a lesson.", variant: "destructive" });
      return;
    }

    const userId = user.uid;
    const lessonId = lesson.id;

    const userRef = doc(db, "users", userId);

    try {
      await updateDoc(userRef, {
        completedLessons: arrayUnion(lessonId),
        points: increment(50), // Award 50 points for completing a lesson (example)
      });
      setIsComplete(true); // Mark as complete in the UI
      toast({ title: "Lesson Completed", description: "You have successfully completed this lesson!", variant: "default" });
      console.log(`Lesson ${lessonId} marked as complete for user ${userId}`);
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      toast({ title: "Error", description: "Could not save lesson progress.", variant: "destructive" });
    }
  };

  return (
    <Card className="shadow-xl overflow-hidden">
       <CardHeader className="border-b">
          <CardTitle className="text-3xl font-bold text-primary font-headline">{lesson.title}</CardTitle>
          {lesson.category && <Badge variant="outline" className="mt-2 w-fit">{lesson.category}</Badge>}
          <CardDescription className="pt-2">{lesson.description}</CardDescription>
           {lesson.estimatedTimeMinutes && (
            <p className="text-xs text-muted-foreground pt-1">Estimated time: {lesson.estimatedTimeMinutes} minutes</p>
          )}
        </CardHeader>

        <ScrollArea className="h-[calc(100vh-20rem)]">
          <CardContent className="pt-6 space-y-6">
            {lesson.youtubeVideoUrl && <YouTubeEmbed videoUrl={lesson.youtubeVideoUrl} />}

            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90 font-headline flex items-center">
                  <BookOpen className="mr-2 h-6 w-6"/> Vocabulary
                </h2>
                <div className="space-y-2">
                  {lesson.vocabulary.map((item, index) => (
                    <Card key={index} className="p-4 bg-card hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg text-foreground">{item.term}</p>
                          <p className="text-muted-foreground">{item.translation}</p>
                        </div>
                        {item.audioUrl && <Button variant="ghost" size="icon"><Volume2 className="h-5 w-5 text-accent"/></Button>}
                      </div>
                      {item.example && <p className="text-sm text-foreground/80 mt-1"><em>Example: {item.example}</em></p>}\
                       {item.imageUrl && (\
                         <div className=\"mt-2 rounded max-h-32 w-32 relative overflow-hidden">\
                            <Image src={item.imageUrl} alt={item.term} layout="fill" objectFit="cover" data-ai-hint={item.dataAiHint || `duala ${item.term.toLowerCase().split(' ')[0]}`}/>\
                         </div>\
                        )}\
                    </Card>
                  ))}\
                </div>\
              </section>\
            )}\

            {lesson.dialogues && lesson.dialogues.length > 0 && (\
              <section>
                <Separator className="my-6"/>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90 font-headline">Dialogues</h2>
                <div className="space-y-4">
                  {lesson.dialogues.map((dialogue, index) => (
                    <div key={index} className="p-3 border rounded-md bg-card">
                      <p className="font-medium text-sm text-primary">{dialogue.speaker}:</p>
                      <p className="text-foreground/90">{dialogue.line}</p>
                       {dialogue.audioUrl && <Button variant="ghost" size="sm" className="mt-1 text-accent"><Volume2 className="mr-1 h-4 w-4"/> Listen</Button>}\
                    </div>
                  ))}\
                </div>
              </section>
            )}\

            {lesson.culturalTips && (\
              <section>
                <Separator className="my-6"/>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90 font-headline flex items-center">
                  <Lightbulb className="mr-2 h-6 w-6"/> Cultural Insights
                </h2>
                <div className="p-4 bg-secondary/30 rounded-md border border-accent/50">
                  <p className="text-foreground/90 whitespace-pre-line">{lesson.culturalTips}</p>
                </div>
              </section>
            )}\
          </CardContent>
           {/* --- Mark as Complete Button --- */}
           {!isComplete && (
            <div className="flex justify-center mt-8 mb-6 px-6">
              <Button onClick={handleCompleteLesson} size="lg" className="gap-2 w-full md:w-auto">
                <CheckCircle className="h-5 w-5" />
                Mark as Complete
              </Button>
            </div>
            )}
          {/* --- End Mark as Complete Button --- */}
        </ScrollArea>
      </Card>
  );
}