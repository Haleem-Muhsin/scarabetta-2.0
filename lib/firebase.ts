// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQ9DBUh_on11ZB5Rgo7ITcPxlhckqWY2c",
  authDomain: "scarabetta-2.firebaseapp.com",
  projectId: "scarabetta-2",
  storageBucket: "scarabetta-2.firebasestorage.app",
  messagingSenderId: "571520686694",
  appId: "1:571520686694:web:02e04741fbcd44afc72ba7",
  measurementId: "G-5QPW7LMEKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Function to fetch questions from Firestore
export const fetchQuestions = async () => {
  const questionsCollection = collection(db, "questions");
  const questionSnapshot = await getDocs(questionsCollection);
  const questionsList = questionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return questionsList;
};

export { db };
