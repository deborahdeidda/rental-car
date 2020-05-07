$(document).ready(function() {

	//hide alert in html
	$("#alert-admin-added").hide()
	$("#alert-admin-error").hide()
	$("#new-admin-form").hide()

	getUser()

	function getUser(){
		$admin_data = $('#admin-data')
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/600/users/' + localStorage.getItem("userid"),
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			}
		}).done(function (response) {
			$admin_data.html('')
			// now let's populate with Json data
			if(response){
				$admin_data.append('<h4 id="' + response.id + '">' + response.name + " " + response.surname + '</h4>' + "<br>" +
				'<p>' + "<b>ID </b>" + response.id +  '</p>' + "<br>" +
				'<p>' + "<b>NAME </b>" + response.name + '</p>' + "<br>" +
				'<p>' + "<b>SURNAME </b>" + response.surname + '</p>' + "<br>" +
				'<p>' + "<b>DATE OF BIRTH </b>" + response.birthday +  '</p>' + "<br>" +
				'<p>' + "<b>MAIL </b>" + response.email + '</p>' + "<br>" +
				'<div class="row pb-3 justify-content-center">' +
				'<div class="col-6 d-inline-block">' +
				'<i id="editAdmin" class="fas fa-user-plus"></i></div></div>')
				loadButtons()
			} else {
				return false
			}
		}).fail(function (err)  {
			return err
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
			createNewAdmin(data)
			e.preventDefault()
		} else {
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
			},
			data: data,
			success: function(data){
				$('#new-admin-form').trigger("reset")
				$("#alert-admin-error").hide()
				$('#alert-admin-added').show()
				$('#new-admin-form').hide()
			},
			error: function(err){
				return err
			}
		})
	}

})
