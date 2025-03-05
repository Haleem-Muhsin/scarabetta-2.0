"use client";

import { useState, useEffect } from "react";
import { fetchQuestion, checkAnswer } from "@/lib/firebase";
import { Question } from "@/components/question";
import { GalleryVerticalEnd } from "lucide-react";
import { Scoreboard } from "@/components/ui/scoreboard";

export default function Round1Page() {
  const [teamNumber, setTeamNumber] = useState<string | null>(null);
  const roundNumber = 1;
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionText, setQuestionText] = useState("Loading question...");
  const [feedback, setFeedback] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const storedTeamNumber = localStorage.getItem("teamNumber");
    setTeamNumber(storedTeamNumber);

    const storedScore = localStorage.getItem("score");
    if (storedScore) setScore(parseInt(storedScore, 10));

    const loadQuestion = async () => {
      try {
        console.log(`Fetching question: Round ${roundNumber}, Question ${questionNumber}`);
        const questionData = await fetchQuestion(roundNumber, questionNumber);
        if (questionData) {
          setQuestionText(questionData.q);
          setFeedback("");
          setAnswer("");
        } else {
          setQuestionText("No question available");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    loadQuestion();
  }, [questionNumber]);

  const handleAnswerSubmit = async (userAnswer: string) => {
    if (!teamNumber) return;

    const result = await checkAnswer(roundNumber, questionNumber, userAnswer);
    let newFeedback = "Moving to next question...";

    if (result.correct) {
      newFeedback = "✅ Correct! Moving to next question...";
      setScore((prev) => {
        const newScore = prev + 10;
        localStorage.setItem("score", newScore.toString()); // Save score to localStorage
        return newScore;
      });
    }

    setFeedback(newFeedback);

    setTimeout(() => {
      setQuestionNumber((prev) => prev + 1);
    }, 1000);
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Scoreboard teamNumber={teamNumber} localScore={score} />
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
