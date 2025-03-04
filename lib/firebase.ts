import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQ9DBUh_on11ZB5Rgo7ITcPxlhckqWY2c",
  authDomain: "scarabetta-2.firebaseapp.com",
  projectId: "scarabetta-2",
  storageBucket: "scarabetta-2.firebasestorage.app",
  messagingSenderId: "571520686694",
  appId: "1:571520686694:web:02e04741fbcd44afc72ba7",
  measurementId: "G-5QPW7LMEKT"
};

// Ensure Firebase initializes only once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Only initialize analytics in the browser
let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

/**
 * Fetches a question from Firestore based on round and question number.
 * @param {number} roundNumber - The round number (collection ID)
 * @param {number} questionNumber - The question number (document ID)
 * @returns {Promise<{question: string, answer: string} | null>} Question data or null if not found
 */
export const fetchQuestion = async (roundNumber: number, questionNumber: number) => {
  try {
    const questionRef = doc(db, `${roundNumber}/${questionNumber}`);
    const questionSnap = await getDoc(questionRef);

    if (questionSnap.exists()) {
      return questionSnap.data();
    } else {
      console.error("Question not found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching question:", error);
    return null;
  }
};

/**
 * Compares the user's answer with the correct answer stored in Firestore.
 * @param {number} roundNumber - The round number
 * @param {number} questionNumber - The question number
 * @param {string} userAnswer - The answer provided by the user
 * @returns {Promise<{correct: boolean, message: string}>} Result indicating correctness
 */
export const checkAnswer = async (roundNumber: number, questionNumber: number, userAnswer: string) => {
  const questionData = await fetchQuestion(roundNumber, questionNumber);
  
  if (!questionData) return { correct: false, message: "Question not found!" };

  const isCorrect = questionData.a.trim().toLowerCase() === userAnswer.trim().toLowerCase();

  return {
    correct: isCorrect,
    message: isCorrect ? "Correct answer!" : "Wrong answer, try again.",
  };
};

export { db };
