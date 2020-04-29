$(document).ready(function(){
	console.log("DOM searchbox ready")
	$.ajax({
		url: 'http://localhost:3000/users',
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
					{ 'data': 'id' },
					{ 'data': 'name' },
					{ 'data': 'surname' },
					{ 'data': 'birthday' },
					{ 'data': 'email' }
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
					console.log("????")
				})

				searchTextBoxes.on('click', function(e){
					e.stopPropagation()
				})
			})
		}
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