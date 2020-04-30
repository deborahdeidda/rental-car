$(document).ready(function() {

	console.log("DOM readyy")
	$("#alert-admin-added").hide()
	$("#alert-admin-error").hide()
	$("#new-admin-form").hide()

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/users?id=' + localStorage.getItem("idfy"),
		contentType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log(localStorage.getItem("jwt"))
		}
	}).done(function (response) {
		console.log("done:", response)
	}).fail(function (err)  {
		console.log("failed:", err)
	})
	console.log("1")
	//variables
	$admin_data = $('#admin-data')

	//retrieve Json data
	$.getJSON('http://localhost:3000/users?id=' + localStorage.getItem("idfy"), function(data) {

		$admin_data.html('')

		// now let's populate with Json data
		if(data[0]){
			$admin_data.append('<h4 id=" ' + data[0]['id'] + ' ">' + data[0]['name'] + " " + data[0]['surname'] + '</h4>' + "<br>" + '<p>' + "<b>ID </b>" + data[0]['id'] +  '</p>' + "<br>" + '<p>' + "<b>NAME </b>" + data[0]['name'] + '</p>' + "<br>" + '<p>' + "<b>SURNAME </b>" + data[0]['surname'] + '</p>' + "<br>" + '<p>' + "<b>DATE OF BIRTH </b>" + data[0]['birthday'] +  '</p>' + "<br>" + '<p>' + "<b>MAIL </b>" + data[0]['email'] + '</p>' + "<br>" +
			'<div class="row pb-3 justify-content-center"><div class="col-2 d-inline-block">' +

			'<i data-userid="' + data[0]['id'] + '" class="far fa-edit"></i></div>' +
			'<div class="col-2 d-inline-block">' +
			'<i id="editAdmin" class="fas fa-user-plus"></i>' +

			' </div></div>')
		}
		loadButtons()
	})
	console.log("2")

	function loadButtons(){
		$('#editAdmin').on('click', function(e){
			$("#new-admin-form").show()
			$('html, body').animate({
				scrollTop: ($('#new-admin-form').offset().top)
			},'slow')
			e.preventDefault()
		})
	}

	$('#create-new-admin').on('click', function(e){

		var name = $('#name').val()
		var surname = $('#surname').val()
		var birthday = $('#birthday').val()
		var email = $('#email').val()
		var password = $('#password').val()
		var role = "admin"

		let data = {
			name: $('#name').val(),
			surname: $('#surname').val(),
			birthday: $('#birthday').val(),
			email: $('#email').val(),
			password: $('#password').val(),
			role: "admin"
		}

		if (email != "" && password != "" && name != "" && surname != "" && birthday != "" ){
			console.log("all fields filled")
			createNewAdmin(data)
			$('#new-admin-form').trigger("reset")
			$("#alert-admin-error").hide()
			$('#alert-admin-added').show()
			$('#new-admin-form').hide()
			e.preventDefault()
		} else {
			console.log("not all fields are filled")
			$("#alert-admin-error").show()
			$('html, body').animate({
				scrollTop: ($('#alert-admin-error').offset().top)
			},'slow')
			e.preventDefault()
		}
	})

	function createNewAdmin(data){
		$.ajax({
			url: "http://localhost:3000/users",
			method: "POST",
			dataType: "json",
			data: data,
			success: function(data){
				console.log("success")
				// $('#alert-admin-added').show()
				// $('#new-admin-form').hide()
			},
			error: function(){
				console.log("error")
				// $("#alert-admin-error").show()
			}
		})
	}

	// function createNewAdmin(data){
	// 	$.ajax({
	// 		url: "http://localhost:3000/users",
	// 		method: "POST",
	// 		dataType: "json",
	// 		data: data,
	// 		success: function(data){
	// 			console.log("SUCCESS data:", data)
	// 			var adminRole = data.role
	// 			localStorage.setItem("aRole", adminRole)
	// 			console.log("the role is:", data.role)
	// 		}
	// 	})
	// }

})
