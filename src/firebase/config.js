import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBafOhteg_F66Q3JMBdZzOYjF0XBQ3zRDw",
  authDomain: "unitrade-9343d.firebaseapp.com",
  projectId: "unitrade-9343d",
  storageBucket: "unitrade-9343d.firebasestorage.app",
  messagingSenderId: "670020018312",
  appId: "1:670020018312:web:4113c64079ebf9f2f97f3d",
  measurementId: "G-XLMRENXMS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
