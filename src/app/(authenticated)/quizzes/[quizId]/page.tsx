
import { QuizEngine } from "@/components/quizzes/quiz-engine";
import type { Quiz } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data fetching
const getQuizDetails = async (quizId: string): Promise<Quiz | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
   const quizzes: Quiz[] = [
    { 
      id: "quiz-1", 
      lessonId: "1", 
      title: "Greetings Quiz", 
      description: "Test your knowledge of basic Duala greetings.", 
      questions: [
        { id: "q1", type: "multiple-choice", text: "How do you say 'Hello' in Duala?", options: ["M̀bɔ́lɔ", "Na som", "Pɛlɛpɛlɛ"], correctAnswer: "M̀bɔ́lɔ", points: 10, explanation: "'M̀bɔ́lɔ' is the common greeting for 'Hello' in Duala." },
        { id: "q2", type: "multiple-choice", text: "What does 'Na som' mean?", options: ["Goodbye", "Thank you", "Yes"], correctAnswer: "Thank you", points: 10, explanation: "'Na som' translates to 'Thank you'." },
        { id: "q3", type: "multiple-choice", text: "How do you ask 'How are you?'", options: ["M̀bɔ́lɔ ní Mbatan", "Ko̠ o pɛlɛpɛlɛ e?", "Na pɛlɛpɛlɛ"], correctAnswer: "Ko̠ o pɛlɛpɛlɛ e?", points: 15, explanation: "'Ko̠ o pɛlɛpɛlɛ e?' is a common way to ask 'How are you?'." },
      ],
      passingScore: 70 
    },
    { 
      id: "quiz-2", 
      lessonId: "2", 
      title: "Alphabet Challenge", 
      description: "Check your understanding of the Duala alphabet.", 
      questions: [
        { id: "q1a2", type: "multiple-choice", text: "Which letter is not typically found in the traditional Duala alphabet?", options: ["ɓ", "ŋ", "x", "ɛ"], correctAnswer: "x", points: 10 },
      ], 
      passingScore: 80 
    },
  ];
  return quizzes.find(q => q.id === quizId) || null;
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
