'use server';

/**
 * @fileOverview Provides personalized feedback on quiz answers using AI.
 *
 * - quizFeedback - A function that generates feedback based on quiz answers.
 * - QuizFeedbackInput - The input type for the quizFeedback function.
 * - QuizFeedbackOutput - The return type for the quizFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizFeedbackInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  answer: z.string().describe('The user\u2019s answer to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
});
export type QuizFeedbackInput = z.infer<typeof QuizFeedbackInputSchema>;

const QuizFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback on the quiz answer, highlighting areas for improvement.'),
});
export type QuizFeedbackOutput = z.infer<typeof QuizFeedbackOutputSchema>;

export async function quizFeedback(input: QuizFeedbackInput): Promise<QuizFeedbackOutput> {
  return quizFeedbackFlow(input);
}

const quizFeedbackPrompt = ai.definePrompt({
  name: 'quizFeedbackPrompt',
  input: {schema: QuizFeedbackInputSchema},
  output: {schema: QuizFeedbackOutputSchema},
  prompt: `You are an AI language tutor specializing in Duala.

You will provide personalized feedback to a learner on their quiz answer. Highlight areas for improvement and provide specific pointers to help them better understand the Duala language.

Question: {{{question}}}
Learner's Answer: {{{answer}}}
Correct Answer: {{{correctAnswer}}}

Feedback:`,
});

const quizFeedbackFlow = ai.defineFlow(
  {
    name: 'quizFeedbackFlow',
    inputSchema: QuizFeedbackInputSchema,
    outputSchema: QuizFeedbackOutputSchema,
  },
  async input => {
    const {output} = await quizFeedbackPrompt(input);
    return output!;
  }
);
