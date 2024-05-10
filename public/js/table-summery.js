import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import { firebaseConfig } from './FirebaseConfigs.js'
import { getFirestore, collection, doc, setDoc, getDocs, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { loadSpinner } from './loader-module.js';
import { dangerAlert, noteAlert } from './dismissableAlerts.js';



const firebaseApp = initializeApp(firebaseConfig);
let mainContainer;
const db = getFirestore(firebaseApp);
const devicesDB = collection(db,'devices');
const empRefDB = collection(db,'employees');
const empAttRef = collection(db,'attendance');
const parser = new DOMParser();
let formattedDate = '';
const employeesMaps = new Map();
let currentDate = new Date();
let day = currentDate.getDate();
let month = currentDate.getMonth();
let year = currentDate.getFullYear();
let theader = document.createElement('thead');
let tbody = document.createElement('tbody');
let datepickbtn;
const options = { 
  year: 'numeric',
  month: 'long',
  day: '2-digit'
  };
let loadingIcon = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
const tableElm = document.createElement('table');
let defaultTable;
tableElm.classList.add('table', 'shadow-soft', 'rounded');

const dateChooser = document.createElement('div');
dateChooser.classList.add('input-group','input-group-border');
dateChooser.innerHTML =  '<div class="input-group-prepend">'+
                            '<span class="input-group-text">'+
                              '<span class="far fa-calendar-alt"></span>'+
                            '</span>'+
                          '</div>'+
                          '<input class="form-control datepicker" id="datePickerInput" data-date-format="MM d, yyyy" placeholder="Choose date" type="text">'+
                          '<span class="input-group-text animate-right-3 date-go">'+
                              '<span id="datepick" class="date-go">GO</span>'+
                            '</span>';

getDocs(empRefDB).then((querySnapshot) => {
  querySnapshot.forEach((document)=>{
    const documentData = document.data();
    employeesMaps.set(document.id, documentData);
    // console.log("emp-id: "+document.id +" "+ JSON.stringify(documentData));
  });
}).catch((error)=>{

});



export function loadTable(container){
  mainContainer = container;
  tableElm.innerHTML = '';
  formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
  // console.log(formattedDate);
//   console.log('day:'+day);
// console.log('month:'+month);
// console.log('year:'+year);
    tableElm.appendChild(theader);
    tableElm.appendChild(tbody);
    mainContainer.replaceChildren(tableElm);
    initHeader();
    initDateChooser();
    
}

function initHeader(){
    theader.innerHTML = '';
    const rowHeader = document.createElement('tr');
    const rowHeaderTitle = document.createElement('th');
    rowHeaderTitle.classList.add('border-0', 'text-center');
    rowHeaderTitle.colSpan = 6;
    rowHeaderTitle.textContent = 'Employee Time Records';
    const rowDate = document.createElement('th');
    rowDate.classList.add('border-0', 'attDate');
  
    rowDate.textContent = formattedDate;
    
    rowHeader.appendChild(rowHeaderTitle);
    rowHeader.appendChild(rowDate);
  
    const rowHeader2 = document.createElement('tr');
    const rowFname = document.createElement('th');
    const rowMname = document.createElement('th');
    const rowLname = document.createElement('th');
    const rowAMIN = document.createElement('th');
    const rowAMOUt = document.createElement('th');
    const rowPMIN = document.createElement('th');
    const rowPMOUT = document.createElement('th');
  
    rowFname.textContent = 'First Name';
    rowMname.textContent = 'Middle Name';
    rowLname.textContent = 'Last Name';
    rowAMIN.textContent = 'AM-In';
    rowAMOUt.textContent = 'AM-Out';
    rowPMIN.textContent = 'PM-In';
    rowPMOUT.textContent = 'PM-Out';
  
    rowHeader2.appendChild(rowFname);
    rowHeader2.appendChild(rowMname);
    rowHeader2.appendChild(rowLname);
    rowHeader2.appendChild(rowAMIN);
    rowHeader2.appendChild(rowAMOUt);
    rowHeader2.appendChild(rowPMIN);
    rowHeader2.appendChild(rowPMOUT);
  
  theader.appendChild(rowHeader);
  theader.appendChild(rowHeader2);
  }

  function initDateChooser(){
    const card = document.createElement('div');
    card.classList.add('card', 'shadow-soft', 'p-4', 'mb-5');
    card.replaceChildren(dateChooser);
    tableElm.insertAdjacentElement('beforebegin', card);
    $('.datepicker').datepicker({
      disableTouchKeyboard: true,
      autoclose: false
  });
    datepickbtn = document.querySelector('.date-go');
    let datePickerInput = document.querySelector('#datePickerInput');

    datepickbtn.addEventListener('click', function(){
        const selectedDate = datePickerInput.value;
        const dateString = selectedDate;
        const dateObject = new Date(dateString);

        if (!isNaN(dateObject)) {
            let day = dateObject.getDate();
            let month = dateObject.getMonth();
            let year = dateObject.getFullYear();
            console.log('day:'+day);
            console.log('month:'+month);
            console.log('year:'+year);
            let attDate = document.querySelector('.attDate');
            attDate.textContent = datePickerInput.value;
            console.log("selected date: "+selectedDate);
            datepickbtn.innerHTML = loadingIcon;
            getAttendances(day, month+1, year);
        } else {
        console.log('Invalid date string');
        }
        
    });
  }
function getAttendances(day, month, year){
  let attendanceMap = {};
  const queryEmps = query(empAttRef, where('month', '==', month),
    where('day', '==', day),
    where('year', '==', year));
    // console.log('month:', month, 'day', day, 'year', year);
  getDocs(queryEmps).then((querySnapshot)=> {
    // console.log('querySnapshot', querySnapshot);
    // console.log('query', queryEmps);
    
    querySnapshot.forEach((document)=>{
      const documentData = document.data();
      const empID = documentData['employee-id'];
      // console.log('empID', empID);
      if( empID in attendanceMap){
        attendanceMap[empID].push(documentData);
      }else{
        let newAttList = [];
        newAttList.push(documentData);
        attendanceMap[empID] =  newAttList;
      }
    });
    
    datepickbtn.innerHTML = '<span id="datepick" class="date-go">GO</span>'; 
    // console.log('wtf');
    console.log('attendanceMap: '+JSON.stringify(attendanceMap));
    getAttendanceTdRows(attendanceMap);
    // console.log('attendanceMap', attendanceMap);
  }).catch((error)=>{
  console.log('error: '+error);
  });


}

function getAttendanceTdRows(attendanceMap){
  // console.log('attendanceMap'.attendanceMap);
  tbody.innerHTML = '';
  for( const [empIdKey, value] of employeesMaps){
    // console.log('empIdKey',empIdKey);
    let tableRow = document.createElement('tr');
    tableRow.id = empIdKey;
    let firstNameTd = document.createElement('td');
    let midNameTd = document.createElement('td');
    let lastNameTd = document.createElement('td');
    let AmInTD = document.createElement('td');
    let AmOutTD = document.createElement('td');
    let PmInTD = document.createElement('td');
    let PmOutTD = document.createElement('td');

    let schedAMinTime = convertTimeStringToDate(value['am-in-time']);
    let schedAMoutTime = convertTimeStringToDate(value['am-out-time']);
    let schedPMinTime = convertTimeStringToDate(value['pm-in-time']);
    let schedPMoutTime = convertTimeStringToDate(value['pm-out-time']);

    firstNameTd.textContent = value.firstname;
    midNameTd.textContent = value.middlename;
    lastNameTd.textContent = value.lastname;

    AmInTD.textContent = '--:-- --';
    AmOutTD.textContent = '--:-- --';
    PmInTD.textContent = '--:-- --';
    PmOutTD.textContent = '--:-- --';
    let atts = attendanceMap[empIdKey];
    console.log(empIdKey, atts);

    if(!(typeof atts === 'undefined'))
      atts.forEach((attendance)=>{
        let type = attendance.type;
        let timeStr = attendance.time;
        const comparableTime = convertTimeStringToDate(timeStr);
        console.log('time', comparableTime);
        console.log('attendance', attendance);
        if (timeStr.includes("AM") && type === "arrival") {
          AmInTD.textContent = timeStr;
          //late calc
        }
        else if (timeStr.includes("AM") || (comparableTime > schedAMoutTime && comparableTime < schedPMinTime) && type === "departure") {
          AmOutTD.textContent = timeStr;
        }
        //pm in
        else if (timeStr.includes("PM") && type === "arrival") {
          PmInTD.textContent = timeStr;
        }
        //out pm
        else if (timeStr.includes("PM") && type === "departure") {
          PmOutTD.textContent = timeStr;
        }
      });
    tableRow.appendChild(firstNameTd);
    tableRow.appendChild(midNameTd);
    tableRow.appendChild(lastNameTd);

    tableRow.appendChild(AmInTD);
    tableRow.appendChild(AmOutTD);
    tableRow.appendChild(PmInTD);
    tableRow.appendChild(PmOutTD);
    tbody.appendChild(tableRow);
    // console.log('added');
  }
  
}

function convertTimeStringToDate(timeString) {
  // Split the time string into hours, minutes, and AM/PM
  const [time, ampm] = timeString.split(' ');

  // Split the hours and minutes
  const [hours, minutes] = time.split(':').map(Number);

  // Convert 12-hour time to 24-hour time
  const hours24 = (hours % 12) + (ampm.toUpperCase() === 'PM' ? 12 : 0);

  // Create a Date object with the current date and the parsed time
  const currentDate = new Date();
  const convertedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours24, minutes);

  return convertedDate;
}
