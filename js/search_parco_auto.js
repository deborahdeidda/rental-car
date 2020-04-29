$(document).ready(function(){
	console.log("DOM searchbox ready")
	$.ajax({
		url: 'http://localhost:3000/bus_vehicles',
		method: 'get',
		dataType: 'json',
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
})

//OLD SEARCHBOX - NOT FILTERS
// $(document).ready(function(){
// 	$('#search').keyup(function(){
// 		$.getJSON("http://localhost:3000/bus_vehicles", function(data){
// 			var searchField = $('#search').val()
// 			var regex = new RegExp(searchField, 'i')
// 			console.log("regex:", regex)
// 			var output
// 			console.log("data:", data)
// 			$.each(data, function(key, value){
// 				console.log("data:", data, "value id:", value.id)
// 				if (value.vehicle_type.search(regex) != -1 || value.model.search(regex) != -1){
// 					output += "<tr>"
// 					output += "<td id=' " + key + " ' > " + value.vehicle_type + " </td>"
// 					output += "<td id=' " + key + " ' > " + value.model + " </td>"
// 					output += "<td id=' " + key + " ' > " + value.registration_year + " </td>"
// 					output += "<td id=' " + key + " ' > " + value.number_plate + " </td>"
// 					output += "<td id=' " + key + " ' > " + value.availability + " </td>"
// 					output += " </td>"
// 				} else {
// 					$('tbody').html("not found")
// 				}
// 			})
// 			$('tbody').html(output)
// 		})
// 	})
// })