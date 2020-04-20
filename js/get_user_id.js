$(document).ready(function(){

	getUser(data)

	function getUser(id, data){
		
		$.ajax({
			url: "http://localhost:3000/users/" + id,
			method: "GET",
			dataType: "json",
			data: data,
			success: function(data){ console.log(data) }
		})
	}


})