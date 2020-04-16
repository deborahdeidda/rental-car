$(document).ready(function(){
    $("#login-btn").click(function() {
        $("#login-btn").hide()
        var name = $("#name").val()
        var password = $("#password").val()
        
        $.post("http://localhost:3000/db", {
            name: name,
            password: password
        }).done(function(data) {
            if (single_data == "success") {
                window.location = "index.html"
            } else {
                $("#login-error").text("Invalid name o password! Try again.")
                $("#login-btn").show()
            }
        })
    })
})