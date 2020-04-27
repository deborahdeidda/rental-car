$(document).ready(function(){
	$('#search').keyup(function(){
		$.getJSON("http://localhost:3000/bus_vehicles", function(data){
			var searchField = $('#search').val()
			var regex = new RegExp(searchField, 'i')
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