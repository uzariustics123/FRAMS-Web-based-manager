import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import { firebaseConfig } from './FirebaseConfigs.js'
import {getDevTab , loadEmployeesTab, loadAttendanceTab} from './tab-containers.js';
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {loadResetPin} from './reset-pincode.js';
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js'
const auth = getAuth(firebaseApp);
const db = firebaseApp.firestore;
onAuthStateChanged(firebaseAuth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;

    // ...
  } else {
    // User is signed out
    // ...
    window.location.replace("./index.html");
  }
});
$(document).ready(() => {
  loadEmployeesTab(document.querySelector("#main-container"));
  $("#drawer-close-btn").on('click', () => {
    if ($('#sidebar').hasClass('closed')) {
      $('#sidebar').removeClass('closed');
      $('#sidebar-list-menu').removeClass('closed');
      $('#drawer-close-btn').removeClass('closed');
        // $('.sidebar-logo').html("Face Recognition Attendance Management System");
        animateTypingText(document.querySelector('.sidebar-logo'), 'Face Recognition Attendance Management System');
      
      $('#drawer-close-btn').html("chevron_left");
      $('.sidebar-icon-menu').addClass('hidden');
    } else {
      $('#sidebar').addClass('closed');
      $('#sidebar-list-menu').addClass('closed');
      $('#drawer-close-btn').addClass('closed');
      $('.sidebar-logo').html("FRAMS");
      $('#drawer-close-btn').html("chevron_right");
      $('.sidebar-icon-menu').removeClass('hidden');                             
    }
  })

  $('.sidebar-list-item .item').each(function (index) {
    $(this).on('click', function () {
      if ($(this).attr('id') === 'logout-btn-list') {

      } else {
        $('.sidebar-list-item .item').removeClass('active-item');
        $('.sidebar-icon-menu-item .btn').removeClass('active');
        $(this).addClass('active-item');
        $('#' + $('.sidebar-icon-menu-item .btn').get(index).id).addClass('active');
      }

    });
  });
  
  $('.sidebar-icon-menu-item .btn').each(function (index) {
    $(this).on('click', function () {
      if ($(this).attr('id') === 'logout-btn') {

      } else {
        $('.sidebar-list-item .item').removeClass('active-item');
        $('.sidebar-icon-menu-item .btn').removeClass('active');
        $(this).addClass('active');
        $('#' + $('.sidebar-list-item .item').get(index).id).addClass('active-item');
      }

    });
  });


  $('#logout-btn').click(function () {
    showAlert('Log out', "Are you sure you want to log out?", "Yes", "Cancel", () => {
      firebaseAuth.signOut()
        .then(() => {
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
          alert(error.message);
        });
    }, () => {

    });
    // alert('asdwdasdw');
  });
  $('#logout-btn-list').click(function () {
    showAlert('Log out', "Are you sure you want to log out?", "Yes", "Cancel", () => {
      firebaseAuth.signOut()
        .then(() => {
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
          alert(error.message);
        });
    }, () => {

    });
    // alert('asdwdasdw');
  });

    $('#devices-btn').click(function () {
    getDevTab(document.querySelector("#main-container"));
  });
  $('#devices-btn-list').click(function () {
    getDevTab(document.querySelector("#main-container"));
  });


  $('#employee-btn').click(function () {
    loadEmployeesTab(document.querySelector("#main-container"));
  });
  $('#employee-btn-list').click(function () {
    loadEmployeesTab(document.querySelector("#main-container"));
  });

  $('#attendances-btn').click(function () {
    window.location.href = '../monthly-dtr.html';
  });
  $('#attendances-btn-list').click(function () {
    window.location.href = '../monthly-dtr.html';
  })
  $('#pin-btn').click(function () {
    loadResetPin(document.querySelector("#main-container"));
  });
  $('#pin-btn-list').click(function () {
    loadResetPin(document.querySelector("#main-container"));
  });



})

function animateTypingText(textElement, textToType){
  let index = 0;
  textElement.textContent = '';
  function typeText() {
    if (index < textToType.length) {
      textElement.textContent += textToType.charAt(index);
      index++;
      setTimeout(typeText, 5); // Adjust the delay (in milliseconds) as needed
    }
  }
  typeText();
  
}