$(document).ready(function() {

	$('#form').hide()
	$('#edit-form').hide()
	$('#show-alert').hide()
	$('#show-alert-edit').hide()
	$('#alert-user-deleted').hide()
	$('#show-bookings-box').hide()

	getAllUsers()

	$('#new-user').on('click', function(e){
		  $('#form').show()
	})

	function getAllUsers(){
		$('#user').html('')
		$.ajax({
			url: "http://localhost:3000/users",
			method: "get",
			dataType: "json",
			data: {
				test: "test data"
			},
			success: function(data){
				$(data).each(function(i, user){
					$('#user').append('<div class="col-12 col-md-4">' + '<div class="card">' + '<img src="../img/avatar.png" alt="Avatar" style="width:100%">' + '<div class="container">' + '<h4 user-id=" ' + user.id + ' ">' + user.name + ' ' + user.surname + '</h4><br>' + '<p><b>ID </b>' + user.id + '</p><br>' + '<p><b>NAME </b>' + user.name + '</p><br>' + '<p><b>SURNAME </b>' + user.surname + '</p><br>' + '<p><b>BIRTHDAY </b>' + user.birthday + '</p><br>' + '<p><b>NAME </b>' + user.name + '</p><br>' + '<p><b>MAIL </b>' + user.mail + '</p><br>' + '<p><b>BOOKINGS </b>' + user.bookings + '</p><br>' + '<div class="row pb-3"><div class="col-4 d-inline-block">' +

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
				var $numberofusers = data.length;
				$('#h2').html(function(data) {
					return "Number of users: " + $numberofusers
				})

				loadButtons()
			}
		})
	}

	function getOneUser(id){
		$.ajax({
			url: "http://localhost:3000/users/" + id,
			method: "get",
			dataType: "json",
			success: function(data){
				$($('#edit-form ')[0].userId).val(data.id)
				$($('#edit-form')[0].editName).val(data.name)
				$($('#edit-form')[0].editSurname).val(data.surname)
				$($('#edit-form')[0].editBirthday).val(data.birthday)
				$($('#edit-form')[0].editMail).val(data.mail)
				$('#edit-form').show()
			}
		})
	}

	$('#create-new-user').on('click', function(e){
		let data = {
			name: $($('#form')[0].name).val(),
			surname: $($('#form')[0].surname).val(),
			birthday: $($('#form')[0].birthday).val(),
			mail: $($('#form')[0].mail).val()
		}

		createNewUser(data)
		$('#form').trigger("reset")
		$('#show-alert').show()
		$('#form').hide()
		e.preventDefault()

		
	})

	function createNewUser(data){
		$.ajax({
			url: "http://localhost:3000/users",
			method: "POST",
			dataType: "json",
			data: data,
			success: function(data){
				console.log(data)
				getAllUsers()
			}
		})
	}

	function loadButtons(){
		$('.editUser').click(function(e){
			getOneUser($($(this)[0]).data('userid'))
			e.preventDefault()
		})

		$('.deleteUser').click(function(e){
			deleteUser($($(this)[0]).data('userid'))
			$('#alert-user-deleted').show()
			e.preventDefault()
		})

		$('.showBookings').click(function(e){
			showBookingUser($($(this)[0]).data('userid'))
			e.preventDefault()
		})
	}

	function editUser(id, data){
		$.ajax({
			url: "http://localhost:3000/users/" + id,
			method: "PUT",
			dataType: "json",
			data: data,
			success: function(data){
				console.log(data)
				getAllUsers()
			}
		})
	}

	$('#edit-user-btn').click( function(e){

		let data = {
			name: $($('#edit-form')[0].editName).val(),
			surname: $($('#edit-form')[0].editSurname).val(),
			birthday: $($('#edit-form')[0].editBirthday).val(),
			mail: $($('#edit-form')[0].editMail).val()
		}

		editUser($($('#edit-form')[0].userId).val(), data)
		$('#edit-form').trigger("reset")
		$('#show-alert-edit').show()
		$('#edit-form').hide()
		e.preventDefault()
	})

	function deleteUser(id, data){
		$.ajax({
			url: "http://localhost:3000/users/" + id,
			method: "GET",
			dataType: "json",
			success: function(data){
				console.log(data)
				getAllUsers()
			}
		})
	}

	function showBookingUser(id, data){

		$('#show-bookings-alert').html('')
		$.ajax({
			url: "http://localhost:3000/bookings/" + id,
			method: "get",
			dataType: "json",
			data: {
				bookings: "booking user"
			},
			success: function(data){
						$('#show-bookings-alert').append('<p>This reservation belogs to customer id: ' + '<b>' + data.userId + '</b>' + "<br>" + "Reservation date: " + '<b>' + data.booking_date + '</b>' + "<br>" + "Vehicle type: " + '<b>' + data.vehicle_type + '</b>' + "Model: " + '<b>' + data.model + '</b>' + "<br>" + "Total cost: " + '<b>' + data.total_cost + '</b>' + "<br>" + "Booking status: " + '<b>' + data.booking_status + '</b>' + "<br>" + '</p><br>')
						$('#show-bookings-box').show()
						console.log(data)
				}
				//let's write the total number of users
				// var $numberofusers = data.length;
				// $('#h2').html(function(data) {
				// 	return "Number of users: " + $numberofusers
				// })

		})
	}
})