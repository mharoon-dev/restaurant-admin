import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDfa5Tb46hoeg0j5Z6cB5z7atgDg7SIX3A",
  authDomain: "restaurant-16154.firebaseapp.com",
  projectId: "restaurant-16154",
  storageBucket: "restaurant-16154.appspot.com",
  messagingSenderId: "942721025927",
  appId: "1:942721025927:web:4fba8b39ffaf050c36f522",
  measurementId: "G-T360KEZPPQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
