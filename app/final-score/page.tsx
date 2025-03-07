"use client";

import React, { useEffect, useState } from "react";
import { Scoreboard } from "@/components/ui/scoreboard";
import { db } from "@/lib/firebase"; // Import Firestore instance
import { doc, setDoc } from "firebase/firestore";

export default function FinalScorePage() {
  const [teamNumber, setTeamNumber] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const storedTeamNumber = localStorage.getItem("teamNumber");
    setTeamNumber(storedTeamNumber);

    const storedScore = localStorage.getItem("score");
    if (storedScore) {
      const parsedScore = parseInt(storedScore, 10);
      setScore(parsedScore);

      // Save score to Firebase if teamNumber exists
      if (storedTeamNumber) {
        saveScoreToFirebase(storedTeamNumber, parsedScore);
      }
    }
  }, []);

  // Function to save score to Firebase
  const saveScoreToFirebase = async (teamId: string, teamScore: number) => {
    try {
      await setDoc(doc(db, "teams", teamId), { score: teamScore }, { merge: true });
      console.log("Score saved successfully!");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Thank you for playing!</h1>
      <Scoreboard teamNumber={teamNumber} localScore={score} />
    </div>
  );
}
