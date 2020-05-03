$(document).ready(function(){
	console.log("DOM ready")

	//hide errors in html
	$('#show-alert-logged-in').hide()
	$('#show-alert-error-logging-in').hide()

	//button clicked to login
	$('#login-btn').click(function(e){
		console.log("clicked")

		//form values
		var user = $('#mail').val()
		var password = $('#password').val()
		e.preventDefault()

		verifyFullFields()

		function verifyFullFields(){
			if (password != "" && user != ""){
				console.log("correct fields")

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

					console.log("I got jwt:",data.accessToken)

					$.ajax({
						type: "GET",
						url: "http://localhost:3000/users?email=" + user,
						contentType: "json",
						// beforeSend: function (xhr) {
						// 	xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
						// 	console.log("I am asking the full data user with: ", localStorage.getItem("jwt"))
						// }
					}).done(function(data){
							console.log("full data: ", data)
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
					console.log("something wrong")
					$('#show-alert-error-logging-in').show()
				})

			}  else {
				console.log("fields required")
				$('#show-alert-error-logging-in').show()
			}
		}




	})
})
