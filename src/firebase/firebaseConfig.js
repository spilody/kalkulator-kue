
// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCi6QeaOL2K2ZFUbIgZfxCvwi5oeYRCCIE",
    authDomain: "kalkulator-kue.firebaseapp.com",
    databaseURL: "https://kalkulator-kue-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kalkulator-kue",
    storageBucket: "kalkulator-kue.firebasestorage.app",
    messagingSenderId: "747506973169",
    appId: "1:747506973169:web:d0e5c7555718d8b682ac50",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);