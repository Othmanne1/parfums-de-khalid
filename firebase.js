// استيراد الـ SDKs عن طريق الـ CDN اللي كيقراها المتصفح ديريكت
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMFsifYpNTl1wvxjpzy0f37wBC3kBtMMc",
  authDomain: "parfums-de-khalid.firebaseapp.com", 
  projectId: "parfums-de-khalid",
  storageBucket: "parfums-de-khalid.firebasestorage.app", 
  messagingSenderId: "109387853829", 
  appId: "1:109387853829:web:48c14d1b9759aed369ac6c",
  measurementId: "G-70EC90WH65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// استيراد الـ Firestore بالطريقة الجديدة
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ربط الـ db بـ window باش يشوفوها كاع الملفات فالسيت
window.db = getFirestore(app);

export { app, analytics };