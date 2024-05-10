// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";

// import firebase from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

    // If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";

    // Add Firebase products that you want to use
    import { getAuth, signInWithEmailAndPassword, onAuthStateChanged  } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js'
    // import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMfAoYxsMPZqBUzD7uMrxk4nf4NksNnL0",
  authDomain: "facerecog-92727.firebaseapp.com",
  projectId: "facerecog-92727",
  storageBucket: "facerecog-92727.appspot.com",
  messagingSenderId: "65401060356",
  appId: "1:65401060356:web:d7f13627b2d5a246108951",
  measurementId: "G-WZ322B2BVG"
};

// Initialize Firebase

// initializeApp(firebaseConfig);
// firebase.initializeApp(firebaseConfig);

const analytics = getAnalytics(firebaseApp);



