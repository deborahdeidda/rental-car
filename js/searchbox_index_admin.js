$(document).ready(function(){

	var table = $('#data-table').DataTable()

	$(document).on('change', '#drop-down-data', function(){

		console.log("on change")

		$.getJSON("http://localhost:3000/users", function(data){

			var selectField = 1
			$(document).on('change', '#drop-down-data', function(){

				selectField = this.value

			})
			console.log("selectField 2:", selectField)

			var regex = new RegExp(selectField, 'i')

			console.log("regex:", regex)

			var output

			console.log("data:", data)
			
			$.each(data, function(key, value){
				console.log("data:", data, "value id:", value.id)
				if (value.vehicle_type.search(regex) != -1 || value.model.search(regex) != -1){
					output += "<tr>"
					output += "<td id=' " + key + " ' > " + value.vehicle_type + " </td>"
					output += "<td id=' " + key + " ' > " + value.model + " </td>"
					output += "<td id=' " + key + " ' > " + value.registration_year + " </td>"
					output += "<td id=' " + key + " ' > " + value.number_plate + " </td>"
					output += "<td id=' " + key + " ' > " + value.availability + " </td>"
					output += " </td>"
				} else {
					$('tbody').html("not found")
				}
			})
			$('tbody').html(output)
		})
	})
})

// $(document).ready(function(){
// 	function searchByColumn(table){
// 		var defaultSearch = 1 //Name
// 		$(document).on('change', '#drop-down-data', function(){
// 			defaultSearch = this.value
// 		})
//
// 		$(document).on('change', '#search-by-column', function(){
// 			table.search('').column().search('').draw()
// 			table.column(defaultSearch).search(this.value).draw()
// 		})
// 	}
// 	var table = $('#data-table').DataTable()
// 	searchByColumn(table)
// })

// $(document).ready(function(){
// 	console.log("ready")
// 	$.ajax({
// 		url: "http://localhost:3000/users",
// 		method: "post",
// 		dataType: "json",
// 		success: function(data){
// 			console.log("success")
// 			var datatableInstance = $('#data-table').DataTable({
// 				paging: true,
// 				sort: true,
// 				searching: true,
// 				scroll: true,
// 				data: console.log("data: ",data),
// 				columns: [
// 					{'data': 'id' },
// 					{'data': 'name' },
// 					{'data': 'surname' },
// 					{'data': 'birthday' },
// 					{'data': 'email' }
// 				]
// 			})
//
// 			$('#data-table thead th').each(function(){
// 				var title = $('#data-table tfoot th').eq($(this).index()).text()
// 				$(this).html('<input type="text" placeholder="Search ' + title + ' "/>')
// 			})
//
// 			datatableInstance.columns().every(function(){
// 				var datatableColumn = this
// 				var searchtextBoxes = $(this.header()).find('input')
//
// 				searchtextBoxes.on('keyup change', function(){
// 					datatableColumn.search(this.value).draw()
// 				})
//
// 				searchtextBoxes.on('click', function(e){
// 					e.stopPropagation()
// 				})
// 			})
// 		}
// 	})
// })