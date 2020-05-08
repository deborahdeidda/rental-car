$(document).ready(function() {

  //hide alert in html
  $("#show-alert-registered").hide()
  $("#show-alert-registered-failed").hide()
  $("#alert-email-exists").hide()


  //btn - to register
  $("#register-btn").click(function(e) {

    var name = $('#name').val()
    var email = $('#email').val()
    var password = $('#pass').val()
    var surname = $('#surname').val()
    var birthday = $('#birthday').val()

    e.preventDefault()

    verifyRegistration()


    function validatePassword(){
  		if(password.length > 7 ){
  			return true
  		} else {
  			return false
  		}
  	}

    function validateEmail(){
  		 var reg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
  		 if(reg.test(email)){
  		 	  return true
  		 } else {
  		 	  return false
  		 }
  	}

    function verifyRegistration(){

      if( validateEmail() && validatePassword() ){
        console.log( validateEmail(), password.length > 7 )
        console.log( validateEmail(), email)
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
            }
        }).done(function(response){
          $("#alert-email-exists").hide()
          $("#show-alert-registered-failed").hide()
          $("#show-alert-registered").show()
        }).fail(function(err){
          $("#show-alert-registered-failed").hide()
          $("#alert-email-exists").show()
        })

      } else {
        $("#show-alert-registered").hide()
        $("#alert-email-exists").hide()
        $("#show-alert-registered-failed").show()
      }

    }

  })
})
