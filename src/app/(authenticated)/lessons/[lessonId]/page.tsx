
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Youtube, Volume2, BookOpen, Lightbulb } from "lucide-react";
import type { Lesson, Quiz, VocabularyItem, DialogueLine } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

// Mock data - replace with actual data fetching
const getLessonDetails = async (lessonId: string): Promise<Lesson | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const lessons: Lesson[] = [
    { 
      id: "1", 
      title: "Basic Duala Greetings", 
      description: "Learn essential Duala greetings and common phrases for everyday conversations, from 'hello' to 'how are you?' and their responses.", 
      category: "Vocabulary", 
      order: 1,
      estimatedTimeMinutes: 20,
      vocabulary: [
        { term: "Díná lâm na ...", translation: "My name is ...", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "name introduction" },
        { term: "mônè", translation: "hello, hi", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting hello" },
        { term: "bobe", translation: "bad", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "emotion bad" },
        { term: "bwâm", translation: "good, well", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "emotion good" },
        { term: "idibà á bwâm e", translation: "good morning", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting morning" },
        { term: "na sôm", translation: "thanks, thank you", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting thanks" },
        { term: "na oa pé", translation: "you too", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "phrase youtoo" },
        { term: "é titi lambo", translation: "don't mention it", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "phrase welcome" },
        { term: "na má àlà", translation: "goodbye, bye", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting goodbye" },
        { term: "buna bópépe", translation: "see you later", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting later" },
        { term: "É ma ala nê ?", translation: "How are you?", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting howareyou" },
        { term: "É ma ala", translation: "I am fine", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting imfine" },
        { term: "Njé yé péná ?", translation: "What's up?", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting whatsup" },
        { term: "Tô lambo lá pena", translation: "Nothing new", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "phrase nothingnew" },
        { term: "ee", translation: "yes", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "word yes" },
        { term: "kèm", translation: "no", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "word no" },
      ],
      dialogues: [
        { speaker: "Muna", line: "mônè, Sango!" },
        { speaker: "Sango", line: "mônè, Muna! É ma ala nê ?" },
        { speaker: "Muna", line: "É ma ala, na sôm. Na wa e?" },
        { speaker: "Sango", line: "É ma ala buki." },
      ],
      culturalTips: "Greetings are very important in Cameroonian culture. Always greet elders with respect. Using titles like 'Sango' (Mr./Sir) or 'Ngo' (Ms./Madam) shows respect.",
      youtubeVideoUrl: "https://youtu.be/VV9gq-XwA-E" 
    },
    { 
      id: "2", 
      title: "Duala Alphabet and Pronunciation", 
      description: "Master the sounds of Duala, including special characters and tones.", 
      category: "Fundamentals", 
      order: 2,
      estimatedTimeMinutes: 25,
      vocabulary: [
        { term: "ɓ", translation: "Voiced bilabial implosive (like 'b' in 'buy' but imploded)", dataAiHint: "alphabet letter" },
        { term: "ɛ", translation: "Open-mid front unrounded vowel (like 'e' in 'bet')", dataAiHint: "alphabet letter" },
        { term: "ŋ", translation: "Velar nasal (like 'ng' in 'sing')", dataAiHint: "alphabet letter" },
      ],
      culturalTips: "Duala is a tonal language, meaning the pitch of a syllable can change its meaning. Pay close attention to tone marks (e.g., M̀bɔ́lɔ vs. Mbɔlɔ)."
    },
  ];
  return lessons.find(l => l.id === lessonId) || null;
};

const getLessonQuiz = async (lessonId: string): Promise<Quiz | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (lessonId === "1") {
    return {
      id: "quiz-1",
      lessonId: "1",
      title: "Greetings Quiz",
      questions: [
        { id: "q1", text: "How do you say 'hello, hi' in Duala?", type: "multiple-choice", options: ["mônè", "na sôm", "É ma ala"], correctAnswer: "mônè", points: 10, explanation: "'mônè' is a common way to say 'hello' or 'hi' in Duala." },
        { id: "q2", text: "What does 'na sôm' mean?", type: "multiple-choice", options: ["goodbye", "thank you", "yes"], correctAnswer: "thank you", points: 10, explanation: "'na sôm' translates to 'thank you'." },
        { id: "q3", text: "How do you ask 'How are you?' in Duala?", type: "multiple-choice", options: ["idibà á bwâm e", "É ma ala nê ?", "É ma ala"], correctAnswer: "É ma ala nê ?", points: 15, explanation: "'É ma ala nê ?' is a way to ask 'How are you?' in Duala." },
        { id: "q4", text: "What is the Duala for 'I am fine'?", type: "multiple-choice", options: ["bobe", "É ma ala", "Njé yé péná ?"], correctAnswer: "É ma ala", points: 10, explanation: "'É ma ala' means 'I am fine' in Duala." },
      ]
    };
  }
  return null;
}

const YouTubeEmbed = ({ embedUrl }: { embedUrl: string }) => (
  <div className="aspect-video overflow-hidden rounded-lg shadow-lg my-4" data-ai-hint="language lesson video">
    <iframe
      width="100%"
      height="100%"
      src={embedUrl.replace("watch?v=", "embed/")} 
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  </div>
);

export default async function LessonDetailsPage({ params }: { params: { lessonId: string } }) {
  const lesson = await getLessonDetails(params.lessonId);
  const quiz = await getLessonQuiz(params.lessonId);

  if (!lesson) {
    return <div className="text-center py-10">Lesson not found.</div>;
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
          <CardContent className="pt-6 space-y-6">
            {lesson.youtubeVideoUrl && <YouTubeEmbed embedUrl={lesson.youtubeVideoUrl} />}

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
                      {item.example && <p className="text-sm text-foreground/80 mt-1"><em>Example: {item.example}</em></p>}
                       {item.imageUrl && (
                         <div className="mt-2 rounded max-h-32 w-32 relative overflow-hidden">
                            <Image src={item.imageUrl} alt={item.term} layout="fill" objectFit="cover" data-ai-hint={item.dataAiHint || `duala ${item.term.toLowerCase().split(' ')[0]}`}/>
                         </div>
                        )}
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {lesson.dialogues && lesson.dialogues.length > 0 && (
              <section>
                <Separator className="my-6"/>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90 font-headline">Dialogues</h2>
                <div className="space-y-4">
                  {lesson.dialogues.map((dialogue, index) => (
                    <div key={index} className="p-3 border rounded-md bg-card">
                      <p className="font-medium text-sm text-primary">{dialogue.speaker}:</p>
                      <p className="text-foreground/90">{dialogue.line}</p>
                       {dialogue.audioUrl && <Button variant="ghost" size="sm" className="mt-1 text-accent"><Volume2 className="mr-1 h-4 w-4"/> Listen</Button>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {lesson.culturalTips && (
              <section>
                <Separator className="my-6"/>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90 font-headline flex items-center">
                  <Lightbulb className="mr-2 h-6 w-6"/> Cultural Insights
                </h2>
                <div className="p-4 bg-secondary/30 rounded-md border border-accent/50">
                  <p className="text-foreground/90 whitespace-pre-line">{lesson.culturalTips}</p>
                </div>
              </section>
            )}
          </CardContent>
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
                Quiz Coming Soon
                </Button>
            )}
            </div>
        </div>
      </CardFooter>
    </div>
  );
}

    
