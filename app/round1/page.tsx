"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter
import { fetchQuestion, checkAnswer } from "@/lib/firebase";
import { Question } from "@/components/question";
import { GalleryVerticalEnd } from "lucide-react";
import { Scoreboard } from "@/components/ui/scoreboard";

export default function Round1Page() {
  const router = useRouter(); // ✅ Initialize router
  const [teamNumber, setTeamNumber] = useState<string | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionText, setQuestionText] = useState("Loading question...");
  const [feedback, setFeedback] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);

  // On page load, reset everything
  useEffect(() => {
    setTeamNumber(localStorage.getItem("teamNumber"));
    setScore(0); // Reset score on refresh
    setRoundNumber(1);
    setQuestionNumber(1);
  }, []);

  // Fetch the question when the round or question changes
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        console.log(`Fetching question: Round ${roundNumber}, Question ${questionNumber}`);
        const questionData = await fetchQuestion(roundNumber, questionNumber);
        if (questionData) {
          setQuestionText(questionData.q);
          setFeedback(""); // Clear previous feedback
          setAnswer(""); // Reset answer input
        } else {
          setQuestionText("No question available");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    loadQuestion();
  }, [roundNumber, questionNumber]); // ✅ Depend on both roundNumber and questionNumber

  // Handle answer submission
  const handleAnswerSubmit = async (userAnswer: string) => {
    if (!teamNumber) return;
  
    const result = await checkAnswer(roundNumber, questionNumber, userAnswer);
    let newFeedback = result.correct ? "Moving to next question..." : "Moving to next question...";
  
    if (result.correct) {
      setScore((prev) => {
        const newScore = prev + 10;
        localStorage.setItem("score", newScore.toString()); // ✅ Save score to localStorage
        return newScore;
      });
    }
  
    setFeedback(newFeedback);
  
    setTimeout(() => {
      setFeedback(""); // ✅ Clear feedback after moving to the next question
  
      // ✅ If it's the last question of Round 5, redirect to final score page
      if (roundNumber === 5 && questionNumber === 5) {
        localStorage.setItem("score", score.toString()); // ✅ Ensure score is saved before navigating
        router.push("/final-score");
        return;
      }
  
      // Move to the next question, or next round if last question of the round
      if (questionNumber === 5) {
        if (roundNumber < 5) {
          setRoundNumber((prev) => prev + 1); // Move to next round
          setQuestionNumber(1); // Reset question number
        }
      } else {
        setQuestionNumber((prev) => prev + 1);
      }
    }, 1000);
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

        <Question
          round={roundNumber}
          question={questionNumber}
          questionText={questionText}
          answer={answer}
          setAnswer={setAnswer}
          onSubmit={handleAnswerSubmit}
        />
        {feedback && <p className="text-center font-bold">{feedback}</p>}
      </div>
    </div>
  );
}
