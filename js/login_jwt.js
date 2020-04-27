$(document).ready(function(){
	console.log("DOM ready")
	//hide errors in html
	$('#show-alert-logged-in').hide()
	$('#show-alert-error-logging-in').hide()

	$('#login-btn').click(function(e){
		alert("clicked")
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
			}
		}).done(function(data){

			console.log("jwt:",data.accessToken)
			var jwt = data.accessToken
			localStorage.setItem("jwt", jwt)

			checkUser()
			verifyFullFields()
			if (user == "admin@admin.com"){
				console.log("I am admin")
				$('#show-alert-error-logging-in').hide()
				$('#show-alert-logged-in').show()

				function redirect() {
					setTimeout(function(){
						window.location.replace("../public/index_admin.html")
					}, 2000)
				}
				redirect()
			} else if (user != "") {
				console.log("I am customer")
				$('#show-alert-error-logging-in').hide()
				$('#show-alert-logged-in').show()
				function redirect() {
					setTimeout(function () {
						window.location.replace("../public/index_customer.html")
					}, 2000)
				}
				redirect()
			}

		}).fail(function(error){
			console.log("something wrong")
			$('#show-alert-error-logging-in').show()
		})
	})
})
