$(document).ready(function(){
	console.log("DOM ready")
	$('#bookings').hide()
	$('#bookings2').hide()
	$('#no-bookings').hide()
	$('#alert-new-booking-added').hide()
	$('#alert-booking-deleted').hide()
	$('#alert-booking-edited').hide()
	$('#new-booking-form').hide()
	$('#edit-booking-form').hide()
	$("#alert-error-editing-booking").hide()
	$("#alert-error-booking").hide()

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/600/users/' + localStorage.getItem("userid"),
		contentType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log("jwt:", localStorage.getItem("jwt"))
		}
	}).done(function (response) {
		console.log("user id is:", response.id)
	}).fail(function (err)  {
		console.log("failed:", err)
	})

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/600/bookings?userId=' + localStorage.getItem("userid"),
		contentType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log("jwt:", localStorage.getItem("jwt"))
		}
	}).done(function (response) {
		console.log("bookings:", response[0])
	}).fail(function (err)  {
		console.log("failed:", err)
	})

	checkBookings()

	function checkBookings(){
		$.ajax({
			type: "get",
			url:"http://localhost:3000/600/bookings?userId="+ localStorage.getItem("userid"),
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			}
		}).done(function (response) {
			console.log("success:", response[0])
			if(response[0]){
				$(response).each(function(i, booking){
					$('#bookings').show()
					$('#bookings').append('<div class="col-12 col-md-6 d-flex align-items-center">' +
						'<img class="img-fluid" src="../img/bus.jfif" alt="Bus">' + '</div>' +
						'<div class="col-12 col-md-6">' +
						'<h2>' + booking.vehicle_type + '</h2>' +
						'<p>Model: <b>' + booking.model +'</b></p>' +
						'<p>Booking date: <b>' + booking.booking_date +'</b></p>' +
						'<p>Daily cost: <b>' + booking.daily_cost +'</b></p>' +
						'<p>Total cost: <b>' + booking.total_cost +'</b></p>' +
						'</div>')
					$('#bookings2').show()
					$('#bookings2').append('<div class="row pb-3 justify-content-center"><div class="col-2 d-inline-block">' +
					'<i data-userid="' + response[0]['userId'] + '" id="editBooking" class="far fa-edit"></i></div>' +
					'<div class="col-2 d-inline-block">' +
					'<i data-userid="' + response[0]['userId'] + '" id="deleteBooking" class="far fa-trash-alt"></i>' +

					'</div></div>')
					loadButtons()
				})
			} else {
				$('#no-bookings').show()
			}

		}).fail(function (err)  {
			console.log("failed")
		})
	}

	function getOneBooking(id){
		$.ajax({
			type: "get",
			url: "http://localhost:3000/600/bookings?userId=" + localStorage.getItem("userid"),
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			}
		}).done(function (response) {
				console.log("get one booking: ", response[0])
				var id = response[0]['id']
				localStorage.setItem("Id", id)
				var dailyCost = response[0]['daily_cost']
				localStorage.setItem("dailycost", dailyCost)
				var totalCost = response[0]['total_cost']
				localStorage.setItem("totalcost", totalCost)
				var bookingStatus = response[0]['booking_status']
				localStorage.setItem("bookingstatus", bookingStatus)
				$($('#edit-booking-form')[0].userId).val(response[0].userId)
				$($('#edit-booking-form')[0].editDate).val(response[0].booking_date)
				$($('#edit-booking-form')[0].editType).val(response[0].vehicle_type)
				$($('#edit-booking-form')[0].editModel).val(response[0].model)
				$('#edit-booking-form').show()
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	$('#new-booking').on('click', function(e){
		alert("clicked")
		$('#new-booking-form').show()
	})

	$('#create-new-booking').on('click', function(e){

		let date = $('#date').val()
		let type = $('#type').val()
		let model = $('#model').val()

		let data = {
			booking_date: $($('#new-booking-form')[0].date).val(),
			vehicle_type: $($('#new-booking-form')[0].type).val(),
			model: $($('#new-booking-form')[0].model).val(),
			daily_cost: localStorage.getItem("dailycost"),
			total_cost: localStorage.getItem("totalcost"),
			booking_status: "awaiting"
		}

		console.log("la richiesta di prenotazione è questa:", data)

		if (date != "" && type != "" && model != ""){
				console.log("all fields filled")
				createNewBooking(data)
				e.preventDefault()
		} else {
			console.log("not all fields are filled")
			$("#alert-error-booking").show()
			$('html, body').animate({
				scrollTop: ($('#alert-error-booking').offset().top)
			},'slow')
			e.preventDefault()
		}
	})

	function createNewBooking(){
		$.ajax({
			method: "post",
			url: "http://localhost:3000/660/bookings",
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: {
				booking_date: $($('#new-booking-form')[0].date).val(),
				vehicle_type: $($('#new-booking-form')[0].type).val(),
				model: $($('#new-booking-form')[0].model).val(),
				daily_cost: localStorage.getItem("dailycost"),
				total_cost: localStorage.getItem("totalcost"),
				booking_status: "awaiting",
				userId: localStorage.getItem("userid")
			},
		}).done(function (response) {
			console.log("success:", response)
			$('#alert-new-booking-added').show()
			$('html, body').animate({
				scrollTop: ($('#alert-new-booking-added').offset().top)
			},'slow')
		}).fail(function (err)  {
			console.log("error:", err)
			// $("#alert-admin-error").show()
		})
	}

	function loadButtons(){
		$('#editBooking').click(function(e){
			alert("I want to edit")
			getOneBooking($($(this)[0]).data('userid'))
			$('html, body').animate({
				scrollTop: ($('#edit-booking-form').offset().top)
			},'slow')
			e.preventDefault()
		})

		$('#deleteBooking').click(function(e){
			alert("I want to delete")
			deleteBooking($($(this)[0]).data('userid'))
			// $('#').show()
			// $('html, body').animate({
			// 	scrollTop: ($('#').offset().top)
			// },'slow')
			e.preventDefault()
		})
	}

	$('#edit-booking-btn').click( function(e){
		alert("clicked")

		let date = $('#editDate').val()
		let type = $('#editType').val()
		let model = $('#editModel').val()

		let data = {
			booking_date: $($('#edit-booking-form')[0].editDate).val(),
			vehicle_type: $($('#edit-booking-form')[0].editType).val(),
			model: $($('#edit-booking-form')[0].editModel).val(),
			daily_cost: localStorage.getItem("dailycost"),
			total_cost: localStorage.getItem("totalcost"),
			booking_status: localStorage.getItem("bookingstatus")
		}
		console.log("i dati da modificare sono questi:", data)

		if (date != "" && type != "" && model != ""){
				console.log("all fields filled")
				editBooking($($('#edit-booking-form')[0].userId).val(), data)
				e.preventDefault()
		} else {
			console.log("not all fields are filled")
			$("#alert-error-editing-booking").show()
			$('html, body').animate({
				scrollTop: ($('#alert-error-editing-booking').offset().top)
			},'slow')
			e.preventDefault()
		}

	})

	function editBooking(id, data){
		console.log("editBooking function, what are: ", id, data)
		$.ajax({
			method: "PUT",
			url: "http://localhost:3000/660/bookings?userId=" + id,
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: data,
		}).done(function (response) {
			console.log("dati modificati:", response)
			$('#edit-booking-form').trigger("reset")
			$('#alert-booking-edited').show()
			$('#edit-booking-form').hide()
		}).fail(function (err) {
			console.log("booking failed:", err)
		})
	}

	function deleteBooking(id, data){
		console.log("cosa sono:", id, data)
		$.ajax({
			method: "DELETE",
			url: "http://localhost:3000/660/bookings?userId=" + localStorage.getItem("userid"),
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("I want to delete this booking, jwt:", localStorage.getItem("jwt"))
			},
			success: function(data){
				console.log("booking deleted")
			},
			error: function(err){
				console.log("failed deleting")
			}
		})
	}

})
