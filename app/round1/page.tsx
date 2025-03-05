"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchQuestion, checkAnswer } from "@/lib/firebase";
import { Question } from "@/components/question";
import {Question3} from "@/components/question3"; // Import Question3 component
import { GalleryVerticalEnd } from "lucide-react";

export default function Round1Page() {
  const router = useRouter();
  const [teamNumber, setTeamNumber] = useState<string | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionText, setQuestionText] = useState("Loading question...");
  const [feedback, setFeedback] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    setTeamNumber(localStorage.getItem("teamNumber"));
    setScore(0);
    setRoundNumber(1);
    setQuestionNumber(1);
  }, []);

  useEffect(() => {
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
  }, [roundNumber, questionNumber]);

  const handleAnswerSubmit = async (userAnswer: string) => {
    if (!teamNumber) return;

    const result = await checkAnswer(roundNumber, questionNumber, userAnswer);
    const newFeedback = "Moving to next question...";

    if (result.correct) {
      setScore((prev) => {
        const newScore = prev + 10;
        localStorage.setItem("score", newScore.toString());
        return newScore;
      });
    }

    setFeedback(newFeedback);

    setTimeout(() => {
      setFeedback("");

      if (roundNumber === 5 && questionNumber === 5) {
        localStorage.setItem("score", score.toString());
        router.push("/final-score");
        return;
      }

      if (questionNumber === 5) {
        if (roundNumber < 5) {
          setRoundNumber((prev) => prev + 1);
          setQuestionNumber(1);
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

        {/* Use Question3 only for Round 1, Question 3 */}
        {roundNumber === 1 && questionNumber === 3 ? (
          <Question3
          />
        ) : (
          <Question
            round={roundNumber}
            question={questionNumber}
            questionText={questionText}
            answer={answer}
            setAnswer={setAnswer}
            onSubmit={handleAnswerSubmit}
          />
        )}

        {feedback && <p className="text-center font-bold">{feedback}</p>}
      </div>
    </div>
  );
}
