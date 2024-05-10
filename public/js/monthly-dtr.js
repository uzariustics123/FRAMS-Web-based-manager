import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import { firebaseConfig } from './FirebaseConfigs.js'
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js'

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

let employeesMap;
let dateElem;
let timeSched;
let printBtn;
let monthSelect;
let yearSelect;
let attendances = [];
const options = { 
    year: 'numeric',
    month: 'long',
    day: '2-digit'
    };
let dateObject = new Date();
let day = dateObject.getDate();
let formattedDate;
let empRefDB = collection(db,'employees');
const empAttRef = collection(db,'attendance');
// const urlString = window.location.search;
// const urlParams = new URLSearchParams(urlString);
// let uid = urlParams.get('uid');

document.addEventListener('DOMContentLoaded', (event) => {
    dateElem = document.querySelector('#date');
    timeSched = document.querySelector('#timeSched');
    printBtn = document.querySelector('#printDocuBtn');
    monthSelect = document.querySelector('#monthSelect');
    yearSelect = document.querySelector('#yearSelect');
    yearSelect.value = dateObject.getFullYear();
    monthSelect.selectedIndex = dateObject.getMonth();
    formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
    dateElem.textContent = 'Loading...';
    setActionEvents();
  });
//   get employee data
getDocs(empRefDB).then((querySnapShot)=>{
     employeesMap = {};
    console.log('getting data');
    querySnapShot.forEach((document)=>{
        const documentData = document.data();
        employeesMap[document.id] = documentData;
        console.log('id',employeesMap[document.id]);
        const firstname = documentData['firstname'];
        const lastname = documentData['lastname'];
        const middlename = documentData['middlename'];
        console.log(firstname);
        console.log(employeesMap.length);
        // const email = documentData['email'];
        // emps += addEmployeeItem(document.id, firstname, lastname, middlename, email);
      });
      console.log(Object.keys(employeesMap).length);
    processEmpData();
}).catch((error)=>{
    alert('Cannot obtain Employee details, caused by: '+error);
    console.log('error', error);
});

function processEmpData(){
    let month = dateObject.getMonth();
    dateElem.textContent = 'Loading...';
    attendances = [];
let year = dateObject.getFullYear();
    const queryAtts = query(empAttRef, where('month', '==', month+1), where('year', '==', year));
    getDocs(queryAtts).then((querySnapShot)=>{
        console.log('querySnapShot', querySnapShot);
        querySnapShot.forEach((document)=>{
            let documentData = document.data();
            attendances.push(document.data());
        });
        displayAttData();
    }).catch((error)=>{
        alert(error);
    }); 
}
function displayAttData(){
    loadHeaderData();
    let month = dateObject.getMonth();
    let year = dateObject.getFullYear();
    let formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
    const monthName = dateObject.toLocaleDateString('en-US', { month: 'long' });
    dateElem.innerHTML = '<strong>'+monthName+'</strong>';
    let tbody = document.querySelector('#tbody');
    tbody.innerHTML = '';
    for (const [key, value] of Object.entries(employeesMap)) {
        let row = document.createElement('tr');
        let empid = key;
        let idnum = document.createElement('td'); idnum.classList.add('borderd'); idnum.innerHTML = value['id-number']; row.appendChild(idnum);
        let empname = document.createElement('td'); empname.classList.add('borderd'); empname.innerHTML = '<strong>'+value['firstname'] +' '+value['lastname']+'</strong>'; row.appendChild(empname);
        for(let i = 1; i <= getDaysInMonth(year, month); i++){//day loop
            let foundAtt = attendances.find(item => item['employee-id'] == empid && item['day'] == i);
            let attStatsStr;
            if(foundAtt){
                attStatsStr = '<strong><font color="#9ACD32">✔</font></strong>';
            }else{
                attStatsStr = '<font color="red">-</font>';
            }
            let attStats = document.createElement('td'); attStats.classList.add('borderd'); attStats.innerHTML = attStatsStr; row.appendChild(attStats);
        }
        tbody.appendChild(row);
      }
    
}
function loadHeaderData(){
    let month = dateObject.getMonth();
    let year = dateObject.getFullYear();
    let headerRowData = document.querySelector('#headerRowData');
    headerRowData.innerHTML = '';
    let idnum = document.createElement('th'); idnum.classList.add('dtr-col'); idnum.innerHTML = 'ID number'; headerRowData.appendChild(idnum);
    let empnameheader = document.createElement('th'); empnameheader.classList.add('dtr-col'); empnameheader.innerHTML = 'Employee Name'; headerRowData.appendChild(empnameheader);
    for(let i = 1; i <= getDaysInMonth(year, month); i++){//day loop
        let day = document.createElement('th');
        day.classList.add('dtr-col');
        day.innerHTML = 'Day '+i;
        headerRowData.appendChild(day);
    }
}
function setActionEvents(){
    printBtn.addEventListener('click', (element)=>{
        let actionsDiv = document.querySelector('.actions');
        actionsDiv.style.display = 'none';
        print();
        actionsDiv.style.display = 'block';
    });
    monthSelect.addEventListener('change', (event)=>{
        let monthSelected = event.target.value - 1;
        dateObject.setMonth(monthSelected)
        console.log(monthSelected);
        formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
        console.log(formattedDate);
        processEmpData();
    });
    yearSelect.addEventListener('change', (event)=>{
        let yearSelected = event.target.value;
        dateObject.setFullYear(yearSelected);
        console.log(yearSelected);
        formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
        console.log(formattedDate);
        processEmpData();
    });
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  function parseTimeString(timeString) {
    const timeRegex = /^(?<hours>\d+)(?::(?<minutes>\d+))?(?:\s+)(?<ampm>\w{2})?$/i;
    const match = timeString.match(timeRegex);
  
    if (!match) {
      throw new Error(`Invalid time string: ${timeString}`);
    }
  
    const hoursString = match.groups.hours;
    const minutesString = match.groups.minutes || '00';
    const ampm = match.groups.ampm;
  
    let hours = parseInt(hoursString);
    const minutes = parseInt(minutesString);
  
    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
  
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
  
    return date;
  }