import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import { firebaseConfig } from './FirebaseConfigs.js'
import { getFirestore, collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { loadSpinner } from './loader-module.js';
import { dangerAlert, noteAlert, successAlert } from './dismissableAlerts.js';
import { loadTable } from './table-summery.js';
import { editEmployee } from './editable-employee-fields.js';
import { newEmployee } from './new-employee-fields.js';


let mainContainer;
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const devicesDB = collection(db,'devices');
const empRefDB = collection(db,'employees');
const parser = new DOMParser();
let accordion = document.createElement('div');
let devicesIds = [];
let employeesMap = {};
accordion.classList.add('accordion', 'shadow-soft', 'rounded');
let devicesData = new Map();

const emptyAnim = parser.parseFromString( "<dotlottie-player src='https://lottie.host/df219d8b-8c14-4eb5-8346-0e4d53868adc/6PF9WBiV8f.json' background='transparent' speed='1' style='width: 300px; height: 300px;' loop autoplay></dotlottie-player></dotlottie-player>", 'text/html');
const errorAnim = document.createElement('div');
errorAnim.innerHTML = "<dotlottie-player src='https://lottie.host/df219d8b-8c14-4eb5-8346-0e4d53868adc/6PF9WBiV8f.json' background='transparent' speed='1' style='width: 300px; height: 300px;' loop autoplay></dotlottie-player></dotlottie-player>";
  
export function getDevTab(container) {
 accordion.innerHTML = loadSpinner("Getting devices");
 let devicesItem = "";
 container.replaceChildren(accordion);
 console.log('getting data');
      getDocs(devicesDB).then((querySnapshot) => {
        devicesIds = [];
        querySnapshot.forEach((doc) => {
          // Access data for each document
          const documentData = doc.data();
          const deviceId = documentData['device-id']; 
          const deviceName = documentData['device-name']; 
          const deviceModel = documentData['device-model']; 
          const deviceLoc = documentData['location']; 
          const deviceStatus = documentData['status']; 
          devicesItem += addDeviceItem(deviceId, deviceName, deviceModel, deviceLoc, deviceStatus);
          console.log(deviceId+','+deviceName+','+deviceModel+','+deviceModel);
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
          devicesIds.push(doc.id);
          devicesData.set(deviceId, doc);
        });
        console.log('Data retrieval successful');
        accordion.innerHTML = devicesItem;
        
      })
      .catch((error) => {
        console.error('Error retrieving data:', error);
        accordion.innerHTML = dangerAlert('Oh snap!', 'Change a few things up and try again.');
      });
      container.replaceChildren(accordion);
      
const doc = parser.parseFromString(noteAlert('Note:', 'This is the list of all devices that installed the Face Recognition App. Some of these devices needs your verification before it can be used or work as it intended. Be careful when verifying a device as it may not be an authorize device for the Face Recognition App.'), 'text/html');
const noteElement = doc.body.firstChild;
      container.insertAdjacentElement('afterbegin', noteElement)
      // setDeviceClickEvents(devicesIds);
    };


    function addDeviceItem(deviceId, deviceName, deviceModel, location, status){
      let show = 'show';
      let verifyBtn = "<button id='btn-"+deviceId+"' class='btn btn-primary text-success' type='button' aria-label='Verify device' title='Verify device'>Verify Device</button>";
      if (status === 'verified'){
        verifyBtn = "";
        show = ''
      }else{
        show = "show";
        let collapsed = '';
        expanded = 'true';
      }
      return "<div class='card card-sm card-body bg-primary border-light mb-0'>"+
      "<a href='#"+deviceId+"' data-bs-target='#"+deviceId+"' class='accordion-panel-header text-center' data-bs-toggle='collapse' role='button' aria-expanded='false' aria-controls='"+deviceId+"'>"+
      "<span class='icon-title h6 mb-0 font-weight-bold'><span class='fas fa-tablet'></span>  "+deviceName+"</span>"+
        "<span class='icon'><span class='fas fa-plus'></span></span>"+
      "</a>"+
      "<div class='collapse "+show+"' id='"+deviceId+"'>"+
      "<div class='pt-3'>"+
      "<p class='mb-0'>id: "+deviceId+"</p>"+
      "<p class='mb-0'>model: "+deviceModel+"</p>"+
      "<p class='mb-0'>location: "+location+"</p>"+
      "<p class='mb-0'>status: "+status+"</p>"+
        "<div class='btn-wrapper my-4'>"+
        verifyBtn+
    "</div>"+
      "</div>"+
      "</div>"+
      "</div>";
    }
     
function setDeviceClickEvents(stringArray){
  stringArray.forEach((element, index) => {
    // document.querySelector("btn-"+deviceId).addEventListener('click', function(){
    //       console.log("click device id");
    // });
  });
}

//employee funcs
export function loadEmployeesTab(container){
  mainContainer = container;
//  accordion.innerHTML = addStudentItem('asdfef','john', 'wick','connor');
//  container.replaceChildren(accordion);
  loadEmpsList(container);
}

async function loadEmpsList(container){
  accordion.innerHTML = '';
  accordion.innerHTML = loadSpinner("Loading Employees...");
  let emps = '';
  container.replaceChildren(accordion);
  getDocs(empRefDB).then((querySnapshot) => {
    querySnapshot.forEach((document)=>{
      const documentData = document.data();
      employeesMap[document.id] = documentData;
      const firstname = documentData['firstname'];
      const lastname = documentData['lastname'];
      const middlename = documentData['middlename'];
      const email = documentData['email'];
      emps += addEmployeeItem(document.id, firstname, lastname, middlename, email);
    });

    accordion.innerHTML = emps;
    container.replaceChildren(accordion);
    loadAddEmpBtn(container);
    loadNoteEmpTab(container);
    setEmployeeBtnEvents();
  }).catch((error) => {
      accordion.innerHTML = dangerAlert('Oh snap! ', 'Something went wrong try again');
      accordion.appendChild(errorAnim);
      console.log(JSON.stringify(error));
      console.log(error);
  });
  
}
export function loadAttendanceTab(container){
  loadTable(container);
}
function loadNoteEmpTab(container){
  const noticeEmpTab = parser.parseFromString(noteAlert("Note: ", "Editing or updating Face Recognition Data of an employee here in the web is not possible since the algorithm requires an android device that needs deep processing calculation and resources of the new face data. Since our algorithm runs in android platform and is the main reason why we chose this platform because it's convenient, fast and offers a lot of features, it is recommended to use the android device with our Face Recognition App installed."), 'text/html');
 container.insertAdjacentElement("afterbegin", noticeEmpTab.body.firstChild);
}
function loadAddEmpBtn(container){
  let addBtn = document.createElement('button');
  addBtn.classList.add('btn', 'btn-primary','addbtn');
  addBtn.innerHTML = "<span class='mr-1'><span class='fas fa-plus'></span></span>Add Employee";
  container.appendChild(addBtn);
  addBtn.addEventListener('click', (element, event)=>{
    newEmployee();
  })
}

function addEmployeeItem(employeeId, firstname, lastname, middlename, email){
  let viewAttendanceBtn = "<a href='/employee-dtr.html?uid="+employeeId+"' target='_blank' id='btn-view-attendance' data-id='"+ employeeId +"' class='btn-view-attendance btn btn-primary m-1' type='button' title='Verify device'><span class='mr-1'><span class='fas fa-book-open'></span></span>View Attendance</a>";
  let editEmpDetailsBtn = "<button data-id='"+ employeeId +"' class=' btn-edit-details btn btn-primary m-1' type='button' title='Edit Employee'><span class='mr-1'><span class='fas fa-edit'></span></span>Edit Employee Details</button>";
  let deleteEmpBtn = "<button data-id='"+ employeeId +"' class='btn-delete-emp btn btn-primary m-1 text-danger' type='button' title='Delete Employee'><span class='mr-1'><span class='fas fa-trash'></span></span>Delete Employee</button>";
  let retakeBtn = "<button id='btn-retake-btn-"+employeeId+"' disabled class='btn btn-primary m-1' type='button' title='Available only with the android app'><span class='mr-1'><span class='fas fa-face'></span></span>Retake Face Data</button>";
  
  return "<div class='card card-sm card-body bg-primary border-light mb-0'>"+
  "<a href='#"+employeeId+"' data-bs-target='#"+employeeId+"' class='accordion-panel-header text-center' data-bs-toggle='collapse' role='button' aria-expanded='false' aria-controls='"+employeeId+"'>"+
  "<span class='icon-title h6 mb-0 font-weight-bold'><span class='fas fa-user'></span>  "+firstname+" "+ lastname+"</span>"+
    "<span class='icon'><span class='fas fa-plus'></span></span>"+
  "</a>"+
  "<div class='collapse' id='"+employeeId+"'>"+
  "<div class='pt-3'>"+
    "<div class='btn-wrapper my-4'>"+
    viewAttendanceBtn+
    editEmpDetailsBtn+
    retakeBtn+
    deleteEmpBtn+
  "</div>"+
  "</div>"+
  "</div>"+
  "</div>";
}

function setEmployeeBtnEvents(){
  let viewAttendanceBtn = document.querySelectorAll('.btn-view-attendance');
  viewAttendanceBtn.forEach(element=>{
      element.addEventListener('click', (element, event)=>{
        let emp_id = element.target.dataset.id;
        let destinedUrl = './table-summery.js?uid='+emp_id;
      })
    });

    let editEmpDetailsBtn = document.querySelectorAll('.btn-edit-details');
    editEmpDetailsBtn.forEach(element=>{
      element.addEventListener('click', (element, event)=>{
        let emp_id = element.target.dataset.id;
        // console.log('clicked edit ', emp_id, employeesMap[emp_id], 'emp map',employeesMap);
        editEmployee(employeesMap[emp_id], emp_id);
      })
    });

    let deleteEmpBtn = document.querySelectorAll('.btn-delete-emp');
    deleteEmpBtn.forEach(element=>{
      element.addEventListener('click', (element, event)=>{
        let emp_id = element.target.dataset.id;
        console.log('clicked delete emp id', emp_id);
        deleteEmployee(emp_id, employeesMap[emp_id]['firstname'] +' '+employeesMap[emp_id]['lastname']);
      })
    });
}

function deleteEmployee(empId, name){
  let docRef = doc(db, 'employees', empId);
  showAlert('Delete Employee', 'are you sure you want to delete '+name+'?', 'yes', 'cancel', ()=>{
    loadToast('Deleting Employee', 'Pease wait...', '');
    deleteDoc(docRef)
    .then(() => {
      hideToast();
      console.log('Document successfully deleted!');
      // const noticeEmpTab = parser.parseFromString(successAlert("Success:", "Employee successfully deleted!"), 'text/html');
      // container.insertAdjacentElement("afterbegin", noticeEmpTab.body.firstChild);
    })
    .catch((error) => {
      console.error('Error deleting document: ', error);
      const noticeEmpTab = parser.parseFromString(dangerAlert("Error:", error), 'text/html');
      container.insertAdjacentElement("afterbegin", noticeEmpTab.body.firstChild);
    });
  }, ()=>{

  });
  
}
function deleteAttendanceData(empID){
  // let docRef = doc(db, 'attendances', empId);
  const attendanceRef = collection(db, 'attendance');
  const queryConditions = query(db, where('employee-id', '==', 'empID'));
}