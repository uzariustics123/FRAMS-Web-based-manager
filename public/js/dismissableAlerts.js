
export function dangerAlert(title, message){
    return "<div class='alert alert-danger alert-dismissible shadow-inset fade show' role='alert'>"+
    "<span class='alert-inner--icon'><span class='fas fa-fire'></span></span>"+
    "<span class='alert-inner--text'><strong>"+title+"</strong> "+message+"</span>"+
    "<button type='button' class='close' data-bs-dismiss='alert' aria-label='Close'><span aria-hidden='true'>×</span></button>"+
    "</div>"
}
export function successAlert(title, message){
    return "<div class='alert alert-danger alert-dismissible shadow-inset fade show' role='alert'>"+
    "<span class='alert-inner--icon'><span class='fas fa-fire'></span></span>"+
    "<span class='alert-inner--text'><strong>"+title+"</strong> "+message+"</span>"+
    "<button type='button' class='close' data-bs-dismiss='alert' aria-label='Close'><span aria-hidden='true'>×</span></button>"+
    "</div>"
}

export function noteAlert(title, message){
    return "<div class='alert alert-info alert-dismissible shadow-inset fade show' role='alert'>"+
    "<span class='alert-inner--icon'><span class='fas fa-bell'></span></span>"+
    "<span class='alert-inner--text'><strong>"+title+"</strong> "+message+"</span>"+
    "<button type='button' class='close' data-bs-dismiss='alert' aria-label='Close'><span aria-hidden='true'>×</span></button>"+
    "</div>"
}