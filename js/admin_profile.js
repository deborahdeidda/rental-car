$(document).ready(function() {

	console.log("DOM readyy")
	$("#alert-admin-added").hide()
	$("#alert-admin-error").hide()
	$("#admin").hide()

	
	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/users?id=' + localStorage.getItem("idfy"),
		contentType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			console.log(localStorage.getItem("jwt"))
		}
	}).done(function (response) {
		console.log("done:", response)
	}).fail(function (err)  {
		console.log("failed:", err)
	})
	console.log("1")
	//variables
	$admin_data = $('#admin-data')

	//retrieve Json data
	$.getJSON('http://localhost:3000/users?id=' + localStorage.getItem("idfy"), function(data) {

		$admin_data.html('')

		// now let's populate with Json data
		if(data[0]){
			$admin_data.append('<h4 id=" ' + data[0]['id'] + ' ">' + data[0]['name'] + " " + data[0]['surname'] + '</h4>' + "<br>" + '<p>' + "<b>ID </b>" + data[0]['id'] +  '</p>' + "<br>" + '<p>' + "<b>NAME </b>" + data[0]['name'] + '</p>' + "<br>" + '<p>' + "<b>SURNAME </b>" + data[0]['surname'] + '</p>' + "<br>" + '<p>' + "<b>DATE OF BIRTH </b>" + data[0]['birthday'] +  '</p>' + "<br>" + '<p>' + "<b>MAIL </b>" + data[0]['email'] + '</p>' + "<br>" + '<div id="user" class="row text-center"><div class="col-6"><button type="submit" class="btn btn-outline-success"><b>Update data</b></div>' + '<div class="col-6"><button id="click" type="button" class="btn btn-outline-success"><b>Add new Admin</b></div></div>' + '</button>')
		}
	})
	console.log("2")
	$('#click').on('click', function(){

		alert("admin form clicked")
		$("#admin").show()

		// let data = {
		// 	name: $('#name').val(),
		// 	email: $('#email').val(),
		// 	password: $('#password').val(),
		// 	surname: $('#surname').val(),
		// 	birthday: $('#birthday').val(),
		// 	role: "admin"
		// }
		//
		// console.log("let data:", data)

		// createNewAdmin(data)
		// $('#admin-form').trigger("reset")
		// $("#alert-admin-added").show()
		// e.preventDefault()

		// function checkUser(){
		// 	if (email != "" && password != "" && name != "" && surname != "" && birthday != "" ){
		// 		true
		// 	} else {
		// 		false
		// 	}
		// }

		// function createNewAdmin(data){
		// 	$.ajax({
		// 		url: "http://localhost:3000/users",
		// 		method: "POST",
		// 		dataType: "json",
		// 		data: data,
		// 		success: function(data){
		// 			console.log("SUCCESS data:", data)
		// 			var adminRole = data.role
		// 			localStorage.setItem("aRole", adminRole)
		// 			console.log("the role is:", data.role)
		// 		}
		// 	})
		// }
	})
})
