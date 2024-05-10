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
let htmlContainer = document.createElement('div');
    htmlContainer.classList.add('row','justify-content-center');
let cardContainer = '<div class="col-12 col-md-6 col-lg-5">'+
                        '<div class="card bg-primary shadow-soft p-4">'+
                            '<div class="card-header text-center pb-0"><h2 class="h4">Reset pincode</h2></div>'+
                            '<p id="warntxt" class="text-danger"></p>'+
                            '<div class="card-body">'+
                                '<div class="">'+
                                    '<div class="form-group">'+
                                        '<label for="oldpin">Old pin</label>'+
                                        '<div class="input-group mb-4">'+
                                            '<div class="input-group-prepend">'+
                                                '<span class="input-group-text"><span class="fas fa-key"></span></span>'+
                                            '</div>'+
                                            '<input class="form-control" id="oldpin" placeholder="pin" type="password" required />'+
                                        '</div>'+
                                    '</div>'+

                                    '<div class="form-group">'+
                                        '<label for="newpin">New pin</label>'+
                                        '<div class="input-group mb-4">'+
                                            '<div class="input-group-prepend">'+
                                                '<span class="input-group-text"><span class="fas fa-key"></span></span>'+
                                            '</div>'+
                                            '<input class="form-control" id="newpin" placeholder="pin" type="password" required />'+
                                        '</div>'+
                                    '</div>'+

                                    '<div class="form-group">'+
                                        '<label for="confirmpin">Confirm new pin</label>'+
                                        '<div class="input-group mb-4">'+
                                            '<div class="input-group-prepend">'+
                                                '<span class="input-group-text"><span class="fas fa-key"></span></span>'+
                                            '</div>'+
                                            '<input class="form-control" id="confirmpin" placeholder="pin" type="password" required />'+
                                        '</div>'+
                                    '</div>'+

                                    '<button id="changepinBtn" disabled class="btn btn-block btn-primary"> Save PIN </button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'
                    '</div>';

let oldpin;
let newpin;
let confirmpin;
let changePinBtn;

export function loadResetPin(container){
    mainContainer = container;
    htmlContainer.innerHTML = cardContainer;
    container.replaceChildren(htmlContainer);
    // container.innerHtml = htmlContainer;
    // console.log("asdfef", htmlContainer);
    setInputEvent();
}
                
function setInputEvent(){
     oldpin = document.querySelector('#oldpin');
     newpin = document.querySelector('#newpin');
     confirmpin = document.querySelector('#confirmpin');
     changePinBtn = document.querySelector('#changepinBtn');
    let inps =  [oldpin, newpin,confirmpin];
    inps.forEach((element)=>{
        console.log('watda ips');
        let elemIndex = inps.indexOf(element);
        let currentValue = element.value;
        element.addEventListener('keyup',(event)=>{
            const key = event.key; // const {key} = event; ES6+
            
            let currentElem = event.currentTarget;
            if(currentElem.value.length > 4 ){
                currentElem.value = currentValue;
            }
            else if (key === "Backspace" || key === "Delete") {
                return false;
            }
            else if(regex.test(currentElem.value)){
                currentValue = currentElem.value;
            }
            else{
                currentElem.value = currentValue;
            }
            if((inps[0].value.length === 4) && (inps[1].value.length === 4) && (inps[2].value.length === 4)){
                changePinBtn.disabled = false;
            }else{
                changePinBtn.disabled = true;
            }
        })
    })
    changePinBtn.addEventListener('click', (element)=>{
        changePinBtn.disabled = true;
        let adminConfigRef = doc(db, 'admin-configs', 'admin-configs');
        loadToast('Changing PIN', 'Saving new PIN');
        getDoc(adminConfigRef).then((querySnapshot)=>{
            let data = querySnapshot.data();
            console.log('pincode' ,data.pincode);
            console.log('oldpin' ,oldpin.value);
            if(oldpin.value === data.pincode){
                if(newpin.value === confirmpin.value){
                    proceedSavePIN(newpin.value);
                }
                else{
                    errorToast('Error', "New pin and Confirm pin does'nt match");
                    changePinBtn.disabled = true;
                }
            }else{
                errorToast('Error', "Old PIN does'nt match to the system PIN");
                changePinBtn.disabled = true;
            }
            
        }).catch((error)=>{
            console.log('error', error);
            errorToast('Error', error);
            changePinBtn.disabled = false;
        });
        // let oldpinVal = oldpin.value;
        // console.log('olfpin', oldpinVal);
    })
}

function proceedSavePIN(newPin){
    let adminConfigRef = doc(db, 'admin-configs', 'admin-configs');
    let adminConfigs = {
        pincode: newPin
    }
    setDoc(adminConfigRef, adminConfigs).then(()=>{
        succesToast('PIN changed', 'new PIN has been saved succesfully');
    }).catch(error=>{
        errorToast('Error', error);
    });
}