"use client"; // Ensure this runs on the client

import { useState, useEffect } from "react";
import { fetchQuestion, checkAnswer } from "@/lib/firebase";
import { Question } from "@/components/question";
import { GalleryVerticalEnd } from "lucide-react";

export default function Round1Page() {
  const roundNumber = 1; // Change dynamically if needed
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionText, setQuestionText] = useState("Loading question...");
  const [feedback, setFeedback] = useState("");

  // Fetch question when the component mounts or questionNumber changes
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        console.log(`Fetching question: Round ${roundNumber}, Question ${questionNumber}`);
        const questionData = await fetchQuestion(roundNumber, questionNumber);
        if (questionData) {
          setQuestionText(questionData.q); // Ensure you're using the correct key
          setFeedback(""); // Clear previous feedback
        } else {
          setQuestionText("No question available");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    loadQuestion();
  }, [questionNumber]); // Re-run when questionNumber updates

  const handleAnswerSubmit = async (userAnswer: string) => {
    const result = await checkAnswer(roundNumber, questionNumber, userAnswer);

    if (result.correct) {
      setFeedback("✅ Correct! Moving to next question...");
      setTimeout(() => {
        setQuestionNumber(prev => prev + 1); // Move to next question
      }, 1000); // Delay for user feedback
    } else {
      setFeedback("❌ Incorrect. Try again!");
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium text-2xl">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Scarabetta 2.0
        </a>

        {/* Display Question Number */}
        <Question
          round={roundNumber}
          question={questionNumber}
          questionText={questionText}
          onSubmit={handleAnswerSubmit}
        />
        {feedback && <p className="text-center font-bold">{feedback}</p>}
      </div>
    </div>
  );
}
