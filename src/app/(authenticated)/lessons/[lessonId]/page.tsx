import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Youtube, Volume2, BookOpen, Lightbulb } from "lucide-react";
import type { Lesson, Quiz } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { getLessonById } from "@/services/lessonService"; // Import the service
import LessonClientContent from "@/components/lessons/LessonClientContent"; // Import the client component
import { getQuizByLessonId } from "@/services/quizService"; // Import the service

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

export default async function LessonDetailsPage({ params }: { params: { lessonId: string } }) {
  const lesson: Lesson | null = await getLessonById(params.lessonId);
  const quiz: Quiz | null = await getQuizByLessonId(params.lessonId);




  if (!lesson) {
    return (
      <div className="text-center py-10">
         <h1 className="text-2xl font-semibold text-destructive mb-4">Lesson Not Found</h1>
        <p className="text-muted-foreground mb-6">The lesson you are looking for does not exist or may have been moved.</p>
        <Link href="/lessons" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Lessons
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/lessons" className="inline-flex items-center text-sm text-accent hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Lessons
      </Link>

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
          <LessonClientContent lesson={lesson} />
        </ScrollArea>
      </Card>

      <CardFooter className="mt-8 p-6 bg-secondary/30 rounded-lg shadow">
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary font-headline">Reinforce Your Learning</h2>
            <p className="text-muted-foreground mb-4">
            Practice what you've learned with a quick quiz or review key vocabulary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
            {quiz ? (
                <Link href={`/quizzes/${quiz.id}`} passHref>
                <Button variant="default" size="lg" className="flex-1 sm:flex-none">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Take Quiz: {quiz.title}
                </Button>
                </Link>
            ) : (
                <Button variant="outline" size="lg" disabled className="flex-1 sm:flex-none">
                Quiz Coming Soon for this lesson
                </Button>
            )}
            </div>
        </div>
      </CardFooter>
    </div>
  );
}
