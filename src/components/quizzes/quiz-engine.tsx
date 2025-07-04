"use client";

import type { Quiz } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { quizFeedback, type QuizFeedbackInput } from "@/ai/flows/quiz-feedback";
import { Loader2, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/use-auth";
// Make sure useAuth returns addPoints, or import the correct context/hook that provides addPoints


export function QuizEngine() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  // Note: QuizEngine receives quizData as a prop, which likely already includes the language context
  const [fetchedQuizData, setFetchedQuizData] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // If useAuth does not provide addPoints, you may need to import it from the correct context/hook.
  // Example: import { usePoints } from "@/hooks/use-points";
  // const { addPoints } = usePoints();
  // TODO: Replace the following with the correct hook/context that provides addPoints
  // const { addPoints } = usePoints(); // Uncomment and adjust as needed
  // const { user, addPoints } = useAuth();
  // Replace the above line with the correct hook/context that provides user and addPoints.
  // Example (if you have a useUser or usePoints hook):
  // const { user } = useUser();
  // const { addPoints } = usePoints();
  // For now, set user and addPoints to undefined to avoid compile error:
  const user = undefined;
  const addPoints = undefined;

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSubmit = async () => {
    if (!fetchedQuizData) return; // Prevent submitting if quiz data is not loaded
    if (!selectedAnswer) {
      toast({ title: "No Answer Selected", description: "Please select an answer.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect && fetchedQuizData) { // Add fetchedQuizData check
      setScore(prevScore => prevScore + currentQuestion.points);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }

    // Get AI Feedback
    setIsFeedbackLoading(true);
    try {
      const feedbackInput: QuizFeedbackInput = {
        question: currentQuestion.text, // currentQuestion is derived from fetchedQuizData
        answer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer as string,
      };
      const aiResult = await quizFeedback(feedbackInput);
      setFeedback(aiResult.feedback);
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      setFeedback("Could not retrieve AI feedback at this time.");
    } finally {
      setIsFeedbackLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!fetchedQuizData) return; // Prevent proceeding if quiz data is not loaded
    setSelectedAnswer(null);
    setFeedback(null);
    setAnswerStatus(null);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowResult(true);

      // --- Firestore Update Logic ---
      if (user && addPoints) {
        try {
          // Add points to Firestore using the context method (which also updates dashboard)
          await addPoints(score);
          // Optionally, update quizScores or other progress fields here if needed
          // (You can extend addPoints or create a separate method in your context)
        } catch (error) {
          console.error("Error updating user points in Firestore:", error);
          toast({ title: "Error", description: "Could not save quiz progress.", variant: "destructive" });
        }
      }
      // --- End Firestore Update Logic ---
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setFeedback(null);
    setAnswerStatus(null);
  };

  if (isLoading) {
    return <Card className="w-full max-w-2xl mx-auto shadow-xl"><CardContent className="pt-6 space-y-6"><p>Loading quiz...</p></CardContent></Card>;
  }

  if (error) {
    return <Card className="w-full max-w-2xl mx-auto shadow-xl"><CardContent className="pt-6 space-y-6"><p className="text-destructive">Error: {error}</p></CardContent></Card>;
  }

  if (!fetchedQuizData) {
      return <Card className="w-full max-w-2xl mx-auto shadow-xl"><CardContent className="pt-6 space-y-6\"><p className="text-muted-foreground\">Quiz data not available.</p></CardContent></Card>;
  }

  // Use fetchedQuizData for rendering and logic
  const quizData = fetchedQuizData; // Assign to a local variable for cleaner code below
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const progressValue = ((currentQuestionIndex +1) / totalQuestions) * 100;

  if (showResult) {
    const totalPointsPossible = quizData.questions.reduce((acc, q) => acc + q.points, 0);
    const percentage = totalPointsPossible > 0 ? (score / totalPointsPossible) * 100 : 0;
    const passed = quizData.passingScore ? percentage >= quizData.passingScore : true;

    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-headline">Quiz Completed: {quizData.title}</CardTitle>
          <CardDescription>Here's how you did!</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-4xl font-bold">
            Your Score: {score} / {totalPointsPossible} ({percentage.toFixed(0)}%)
          </p>
          {passed ? (
            <Alert variant="default" className="bg-green-50 border-green-500 text-green-700">
              <CheckCircle className="h-5 w-5 text-green-700" />
              <AlertTitle>Congratulations! You passed!</AlertTitle>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-5 w-5" />
              <AlertTitle>Keep Practicing! You didn't pass this time.</AlertTitle>
              {quizData.passingScore && <AlertDescription>You needed {quizData.passingScore}% to pass.</AlertDescription>}
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={resetQuiz} variant="outline">Retake Quiz</Button>
          <Button onClick={() => window.location.href = '/quizzes'} className="ml-4">Back to Quizzes</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!currentQuestion) {
    return <p>Loading quiz...</p>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary font-headline">{quizData.title}</CardTitle>
        <div className="flex justify-between items-center pt-2">
          <CardDescription>Question {currentQuestionIndex + 1} of {totalQuestions}</CardDescription>
          <CardDescription>Score: {score}</CardDescription>
        </div>
        <Progress value={progressValue} className="w-full mt-2 h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-semibold text-foreground">{currentQuestion.text}</p>
        {currentQuestion.type === 'multiple-choice' && (
          <RadioGroup
            onValueChange={setSelectedAnswer}
            value={selectedAnswer || ""}
            disabled={isSubmitting || !!answerStatus}
            className="space-y-2"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-accent-foreground">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {/* TODO: Add rendering for other question types like 'fill-blank', 'matching' */}

        {answerStatus && (
          <Alert variant={answerStatus === 'correct' ? 'default' : 'destructive'} className={answerStatus === 'correct' ? "bg-green-50 border-green-500 text-green-700" : ""}>
            {answerStatus === 'correct' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <AlertTitle>{answerStatus === 'correct' ? 'Correct!' : 'Incorrect'}</AlertTitle>
            {answerStatus === 'incorrect' && <AlertDescription>The correct answer was: {currentQuestion.correctAnswer}</AlertDescription>}
            {currentQuestion.explanation && <AlertDescription className="mt-2">{currentQuestion.explanation}</AlertDescription>}
          </Alert>
        )}

        {isFeedbackLoading && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating AI feedback...
          </div>
        )}
        {feedback && !isFeedbackLoading && (
          <Card className="bg-secondary/30 border-accent">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center text-accent font-headline">
                <Sparkles className="mr-2 h-5 w-5" /> AI Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">{feedback}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter>
        {!answerStatus ? (
          <Button onClick={handleAnswerSubmit} disabled={isSubmitting || !selectedAnswer} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} className="w-full">
            {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "Show Results"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}