
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Lesson } from "@/types";
import { BookOpenText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image"; 

// Mock data - replace with actual data fetching
const lessons: Lesson[] = [
  { 
    id: "1", 
    title: "Basic Duala Greetings", 
    description: "Learn common greetings and introductions.", 
    category: "Vocabulary", 
    estimatedTimeMinutes: 15, 
    order: 1,
    vocabulary: [
      { term: "M̀bɔ́lɔ", translation: "Hello" },
      { term: "Na som", translation: "Thank you" }
    ]
  },
  { 
    id: "2", 
    title: "Duala Alphabet and Pronunciation", 
    description: "Master the sounds of Duala.", 
    category: "Fundamentals", 
    estimatedTimeMinutes: 25, 
    order: 2 
  },
  { 
    id: "3", 
    title: "Ordering Food in Duala", 
    description: "Essential phrases for restaurants.", 
    category: "Dialogues", 
    estimatedTimeMinutes: 20, 
    order: 3,
    dialogues: [
      { speaker: "Customer", line: "M̀bɔ́lɔ, na me̠nde̠ sombo bia." },
      { speaker: "Waiter", line: "M̀bɔ́lɔ, nje o me̠nde̠ e?" }
    ]
  },
  { 
    id: "4", 
    title: "Family Members", 
    description: "Learn how to talk about your family.", 
    category: "Vocabulary", 
    estimatedTimeMinutes: 18, 
    order: 4 
  },
  { 
    id: "5", 
    title: "Cultural Etiquette in Cameroon", 
    description: "Understand important cultural norms.", 
    category: "Culture", 
    estimatedTimeMinutes: 30, 
    order: 5,
    culturalTips: "Greetings are very important. Always greet elders first."
  },
];

export default function LessonsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Interactive Lessons</h1>
        {/* Potentially a filter or search bar here */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
             <div className="relative h-40 w-full bg-secondary/20 flex items-center justify-center" data-ai-hint={`lesson ${lesson.category?.toLowerCase()} abstract`}>
                {/* Placeholder for lesson image or icon. Could use Image component if URLs are available */}
                {/* <Image src={lesson.imageUrl || "https://placehold.co/400x200.png"} alt={lesson.title} layout="fill" objectFit="cover" /> */}
                <BookOpenText className="w-16 h-16 text-primary/50" />
             </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-primary leading-tight">{lesson.title}</CardTitle>
              {lesson.category && <Badge variant="secondary" className="mt-1 w-fit">{lesson.category}</Badge>}
            </CardHeader>
            <CardContent className="flex-grow">
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
        ))}
      </div>
       {lessons.length === 0 && (
        <p className="text-center text-muted-foreground py-10">No lessons available yet. Check back soon!</p>
      )}
    </div>
  );
}

    