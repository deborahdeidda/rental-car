$(document).ready(function(){

	//hide alert in html
	$('#bookings').hide()
	$('#no-bookings').hide()
	$('#alert-new-booking-added').hide()
	$('#alert-booking-deleted').hide()
	$('#alert-booking-edited').hide()
	$('#new-booking-form').hide()
	$('#edit-booking-form').hide()
	$("#alert-error-editing-booking").hide()
	$("#alert-error-booking").hide()
	$("#alert-error-deleting").hide()
	$("#error-editing-booking").hide()

	getBookings()

	function dataT(response){
		console.log("dati tabella: " + JSON.stringify(response))
		//searchbox
		var datatableInstance = $('#datatable').DataTable({
			retrieve: true,
			paging: true,
			sort: true,
			searching: true,
			data: response,
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
				dataTableColumn.search(this.value).draw()
			})

			searchTextBoxes.on('click', function(e){
				e.stopPropagation()
			})

		})
	}


	function getBookings(){
		$.ajax({
			type: "GET",
			url:"http://localhost:3000/660/bookings?userId="+ localStorage.getItem("userid"),
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			}
		}).done(function (response) {

			//
			dataT(response)

			if(response.length == 0){
				$('#bookings').hide()
				$('#no-bookings').show()
				return response.length
			}

			$('#bookings').html('')
			$(response).each(function(i, booking){
				$('#no-bookings').hide()
				$('#bookings').show()
				$('#bookings').append('<div class="row py-4"><div class="col-12 col-md-6 d-flex align-items-center">' +
					'<img class="img-fluid" src="../img/bus.jfif" alt="Bus">' + '</div>' +
					'<div class="col-12 col-md-6">' +
					'<p>Booking date: <b>' + booking.booking_date +'</b></p>' +
					'<p>Total cost: <b>' + booking.total_cost +'</b></p>' +
					'<p>Booking status: <b>' + booking.booking_status +'</b></p>' +
					'</div><div class="row m-auto text-center"><div class="col-12"><p>Puoi effettuare la cancellazione o modifica solamente se la data odierna dista almeno di 2 giorni dalla data di prenotazione.</p>' +
					'<div class="row mb-4 m-auto text-center"><div class="col-6 d-inline-block px-4">' +
					'<i data-bookingdate="' +  booking.booking_date + '" data-bookingid="' + booking.id + '" class="far fa-edit editBooking"></i><hr></div>' +
					'<div class="col-6 d-inline-block x-4">' +
					'<i data-bookingdate="' +  booking.booking_date + '" data-bookingid="' + booking.id + '" class="far fa-trash-alt deleteBooking"></i><hr>' +

					'</div></div></div>')
				loadButtons()
			})

		}).fail(function (err)  {
			return err
		})

	}

	function getOneBooking(id){
		$.ajax({
			type: "get",
			url: "http://localhost:3000/660/bookings/" + id,
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			}
		}).done(function (response) {
				$('#bookingid').val(response.id)
				$('#editDate').val(response.booking_date)
				$('#editType').val(response.vehicle_type)
				$('#editModel').val(response.model)
				$('#edit-booking-form').show()
		}).fail(function (err)  {
			return err
		})
	}

	//btn - show new booking form
	$('#new-booking').on('click', function(e){
		$('#new-booking-form').show()
	})

	//btn - send data to book
	$('#create-new-booking').on('click', function(e){

		let date = $('#date').val()
		let type = $('#type').val()
		let model = $('#model').val()

		let data = {
			booking_date: $('#date').val(),
			vehicle_type: $('#type').val(),
			model: $('#model').val(),
			daily_cost: 100,
			total_cost: 1000,
			booking_status: "pending",
			userId: parseInt(localStorage.getItem("userid"))
		}

		if (date != "" && type != "" && model != ""){
				$("#alert-error-booking").hide()
				createNewBooking(data)
				e.preventDefault()
		} else {
			$("#alert-error-booking").show()
			$('html, body').animate({
				scrollTop: ($('#alert-error-booking').offset().top)
			},'slow')
			e.preventDefault()
		}
	})

	function createNewBooking(data){
		$.ajax({
			method: "post",
			url: "http://localhost:3000/660/bookings?userId=" + localStorage.getItem("userid"),
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			},
			data: data,
		}).done(function (data) {
			$('#alert-booking-edited').hide()
			$('#alert-booking-deleted').hide()
			$('#alert-new-booking-added').show()
			$('html, body').animate({
				scrollTop: ($('#alert-new-booking-added').offset().top)
			},'slow')
			$('#new-booking-form').hide()
			getBookings()
		}).fail(function (err) {
			return err
		})
	}

	function loadButtons(){
		$('.editBooking').click(function(e){

			var bookingDate = $(e.target).data('bookingdate')
			var fullBookingDate = new Date(bookingDate)

			var todayDate = new Date()

			var difference = todayDate - fullBookingDate

			var millisecondsInOneSecond = 1000
			var secondInOneHour = 3600
			var hoursInOneDay = 24

			var result = parseInt(difference / (millisecondsInOneSecond * secondInOneHour * hoursInOneDay))

			if (result == -2 || result < -2){
				getOneBooking( $(e.target).data('bookingid') )
				$('html, body').animate({
					scrollTop: ($('#edit-booking-form').offset().top)
				},'slow')
				e.preventDefault()
			} else {
				$("#error-editing-booking").show()
				$('html, body').animate({
					scrollTop: ($('#error-editing-booking').offset().top)
				},'slow')
			}

		})

		$('.deleteBooking').click(function(e){

			var bookingDate = $(e.target).data('bookingdate')
			var fullBookingDate = new Date(bookingDate)

			var todayDate = new Date()

			var difference = todayDate - fullBookingDate

			var millisecondsInOneSecond = 1000
			var secondInOneHour = 3600
			var hoursInOneDay = 24

			var result = parseInt(difference / (millisecondsInOneSecond * secondInOneHour * hoursInOneDay))

			if (result == -2 || result < -2){
				deleteBooking( $(e.target).data('bookingid') )
				e.preventDefault()
			} else {
				$("#alert-error-deleting").show()
				$('html, body').animate({
					scrollTop: ($('#alert-error-deleting').offset().top)
				},'slow')
			}

		})
	}

	//btn - send data to edit
	$('#edit-booking-btn').click( function(e){

		var date = $('#editDate').val()
		var type = $('#editType').val()
		var model = $('#editModel').val()

		let data = {
			booking_date: $('#editDate').val(),
			vehicle_type: $('#editType').val(),
			model: $('#editModel').val(),
			daily_cost: 100,
			total_cost: 2000,
			booking_status: "pending",
			userId: localStorage.getItem("userid")
		}

		if (date != "" && type != "" && model != ""){
				editBooking($('#bookingid').val(), data)
				e.preventDefault()
		} else {
			$("#alert-error-editing-booking").show()
			$('html, body').animate({
				scrollTop: ($('#alert-error-editing-booking').offset().top)
			},'slow')
			e.preventDefault()
		}

	})

	function editBooking(id, data){
		$.ajax({
			method: "PUT",
			url: "http://localhost:3000/660/bookings/" + id,
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			},
			data: data,
		}).done(function (data) {
			$('#alert-new-booking-added').hide()
			$('#alert-booking-deleted').hide()
			$('#edit-booking-form').trigger("reset")
			$('#alert-booking-edited').show()
			$('html, body').animate({
				scrollTop: ($('#alert-booking-edited').offset().top)
			},'slow')
			$('#edit-booking-form').hide()
			getBookings()
		}).fail(function (err)  {
			return err
		})
	}

	function deleteBooking(id){
		$.ajax({
			url: "http://localhost:3000/660/bookings/" + id,
			method: "delete",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			}
		}).done(function (response) {
			$('#alert-new-booking-added').hide()
			$('#alert-booking-edited').hide()
			$('#alert-booking-deleted').show()
			$('html, body').animate({
				scrollTop: ($('#alert-booking-deleted').offset().top)
			},'slow')
			getBookings()
		}).fail(function (err)  {
			return err
		})
	}

})
