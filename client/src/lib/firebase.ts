import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBLXxLGhNej_ytNR57ydMOdXck-TMs2JTc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "anand-portfolio-f1667.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "anand-portfolio-f1667",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "anand-portfolio-f1667.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "680965504181",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:680965504181:web:4f4668acabe30d8e2012fc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-PHZHJMWP17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dlvjvskje",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "anandportfolio",
  apiUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dlvjvskje"}/image/upload`
};

// Admin email for authentication
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "pnsssanand@gmail.com";

export default app;
