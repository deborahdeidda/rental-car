$(document).ready(function(){
	console.log("DOM searchbox ready")
	$.ajax({
		url: 'http://localhost:3000/bus_vehicles',
		method: 'get',
		dataType: 'json',
		success: function (data) {
			console.log("data searchbox: ", data)
			var datatableInstance = $('#data-table').DataTable({
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

			$('#data-table thead th').each(function() {
				var title = $('#data-table tfoot th').eq($(this).index()).text()
				$(this).html('<input type="text" placeholder="Search ' + title + '" />')
			})

			datatableInstance.columns().every(function() {
				var dataTableColumn = this

				var searchTextBoxes = $(this.header()).find('input')

				searchTextBoxes.on('keyup change', function() {
					console.log("searchTextBoxes:", searchTextBoxes)
					dataTableColumn.search(this.value).draw()
				})

				searchTextBoxes.on('click', function(e){
					e.stopPropagation()
				})
			})
		}
	})
})