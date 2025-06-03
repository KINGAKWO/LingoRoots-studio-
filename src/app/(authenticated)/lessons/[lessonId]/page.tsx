
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
        { term: "mônè", translation: "hello, hi", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting hello" },
        { term: "idibà á bwâm e", translation: "good morning", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting morning" },
        { term: "na sôm", translation: "thanks, thank you", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting thanks" },
        { term: "na oa pé", translation: "you too", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "phrase youtoo" },
        { term: "é titi lambo", translation: "don't mention it / you're welcome", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "phrase welcome" },
        { term: "na má àlà", translation: "goodbye, bye", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting goodbye" },
        { term: "buna bópépe", translation: "see you later", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting later" },
        { term: "É ma ala nê ?", translation: "How are you?", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting howareyou" },
        { term: "É ma ala", translation: "I am fine", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting imfine" },
        { term: "Njé yé péná ?", translation: "What's up?", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "greeting whatsup" },
        { term: "Tô lambo lá pena", translation: "Nothing new", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "phrase nothingnew" },
        { term: "ee", translation: "yes", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "word yes" },
        { term: "kèm", translation: "no", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "word no" },
        { term: "Díná lâm na ...", translation: "My name is ...", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "name introduction" },
        { term: "bobe", translation: "bad", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "emotion bad" },
        { term: "bwâm", translation: "good, well", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "emotion good" },
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
        { term: "a", translation: "Example: ami", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "b", translation: "Pronounced like 'bé' (explosive), as in 'bouteille'", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "c", translation: "Pronounced 'tché', as in 'chair', 'cheap'", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "d", translation: "Pronounced 'dé'", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "e", translation: "Pronounced 'é' (like 'ay' in 'say')", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "e̱", translation: "Pronounced 'è' (like 'e' in 'bet')", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "f", translation: "Example: fille", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "g", translation: "Example: gateau, langue", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "h", translation: "Example: ha", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "i", translation: "Example: île", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "j", translation: "Pronounced 'djé', as in 'jump', 'joke'", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "k", translation: "Example: ka", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "l", translation: "Pronounced 'èl'", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "m", translation: "Pronounced 'èm'", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "n", translation: "Pronounced 'èn'", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "ñ", translation: "Example: campagne, panier", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "o", translation: "Example: peau, beau, hôpital", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "o̱", translation: "Pronounced 'ô' (like 'o' in 'or'), as in 'robe', 'bord'", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "p", translation: "Example: patte, poule", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "r", translation: "Example: rire, roue", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "s", translation: "Example: soif, savoir", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "t", translation: "Example: tard, tout", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "u", translation: "Pronounced 'ou', as in 'moule', 'vous'", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "w", translation: "Note: not pronounced as in German", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
        { term: "y", translation: "Example: caille, cuillère", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "alphabet letter" },
      ],
      culturalTips: "Duala is a tonal language, meaning the pitch of a syllable can change its meaning. Pay close attention to tone marks (e.g., M̀bɔ́lɔ vs. Mbɔlɔ)."
    },
    { 
      id: "3", 
      title: "Ordering Food in Duala", 
      description: "Essential phrases for restaurants.", 
      category: "Dialogues", 
      order: 3,
      estimatedTimeMinutes: 20,
      dialogues: [
        { speaker: "Customer", line: "M̀bɔ́lɔ, na me̠nde̠ sombo bia." }, // Hello, I want to order food.
        { speaker: "Waiter", line: "M̀bɔ́lɔ, nje o me̠nde̠ e?" } // Hello, what will you have?
      ]
    },
    { 
      id: "4", 
      title: "Mbia - Family - La famille", 
      description: "Learn Duala terms for family members.", 
      category: "Vocabulary", 
      estimatedTimeMinutes: 18, 
      order: 4,
      vocabulary: [
        { term: "pambambÄ", translation: "grandfather", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family grandfather" },
        { term: "mambambÄ", translation: "grandmother", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family grandmother" },
        { term: "tetÄ, te, sango, papa", translation: "father, dad", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family father" },
        { term: "yeye, iyo, ñango, mama", translation: "mother, mom", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family mother" },
        { term: "moto, mumi", translation: "man, husband", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family husband" },
        { term: "muto", translation: "woman, wife, spouse", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family wife" },
        { term: "mola", translation: "uncle", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family uncle" },
        { term: "insadi, sita, tanti", translation: "aunt", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family aunt" },
        { term: "mulalo", translation: "cousin", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family cousin" },
        { term: "ndomÄ", translation: "brother", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family brother" },
        { term: "ndoma muto", translation: "sister", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family sister" },
        { term: "diwása", translation: "twin", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family twin" },
        { term: "muna", translation: "child", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family child" },
        { term: "mwÄ ngÄ mwa muna", translation: "baby", imageUrl: "https://placehold.co/100x100.png", dataAiHint: "family baby" },
      ]
    },
    { 
      id: "5", 
      title: "Cultural Etiquette in Cameroon", 
      description: "Understand important cultural norms.", 
      category: "Culture", 
      estimatedTimeMinutes: 30, 
      order: 5,
      culturalTips: "Greetings are very important. Always greet elders first. When visiting someone's home, it's customary to bring a small gift. Handshakes are common, but maintain eye contact respectfully, especially with elders. Pointing with an index finger can be considered rude."
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
  // Add quiz for lesson 4 (Family) later if needed
  return null;
}

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
    // Fallback for cases where videoUrl might just be the ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(videoUrl)) { 
        return `https://www.youtube.com/embed/${videoUrl}`;
    }
    return 'about:blank'; // Invalid URL, return blank page
  }

  if (videoId) {
    // Remove query parameters from videoId if present (e.g. from youtu.be/VIDEO_ID?si=...)
    const queryIndex = videoId.indexOf('?');
    if (queryIndex !== -1) {
      videoId = videoId.substring(0, queryIndex);
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  console.warn("Could not extract YouTube video ID from URL:", videoUrl);
  return 'about:blank'; // Could not extract ID, return blank page
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
        
        <ScrollArea className="h-[calc(100vh-20rem)]"> {/* Adjust height as needed */}
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

    
