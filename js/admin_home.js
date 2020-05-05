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
	$("#alert-error-editing-user").hide()
	$("#alert-booking-deleted").hide()
	$("#alert-booking-confirmed").hide()

	//searchbox
	$.ajax({
		type: 'get',
		url: 'http://localhost:3000/660/users',
		contentType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log("jwt:", localStorage.getItem("jwt"))
		}
	}).done(function (response) {
		console.log("data searchbox: ", response)
		var datatableInstance = $('#datatable').DataTable({
			paging: true,
			sort: true,
			searching: true,
			data: response,
			columns: [
				{ 'data': 'id' },
				{ 'data': 'name' },
				{ 'data': 'surname' },
				{ 'data': 'birthday' },
				{ 'data': 'email' }
			]
		})

		$('#datatable thead th').each(function () {
			var title = $('#datatable tfoot th').eq($(this).index()).text()
			$(this).html('<input type="text" placeholder="Search ' + title + '" />')
		})

		datatableInstance.columns().every(function () {
			var dataTableColumn = this

			var searchTextBoxes = $(this.header()).find('input')

			searchTextBoxes.on('keyup change', function () {
				dataTableColumn.search(this.value).draw()
				console.log("????")
			})

			searchTextBoxes.on('click', function(e){
				e.stopPropagation()
			})
		})
	}).fail(function (err)  {
		console.log("failed:", err)
	})


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

						'<i data-userid="' + user.id + '" class="far fa-edit editUser"></i>' +
						'<div class="col-4 d-inline-block">' +

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

					var editName = $('#editName').val()
					var editSurname = $('#editSurname').val()
					var editBirthday = $('#editBirthday').val()
					var editBirthday = $('#editEmail').val()

					let data = {
						name: $($('#edit-form')[0].editName).val(),
						surname: $($('#edit-form')[0].editSurname).val(),
						birthday: $($('#edit-form')[0].editBirthday).val(),
						email: $($('#edit-form')[0].editEmail).val(),
						password: userPass,
						role: "customer"
					}
					console.log("al click i dati sono questi:", data)

					if (editName != "" && editSurname != "" && editBirthday != "" && editBirthday != "" ){
						console.log("all fields filled:", editName + " " + editSurname + " " +  editBirthday + " " +  editBirthday)
						$("#alert-error-editing-user").hide()
						editUser($($('#edit-form')[0].userId).val(), data)
						$('#edit-form').trigger("reset")
						$('#show-alert-edit').show()
						$('#edit-form').hide()
						e.preventDefault()
					} else {
						console.log("not all fields are filled:", editName + editSurname + editBirthday + editBirthday)
						$("#alert-error-editing-user").show()
						e.preventDefault()
					}
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
			method: "post",
			url: "http://localhost:3000/660/users",
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: data,
			success: function(data){
				console.log("success:", data)
				getAllUsers()
			},
			error: function(){
				console.log("error")
				// $("#alert-admin-error").show()
			}
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

	function deleteUser(id){
		console.log("user id:", id)
		$.ajax({
			url: "http://localhost:3000/660/users/" + id,
			method: "DELETE",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
		}).done(function (response) {
			console.log("success:", response)
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
		}).done(function (response) {
			console.log("DATA:", response)

			if(response.length == 0){
				console.log("no bookings")
				// $('#show-bookings-box').hide()
				$('#alert-no-bookings').show()
			}

			$(response).each(function(i, booking){
					console.log("quante prenotazioni?:", response)
					if (booking.booking_status == "confirmed"){
						$('#alert-no-bookings').hide()
						$('#show-bookings-alert').append('<hr><p>This reservation belogs to customer id: ' + '<b>' + booking.userId + '</b>' + "<br>" + "Booking date: " + '<b>' + booking.booking_date + '</b>' + "<br>" + "Total cost: " + '<b>' + booking.total_cost + '</b>' + "<br>" + "Booking status: " + '<b>' + booking.booking_status + '</b>' + "<br>" + "Booking id: " + '<b>' + booking.id + '</b></p>' + '<i data-bookingid="' + booking.id + '" class="far fa-trash-alt deleteBooking"></i><br>')
						$('#show-bookings-box').show()
					} else if (booking.booking_status == "pending"){
						$('#alert-no-bookings').hide()
						$('#show-bookings-alert').append('<hr><p>This reservation belogs to customer id: ' + '<b>' + booking.userId + '</b>' + "<br>" + "Booking date: " + '<b>' + booking.booking_date + '</b>' + "<br>" + "Total cost: " + '<b>' + booking.total_cost + '</b>' + "<br>" + "Booking status: " + '<b>' + booking.booking_status + '</b><br>' + "Booking id: " + '<b>' + booking.id + '</b></p>' + '<i data-bookingid="' + booking.id + '" class="far fa-trash-alt deleteBooking px-4"></i>' + '<i data-bookingid="' + booking.id + '" data-userid="' + booking.userId + '" data-totalcost="' + booking.total_cost + '" data-dailycost="' + booking.daily_cost + '" data-model="' + booking.model + '" data-type="' + booking.vehicle_type + '" data-bookingdate="' + booking.booking_date + '" data-bookingstatus="' + booking.booking_status + '" class="fas fa-check confirmBooking px-4"></i>')
						$('#show-bookings-box').show()
						loadButtonsBookings()
					}
			})

		}).fail(function (err)  {
			$('#show-bookings-box').hide()
			$('#alert-no-bookings').show()
		})
	}

	function loadButtonsBookings(){

		$('.deleteBooking').click(function(e){
			deleteBooking($($(this)[0]).data('bookingid'))
			e.preventDefault()
		})

		$('.confirmBooking').click(function(e){
			var bookingStatus = $($(this)[0]).data('bookingstatus')
			var userId = $($(this)[0]).data('userid')
			var type = $($(this)[0]).data('type')
			var model = $($(this)[0]).data('model')
			var dailyCost = $($(this)[0]).data('dailycost')
			var totalCost = $($(this)[0]).data('totalcost')
			var bookingDate = $($(this)[0]).data('bookingdate')
			confirmBooking($($(this)[0]).data('bookingid'), bookingStatus, userId, type, totalCost, bookingDate, model)
			e.preventDefault()
		})

	}

	function confirmBooking(id, bookingStatus, userId, type, totalCost, bookingDate, model){
		console.log("booking data:", id, bookingStatus, userId, type, totalCost, bookingDate, model)
		$.ajax({
			method: "PUT",
			url: "http://localhost:3000/660/bookings/" + id,
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: {
				id: $($(this)[0]).data('bookingid'),
				userId: userId,
				model: model,
				booking_date: bookingDate,
				vehicle_type: type,
				daily_cost: 100,
				total_cost:	totalCost,
				booking_status: "confirmed"
			}
		}).done(function (data) {
			console.log("dati confermati:", data)
			$('#show-bookings-box').hide()
			$("#alert-booking-confirmed").show()
			$('html, body').animate({
				scrollTop: ($('#alert-booking-confirmed').offset().top)
			},'slow')
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	function deleteBooking(id){
		console.log("booking id:", id)
		$.ajax({
			url: "http://localhost:3000/660/bookings/" + id,
			method: "DELETE",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
		}).done(function (response) {
			console.log("booking deleted:", response)
			$('#show-bookings-box').hide()
			$("#alert-booking-deleted").show()
			$('html, body').animate({
				scrollTop: ($('#alert-booking-deleted').offset().top)
			},'slow')
		}).fail(function (err)  {
			console.log("failed deleting:", err)
		})
	}


})
