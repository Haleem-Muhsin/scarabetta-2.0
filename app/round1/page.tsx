"use client";

import { useState, useEffect } from "react";
import { fetchQuestion, checkAnswer } from "@/lib/firebase";
import { Question } from "@/components/question";
import { Question3 } from "@/components/question3"; // Import Question3 component
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import router from "next/router";

export default function Round1Page() {
  const [teamNumber, setTeamNumber] = useState<string | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionText, setQuestionText] = useState("Loading question...");
  const [feedback, setFeedback] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setTeamNumber(localStorage.getItem("teamNumber"));
    setRoundNumber(1);
    const storedQuestionNumber = localStorage.getItem("questionNumber");
    if (storedQuestionNumber === "4") {
      setQuestionNumber(4);
      const storedScore = localStorage.getItem("score");
      setScore(storedScore ? parseInt(storedScore) : 0);
    } else {
      setQuestionNumber(1);
      localStorage.setItem("questionNumber", "1");
      localStorage.setItem("score", "0");
      setScore(0);
    }
    setIsInitialLoad(false);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      showTabSwitchWarning();
    }
  };

  const handleWindowBlur = () => {
    showTabSwitchWarning();
  };

  const showTabSwitchWarning = () => {
    setTabSwitchWarning(true);
  };

  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("questionNumber", questionNumber.toString());
    }
  }, [questionNumber, isInitialLoad]);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        console.log(`Fetching question: Round ${roundNumber}, Question ${questionNumber}`);
        if (roundNumber === 1 && questionNumber === 3) return;
        const questionData = await fetchQuestion(roundNumber, questionNumber);
        if (questionData) {
          setQuestionText(questionData.q);
          setFeedback("");
          setAnswer("");
          setAttempts(0);
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
    const isLimitedQuestion = (roundNumber === 3 && questionNumber === 5) || (roundNumber === 4 && questionNumber === 1);
    if (result.correct) {
      setFeedback("✅ Correct answer, Moving on...");
      const newScore = score + 100;
      localStorage.setItem("score", newScore.toString());
      setScore(newScore);
    } else {
      setFeedback(" ❌ Incorrect answer");
    }
    setTimeout(() => {
      if (isLimitedQuestion) {
        if (attempts + 1 >= 2) {
          proceedToNextQuestion();
          return;
        }
        setAttempts(attempts + 1);
      } else if (result.correct) {
        proceedToNextQuestion();
      }
    }, 1000);
  };

  const proceedToNextQuestion = () => {
    if (roundNumber === 4 && questionNumber === 5) {
      router.push("/final-score"); // ✅ Redirect after Round 4, Question 5
      return;
    }
    let newQuestionNumber = questionNumber + 1;
    let newRoundNumber = roundNumber;
    if (questionNumber === 5) {
      if (roundNumber < 4) {
        newRoundNumber += 1;
        newQuestionNumber = 1;
      }
    }
    console.log(`Moving to Round ${newRoundNumber}, Question ${newQuestionNumber}`);
    localStorage.setItem("questionNumber", newQuestionNumber.toString());
    localStorage.setItem("roundNumber", newRoundNumber.toString());
    setQuestionNumber(newQuestionNumber);
    setRoundNumber(newRoundNumber);
  };

  const dismissWarning = () => {
    const newScore = score - 100;
    localStorage.setItem("score", newScore.toString());
    setTabSwitchWarning(false);
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {tabSwitchWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col md:flex-row items-center md:justify-between z-50 p-4">
          <div className="w-full md:w-1/2 flex justify-center items-center mb-4 md:mb-0">
            <Image src="/images/foul.png" alt="You naughty!" width={500} height={300} className="w-full max-w-sm h-auto" />
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center md:pr-8">
            <div className="bg-white p-6 rounded-lg max-w-md text-center w-full md:w-auto">
              <h2 className="text-xl font-bold text-red-600 mb-4">You naughty!</h2>
              <p className="mb-4">Tab switching or leaving the window is not allowed during the quiz.</p>
              <p className="mb-6">You&apos;ll be deducted 100 Divine Aura.</p>
              <button onClick={dismissWarning} className="bg-primary text-white px-4 py-2 rounded-md">I Understand</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium text-2xl">
          <GalleryVerticalEnd className="size-4" /> Scarabetta 2.0
        </a>
        {roundNumber === 1 && questionNumber === 3 ? <Question3 /> : <Question round={roundNumber} question={questionNumber} questionText={questionText} answer={answer} setAnswer={setAnswer} onSubmit={handleAnswerSubmit} />}
        {feedback && <p className="text-center font-bold">{feedback}</p>}
      </div>
    </div>
  );
}
