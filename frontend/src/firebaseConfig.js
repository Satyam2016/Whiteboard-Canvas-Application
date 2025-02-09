// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfjMzAcARANzb2aNDvmmlArxTmtxTWTxI",
  authDomain: "whiteboard-app-eb8d9.firebaseapp.com",
  projectId: "whiteboard-app-eb8d9",
  storageBucket: "whiteboard-app-eb8d9.firebasestorage.app",
  messagingSenderId: "377979326196",
  appId: "1:377979326196:web:94153ca9f803b0cb1058a1",
  measurementId: "G-23CYZ0WR93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, analytics, googleProvider };