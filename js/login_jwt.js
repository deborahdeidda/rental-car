$(document).ready(function(){
	console.log("DOM ready")
	//hide errors in html
	$('#show-alert-logged-in').hide()
	$('#show-alert-error-logging-in').hide()

	$('#login-btn').click(function(e){
		console.log("clicked")
		var user = $('#mail').val()
		var password = $('#password').val()
		e.preventDefault()

		function verifyFullFields(){
			if (password != "" && user != ""){
				console.log("correct fields")
			}  else {
				console.log("fields required")
				$('#show-alert-error-logging-in').show()
			}
		}

		verifyFullFields()

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
				url: "http://localhost:3000/users?email=" + user,
				method: "GET",
				dataType: "json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
					console.log("TOKEN: ", localStorage.getItem("jwt"))
				},
				data: { },
				success: function(data){

					console.log("the data is: ", data[0]['id'])

					var identify = data[0]['id']
					localStorage.setItem("idfy", identify)

					if (data[0]['role'] == "admin"){
						console.log("I am admin")
						$('#show-alert-error-logging-in').hide()
						$('#show-alert-logged-in').show()

						function redirect() {
							setTimeout(function(){
								window.location.replace("../public/index_admin.html")
							}, 2000)
						}
						redirect()
					} else if (data[0]['role'] == "customer") {
						console.log("I am customer")
						$('#show-alert-error-logging-in').hide()
						$('#show-alert-logged-in').show()
						function redirect() {
							setTimeout(function () {
								window.location.replace("../public/index_customer.html")
							}, 2000)
						}
						redirect()
					} else {
						false
					}
				}
			})
		}).fail(function(error){
			console.log("something wrong")
			$('#show-alert-error-logging-in').show()
		})
	})
})
