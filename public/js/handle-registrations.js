import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import { firebaseConfig } from './FirebaseConfigs.js'
// import firebase from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics

// Add Firebase products that you want to use
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js'
const auth = getAuth(firebaseApp);
onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        window.location.replace("./admin.html");
        // ...
    } else {
        // User is signed out
        // ...
    }
});
$(document).ready(function () {
    $('#regBtn').on('click', function (e) {
        register();
    })

    const auth = getAuth();
    function register() {
        const email = $('#emailtf').val();
        const passswd = $('#passswd').val();
        const cfpass = $('#cfpass').val();
    }
})
