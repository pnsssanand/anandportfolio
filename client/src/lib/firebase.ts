import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBLXxLGhNej_ytNR57ydMOdXck-TMs2JTc",
  authDomain: "anand-portfolio-f1667.firebaseapp.com",
  projectId: "anand-portfolio-f1667",
  storageBucket: "anand-portfolio-f1667.firebasestorage.app",
  messagingSenderId: "680965504181",
  appId: "1:680965504181:web:4f4668acabe30d8e2012fc",
  measurementId: "G-PHZHJMWP17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: "dlvjvskje",
  uploadPreset: "anandportfolio",
  apiUrl: `https://api.cloudinary.com/v1_1/dlvjvskje/image/upload`
};

// Admin email for authentication
export const ADMIN_EMAIL = "anandpinisetty@gmail.com";

export default app;
