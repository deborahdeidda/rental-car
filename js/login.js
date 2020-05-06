$(document).ready(function(){

	//hide errors in html
	$('#show-alert-logged-in').hide()
	$('#show-alert-error-logging-in').hide()

	//button clicked to login
	$('#login-btn').click(function(e){

		//form values
		var user = $('#mail').val()
		var password = $('#password').val()
		e.preventDefault()

		verifyFullFields()

		function verifyFullFields(){
			if (password != "" && user != ""){

				$.ajax({
					url: "http://localhost:3000/login",
					method: "POST",
					dataType: "json",
					data: {
						"email": user,
						"password": password
					}
				}).done(function(data){

					var jwt = data.accessToken
					localStorage.setItem("jwt", jwt)

					$.ajax({
						type: "GET",
						url: "http://localhost:3000/users?email=" + user,
						contentType: "json",
					}).done(function(data){

							var userEmail = data[0]['email']
							localStorage.setItem("useremail", userEmail)
							var userId = data[0]['id']
							localStorage.setItem("userid", userId)
							var identify = data[0]['id']
							localStorage.setItem("idfy", identify)

							if (data[0]['role'] == "admin"){
								console.log("I am admin")
								$('#show-alert-error-logging-in').hide()
								$('#show-alert-logged-in').show()

								function redirect(data) {
									setTimeout(function(){
										window.location.replace("../public/admin_home.html")
									}, 2000)
								}
								redirect(data)

							} else if (data[0]['role'] == "customer") {
								console.log("I am customer")
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
					$('#show-alert-error-logging-in').show()
				})

			}  else {
				$('#show-alert-error-logging-in').show()
			}
		}

	})
})
