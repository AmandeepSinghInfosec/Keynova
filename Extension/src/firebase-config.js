// extension/firebase-config.js
// ── REPLACE ALL VALUES BELOW WITH YOUR FIREBASE PROJECT CONFIG ──────────────
// Get these from: Firebase Console → Project Settings → Your apps → SDK setup

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoqg-PXgof0AcALJHAgImtaZaecTynxCI",
  authDomain: "keynova-fec23.firebaseapp.com",
  databaseURL: "https://keynova-fec23-default-rtdb.firebaseio.com",
  projectId: "keynova-fec23",
  storageBucket: "keynova-fec23.firebasestorage.app",
  messagingSenderId: "508346670786",
  appId: "1:508346670786:web:ee638dff3ddf7d80a2a55b",
  measurementId: "G-C0TX3GJPTL"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);




// ── HOW TO FIND THESE VALUES ─────────────────────────────────────────────────
// 1. Go to https://console.firebase.google.com
// 2. Open your keynova project
// 3. Click gear icon (⚙) → Project Settings
// 4. Scroll down to "Your apps" section
// 5. Click the </> web app you registered
// 6. Copy each value from the firebaseConfig object shown there
