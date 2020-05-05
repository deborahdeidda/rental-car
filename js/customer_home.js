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
			if(response.length == 0){
				console.log("no bookings")
				$('#no-bookings').show()
			}

			$(response).each(function(i, booking){
				$('#bookings').show()
				$('#bookings').append('<div class="row py-4"><div class="col-12 col-md-6 d-flex align-items-center">' +
					'<img class="img-fluid" src="../img/bus.jfif" alt="Bus">' + '</div>' +
					'<div class="col-12 col-md-6">' +
					'<p>Booking date: <b>' + booking.booking_date +'</b></p>' +
					'<p>Total cost: <b>' + booking.total_cost +'</b></p>' +
					'<p>Booking status: <b>' + booking.booking_status +'</b></p>' +
					'</div><div class="row mb-4 m-auto text-center"><div class="col-2 d-inline-block px-4">' +
					'<i data-bookingid="' + booking.id + '" class="far fa-edit editBooking"></i></div>' +
					'<div class="col-2 d-inline-block x-4">' +
					'<i data-bookingid="' + booking.id + '" class="far fa-trash-alt deleteBooking"></i>' +

					'</div></div></div>')
				loadButtons()
			})

		}).fail(function (err)  {
			console.log("failed")
		})
	}

	function getOneBooking(id){
		console.log("booking id:", id)
		$.ajax({
			type: "get",
			url: "http://localhost:3000/660/bookings/" + id,
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			}
		}).done(function (response) {
				console.log("get one booking: ", response)

				var dailyCost = response.daily_cost
				localStorage.setItem("dailycost", dailyCost)

				var totalCost = response.total_cost
				localStorage.setItem("totalcost", totalCost)

				$($('#edit-booking-form')[0].bookingid).val(response.id)
				$($('#edit-booking-form')[0].editDate).val(response.booking_date)
				$($('#edit-booking-form')[0].editType).val(response.vehicle_type)
				$($('#edit-booking-form')[0].editModel).val(response.model)
				$('#edit-booking-form').show()
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	//new booking btn
	$('#new-booking').on('click', function(e){
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

	function refresh(){
		$('.delete').click(function(){
			location.reload()
		})
	}

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
				userId: (localStorage.getItem("userid"))
			},
		}).done(function (response) {
			console.log("new booking:", response)
			$('#alert-new-booking-added').show()
			$('html, body').animate({
				scrollTop: ($('#alert-new-booking-added').offset().top)
			},'slow')
			refresh()
		}).fail(function (err)  {
			console.log("error:", err)
			// $("#alert-admin-error").show()
		})
	}

	function loadButtons(){
		$('.editBooking').click(function(e){
			getOneBooking($($(this)[0]).data('bookingid'))
			$('html, body').animate({
				scrollTop: ($('#edit-booking-form').offset().top)
			},'slow')
			e.preventDefault()
		})

		$('.deleteBooking').click(function(e){
			deleteBooking($($(this)[0]).data('bookingid'))
			e.preventDefault()
		})
	}

	$('#edit-booking-btn').click( function(e){

		var date = $('#editDate').val()
		var type = $('#editType').val()
		var model = $('#editModel').val()

		let data = {

			booking_date: $($('#edit-booking-form')[0].editDate).val(),
			vehicle_type: $($('#edit-booking-form')[0].editType).val(),
			model: $($('#edit-booking-form')[0].editModel).val(),
			daily_cost: 100,
			total_cost: 2000,
			booking_status: "pending",
			userId: localStorage.getItem("userid")
		}
		console.log("i dati da modificare sono questi:", data)

		if (date != "" && type != "" && model != ""){
				console.log("all fields filled")
				console.log( "invio dati:", $($('#edit-booking-form')[0].bookingid).val(), data )
				editBooking($($('#edit-booking-form')[0].bookingid).val(), data)
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
		console.log("id:", id, "booking:", data)
		$.ajax({
			method: "PUT",
			url: "http://localhost:3000/660/bookings/" + id,
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: data,
		}).done(function (data) {
			console.log("dati modificati:", data)
			$('#edit-booking-form').trigger("reset")
			$('#alert-booking-edited').show()
			$('html, body').animate({
				scrollTop: ($('#alert-booking-edited').offset().top)
			},'slow')
			$('#edit-booking-form').hide()
			refresh()
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	function deleteBooking(id){
		console.log("b.i:", id)
		$.ajax({
			url: "http://localhost:3000/660/bookings/" + id,
			method: "delete",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("I want to delete this booking, jwt:", localStorage.getItem("jwt"))
			}
		}).done(function (response) {
			console.log("booking deleted")
			$('#alert-booking-deleted').show()
			$('html, body').animate({
				scrollTop: ($('#alert-booking-deleted').offset().top)
			},'slow')
			refresh()
		}).fail(function (err)  {
			console.log("failed deleting")
		})
	}

})
