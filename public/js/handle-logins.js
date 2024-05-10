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
  $('#loginBtn').on('click', function (e) {
    login();
  })

  const auth = getAuth();
  function login() {

    var email = $('#emailtf').val();
    var passswd = $('#passswd').val();
    loadToast("Signing in...", "Signing in with " + email);
    // $('#passTextField').val("123123123123");

    // console.log("pass1" + ": " + passswd);

    signInWithEmailAndPassword(auth, email, passswd)
      .then(function (result) {
        hideToast();
        // Sign-in successful.
        console.log("Sign-in successful.");
        // alert("Sign-in successful");
        // window.location.replace("./all_components.php");
      })
      .catch(function (error) {
        hideToast();
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + ": sss" + errorMessage);
        // alert(errorMessage);
        if (errorCode === 'auth/wrong-password') {
          showAlert("Oops!", "Password or username is incorrect", "CLOSE", "OK", null, null);
        } else if (errorCode === 'auth/user-not-found') {
          showAlert("Oops!", "Password or username is incorrect or this account doesn't exist", "CLOSE", "OK", null, null);
        }
        else if (errorCode === "auth/invalid-email") {
          showAlert("Oops!", "Please provide an acceptable email", "CLOSE", "OK", null, null);
        }
        else {
          showAlert("Error", "Please check logs to view error details", "CLOSE", "OK", null, null);
          console.log("Error", errorMessage);
        }
      });
  }
})