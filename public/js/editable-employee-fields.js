import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import { firebaseConfig } from './FirebaseConfigs.js'
import { getFirestore, collection, doc, setDoc, getDocs , getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { loadSpinner } from './loader-module.js';
import { dangerAlert, noteAlert, successAlert } from './dismissableAlerts.js';
import { loadTable } from './table-summery.js';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
let mainContainer;
const regex = /^[0-9]+$/;
let modalContainer = '<div class="modal fade" id="modal-edit-emp" tabindex="-1" role="dialog" aria-labelledby="modal-edit-emp" aria-model="true">'+
                        '<div class="modal-dialog modal-dialog-centered" role="document">'+
                            '<div class="modal-content">'+
                                '<div class="modal-body p-0">'+
                                    '<div class="card bg-primary shadow-soft border-light p-4">'+
                                        '<button type="button" class="close ml-auto" data-bs-dismiss="modal" aria-label="Close">'+
                                            '<span aria-hidden="true">×</span>'+
                                        '</button>'+
                                        '<div class="card-header text-center pb-0">'+
                                        '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4lQHH4lXf8gt-fEpRHuQPB4N8l5VgYHYezg&usqp=CAU" style="width:100px; height:100px; border-radius: 20px;" />'+
                                            '<h2 id="emp-name" class="h4">Employee Name</h2>'+
                                            '<span>Employee details</span>'+
                                        '</div>'+
                                    '<div class="card-body">'+

                                        '<div class="form-group">'+
                                            '<label for="idnumber">ID Number</label>'+
                                            '<div class="input-group mb-4">'+
                                                '<div class="input-group-prepend">'+
                                                    '<span class="input-group-text"><span class="fas fa-user"></span></span>'+
                                                '</div>'+
                                                '<input class="form-control" id="idnumber" placeholder="" type="text" required />'+
                                            '</div>'+
                                        '</div>'+
                                        
                                            '<div class="form-group">'+
                                                '<label for="emailinp">email</label>'+
                                                '<div class="input-group mb-4">'+
                                                    '<div class="input-group-prepend">'+
                                                        '<span class="input-group-text"><span class="fas fa-envelope"></span></span>'+
                                                    '</div>'+
                                                    '<input class="form-control" id="emailinp" placeholder="" type="text" required />'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="form-group">'+
                                                '<label for="firstnameinp">First Name</label>'+
                                                '<div class="input-group mb-4">'+
                                                    '<div class="input-group-prepend">'+
                                                        '<span class="input-group-text"><span class="fas fa-user"></span></span>'+
                                                    '</div>'+
                                                    '<input class="form-control" id="firstnameinp" placeholder="" type="text" required />'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="form-group">'+
                                                '<label for="midnameinp">Middle Name</label>'+
                                                '<div class="input-group mb-4">'+
                                                    '<div class="input-group-prepend">'+
                                                        '<span class="input-group-text"><span class="fas fa-user"></span></span>'+
                                                    '</div>'+
                                                    '<input class="form-control" id="midnameinp" placeholder="" type="text" required />'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="form-group">'+
                                                '<label for="lastnameinp">Last Name</label>'+
                                                '<div class="input-group mb-4">'+
                                                    '<div class="input-group-prepend">'+
                                                        '<span class="input-group-text"><span class="fas fa-user"></span></span>'+
                                                    '</div>'+
                                                    '<input class="form-control" id="lastnameinp" placeholder="" type="text" required />'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="col-12">'+
                                                '<div class="row align-items-center">'+
                                                    '<div class="col">'+
                                                        '<label class="h6" for="amInInput">AM In</label>'+
                                                        '<div class="form-group">'+
                                                            '<div class="input-group input-group-border">'+
                                                                // '<div class="input-group-prepend"><span class="input-group-text"><span class="far fa-clock"></span></span></div>'+
                                                                '<input class="form-control" id="amInInput" placeholder="Start time" type="time"/>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="col">'+
                                                        '<div class="form-group">'+
                                                            '<label class="h6" for="amOutInput">AM out</label>'+
                                                            '<div class="input-group input-group-border">'+
                                                                // '<div class="input-group-prepend"><span class="input-group-text"><span class="far fa-clock"></span></span></div>'+
                                                                '<input class="form-control" id="amOutInput" value="11:02 am" placeholder="End time" type="time"/>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="col-12">'+
                                                '<div class="row align-items-center">'+
                                                    '<div class="col">'+
                                                        '<label class="h6" for="pmInInput">PM In</label>'+
                                                        '<div class="form-group">'+
                                                            '<div class="input-group input-group-border">'+
                                                                // '<div class="input-group-prepend"><span class="input-group-text"><span class="far fa-clock"></span></span></div>'+
                                                                '<input class="form-control" id="pmInInput" placeholder="Start time" type="time"/>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="col">'+
                                                        '<div class="form-group">'+
                                                            '<label class="h6" for="pmOutInput">PM out</label>'+
                                                            '<div class="input-group input-group-border">'+
                                                                // '<div class="input-group-prepend"><span class="input-group-text"><span class="far fa-clock"></span></span></div>'+
                                                                '<input class="form-control" id="pmOutInput" placeholder="End time" type="time"/>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                            '<button id="saveChangesBtn" disabled class="btn btn-block btn-primary"> Save Changes </button>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';

let modalEdit;
let emailinp;
let idnumberinp;
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

let bodyelem = document.querySelector('body');
let emptyDiv = document.createElement('div');
// emptyDiv.innerHTML = modalContainer;
try {
    $(document.body).append(modalContainer);
    // console.log('succ' , emptyDiv.firstChild);
} catch (error) {
    alert(error);
}
document.addEventListener('DOMContentLoaded', (event) => {
    
  });
export function editEmployee(employeeData, uid){
    currentEmployeeData = employeeData;
    empid = uid;
    console.log(uid);
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
    
    nameTitle.textContent = employeeData.firstname + ' ' + employeeData.lastname;
    emailinp.value = employeeData['email'];
    idnumberinp.value = employeeData['id-number'];
    firstnameinp.value = employeeData['firstname'];
    midnameinp.value = employeeData['middlename'];
    lastnameinp.value = employeeData['lastname'];

    amInInput.value = formatTimeInputValue(employeeData['am-in-time']);
    amOutInput.value = formatTimeInputValue(employeeData['am-out-time']);
    pmInInput.value = formatTimeInputValue(employeeData['pm-in-time']);
    pmOutInput.value = formatTimeInputValue(employeeData['pm-out-time']);

    setOnchangeEvent(emailinp);
    setOnchangeEvent(idnumberinp);
    setOnchangeEvent(firstnameinp);
    setOnchangeEvent(midnameinp);
    setOnchangeEvent(lastnameinp);

    setOnchangeEvent(amInInput);
    setOnchangeEvent(amOutInput);
    setOnchangeEvent(pmInInput);
    setOnchangeEvent(pmOutInput);

    saveChangesBtn.textContent = 'Save Changes';
    saveChangesBtn.addEventListener('click', (event)=>{
        saveChanges();
    })
}
function setOnchangeEvent(inpelement){
    inpelement.addEventListener('change', (event)=>{
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
function proceedSaveEmployee(newPin){
    console.log('currentEmployeeData', currentEmployeeData);
    let empDocRef = doc(db, 'employees', empid);
    setDoc(empDocRef, currentEmployeeData).then(()=>{
        $("#modal-edit-emp").modal("hide");
        succesToast('Employee updated', 'changes has been saved');
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


                


