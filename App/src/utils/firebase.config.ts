// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAlLYYnmDU-M86Q1fji5dLjFt1FMz5-0Ow",
    authDomain: "zaloclone-e11cb.firebaseapp.com",
    databaseURL: "https://zaloclone-e11cb-default-rtdb.firebaseio.com",
    projectId: "zaloclone-e11cb",
    storageBucket: "zaloclone-e11cb.firebasestorage.app",
    messagingSenderId: "274540464831",
    appId: "1:274540464831:web:ceadf0835eaf4392bc140a",
    measurementId: "G-DDVECRWZVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');