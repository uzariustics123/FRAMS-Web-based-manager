import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import { firebaseConfig } from './FirebaseConfigs.js'
import { getFirestore, collection, doc, addDoc, getDocs , getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { loadSpinner } from './loader-module.js';
import { dangerAlert, noteAlert, successAlert } from './dismissableAlerts.js';
import { loadTable } from './table-summery.js';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
let mainContainer;
const regex = /^[0-9]+$/;

let modalEdit;
let idnumberinp;
let emailinp;
let firstnameinp;
let midnameinp;
let lastnameinp;
let nameTitle;
let amInInput;
let amOutInput;
let pmInInput;
let pmOutInput;
let saveChangesBtn;
let hasChanges = false;
let empid;
let currentEmployeeData;
let type;

let bodyelem = document.querySelector('body');
let emptyDiv = document.createElement('div');
// emptyDiv.innerHTML = modalContainer;
// try {
//     $(document.body).append(modalContainer);
//     // console.log('succ' , emptyDiv.firstChild);
// } catch (error) {
//     alert(error);
// }
document.addEventListener('DOMContentLoaded', (event) => {
    
  });
export function newEmployee(){
    type = type;
    currentEmployeeData = {};
    emailinp = document.querySelector('#emailinp');
    idnumberinp = document.querySelector('#idnumber');
    firstnameinp = document.querySelector('#firstnameinp');
    midnameinp = document.querySelector('#midnameinp');
    lastnameinp = document.querySelector('#lastnameinp');
    
    amInInput = document.querySelector('#amInInput');
    amOutInput = document.querySelector('#amOutInput');
    pmInInput = document.querySelector('#pmInInput');
    pmOutInput = document.querySelector('#pmOutInput');
    nameTitle = document.querySelector('#emp-name');
    saveChangesBtn = document.querySelector('#saveChangesBtn'); 
    $("#modal-edit-emp").modal("show");

    idnumberinp.value = '';
    emailinp.value = '';
    firstnameinp.value = '';
    midnameinp.value = '';
    lastnameinp.value = '';

    amInInput.value = formatTimeInputValue('8:00 AM');
    amOutInput.value = formatTimeInputValue('12:00 PM');
    pmInInput.value = formatTimeInputValue('1:00 PM');
    pmOutInput.value = formatTimeInputValue('5:00 PM');

    setOnchangeEvent(emailinp);
    setOnchangeEvent(idnumberinp);
    setOnchangeEvent(firstnameinp);
    setOnchangeEvent(midnameinp);
    setOnchangeEvent(lastnameinp);

    setOnchangeEvent(amInInput);
    setOnchangeEvent(amOutInput);
    setOnchangeEvent(pmInInput);
    setOnchangeEvent(pmOutInput);
    saveChangesBtn.textContent = 'Save New Employee';
    saveChangesBtn.addEventListener('click', (event)=>{
        saveChanges();
    })
}
function setOnchangeEvent(inpelement){
    inpelement.addEventListener('change', (event)=>{
        let value = event.target.value;
        console.log('val', value);
        hasChanges = true;
        saveChangesBtn.disabled = false;
    });
}
function saveChanges(){
    if(hasChanges){
        let emailStr = emailinp.value;
        let idnumberStr = idnumberinp.value;
        let firstnameStr = firstnameinp.value;
        let midnameStr = midnameinp.value;
        let lastnameStr = lastnameinp.value;
        let amintime = convertToAMPMFormat(amInInput.value);
        let amouttime = convertToAMPMFormat(amOutInput.value);
        let pmintime = convertToAMPMFormat(pmInInput.value);
        let pmouttime = convertToAMPMFormat(pmOutInput.value);

        currentEmployeeData['id-number'] = idnumberStr;
       currentEmployeeData['email'] = emailStr;
       currentEmployeeData['firstname'] = firstnameStr;
       currentEmployeeData['middlename'] = midnameStr;
       currentEmployeeData['lastname'] = lastnameStr;
       currentEmployeeData['am-in-time'] = amintime;
       currentEmployeeData['am-out-time'] = amouttime;
       currentEmployeeData['pm-in-time'] = pmintime;
       currentEmployeeData['pm-out-time'] = pmouttime;


       proceedSaveEmployee();
    }
}
function proceedSaveEmployee(){
    currentEmployeeData['face_data'] = 'unregistered';
    currentEmployeeData['smile_face_data'] = 'unregistered';
    console.log('currentEmployeeData', currentEmployeeData);
    let empDocRef = collection(db, 'employees');
    addDoc(empDocRef, currentEmployeeData).then(()=>{
        $("#modal-edit-emp").modal("hide");
        succesToast('Employee saved', 'new employee has been added');
    }).catch(error=>{
        $("#modal-edit-emp").modal("hide");
        errorToast('Error', error);
    });
}
function formatTimeInputValue(givenTimeStr) {
    // Parse the time string
    const parsedTime = new Date('2000-01-01 ' + givenTimeStr);
  
    // Get hours and minutes separately
    const hours = parsedTime.getHours().toString().padStart(2, '0');
    const minutes = parsedTime.getMinutes().toString().padStart(2, '0');
  
    // Return the formatted value
    return `${hours}:${minutes}`;
  }

  function convertToAMPMFormat(timeValue) {
    // Parse the time value
    const parsedTime = new Date(`2000-01-01T${timeValue}`);
  
    // Get hours and minutes separately
    const hours = parsedTime.getHours().toString().padStart(2, '0');
    const minutes = parsedTime.getMinutes().toString().padStart(2, '0');
  
    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    const formattedHours = (hours % 12) || 12;
  
    // Return the formatted time in "hh:mm AM/PM" format
    return `${formattedHours}:${minutes} ${ampm}`;
  }


                


