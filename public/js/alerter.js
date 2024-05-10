let alerter =   "<div class='modal fade' id='alerter-dialog' tabindex='-1' role='dialog' aria-labelledby='alerter-dialog' aria-hidden='true' >" +
                    "<div class='modal-dialog modal-dialog-centered' role='document'>" +
                    "<div class='modal-content'>" +
                    "<div class='modal-header'>" +
                    "<h2 class='h6 modal-title mb-0' id='alerter-title'>" +
                    "Terms of Service" +
                    "</h2>" +
                    "<button type='button' class='close' data-bs-dismiss='modal' aria-label='Close' >" +
                    "<span aria-hidden='true'>×</span>" +
                    "</button>" +
                    "</div>" +
                    "<div class='modal-body'>" +
                    "<p id='alerter-msg'>" +
                    "</p>" +
                    "</div>" +
                    "<div class='modal-footer'>" +
                    "<button id='alerter-l-btn' type='button' class='btn btn-sm btn-primary' data-bs-dismiss='modal' aria-label='Close' > I Got It </button>" +
                    "<button id='alerter-r-btn' type='button'" +
                    "class='btn btn-primary text-danger ml-auto' data-dismiss='modal' data-bs-dismiss='modal' >" +
                    "Close" +
                    "</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                "</div > ";

                $(document.body).append(alerter);
                function showAlert(title, message, lbtnztext, rbtntext, funcLeftBtn, funcRightBtn) {
                    $("#alerter-title").html(title);
                    $("#alerter-msg").html(message);
                    $("#alerter-dialog").modal("show");
                    $("#alerter-l-btn").html(lbtnztext);
                    $("#alerter-r-btn").html(rbtntext);
                    $("#alerter-l-btn").on("click", funcLeftBtn);
                    $("#alerter-r-btn").on("click", funcRightBtn);
                }