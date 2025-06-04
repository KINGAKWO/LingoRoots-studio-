
import { QuizEngine } from "@/components/quizzes/quiz-engine";
import type { Quiz } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getQuizById } from "@/services/quizService"; // Import the service

export default async function QuizPage({ params }: { params: { quizId: string } }) {
  const quizData: Quiz | null = await getQuizById(params.quizId);

  if (!quizData) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold text-destructive mb-4">Quiz Not Found</h1>
        <p className="text-muted-foreground mb-6">The quiz you are looking for does not exist or may have been moved.</p>
        <Link href="/quizzes" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Quizzes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
       <Link href="/quizzes" className="inline-flex items-center text-sm text-accent hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Quizzes
      </Link>
      <QuizEngine quizData={quizData} />
    </div>
  );
}
