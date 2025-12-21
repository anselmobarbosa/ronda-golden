import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Analytics optional, focusing on DB first

const firebaseConfig = {
    apiKey: "AIzaSyDvzeJyZDoQ2Oyw5qLquZnraB_6BefutxI",
    authDomain: "appronda-821a9.firebaseapp.com",
    projectId: "appronda-821a9",
    storageBucket: "appronda-821a9.firebasestorage.app",
    messagingSenderId: "876144318567",
    appId: "1:876144318567:web:d7555d294a4a4a42a2dcc2",
    measurementId: "G-CQZLLFVFF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
