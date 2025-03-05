"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchQuestion, checkAnswer } from "@/lib/firebase";
import { Question } from "@/components/question";
import { Question3 } from "@/components/question3"; // Import Question3 component
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
    // Get team number from localStorage
    setTeamNumber(localStorage.getItem("teamNumber"));

    // Get score from localStorage or default to 0
    const storedScore = localStorage.getItem("score");
    setScore(storedScore ? parseInt(storedScore) : 0);

    // Always set roundNumber to 1 for this page
    setRoundNumber(1);

    // Get questionNumber from localStorage or default to 1
    const storedQuestionNumber = localStorage.getItem("questionNumber");
    let startQuestionNumber = storedQuestionNumber ? parseInt(storedQuestionNumber) : 1;

    // If stuck on Question 3, move to 4
    if (startQuestionNumber === 3) {
      startQuestionNumber = 4;
      localStorage.setItem("questionNumber", "4");
    }

    setQuestionNumber(startQuestionNumber);
  }, []);

  // Save questionNumber to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("questionNumber", questionNumber.toString());
  }, [questionNumber]);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        console.log(`Fetching question: Round ${roundNumber}, Question ${questionNumber}`);

        // Skip loading question if coming from Question3
        if (roundNumber === 1 && questionNumber === 3) return;

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
    setFeedback("Processing...");

    // Compute new score if correct
    let newScore = score;
    if (result.correct) {
      newScore += 10;
      localStorage.setItem("score", newScore.toString());
      setScore(newScore);
    }

    setTimeout(() => {
      setFeedback("");

      let newQuestionNumber = questionNumber + 1;
      let newRoundNumber = roundNumber;

      if (questionNumber === 5) {
        if (roundNumber < 5) {
          newRoundNumber += 1;
          newQuestionNumber = 1;
        }
      }

      console.log(`Moving to Round ${newRoundNumber}, Question ${newQuestionNumber}`);

      // Update localStorage BEFORE updating state
      localStorage.setItem("questionNumber", newQuestionNumber.toString());
      localStorage.setItem("roundNumber", newRoundNumber.toString());

      // Update state to trigger re-render
      setQuestionNumber(newQuestionNumber);
      setRoundNumber(newRoundNumber);
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
          <Question3 />
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
