
export function loadSpinner(message){
return "<button class='btn btn-primary' type='button' disabled='disabled'>"+
"<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>"+
"<span class='ml-1' >"+message+"</span>"+                        
"</button>";
}