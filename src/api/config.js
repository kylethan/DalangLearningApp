// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTUHq_1TOFdWe6ssr1Q87zQdHx6oyc2qs",
  authDomain: "dalanggathering.firebaseapp.com",
  projectId: "dalanggathering",
  storageBucket: "dalanggathering.appspot.com",
  messagingSenderId: "216597857169",
  appId: "1:216597857169:web:ed63e45999ef3bae825030",
  measurementId: "G-QP8KKXDHEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;