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
		url: 'http://localhost:3000/660/users/' + localStorage.getItem("userid"),
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
		url: 'http://localhost:3000/660/bookings?userId=' + localStorage.getItem("userid"),
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

	//searchbox
	$.ajax({
		type: "get",
		url:"http://localhost:3000/660/bookings?userId="+ localStorage.getItem("userid"),
		contentType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log("jwt:", localStorage.getItem("jwt"))
		},
		success: function (data) {
			console.log("bookings searchbox: ", data)
			var datatableInstance = $('#datatable').DataTable({
				paging: true,
				sort: true,
				searching: true,
				data: data,
				columns: [
					{ 'data': 'booking_date' },
					{ 'data': 'total_cost' },
					{ 'data': 'booking_status' }
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
					console.log("keyup and change")
					dataTableColumn.search(this.value).draw()
				})

				searchTextBoxes.on('click', function(e){
					e.stopPropagation()
				})
			})
		}
	})

	checkBookings()

	function checkBookings(){
		$.ajax({
			type: "get",
			url:"http://localhost:3000/660/bookings?userId="+ localStorage.getItem("userid"),
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			}
		}).done(function (response) {
			console.log("success:", response)
			if(response){
				$(response).each(function(i, booking){
					$('#bookings').show()
					$('#bookings2').show()
					$('#bookings').append('<div class="row py-4"><div class="col-12 col-md-6 d-flex align-items-center">' +
						'<img class="img-fluid" src="../img/bus.jfif" alt="Bus">' + '</div>' +
						'<div class="col-12 col-md-6">' +
						'<p>Booking date: <b>' + booking.booking_date +'</b></p>' +
						'<p>Total cost: <b>' + booking.total_cost +'</b></p>' +
						'<p>Booking status: <b>' + booking.booking_status +'</b></p>' +
						'</div><div class="row mb-4 m-auto text-center"><div class="col-2 d-inline-block px-4">' +
						'<i data-bookingid="' + booking.id + '" data-userid="' + booking.userId + '" class="far fa-edit editBooking"></i></div>' +
						'<div class="col-2 d-inline-block x-4">' +
						'<i data-bookingid="' + booking.id + '" data-userid="' + booking.userId + '" class="far fa-trash-alt deleteBooking"></i>' +

						'</div></div></div>')
					loadButtons()
				})
			} else {
				$('#no-bookings').show()
			}

		}).fail(function (err)  {
			console.log("failed")
		})
	}

	function getOneBooking(bookingID, userID){
		console.log("booking id:", bookingID, "user id:", userID)
		$.ajax({
			type: "get",
			url: "http://localhost:3000/660/bookings?id=" + bookingID + "&userId=" + userID,
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

	//new booking btn
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
			daily_cost: 100,
			total_cost: 1000,
			booking_status: "pending",
			userId: parseInt(localStorage.getItem("userid"))
		}

		console.log("la richiesta di prenotazione è questa:", data)

		if (date != "" && type != "" && model != ""){
				console.log("all fields filled")
				$("#alert-error-booking").hide()
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
			url: "http://localhost:3000/660/bookings?userId=" + localStorage.getItem("userid"),
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: {
				booking_date: $($('#new-booking-form')[0].date).val(),
				vehicle_type: $($('#new-booking-form')[0].type).val(),
				model: $($('#new-booking-form')[0].model).val(),
				daily_cost: 100,
				total_cost: 1000,
				booking_status: "pending",
				userId: JSON.parse((localStorage.getItem("userid")))
			},
		}).done(function (response) {
			console.log("new booking:", response)
			$('#alert-new-booking-added').show()
			$('html, body').animate({
				scrollTop: ($('#alert-new-booking-added').offset().top)
			},'slow')
			checkBookings()
		}).fail(function (err)  {
			console.log("error:", err)
			// $("#alert-admin-error").show()
		})
	}

	function loadButtons(){
		$('.editBooking').click(function(e){
			alert("I want to edit")
			var bookingID = $($(this)[0]).data('bookingid')
			var userID = $($(this)[0]).data('userid')
			getOneBooking(bookingID, userID)
			console.log("edit this:", bookingID, userID)
			$('html, body').animate({
				scrollTop: ($('#edit-booking-form').offset().top)
			},'slow')
			e.preventDefault()
		})

		$('.deleteBooking').click(function(e){
			alert("I want to delete")
			var booking = $($(this)[0])
			var bookingID = $($(this)[0]).data('bookingid')
			var userID = $($(this)[0]).data('userid')
			deleteBooking(bookingID, userID)
			// $('#').show()
			// $('html, body').animate({
			// 	scrollTop: ($('#').offset().top)
			// },'slow')
			e.preventDefault()
		})
	}

	$('#edit-booking-btn').click( function(e){
		alert("clicked")

		var date = $('#editDate').val()
		var type = $('#editType').val()
		var model = $('#editModel').val()

		let data = {

			booking_date: $($('#edit-booking-form')[0].editDate).val(),
			vehicle_type: $($('#edit-booking-form')[0].editType).val(),
			model: $($('#edit-booking-form')[0].editModel).val(),
			daily_cost: parseInt(localStorage.getItem("dailycost")),
			total_cost: parseInt(localStorage.getItem("totalcost")),
			booking_status: localStorage.getItem("bookingstatus")
		}
		console.log("i dati da modificare sono questi:", data)

		if (date != "" && type != "" && model != ""){
				console.log("all fields filled")
				console.log( "invio dati:", $($('#edit-booking-form')[0].id).val(), data )
				editBooking($($('#edit-booking-form')[0].id).val(), data)

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

	function editBooking(bookingID, userID, data){
		console.log("booking id:", bookingID, "user id:", userID, "booking:", data)
		$.ajax({
			method: "PUT",
			url: "http://localhost:3000/660/bookings?id=" + bookingID + "&userId=" + userID,
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: data
		}).done(function (data) {
			console.log("dati modificati:", data)
			$('#edit-booking-form').trigger("reset")
			$('#alert-booking-edited').show()
			$('#edit-booking-form').hide()
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	function deleteBooking(bookingID, userID){
		console.log("booking id:", bookingID, "user id:", userID)
		$.ajax({
			url: "http://localhost:3000/660/bookings?id=" + bookingID + "&userId=" + userID,
			method: "delete",
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("I want to delete this booking, jwt:", localStorage.getItem("jwt"))
			}
		}).done(function (response) {
				console.log("booking deleted")
		}).fail(function (err)  {
			console.log("failed deleting")
		})
	}

})
