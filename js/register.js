$(document).ready(function() {

    //hide errors in html
    $("#error-name").hide()
    $("#error-email").hide()
    $("#error-password").hide()
    $("#error-repeat-password").hide()

    //global variables
    var error_name = false
    var error_email = false
    var error_password = false
    var repeat_password = false

    //input's id
    $("#name").focusout(function() {
        check_name()
    })
    $("#email").focusout(function() {
        check_email()
    })
    $("#password").focusout(function() {
        check_password()
    })
    $("#repeat-password").focusout(function() {
        check_repeat_password()
    })

    //check input
    function check_name() {
        var name_length = $("#name").val().length

        if (name_length < 5 || name_length > 20) {
            $("#error-name").html("The name should be between 5-20 characters")
            $("#error-name").show()
            error_name = true
        } else {
            $("#error-name").hide()
        }
    }
    function check_email() {
        var email_pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i)

        if (email_pattern.test( $("#email").val() )) {
            $("#error-email").hide()
        } else {
            $("#error-email").html("Invalid email address")
            $("#error-email").show()
            error_email = true
        }
    }
    function check_password() {
        var password_length = $("#password").val().length

        if (password_length < 8) {
            $("#error-password").html("At least 8 characters")
            $("#error-password").show()
            error_password = true
        } else {
            $("#error-password").hide()
        }
        
    }
    function check_repeat_password() {
        var password = $("#password").val()
        var repeat_password = $("#repeat-password").val()

        if (password != repeat_password) {
            $("#error-repeat-password").html("Passwords don't match!")
            $("#error-repeat-password").show()
            repeat_password = true
        } else {
            $("#error-repeat-password").hide()
        }
    }

    $("#registration-form").submit(function() {
        error_name = false
        error_email = false
        error_password = false
        repeat_password = false

        check_name()
        check_email()
        check_password()
        check_repeat_password()

        if(error_name == false && error_email == false && error_password == false && repeat_password == false) {
            return true
        } else {
            return false
        }
    })
})
