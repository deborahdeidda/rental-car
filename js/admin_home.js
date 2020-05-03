$(document).ready(function() {

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/660/users?id=' + localStorage.getItem("userid"),
		contentType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log("jwt:", localStorage.getItem("jwt"))
		}
	}).done(function (response) {
		console.log("user id is:", response[0]['id'])
	}).fail(function (err)  {
		console.log("failed:", err)
	})

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/660/users',
		contentType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log("jwt:", localStorage.getItem("jwt"))
		}
	}).done(function (response) {
		console.log("users are:", response)
	}).fail(function (err)  {
		console.log("failed:", err)
	})

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/660/bookings',
		contentType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log("jwt:", localStorage.getItem("jwt"))
		}
	}).done(function (response) {
		console.log("bookings:", response)
	}).fail(function (err)  {
		console.log("failed:", err)
	})

	$('#form').hide()
	$('#edit-form').hide()
	$('#show-alert').hide()
	$('#show-alert-edit').hide()
	$('#alert-user-deleted').hide()
	$('#show-bookings-box').hide()
	$('#alert-no-bookings').hide()
	$("#alert-user-error").hide()


	getAllUsers()

	$('#new-user').on('click', function(e){
		  $('#form').show()
	})

	function getAllUsers(){
		$('#user').html('')
		$.ajax({
			type: "get",
			url: "http://localhost:3000/660/users",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: {
				test: "test data"
			},
		}).done(function (response) {
				$(response).each(function(i, user){
					$('#user').append('<div class="col-12 col-md-4">' + '<div class="card">' + '<img src="../img/avatar.png" alt="Avatar" style="width:100%">' + '<div class="container">' + '<h4 user-id=" ' + user.id + ' ">' + user.name + ' ' + user.surname + '</h4><br>' + '<p><b>ID </b>' + user.id + '</p><br>' + '<p><b>NAME </b>' + user.name + '</p><br>' + '<p><b>SURNAME </b>' + user.surname + '</p><br>' + '<p><b>BIRTHDAY </b>' + user.birthday + '</p><br>' + '<p><b>EMAIL </b>' + user.email + '</p><br>' + '<div class="row pb-3"><div class="col-4 d-inline-block">' +

						'<i data-userid="' + user.id + '" class="far fa-edit editUser"></i>'

						+ '<div class="col-4 d-inline-block">' +

						'<i data-userid="' + user.id + '" class="far fa-trash-alt deleteUser"></i>' +
						'' +
						'</div><div class="col-4 d-inline-block">' +
						'' +
						'<i data-userid="' + user.id + '" class="fas fa-book showBookings"></i>' +

						'</div></div></div>')
				})

				//let's write the total number of users
				var $numberofusers = response.length;
				$('#h2').html(function(response) {
					return "Number of users: " + $numberofusers
				})

				loadButtons()
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	function getOneUser(id){
		$.ajax({
			type: "get",
			url: "http://localhost:3000/660/users/" + id,
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			}
		}).done(function (response) {
				console.log("get one user data: ", response.password)
				var userPass = response.password
				$($('#edit-form ')[0].userId).val(response.id)
				$($('#edit-form')[0].editName).val(response.name)
				$($('#edit-form')[0].editSurname).val(response.surname)
				$($('#edit-form')[0].editBirthday).val(response.birthday)
				$($('#edit-form')[0].editEmail).val(response.email)
				$('#edit-form').show()

				$('#edit-user-btn').click( function(e){
					console.log("clicked")
					let data = {
						name: $($('#edit-form')[0].editName).val(),
						surname: $($('#edit-form')[0].editSurname).val(),
						birthday: $($('#edit-form')[0].editBirthday).val(),
						email: $($('#edit-form')[0].editEmail).val(),
						password: userPass,
						role: "customer"
					}
					console.log("al click i dati sono questi:", data)


					editUser($($('#edit-form')[0].userId).val(), data)
					$('#edit-form').trigger("reset")
					$('#show-alert-edit').show()
					$('#edit-form').hide()
					e.preventDefault()
				})
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	$('#create-new-user').on('click', function(e){

		alert("clicked")

		var name = $('#name').val()
		var surname = $('#surname').val()
		var birthday = $('#birthday').val()
		var email = $('#email').val()
		var role = "customer"

		let data = {
			name: $($('#form')[0].name).val(),
			surname: $($('#form')[0].surname).val(),
			birthday: $($('#form')[0].birthday).val(),
			email: $($('#form')[0].email).val(),
			role: "customer"
		}

		$('#edit-form').hide()
		$('#show-alert').hide()
		$('#show-alert-edit').hide()
		$('#alert-user-deleted').hide()
		$('#show-bookings-box').hide()
		$('#alert-no-bookings').hide()

		if (email != "" && name != "" && surname != "" && birthday != "" ){
				console.log("all fields filled")
				createNewUser(data)
				$('#form').trigger("reset")
				$('#show-alert').show()
				$('#form').hide()
				e.preventDefault()
		} else {
			console.log("not all fields are filled")

			$("#alert-user-error").show()
			// $('html, body').animate({
			// 	scrollTop: ($('#alert-user-error').offset().top)
			// },'slow')
			e.preventDefault()
		}
	})

	function createNewUser(data){
		$.ajax({
			type: "post",
			url: "http://localhost:3000/660/users",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: data,
		}).done(function (response) {
			console.log("success")
			getAllUsers()
		}).fail(function (err)  {
			console.log("error")
			// $("#alert-admin-error").show()
		})
	}

	function loadButtons(){
		$('.editUser').click(function(e){
			$('#form').hide()
			$('#show-alert').hide()
			$('#show-alert-edit').hide()
			$('#alert-user-deleted').hide()
			$('#show-bookings-box').hide()
			$('#alert-no-bookings').hide()
			getOneUser($($(this)[0]).data('userid'))
			$('html, body').animate({
				scrollTop: ($('#edit-form').offset().top)
			},'slow')
			e.preventDefault()
		})

		$('.deleteUser').click(function(e){
			$('#form').hide()
			$('#edit-form').hide()
			$('#show-alert').hide()
			$('#show-alert-edit').hide()
			$('#show-bookings-box').hide()
			$('#alert-no-bookings').hide()
			deleteUser($($(this)[0]).data('userid'))
			$('#alert-user-deleted').show()
			$('html, body').animate({
				scrollTop: ($('#alert-user-deleted').offset().top)
			},'slow')
			e.preventDefault()
		})

		$('.showBookings').click(function(e){
			console.log("SHOW ME THE BOOKINGS, CLICKED")
			$('#form').hide()
			$('#edit-form').hide()
			$('#show-alert').hide()
			$('#show-alert-edit').hide()
			$('#alert-user-deleted').hide()
			showBookingUser($($(this)[0]).data('userid'))
			$('html, body').animate({
				scrollTop: ($('#show-bookings-box').offset().top)
			},'slow')
			e.preventDefault()
		})
	}

	function editUser(id, data){
		$.ajax({
			method: "PUT",
			url: "http://localhost:3000/660/users/" + id,
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: data,
		}).done(function (data) {
			console.log("dati modificati:", data)
			getAllUsers()
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	function deleteUser(id, data){
		$.ajax({
			url: "http://localhost:3000/660/users/" + id,
			method: "DELETE",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
		}).done(function (data) {
			getAllUsers()
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	function showBookingUser(id, data){
		console.log("I AM INSIDE BOOKINGS FUNCTION")
		$('#show-bookings-alert').html('')
		$.ajax({
			type: "get",
			url: "http://localhost:3000/660/bookings?userId=" + id,
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			}
		}).done(function (data) {
			console.log("DATA:", data)
			if(data[0]){
				$('#alert-no-bookings').hide()
				$('#show-bookings-alert').append('<p>This reservation belogs to customer id: ' + '<b>' + data[0]['userId'] + '</b>' + "<br>" + "Booking date: " + '<b>' + data[0]['booking_date'] + '</b>' + "<br>" + "Vehicle type: " + '<b>' + data[0]['vehicle_type'] + '</b>'+ "<br>" + "Model: " + '<b>' + data[0]['model'] + '</b>' + "<br>" + "Daily cost: " + '<b>' + data[0]['daily_cost'] + '</b>' + "<br>" + "Total cost: " + '<b>' + data[0]['total_cost'] + '</b>' + "<br>" + "Booking status: " + '<b>' + data[0]['booking_status'] + '</b>' + "<br>" + '</p><br>')
				$('#show-bookings-box').show()
			} else {
				console.log("no bookings")
				$('#show-bookings-box').hide()
				$('#alert-no-bookings').show()
			}
		}).fail(function (err)  {
			$('#show-bookings-box').hide()
			$('#alert-no-bookings').show()
		})
	}
})
