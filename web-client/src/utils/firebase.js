import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAmgSrI6vleGW4lkmJ3qGUx8k6bhLtf78A",
  authDomain: "react-chat-app-50b7d.firebaseapp.com",
  databaseURL:
    "https://react-chat-app-50b7d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-chat-app-50b7d",
  storageBucket: "react-chat-app-50b7d.appspot.com",
  messagingSenderId: "214086010252",
  appId: "1:214086010252:web:ecb7e7814bc65976e002a9",
  measurementId: "G-38VP8W2LVW",
};

const firebase = initializeApp(firebaseConfig);

export const storage = getStorage(firebase);
