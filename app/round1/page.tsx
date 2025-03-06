"use client";

import { useState, useEffect } from "react";
import { fetchQuestion, checkAnswer } from "@/lib/firebase";
import { Question } from "@/components/question";
import { Question3 } from "@/components/question3"; // Import Question3 component
import { GalleryVerticalEnd } from "lucide-react";

export default function Round1Page() {
  const [teamNumber, setTeamNumber] = useState<string | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionText, setQuestionText] = useState("Loading question...");
  const [feedback, setFeedback] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Get team number from localStorage
    setTeamNumber(localStorage.getItem("teamNumber"));

    // Always set roundNumber to 1 for this page
    setRoundNumber(1);
    
    // Check if question number is 4 from localStorage
    const storedQuestionNumber = localStorage.getItem("questionNumber");
    
    if (storedQuestionNumber === "4") {
      // If question number is 4, keep it and don't clear score
      setQuestionNumber(4);
      
      // Get score from localStorage or default to 0
      const storedScore = localStorage.getItem("score");
      setScore(storedScore ? parseInt(storedScore) : 0);
    } else {
      // If question number is not 4, reset to question 1 and clear score
      setQuestionNumber(1);
      localStorage.setItem("questionNumber", "1");
      localStorage.setItem("score", "0");
      setScore(0);
    }
    
    // Mark initial load as complete
    setIsInitialLoad(false);
  }, []);

  // Only save questionNumber to localStorage when it changes AFTER initial load
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("questionNumber", questionNumber.toString());
    }
  }, [questionNumber, isInitialLoad]);

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
    
    if (result.correct) {
      setFeedback("Correct answer, Moving on...");
      
      // Compute new score if correct
      let newScore = score + 10;
      localStorage.setItem("score", newScore.toString());
      setScore(newScore);
      
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
    } else {
      setFeedback("Incorrect answer. Try again");
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
