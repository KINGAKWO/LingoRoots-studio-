import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MessageSquareHeart } from "lucide-react";
import type { Lesson, Quiz } from "@/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Mock data - replace with actual data fetching
const getLessonDetails = async (lessonId: string): Promise<Lesson | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  const lessons: Lesson[] = [
    { id: "1", title: "Basic Duala Greetings", description: "Learn common greetings and introductions such as 'Bonjour', 'Bonsoir', 'Comment vas-tu?', and their replies.", category: "Vocabulary", content: "# Duala Greetings\n\nHello - *M̀bɔ́lɔ*\n\nGood morning - *M̀bɔ́lɔ ní Mbatan*\n\nHow are you? - *Ko̠ o pɛlɛpɛlɛ e?*\n\nI am fine - *Na pɛlɛpɛlɛ*\n\nThank you - *Na som*\n\n## Dialogue Example\n\nMuna: M̀bɔ́lɔ, Sango!\n\nSango: M̀bɔ́lɔ, Muna! Ko̠ o pɛlɛpɛlɛ e?\n\nMuna: Na pɛlɛpɛlɛ, na som. Na wa e?\n\nSango: Na pɛlɛpɛlɛ buki.\n\n## Cultural Insight\n\nGreetings are very important in Cameroonian culture. Always greet elders with respect.", estimatedTimeMinutes: 15, order: 1, icon: "https://placehold.co/800x400.png"},
    { id: "2", title: "Duala Alphabet and Pronunciation", description: "Master the sounds of Duala.", category: "Fundamentals", content: "# Duala Alphabet\n\nThis lesson covers the Duala alphabet and pronunciation rules...\n(Content based on duala.douala.free.fr)", estimatedTimeMinutes: 25, order: 2, icon: "https://placehold.co/800x400.png" },
  ];
  return lessons.find(l => l.id === lessonId) || null;
};

const getLessonQuiz = async (lessonId: string): Promise<Quiz | null> => {
   // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  if (lessonId === "1") {
    return {
      id: "quiz-1",
      lessonId: "1",
      title: "Greetings Quiz",
      questions: [
        { id: "q1", questionText: "How do you say 'Hello' in Duala?", options: ["M̀bɔ́lɔ", "Na som", "Pɛlɛpɛlɛ"], correctAnswer: "M̀bɔ́lɔ", points: 10 },
        { id: "q2", questionText: "What does 'Na som' mean?", options: ["Goodbye", "Thank you", "Yes"], correctAnswer: "Thank you", points: 10 },
      ]
    };
  }
  return null;
}


export default async function LessonDetailsPage({ params }: { params: { lessonId: string } }) {
  const lesson = await getLessonDetails(params.lessonId);
  const quiz = await getLessonQuiz(params.lessonId);

  if (!lesson) {
    return <div className="text-center py-10">Lesson not found.</div>;
  }

  // A simple markdown parser (very basic, for demonstration)
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, pIdx) => (
      <p key={pIdx} className="mb-4 text-foreground/90">
        {paragraph.split('\n').map((line, lIdx) => {
          if (line.startsWith('# ')) return <h1 key={lIdx} className="text-2xl font-bold mt-4 mb-2 text-primary font-headline">{line.substring(2)}</h1>;
          if (line.startsWith('## ')) return <h2 key={lIdx} className="text-xl font-semibold mt-3 mb-1 text-primary/90 font-headline">{line.substring(3)}</h2>;
          if (line.startsWith('### ')) return <h3 key={lIdx} className="text-lg font-semibold mt-2 mb-1 text-primary/80 font-headline">{line.substring(4)}</h3>;
          // Basic bold/italic
          line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
          return <span key={lIdx} dangerouslySetInnerHTML={{ __html: line }} className="block" />;
        })}
      </p>
    ));
  };

  return (
    <div className="space-y-6">
      <Link href="/lessons" className="inline-flex items-center text-sm text-accent hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Lessons
      </Link>

      <Card className="shadow-xl overflow-hidden">
        {lesson.icon && (
          <div className="relative h-64 w-full bg-muted" data-ai-hint="language study culture">
             <Image src={lesson.icon} alt={lesson.title} layout="fill" objectFit="cover" />
          </div>
        )}
        <CardHeader className="border-b">
          <CardTitle className="text-3xl font-bold text-primary font-headline">{lesson.title}</CardTitle>
          {lesson.category && <Badge variant="outline" className="mt-2 w-fit">{lesson.category}</Badge>}
          <CardDescription className="pt-2">{lesson.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 prose prose-lg max-w-none dark:prose-invert prose-headings:text-primary prose-strong:text-foreground/90 prose-em:text-foreground/80">
          {renderContent(lesson.content)}
        </CardContent>
      </Card>
      
      {/* Placeholder for interactive elements if any */}
      {/* E.g. vocabulary cards, audio pronunciation, dialogues */}

      <div className="mt-8 p-6 bg-secondary/30 rounded-lg shadow">
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
              Quiz Coming Soon
            </Button>
          )}
          {/* <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
            <MessageSquareHeart className="mr-2 h-5 w-5" />
            Practice Vocabulary (Coming Soon)
          </Button> */}
        </div>
      </div>
    </div>
  );
}
