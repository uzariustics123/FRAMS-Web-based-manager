import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import { firebaseConfig } from './FirebaseConfigs.js'
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js'

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

let defaultAmIn = parseTimeString('8:00 AM');
let defaultAmOut = parseTimeString('11:59 AM');
let defaultPmIn = parseTimeString('1:00 PM');
let defaultPmOut = parseTimeString('5:00 PM');
let defaultAmInStr = '8:00 AM';
let defaultAmOutStr = '11:59 AM';
let defaultPmInStr = '1:00 PM';
let defaultPmOutStr = '5:00 PM';
let employeeData;
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
const empRefDB = collection(db,'employees');
const empAttRef = collection(db,'attendance');
const urlString = window.location.search;
const urlParams = new URLSearchParams(urlString);
let uid = urlParams.get('uid');
const empRef = doc(db,'employees', uid);

document.addEventListener('DOMContentLoaded', (event) => {
    dateElem = document.querySelector('#date');
    timeSched = document.querySelector('#timeSched');
    printBtn = document.querySelector('#printDocuBtn');
    monthSelect = document.querySelector('#monthSelect');
    yearSelect = document.querySelector('#yearSelect');
    yearSelect.value = dateObject.getFullYear();
    monthSelect.selectedIndex = dateObject.getMonth();
    formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
    dateElem.textContent = formattedDate;
    setActionEvents();
  });
//   get employee data
getDoc(empRef).then((querySnapShot)=>{
    employeeData = querySnapShot.data();
    // console.log('employeeData', employeeData);
    defaultAmIn = parseTimeString(employeeData['am-in-time']);
    defaultAmOut = parseTimeString(employeeData['am-out-time']);
    defaultPmIn = parseTimeString(employeeData['pm-in-time']);
    defaultPmOut = parseTimeString(employeeData['pm-out-time']);

     let defaultAmInStr = employeeData['am-in-time'];
     let defaultAmOutStr = employeeData['am-out-time'];
     let defaultPmInStr = employeeData['pm-in-time'];
     let defaultPmOutStr = employeeData['pm-out-time'];
    timeSched.innerHTML = defaultAmInStr +' to ' + defaultAmOutStr +'<br/>'+ defaultPmInStr+ ' to '+ defaultPmOutStr;
    processEmpData();
}).catch((error)=>{
    alert('Cannot obtain Employee details, caused by: '+error);
    console.log('error', error);
});

function processEmpData(){
    let month = dateObject.getMonth();
    attendances = [];
let year = dateObject.getFullYear();
    const queryAtts = query(empAttRef, where('employee-id', '==', uid), where('month', '==', month+1), where('year', '==', year));
    getDocs(queryAtts).then((querySnapShot)=>{
        console.log('querySnapShot', querySnapShot);
        querySnapShot.forEach((document)=>{
            attendances.push(document.data());
        });
        displayAttData();
        console.log('attendances', attendances);
    }).catch((error)=>{
        alert(error);
    }); 
}
function displayAttData(){
    let month = dateObject.getMonth();
    let year = dateObject.getFullYear();
    let formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
    const monthName = dateObject.toLocaleDateString('en-US', { month: 'long' });
    dateElem.textContent = monthName;
    let tbody = document.querySelector('#tbody');
    tbody.innerHTML = '';
    let empNameElem = document.querySelector('#employee-name');
    let name = employeeData.firstname + ' ' + employeeData.lastname;
    console.log(name);
    empNameElem.textContent = name;
    for(let i = 1; i <= getDaysInMonth(year, month); i++){//day loop
        // console.log('days', i);
        let row = document.createElement('tr');
        let dayelem = document.createElement('td'); dayelem.classList.add('borderd');
        let amArrivalTd = document.createElement('td'); amArrivalTd.classList.add('borderd');
        let amDepartTd = document.createElement('td');  amDepartTd.classList.add('borderd');
        let pmArrivalTd = document.createElement('td');pmArrivalTd.classList.add('borderd');
        let pmDepartTd = document.createElement('td');pmDepartTd.classList.add('borderd');
        let lateTd = document.createElement('td');lateTd.classList.add('borderd');
        let underTd = document.createElement('td');underTd.classList.add('borderd');
        dayelem.innerHTML = i;
        amArrivalTd.innerHTML = '--:-- --';
        amDepartTd.innerHTML = '--:-- --';
        pmArrivalTd.innerHTML = '--:-- --';
        pmDepartTd.innerHTML = '--:-- --';
       

        let TotalLateHr = 0;
        let TotalLateMin = 0;
        let TotalUndertimeHr = 0;
        let TotalUndertimeMin = 0;
        
        let attendedAmInTime = '';
        let attendedAmOutTime = '';
        let attendedPmInTime = '';
        let attendedPmOutTime = '';
        attendances.forEach((attendanceItem)=>{
            let day = attendanceItem.day;
            let type = attendanceItem.type;
            let timeStr = attendanceItem.time;
            if(day === i){
                
                try{
                    let time = parseTimeString(timeStr);
                    if(type === 'arrival' ){
                        if(timeStr.endsWith('AM')){
                            amArrivalTd.innerHTML = timeStr;
                            attendedAmInTime = time;
                            if(time > defaultAmIn){
                                TotalLateHr += time.getHours() - defaultAmIn.getHours();
                                TotalLateMin += time.getMinutes() - defaultAmIn.getMinutes(); 
                            }
                        }else if(timeStr.endsWith('PM')){
                            pmArrivalTd.innerHTML = timeStr;
                            attendedPmInTime = time;
                            if(time > defaultPmIn){
                                TotalLateHr += time.getHours() - defaultPmIn.getHours();
                                TotalLateMin += time.getMinutes() - defaultPmIn.getMinutes(); 
                            }
                        }
                    }else if(type === 'departure'){
                        if(timeStr.endsWith('AM')){
                            amDepartTd.innerHTML = timeStr;
                            attendedAmOutTime = time;
                            if(time > defaultAmOut){
                                const seconds = (time.getTime() - defaultAmIn.getTime()) / 1000;
                                TotalUndertimeMin += Math.floor(seconds / 60);
                                TotalUndertimeHr += Math.floor(minutes / 60);
                            }
                        }else if(timeStr.endsWith('PM')){
                            attendedPmOutTime = time;
                            pmDepartTd.innerHTML = timeStr;
                            if(time > defaultPmOut){
                                const seconds = (time.getTime() - defaultAmIn.getTime()) / 1000;
                                TotalUndertimeMin += Math.floor(seconds / 60);
                                TotalUndertimeHr += Math.floor(minutes / 60);
                            }
                        }
                    }
                }catch(e){
                    console.log(e);
                }
            }
        });
        lateTd.innerHTML = TotalLateHr+' hrs '+ TotalLateMin +' mins';
        underTd.innerHTML = TotalUndertimeHr+' hrs '+ TotalUndertimeMin +' mins';

        row.appendChild(dayelem);
        row.appendChild(amArrivalTd);
        row.appendChild(amDepartTd);
        row.appendChild(pmArrivalTd);
        row.appendChild(pmDepartTd);
        row.appendChild(lateTd);
        row.appendChild(underTd);
        tbody.appendChild(row);
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