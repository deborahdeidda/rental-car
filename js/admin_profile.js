
$(document).ready(function() {

	console.log("DOM readyy")
	$("#alert-admin-added").hide()
	$("#alert-admin-error").hide()
	$("#new-admin-form").hide()

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/600/users/' + localStorage.getItem("idfy"),
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

	getUser()

	function getUser(){
		//variables
		$admin_data = $('#admin-data')
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/600/users/' + localStorage.getItem("idfy"),
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt (function get user n):", localStorage.getItem("jwt"))
			}
		}).done(function (response) {
			console.log("function get user n:", response.id)
			$admin_data.html('')

				// now let's populate with Json data
				if(response){
					$admin_data.append('<h4 id=" ' + response.id + ' ">' + response.name + " " + response.surname + '</h4>' + "<br>" + '<p>' + "<b>ID </b>" + response.id +  '</p>' + "<br>" + '<p>' + "<b>NAME </b>" + response.name + '</p>' + "<br>" + '<p>' + "<b>SURNAME </b>" + response.surname + '</p>' + "<br>" + '<p>' + "<b>DATE OF BIRTH </b>" + response.birthday +  '</p>' + "<br>" + '<p>' + "<b>MAIL </b>" + response.email + '</p>' + "<br>" +

					'<div class="row pb-3 justify-content-center"><div class="col-6 d-inline-block">' +
					'<i id="editAdmin" class="fas fa-user-plus"></i>' +

					' </div></div>')
					loadButtons()
				} else {
					console.log("no data")
				}
		}).fail(function (err)  {
			console.log("failed")
		})
	}

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
		var role = "admin"

		let data = {
			name: $('#name').val(),
			surname: $('#surname').val(),
			birthday: $('#birthday').val(),
			email: $('#email').val(),
			role: "admin"
		}

		if (email != "" && name != "" && surname != "" && birthday != "" ){
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
			url: "http://localhost:3000/660/users",
			method: "POST",
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt (function get user n):", localStorage.getItem("jwt"))
			},
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
