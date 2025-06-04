
import { QuizEngine } from "@/components/quizzes/quiz-engine";
import type { Quiz } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { mockQuizzes } from "@/data/mock/quizzes";

// Fetch quiz details from centralized mock data
const getQuizDetails = async (quizId: string): Promise<Quiz | null> => {
  await new Promise(resolve => setTimeout(resolve, 10)); // Simulate API call
  return mockQuizzes.find(q => q.id === quizId) || null;
};

export default async function QuizPage({ params }: { params: { quizId: string } }) {
  const quizData = await getQuizDetails(params.quizId);

  if (!quizData) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-destructive">Quiz not found.</p>
        <Link href="/quizzes" className="inline-flex items-center text-accent hover:underline mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
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
