$(document).ready(function() {

  //hide alert in html
  $("#show-alert-registerd").hide()
  $("#show-alert-registered-failed").hide()

  //btn - to register
  $("#register-btn").click(function(e) {

    var name = $('#name').val()
    var email = $('#email').val()
    var password = $('#pass-word').val()
    var surname = $('#surname').val()
    var birthday = $('#birthday').val()

  	var validatePassword = function(){
      console.log(password)
  		if(password.length > 7){
  			true
  		} else {
  			false
  		}
  	}

    var validateEmail = function(){
  		 var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  		 if(reg.test(email)){
  		 	true
  		 } else {
  		 	false
  		 }
  	}
    e.preventDefault()
    verifyRegistration()

    function verifyRegistration(){
      if( validateEmail && validatePassword ){
        $.ajax({
            url: "http://localhost:3000/register",
            method: "POST",
            data: {
                "name": name,
                "email": email,
                "password": password,
                "surname": surname,
                "birthday": birthday,
                "role": "customer"
            },
            success: function(data){
              if (data){
                $("#show-alert-registered-failed").hide()
                $("#show-alert-registerd").show()
              }
            },
            error: function(){
              $('#show-alert-registered-failed').show()
            }
        })

      } else {
        $("#show-alert-registered-failed").show()
      }
    }

  })
})
