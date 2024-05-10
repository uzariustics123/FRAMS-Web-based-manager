let loaderToast = "<div class='col-12 toast-pos' style='position:fixed;top: 30px;'>" +
    "<div class='toast fade float-right' role='alert' aria-live='assertive' aria-atomic='true' id='toaster'>" +
    "<div class='toast-header text-dark'>" +
    "<span id='toast-icon' class='' role='status' aria-hidden='true'></span>" +
    "<strong id='title-toast' class='mr-auto ml-2'>Please wait...</strong>" +
    "<small id='suffix-msg' class='text-gray'></small>" +
    '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onclick="hideToast()">'+
                '<span aria-hidden="true">×</span>'+
            '</button>'+
    "</div>" +
    "<div class='toast-body' id='message-toast'>" +
    "Signing in with your account." +
    "</div>" +
    "</div>" +
    "</div>";

$(document.body).append(loaderToast);
let toastpos;
$(document).ready(()=>{
    toastpos = document.querySelector('.toast-pos');
    toastpos.style.display = 'none';
    // console.log('watda ip', toastpos, toastpos);
});


function loadToast(title, message, suffixmsg) {
    toastpos.style.display = 'block';
    $('#toast-icon').removeClass();
    $('#toast-icon').html('');
    $('#toast-icon').addClass('spinner-border');
    $('#toast-icon').addClass('spinner-border-sm');
    $('#title-toast').text(title);
    $('#message-toast').text(message);
    $('#suffix-msg').text(suffixmsg);
    $('.toast').addClass('show');
}
function hideToast() {
    toastpos.style.display = 'none';
    $('#toast-icon').removeClass();
    // $('#toast-icon').removeClass('spinner-border-sm');
    // $('#toast-icon').removeClass('fab');
    // $('#toast-icon').removeClass('fa-check-circle');
    $('#toast-icon').html('');
    $('.toast').removeClass('show');
}
function succesToast(title, message, suffixmsg) {
    toastpos.style.display = 'block';
    $('#toast-icon').removeClass();
    $('#toast-icon').html('');
    $('#toast-icon').addClass('material-icons');
    $('#toast-icon').html('check');
    $('#title-toast').text(title);
    $('#message-toast').text(message);
    $('#suffix-msg').text(suffixmsg);
    $('.toast').addClass('show');
    setTimeout(()=>{
        hideToast();
    }, 5000);
}
function errorToast(title, message, suffixmsg) {
    toastpos.style.display = 'block';
    $('#toast-icon').removeClass();
    $('#toast-icon').html('');
    $('#toast-icon').addClass('material-icons');
    $('#toast-icon').html('error');
    $('#title-toast').text(title);
    $('#message-toast').text(message);
    $('#suffix-msg').text(suffixmsg);
    $('.toast').addClass('show');
}