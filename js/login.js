$(document).ready(function(){

	//hide alert in html
	$('#show-alert-logged-in').hide()
	$('#show-alert-error-logging-in').hide()
	$('#alert-data-incorrect').hide()

	//btn - to login
		$('#login-btn').click(function(e){

	    var email = $('#email').val()
	    var password = $('#password').val()

	  	var validatePassword = function(){
	      console.log(password)
	  		if(password != ""){
	  			return true
	  		} else {
	  			return false
	  		}
	  	}

	    var validateEmail = function(){
	  		 var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
	  		 if(reg.test(email)){
	  		 	return true
	  		 } else {
	  		 	return false
	  		 }
	  	}
			e.preventDefault()
			verifyLogin()

			function verifyLogin(){
				if( validateEmail && validatePassword ){
					console.log(validateEmail == true)
					console.log(validatePassword == true)
					$.ajax({
						url: "http://localhost:3000/login",
						method: "POST",
						dataType: "json",
						data: {
							"email": email,
							"password": password
						}
					}).done(function(data){

						var jwt = data.accessToken
						localStorage.setItem("jwt", jwt)

						$.ajax({
							type: "GET",
							url: "http://localhost:3000/users?email=" + email,
							contentType: "json",
						}).done(function(data){

								//saving user id
								var userId = data[0]['id']
								localStorage.setItem("userid", userId)

								if (data[0]['role'] == "admin"){
									$('#alert-data-incorrect').hide()
									$('#show-alert-error-logging-in').hide()
									$('#show-alert-logged-in').show()

									function redirect(data) {
										setTimeout(function(){
											window.location.replace("../public/admin_home.html")
										}, 2000)
									}
									redirect(data)

								} else if (data[0]['role'] == "customer") {
									$('#alert-data-incorrect').hide()
									$('#show-alert-error-logging-in').hide()
									$('#show-alert-logged-in').show()
									function redirect(data) {
										setTimeout(function () {
											window.location.replace("../public/customer_home.html")
										}, 2000)
									}
									redirect(data)

								} else {
									false
								}
						})
					}).fail(function(error){
							if (email == "" || password == ""){
								$('#show-alert-logged-in').hide()
								$('#alert-data-incorrect').hide()
								$('#show-alert-error-logging-in').show()
							} else {
								$('#show-alert-logged-in').hide()
								$('#show-alert-error-logging-in').hide()
								$('#alert-data-incorrect').show()
							}
					})

				} else {
					$('#show-alert-logged-in').hide()
					$('#alert-data-incorrect').hide()
					$('#show-alert-error-logging-in').show()
				}
			}

			e.preventDefault()

		})
})
