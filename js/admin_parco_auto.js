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
      $bus.append('<div class="col-12 col-md-4" id=" ' + vehicle.id + '">' + '<div class="card" style="width: 18rem;"><img class="card-img-top" src="../img/bus.jfif" alt="Card image cap"><div class="card-body"><h5 class="card-title">' + vehicle.vehicle_type + '</h5>' + '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>' + '</div>' + '<ul class="list-group list-group-flush"><li class="list-group-item">' + "<b>Model </b>" + vehicle.model + '</li><li class="list-group-item">' + "<b>Manufacturer </b>"  + vehicle.manufacturer + '</li><li class="list-group-item">' + "<b>Registration year </b>" + vehicle.registration_year + '</li><li class="list-group-item">' + "<b>Number plate </b>" + vehicle.number_plate + '</li><li class="list-group-item">' + "<b>Availability </b>" + vehicle.availability + '</li><li class="list-group-item">' +

			'<i data-userid="' + vehicle.id + '" class="far fa-edit px-4 editVehicle"></i>' +
			'<i data-userid="' + vehicle.id + '" class="far fa-trash-alt px-5 deleteVehicle"></i>' +
			'<i data-userid="' + vehicle.id + '" class="fas fa-user-plus px-4 addVehicle"></i>' +

			'</li>' + '</div>')
    })

    //let's write the total number of users
    var $number_vehicles = response.length
    $('#h2').html(function(response) {
        return "Number of vehicles: " + $number_vehicles
    })

	}).fail(function (err)  {
		console.log("failed:", err)
	})

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
