import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getDatabase } from 'firebase/database';
// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAlLYYnmDU-M86Q1fji5dLjFt1FMz5-0Ow",
  authDomain: "zaloclone-e11cb.firebaseapp.com",
  dataBaseURL: "https://zaloclone-e11cb-default-rtdb.firebaseio.com",
  projectId: "zaloclone-e11cb",
  storageBucket: "zaloclone-e11cb.firebasestorage.app",
  messagingSenderId: "274540464831",
  appId: "1:274540464831:web:ceadf0835eaf4392bc140a",
  measurementId: "G-DDVECRWZVF"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Lấy dữ liệu từ Firebase Realtime Database
const db = getDatabase(app);

export { app, auth ,db , RecaptchaVerifier };
