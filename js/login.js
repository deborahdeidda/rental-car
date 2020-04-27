$(document).ready(function(){

    //hide errors in html
    $('#show-alert-logged-in').hide()
    $('#show-alert-error-logging-in').hide()

    $('#login-btn').click(function(e){

        var user = $('#mail').val()
        var password = $('#password').val()
        e.preventDefault()

        function checkUser(){
            if (user == "admin@admin.com"){
                true
            }  else if (user != ""){
                false
            }
        }

        function verifyFullFields(){
            if (password != "" && password != ""){
                true
            }  else {
                false
            }
        }

        $.ajax({
            url: "http://localhost:3000/login",
            method: "POST",
            dataType: "json",
            data: {
                "email": user,
                "password": password
            },
            success: function(data) {
                checkUser()
                verifyFullFields()
                if (user == "admin@admin.com"){
                    $('#show-alert-error-logging-in').hide()
                    $('#show-alert-logged-in').show()

                    function redirect() {
                        setTimeout(function(){
                            window.location.replace("../public/index_admin.html")
                        }, 2000)
                    }
                    redirect()
                } else if (user != "") {
                    $('#show-alert-error-logging-in').hide()
                    $('#show-alert-logged-in').show()
                    function redirect() {
                        setTimeout(function () {
                            window.location.replace("../public/index_customer.html")
                        }, 2000)
                    }
                    redirect()
                }
            },
            error: function(){
                $('#show-alert-error-logging-in').show()
            }
        })
    })
})
