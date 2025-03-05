"use client";

import React, { useEffect, useState } from "react";
import { Scoreboard } from "@/components/ui/scoreboard";

export default function FinalScorePage() {
  const [teamNumber, setTeamNumber] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setTeamNumber(localStorage.getItem("teamNumber"));

    const storedScore = localStorage.getItem("score");
    if (storedScore) setScore(parseInt(storedScore, 10));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Thank you for playing!</h1>
      <Scoreboard teamNumber={teamNumber} localScore={score} />
    </div>
  );
}
