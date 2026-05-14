// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnhM4tiB1Lqq4FFVdpx867HSqTgSoCXgY",
  authDomain: "gluviacare-df692.firebaseapp.com",
  projectId: "gluviacare-df692",
  storageBucket: "gluviacare-df692.firebasestorage.app",
  messagingSenderId: "1079209615286",
  appId: "1:1079209615286:web:0eb598db49063444efab17",
  measurementId: "G-SP2BWYNBX5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };
