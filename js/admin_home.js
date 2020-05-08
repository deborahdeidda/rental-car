$(document).ready(function() {

	//hide alert in html
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

	getAllUsers()

	//searchbox
	function dataT(response){
		//initialise datatable
		var datatableInstance = $('#datatable').DataTable()
		//destroy
		datatableInstance.destroy()
		//empty
		$('#datatable').empty()
		//populate 
		datatableInstance = $('#datatable').DataTable({
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

		//insert input inside each th table with title
		$('#datatable thead th').each(function () {
			var title = $('#datatable tfoot th').eq($(this).index()).text()
			$(this).html('<input type="text" placeholder="Search ' + title + '" />')
		})

		//for every data in columns
		datatableInstance.columns().every(function () {
			var dataTableColumn = this

			//header input
			var searchTextBoxes = $(this.header()).find('input')

			//on keyup and on change, search value and put the data in table
			searchTextBoxes.on('keyup change', function () {
				dataTableColumn.search(this.value).draw()
			})

			//at click stop sorting data
			searchTextBoxes.on('click', function(e){
				e.stopPropagation()
			})
		})
	}

	$('#new-user').on('click', function(e){
		  $('#form').show()
	})

	function getAllUsers(){
		$('#user').html('')
		$.ajax({
			type: "GET",
			url: "http://localhost:3000/660/users",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			},
			data: {
				test: "test data"
			},
		}).done(function (response) {

			dataT(response)

			//users card
			$(response).each(function(i, user){
				$('#user').append('<div class="col-12 col-md-4">' +
				'<div class="card">' +
				'<img src="../img/avatar.png" alt="Avatar" style="width:100%">' +
				'<div class="container">' +
				'<h4 user-id=" ' + user.id + ' ">' + user.name + ' ' + user.surname + '</h4><br>' +
				'<p><b>ID </b>' + user.id + '</p><br>' +
				'<p><b>NAME </b>' + user.name + '</p><br>' +
				'<p><b>SURNAME </b>' + user.surname + '</p><br>' +
				'<p><b>BIRTHDAY </b>' + user.birthday + '</p><br>' +
				'<p><b>EMAIL </b>' + user.email + '</p><br>' +
				'<div class="row pb-3">' +
				'<div class="col-4 d-inline-block">' +
				'<i data-userid="' + user.id + '" class="far fa-edit editUser"></i>' +
				'<div class="col-4 d-inline-block">' +
				'<i data-userid="' + user.id + '" class="far fa-trash-alt deleteUser"></i>' + '' +
				'</div><div class="col-4 d-inline-block">' + '' +
				'<i data-userid="' + user.id + '" class="fas fa-book showBookings"></i>' +
				'</div></div></div>')
			})

			loadButtons()

				//let's write the total number of users
				var $numberofusers = response.length;
				$('#h2').html(function(response) {
					return "Number of users: " + $numberofusers
				})

		}).fail(function (err)  {
			return err
		})
	}

	//get single user to edit
	function getOneUser(id){
		$.ajax({
			type: "GET",
			url: "http://localhost:3000/660/users/" + id,
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			}
		}).done(function (response) {
				var userPass = response.password
				$('#userId').val(response.id)
				$('#editName').val(response.name)
				$('#editSurname').val(response.surname)
				$('#editBirthday').val(response.birthday)
				$('#editEmail').val(response.email)
				$('#edit-form').show()

				//btn - edit user form
				$('#edit-user-btn').click( function(e){

					var editName = $('#editName').val()
					var editSurname = $('#editSurname').val()
					var editBirthday = $('#editBirthday').val()
					var editBirthday = $('#editEmail').val()

					let data = {
						name: $('#editName').val(),
						surname: $('#editSurname').val(),
						birthday: $('#editBirthday').val(),
						email: $('#editEmail').val(),
						password: userPass,
						role: "customer"
					}

					if (editName != "" && editSurname != "" && editBirthday != "" && editBirthday != "" ){
						$("#alert-error-editing-user").hide()
						editUser($('#userId').val(), data)
						$('#edit-form').trigger("reset")
						$('#show-alert-edit').show()
						$('#edit-form').hide()
						e.preventDefault()
					} else {
						$("#alert-error-editing-user").show()
						e.preventDefault()
					}
				})
		}).fail(function (err)  {
			return err
		})
	}

	//btn - new user form
	$('#create-new-user').on('click', function(e){

		var name = $('#name').val()
		var surname = $('#surname').val()
		var birthday = $('#birthday').val()
		var email = $('#email').val()
		var role = "customer"

		let data = {
			name: $('#name').val(),
			surname: $('#surname').val(),
			birthday: $('#birthday').val(),
			email: $('#email').val(),
			role: "customer"
		}

		$('#edit-form').hide()
		$('#show-alert').hide()
		$('#show-alert-edit').hide()
		$('#alert-user-deleted').hide()
		$('#show-bookings-box').hide()
		$('#alert-no-bookings').hide()

		if (email != "" && name != "" && surname != "" && birthday != "" ){
				createNewUser(data)
				$('#form').trigger("reset")
				$('#show-alert').show()
				$('#form').hide()
				e.preventDefault()
		} else {
			$("#alert-user-error").show()
			$('html, body').animate({
				scrollTop: ($('#alert-user-error').offset().top)
			},'slow')
			e.preventDefault()
		}
	})

	function createNewUser(data){
		$.ajax({
			method: "POST",
			url: "http://localhost:3000/660/users",
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			},
			data: data,
			success: function(data){
				getAllUsers()
			},
			error: function(err){
				return err
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
			getOneUser( $(e.target).data('userid') )
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
			deleteUser( $(e.target).data('userid') )
			$('#alert-user-deleted').show()
			$('html, body').animate({
				scrollTop: ($('#alert-user-deleted').offset().top)
			},'slow')
			e.preventDefault()
		})

		$('.showBookings').click(function(e){
			$('#form').hide()
			$('#edit-form').hide()
			$('#show-alert').hide()
			$('#show-alert-edit').hide()
			$('#alert-user-deleted').hide()
			showBookingUser( $(e.target).data('userid') )
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
			},
			data: data,
		}).done(function (data) {
			getAllUsers()
		}).fail(function (err)  {
			return err
		})
	}

	function deleteUser(id){
		$.ajax({
			url: "http://localhost:3000/660/users/" + id,
			method: "DELETE",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			},
		}).done(function (response) {
			getAllUsers()
		}).fail(function (err) {
			return err
		})
	}

	function showBookingUser(id, data){
		$('#show-bookings-alert').html('')
		$.ajax({
			type: "GET",
			url: "http://localhost:3000/660/bookings?userId=" + id,
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			}
		}).done(function (response) {

			if(response.length == 0){
				console.log("no bookings")
				$('#show-bookings-box').hide()
				$('#alert-no-bookings').show()
			}

			$(response).each(function(i, booking){
					if (booking.booking_status == "confirmed"){
						$('#alert-no-bookings').hide()
						$('#show-bookings-alert').append('<hr>' +
						'<p>This reservation belogs to customer id: ' + '<b>' + booking.userId + '</b>' + "<br>" + "Booking date: " + '<b>' + booking.booking_date + '</b>' + "<br>" +
						"Total cost: " + '<b>' + booking.total_cost + '</b>' + "<br>" +
						"Booking status: " + '<b>' + booking.booking_status + '</b>' + "<br>" +
						"Booking id: " + '<b>' + booking.id + '</b></p>' +
						'<i data-bookingid="' + booking.id + '" class="far fa-trash-alt deleteBooking"></i><br>')
						$('#show-bookings-box').show()
						loadButtonsBookings()
					} else {
						$('#alert-no-bookings').hide()
						$('#show-bookings-alert').append('<hr>' +
						'<p>This reservation belogs to customer id: ' + '<b>' + booking.userId + '</b>' + "<br>" + "Booking date: " + '<b>' + booking.booking_date + '</b>' + "<br>" +
						"Total cost: " + '<b>' + booking.total_cost + '</b>' + "<br>" +
						"Booking status: " + '<b>' + booking.booking_status + '</b><br>' +
						"Booking id: " + '<b>' + booking.id + '</b></p>' +
						'<i data-bookingid="' + booking.id + '" class="far fa-trash-alt deleteBooking px-4"></i>' +
						'<i data-bookingid="' + booking.id + '" data-userid="' + booking.userId + '" data-totalcost="' + booking.total_cost + '" data-dailycost="' + booking.daily_cost + '" data-model="' + booking.model + '" data-type="' + booking.vehicle_type + '" data-bookingdate="' + booking.booking_date + '" data-bookingstatus="' + booking.booking_status + '" class="fas fa-check confirmBooking px-4"></i>')
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
			deleteBooking($(e.target).data('bookingid'))
			e.preventDefault()
		})

		$('.confirmBooking').click(function(e){
			var bookingStatus = $(e.target).data('bookingstatus')
			var userId = $(e.target).data('userid')
			var type = $(e.target).data('type')
			var model = $(e.target).data('model')
			var dailyCost = $(e.target).data('dailycost')
			var totalCost = $(e.target).data('totalcost')
			var bookingDate = $(e.target).data('bookingdate')
			confirmBooking($(e.target).data('bookingid'), bookingStatus, userId, type, totalCost, bookingDate, model)
			e.preventDefault()
		})

	}

	function confirmBooking(id, bookingStatus, userId, type, totalCost, bookingDate, model){
		$.ajax({
			method: "PUT",
			url: "http://localhost:3000/660/bookings/" + id,
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			},
			data: {
				id: id,
				userId: userId,
				model: model,
				booking_date: bookingDate,
				vehicle_type: type,
				daily_cost: 100,
				total_cost:	totalCost,
				booking_status: "confirmed"
			}
		}).done(function (data) {
			$('#show-bookings-box').hide()
			$("#alert-booking-confirmed").show()
			$('html, body').animate({
				scrollTop: ($('#alert-booking-confirmed').offset().top)
			},'slow')
		}).fail(function (err) {
			return err
		})
	}

	function deleteBooking(id){
		$.ajax({
			url: "http://localhost:3000/660/bookings/" + id,
			method: "DELETE",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			},
		}).done(function (response) {
			$('#show-bookings-box').hide()
			$("#alert-booking-deleted").show()
			$('html, body').animate({
				scrollTop: ($('#alert-booking-deleted').offset().top)
			},'slow')
		}).fail(function (err)  {
			return err
		})
	}

})
