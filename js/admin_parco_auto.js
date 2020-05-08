$(document).ready(function() {

	//hide alert in html
	$('#alert-vehicle-deleted').hide()
	$('#vehicle-form').hide()
	$('#alert-vehicle-edited').hide()
	$('#add-vehicle-form').hide()
	$('#alert-error-adding-vehicle').hide()
	$('#alert-vehicle-added').hide()

	getVehicles()

	//Searchbox
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
				{ 'data': 'vehicle_type' },
				{ 'data': 'model' },
				{ 'data': 'registration_year' },
				{ 'data': 'number_plate' },
				{ 'data': 'availability' }
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

	function getVehicles(){
	  var $bus = $('#bus')
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/660/bus_vehicles',
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			}
		}).done(function (response) {

			dataT(response)

			//Vehicle cards
			$bus.html('')
			$(response).each(function(i, vehicle){
	      $bus.append('<div class="col-12 col-md-4 my-4 m-auto justify-items-center" id=" ' + vehicle.id + '">' + '<div class="card mx-auto my-3" style="width: 18rem;">' +
				'<img class="card-img-top" src="../img/bus.jfif" alt="Card image cap">' +
				'<div class="card-body">' +
				'<h5 class="card-title">' + vehicle.vehicle_type + '</h5>' +
				'<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>' + '</div>' +
				'<ul class="list-group list-group-flush">' +
				'<li class="list-group-item">' + "<b>Model </b>" + vehicle.model + '</li>' +
				'<li class="list-group-item">' + "<b>Manufacturer </b>"  + vehicle.manufacturer + '</li>' +
				'<li class="list-group-item">' + "<b>Registration year </b>" + vehicle.registration_year + '</li>' +
				'<li class="list-group-item">' + "<b>Number plate </b>" + vehicle.number_plate + '</li>' +
				'<li class="list-group-item">' + "<b>Availability </b>" + vehicle.availability + '</li>' +
				'<li class="list-group-item m-auto text-center">' +
				'<i data-vehicleid="' + vehicle.id + '" class="far fa-edit px-4 editVehicle"></i>' +
				'<i data-vehicleid="' + vehicle.id + '" class="far fa-trash-alt px-5 deleteVehicle"></i>' +
				'</li></div>')
				loadButtons()
	    })

	    //let's write the total number of users
	    var $number_vehicles = response.length
	    $('#h2').html(function(response) {
	        return "Number of vehicles: " + $number_vehicles
	    })

		}).fail(function (err)  {
			return err
		})
	}

	function getOneVehicle(id){
		$.ajax({
			type: "get",
			url: "http://localhost:3000/660/bus_vehicles/" + id,
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			}
		}).done(function (response) {
				$('#vehicleId').val(response.id)
				$('#editType').val(response.vehicle_type)
				$('#editModel').val(response.model)
				$('#editManufacturer').val(response.manufacturer)
				$('#editRyear').val(response.registration_year)
				$('#editPlate').val(response.number_plate)
				$('#editAvailability').val(response.availability)
				$('#vehicle-form').show()

				$('#edit-vehicle-btn').click( function(e){
					var editType = $('#editType').val()
					var editModel = $('#editModel').val()
					var editManufacturer = $('#editManufacturer').val()
					var editRegYear = $('#editRyear').val()
					var editNPlate = $('#editPlate').val()
					var editAvailability = $('#editAvailability').val()

					let data = {
						vehicle_type: $('#editType').val(),
						model: $('#editModel').val(),
						manufacturer: $('#editManufacturer').val(),
						registration_year: $('#editRyear').val(),
						number_plate: $('#editPlate').val(),
						availability: $('#editAvailability').val()
					}

					if (editType != "" && editModel != "" && editManufacturer != "" && editRegYear != "" && editNPlate != "" && editAvailability != ""){
						editVehicle($('#vehicleId').val(), data)
						e.preventDefault()
					} else {
						$('#alert-error-adding-vehicle').show()
						$('html, body').animate({
							scrollTop: ($('#alert-error-adding-vehicle').height())
						},'slow')
						e.preventDefault()
					}
				})
		}).fail(function (err)  {
			return err
		})
	}

	function loadButtons(){
		$('.editVehicle').click(function(e){
			getOneVehicle($(e.target).data('vehicleid'))
			$('html, body').animate({
				scrollTop: ($('#vehicle-form').height())
			},'slow')
			e.preventDefault()
		})

		$('.deleteVehicle').click(function(e){
			deleteVehicle($(e.target).data('vehicleid'))
			e.preventDefault()
		})
	}

	$('#add-vehicle').click(function(){
		$('#add-vehicle-form').show()
	})

	$('#add-vehicle-btn').click(function(e){

		var type = $('#type').val()
		var model = $('#model').val()
		var manufacturer = $('#manufacturer').val()
		var rYear = $('#year').val()
		var nPlate = $('#plate').val()
		var availability = $('#availability').val()

		let data = {
			vehicle_type: $('#type').val(),
			model: $('#model').val(),
			manufacturer: $('#manufacturer').val(),
			registration_year: $('#year').val(),
			number_plate: $('#plate').val(),
			availability: $('#availability').val()
		}

		$('#alert-vehicle-edited').hide()
		$('#alert-vehicle-deleted').hide()

		if (type != "" && model != "" && manufacturer != "" && rYear != "" && nPlate != "" && availability != ""){
			addVehicle(data)
			e.preventDefault()
		} else {
			$('#alert-error-adding-vehicle').show()
			$('html, body').animate({
				scrollTop: ($('#alert-error-adding-vehicle').offset().top)
			},'slow')
			e.preventDefault()
		}
	})

	function addVehicle(data){
		$.ajax({
			url: "http://localhost:3000/660/bus_vehicles",
			method: "POST",
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			},
			data: data,
		}).done( function(response){
			$('#add-vehicle-form').trigger("reset")
			$('#alert-vehicle-added').show()
			$('html, body').animate({
				scrollTop: ($('#alert-vehicle-added').offset().top)
			},'slow')
			$('#add-vehicle-form').hide()
			getVehicles()
		}).fail( function(err){
			return err
		})
	}

	function editVehicle(id, data){
		$.ajax({
			method: "PUT",
			url: "http://localhost:3000/660/bus_vehicles/" + id,
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			},
			data: data,
		}).done(function (data) {
			$('#alert-vehicle-added').hide()
			$('#vehicle-form').hide()
			$('#alert-vehicle-deleted').hide()
			$('#alert-vehicle-edited').show()
			$('html, body').animate({
				scrollTop: ($('#alert-vehicle-edited').offset().top)
			},'slow')
			getVehicles()
		}).fail(function (err)  {
			return err
		})
	}

	function deleteVehicle(id){
		$.ajax({
			url: "http://localhost:3000/660/bus_vehicles/" + id,
			method: "DELETE",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
		}).done(function (response) {
			$('#alert-vehicle-added').hide()
			$('#alert-vehicle-edited').hide()
			$('#alert-vehicle-deleted').show()
			$('html, body').animate({
				scrollTop: ($('#alert-vehicle-deleted').offset().top)
			},'slow')
			getVehicles()
		}).fail(function (err)  {
			return err
		})
	}

})
