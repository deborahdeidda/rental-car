$(document).ready(function() {

    //hide errors in html
    $("#error-email").hide()
    $("#error-password").hide()
    $("#fill-email").hide()
    $("#show-alert-registerd").hide()
    $("#show-alert-registered-failed").hide()


    $("#register-btn").click(function(e) {

        var name = $('#name').val()
        var email = $('#email').val()
        var password = $('#password').val()
        var surname = $('#surname').val()
        var birthday = $('#birthday').val()
        e.preventDefault()

        function checkUser(){
            if (email != "" && password != ""){
                true
            } else {
                false
            }
        }

        $.ajax({
            url: "http://localhost:3000/register",
            method: "POST",
            data: {
                "name": name,
                "email": email,
                "password": password,
                "surname": surname,
                "birthday": birthday
            },
            success: function(data){
                checkUser()
                if (data){
                    $("#show-alert-registered-failed").hide()
                    $("#show-alert-registerd").show()
                } 
            },
            error: function(){
                $("#show-alert-registered-failed").show()
            }
        })
    })
})
