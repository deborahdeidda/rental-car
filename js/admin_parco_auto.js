$(document).ready(function() {

	$('#alert-vehicle-deleted').hide()
	$('#vehicle-form').hide()
	$('#alert-vehicle-edited').hide()
	$('#add-vehicle-form').hide()
	$('#alert-error-adding-vehicle').hide()
	$('#alert-vehicle-added').hide()


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
		url: 'http://localhost:3000/660/bus_vehicles',
		contentType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log("jwt:", localStorage.getItem("jwt"))
		}
	}).done(function (response) {
		console.log("bus vehicles are:", response)
	}).fail(function (err)  {
		console.log("failed:", err)
	})

	//Searchbox
  $.ajax({
    url: 'http://localhost:3000/660/bus_vehicles',
    method: 'get',
    dataType: 'json',
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log("jwt:", localStorage.getItem("jwt"))
		},
    success: function (data) {
      console.log("data searchbox: ", data)
      var datatableInstance = $('#datatable').DataTable({
        paging: true,
        sort: true,
        searching: true,
        data: data,
        columns: [
          { 'data': 'vehicle_type' },
          { 'data': 'model' },
          { 'data': 'registration_year' },
          { 'data': 'number_plate' },
          { 'data': 'availability' }
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
          console.log("?")
          dataTableColumn.search(this.value).draw()
        })

        searchTextBoxes.on('click', function(e){
          e.stopPropagation()
        })
      })
    }
  })

	getVehicles()

	function getVehicles(){
		//variables
	  var $bus = $('#bus')
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/660/bus_vehicles',
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			}
		}).done(function (response) {
			console.log("bus vehicles are:", response)
			$bus.html('');//clear select
			$(response).each(function(i, vehicle){
	      $bus.append('<div class="col-12 col-md-4 my-4 m-auto justify-items-center" id=" ' + vehicle.id + '">' + '<div class="card mx-auto my-3" style="width: 18rem;"><img class="card-img-top" src="../img/bus.jfif" alt="Card image cap"><div class="card-body"><h5 class="card-title">' + vehicle.vehicle_type + '</h5>' + '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>' + '</div>' + '<ul class="list-group list-group-flush"><li class="list-group-item">' + "<b>Model </b>" + vehicle.model + '</li><li class="list-group-item">' + "<b>Manufacturer </b>"  + vehicle.manufacturer + '</li><li class="list-group-item">' + "<b>Registration year </b>" + vehicle.registration_year + '</li><li class="list-group-item">' + "<b>Number plate </b>" + vehicle.number_plate + '</li><li class="list-group-item">' + "<b>Availability </b>" + vehicle.availability + '</li><li class="list-group-item m-auto text-center">' +

				'<i data-vehicleid="' + vehicle.id + '" class="far fa-edit px-4 editVehicle"></i>' +
				'<i data-vehicleid="' + vehicle.id + '" class="far fa-trash-alt px-5 deleteVehicle"></i>' +

				'</li>' + '</div>')
				loadButtons()
	    })

	    //let's write the total number of users
	    var $number_vehicles = response.length
	    $('#h2').html(function(response) {
	        return "Number of vehicles: " + $number_vehicles
	    })

		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	function getOneVehicle(id){
		$.ajax({
			type: "get",
			url: "http://localhost:3000/660/bus_vehicles/" + id,
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			}
		}).done(function (response) {
				console.log("get one user vehicle: ", response)
				$($('#vehicle-form')[0].vehicleId).val(response.id)
				$($('#vehicle-form')[0].editType).val(response.vehicle_type)
				$($('#vehicle-form')[0].editModel).val(response.model)
				$($('#vehicle-form')[0].editManufacturer).val(response.manufacturer)
				$($('#vehicle-form')[0].editRyear).val(response.registration_year)
				$($('#vehicle-form')[0].editPlate).val(response.number_plate)
				$($('#vehicle-form')[0].editAvailability).val(response.availability)
				$('#vehicle-form').show()

				$('#edit-vehicle-btn').click( function(e){
					console.log("clicked")

					var editType = $('#editType').val()
					var editModel = $('#editModel').val()
					var editManufacturer = $('#editManufacturer').val()
					var editRegYear = $('#editRyear').val()
					var editNPlate = $('#editPlate').val()
					var editAvailability = $('#editAvailability').val()

					let data = {
						vehicle_type: $($('#vehicle-form')[0].editType).val(),
						model: $($('#vehicle-form')[0].editModel).val(),
						manufacturer: $($('#vehicle-form')[0].editManufacturer).val(),
						registration_year: $($('#vehicle-form')[0].editRyear).val(),
						number_plate: $($('#vehicle-form')[0].editPlate).val(),
						availability: $($('#vehicle-form')[0].editAvailability).val()
					}
					console.log("al click i dati sono questi:", data)

					if (editType != "" && editModel != "" && editManufacturer != "" && editRegYear != "" && editNPlate != "" && editAvailability != ""){
						console.log("all fields filled")
						// $("#alert-error-editing-user").hide()
						editVehicle($($('#vehicle-form')[0].vehicleId).val(), data)
						// $('#edit-form').trigger("reset")
						// $('#show-alert-edit').show()
						// $('#edit-form').hide()
						e.preventDefault()
					} else {
						console.log("not all fields are filled")
						// $("#alert-error-editing-user").show()
						e.preventDefault()
					}
				})
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	function refresh(){
		$('.delete').click(function(){
			location.reload()
		})
	}

	function loadButtons(){
		$('.editVehicle').click(function(e){
			getOneVehicle($($(this)[0]).data('vehicleid'))
			$('html, body').animate({
				scrollTop: ($('#vehicle-form').height())
			},'slow')
			e.preventDefault()
		})

		$('.deleteVehicle').click(function(e){
			deleteVehicle($($(this)[0]).data('vehicleid'))
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
			vehicle_type: $($('#add-vehicle-form')[0].type).val(),
			model: $($('#add-vehicle-form')[0].model).val(),
			manufacturer: $($('#add-vehicle-form')[0].manufacturer).val(),
			registration_year: $($('#add-vehicle-form')[0].year).val(),
			number_plate: $($('#add-vehicle-form')[0].plate).val(),
			availability: $($('#add-vehicle-form')[0].availability).val()
		}

		$('#alert-vehicle-edited').hide()
		$('#alert-vehicle-deleted').hide()

		if (type != "" && model != "" && manufacturer != "" && rYear != "" && nPlate != "" && availability != ""){
			console.log("all fields filled")
			addVehicle(data)
			$('#add-vehicle-form').trigger("reset")
			$('#alert-vehicle-added').show()
			$('html, body').animate({
				scrollTop: ($('#alert-vehicle-added').offset().top)
			},'slow')
			$('#add-vehicle-form').hide()
			refresh()
			e.preventDefault()
		} else {
			console.log("not all fields are filled")
			$('#alert-error-adding-vehicle').show()
			$('html, body').animate({
				scrollTop: ($('#alert-error-adding-vehicle').offset().top)
			},'slow')
			refresh()
			e.preventDefault()
		}
	})

	function addVehicle(data){
		console.log("data:", data)
		$.ajax({
			url: "http://localhost:3000/660/bus_vehicles",
			method: "POST",
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt (function post vehicle):", localStorage.getItem("jwt"))
			},
			data: data,
		}).done( function(response){
			console.log("new vehicle added")
			// $('#alert-vehicle-added').show()
			// $('html, body').animate({
			// 	scrollTop: ($('#alert-vehicle-added').offset().top)
			// },'slow')
		}).fail( function(err){
			console.log("error adding vehicle")
		})
	}

	function editVehicle(id, data){
		$.ajax({
			method: "PUT",
			url: "http://localhost:3000/660/bus_vehicles/" + id,
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
			data: data,
		}).done(function (data) {
			console.log("dati modificati:", data)
			$('#alert-vehicle-added').hide()
			$('#vehicle-form').hide()
			$('#alert-vehicle-deleted').hide()
			$('#alert-vehicle-edited').show()
			$('html, body').animate({
				scrollTop: ($('#alert-vehicle-edited').offset().top)
			},'slow')
			refresh()
		}).fail(function (err)  {
			console.log("failed:", err)
		})
	}

	function deleteVehicle(id){
		console.log("vehicle id:", id)
		$.ajax({
			url: "http://localhost:3000/660/bus_vehicles/" + id,
			method: "DELETE",
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
				console.log("jwt:", localStorage.getItem("jwt"))
			},
		}).done(function (response) {
			console.log("vehicle deleted:", response)
			$('#alert-vehicle-added').hide()
			$('#alert-vehicle-edited').hide()
			$('#alert-vehicle-deleted').show()
			$('html, body').animate({
				scrollTop: ($('#alert-vehicle-deleted').offset().top)
			},'slow')
			refresh()
		}).fail(function (err)  {
			console.log("failed deleting vehicle:", err)
		})
	}

})

// $(document).ready(function(){
// 	console.log("DOM searchbox ready")
// 	$.ajax({
// 		url: 'http://localhost:3000/660/bus_vehicles',
// 		method: 'get',
// 		dataType: 'json',
// 		success: function (data) {
// 			console.log("data searchbox: ", data)
// 			var datatableInstance = $('#data-table').DataTable({
// 				paging: true,
// 				sort: true,
// 				searching: true,
// 				data: data,
// 				columns: [
// 					{ 'data': 'vehicle_type' },
// 					{ 'data': 'model' },
// 					{ 'data': 'registration_year' },
// 					{ 'data': 'number_plate' },
// 					{ 'data': 'availability' }
// 				]
// 			})
//
// 			$('#data-table thead th').each(function() {
// 				var title = $('#data-table tfoot th').eq($(this).index()).text()
// 				$(this).html('<input type="text" placeholder="Search ' + title + '" />')
// 			})
//
// 			datatableInstance.columns().every(function() {
// 				var dataTableColumn = this
//
// 				var searchTextBoxes = $(this.header()).find('input')
//
// 				searchTextBoxes.on('keyup change', function() {
// 					console.log("searchTextBoxes:", searchTextBoxes)
// 					dataTableColumn.search(this.value).draw()
// 				})
//
// 				searchTextBoxes.on('click', function(e){
// 					e.stopPropagation()
// 				})
// 			})
// 		}
// 	})
// })
