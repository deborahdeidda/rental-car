$(document).ready(function(){
	console.log("DOM ready")
	$.ajax({
		type: "GET",
		url: '../public/index_customer.html',
		contentType: "html",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log(localStorage.getItem("jwt"))
		}
	}).done(function (response) {
		console.log("done:", response)
	}).fail(function (err)  {
		console.log("failed:", err)
	})
})