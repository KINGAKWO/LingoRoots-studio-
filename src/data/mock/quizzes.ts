
import type { Quiz } from "@/types";

export const mockQuizzes: Quiz[] = [
  { 
    id: "quiz-1", 
    lessonId: "1", 
    title: "Greetings Quiz", 
    description: "Test your knowledge of basic Duala greetings.", 
    questions: [
      { id: "q1", type: "multiple-choice", text: "How do you say 'Hello' in Duala?", options: ["M̀bɔ́lɔ", "Na som", "Pɛlɛpɛlɛ"], correctAnswer: "M̀bɔ́lɔ", points: 10, explanation: "'M̀bɔ́lɔ' is the common greeting for 'Hello' in Duala." },
      { id: "q2", type: "multiple-choice", text: "What does 'Na som' mean?", options: ["Goodbye", "Thank you", "Yes"], correctAnswer: "Thank you", points: 10, explanation: "'Na som' translates to 'Thank you'." },
      { id: "q3", type: "multiple-choice", text: "How do you ask 'How are you?'", options: ["M̀bɔ́lɔ ní Mbatan", "Ko̠ o pɛlɛpɛlɛ e?", "Na pɛlɛpɛlɛ"], correctAnswer: "Ko̠ o pɛlɛpɛlɛ e?", points: 15, explanation: "'Ko̠ o pɛlɛpɛlɛ e?' is a common way to ask 'How are you?'." },
      // Adding question from original lesson detail page quiz for lesson 1, if different
      { id: "q4", text: "What is the Duala for 'I am fine'?", type: "multiple-choice", options: ["bobe", "É ma ala", "Njé yé péná ?"], correctAnswer: "É ma ala", points: 10, explanation: "'É ma ala' means 'I am fine' in Duala." },
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
  { 
    id: "quiz-3", 
    lessonId: "3", 
    title: "Restaurant Phrases Quiz", 
    description: "Can you order food in Duala?", 
    questions: [], // Assuming no questions were defined for this in original mock data. Add if available.
    passingScore: 75 
  },
];
