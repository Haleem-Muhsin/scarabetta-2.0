"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "./card";

interface ScoreboardProps {
  teamNumber: string | null;
  localScore: number;
}

export function Scoreboard({ teamNumber, localScore }: ScoreboardProps) {
  const [firebaseScore, setFirebaseScore] = useState(0);

  useEffect(() => {
    if (!teamNumber) return;

    const teamDocRef = doc(db, "teamscore", teamNumber);
    const unsubscribe = onSnapshot(teamDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const scores = docSnap.data();
        const sum = Object.values(scores).reduce((acc, val) => acc + (val as number), 0);
        setFirebaseScore(sum);
      } else {
        setFirebaseScore(0);
      }
    });

    return () => unsubscribe();
  }, [teamNumber]);

  if (!teamNumber) {
    return <p className="text-red-500">No team number found</p>;
  }

  return (
    <div className="items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Team: {teamNumber} - total  Aura</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{firebaseScore + localScore}</p>
        </CardContent>
      </Card>
    </div>
  );
}
