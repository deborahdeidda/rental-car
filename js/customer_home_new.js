$(document).ready(function(){

  $.ajax({
  	type: "GET",
  	url:"http://localhost:3000/660/bookings?userId="+ localStorage.getItem("userid"),
  	contentType: "json",
  	beforeSend: function (xhr) {
  		xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
  	}
  }).done(function (response) {
    console.log(response)
    dataTableBookings(response)
    // var bookings = response
    // localStorage.setItem("userBookings", bookings)
  }).fail(function (err)  {
  	return err
  })

	//searchbox
  function dataTableBookings(response){
    console.log("how many b?: ", response)
    var datatableInstance = $('#datatable').DataTable({
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

})
