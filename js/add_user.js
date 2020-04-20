$(document).ready(function(){
	$('#create-user').on('click', function(e){

		let data = {
			name: $('#name').val(),
			surname: $('#surname').val(),
			birthday: $('#birthday').val(),
			mail: $('#mail').val()
		}

		addUser(data)
		$('#form').hide()
		showUser(data)
		e.preventDefault()


	})
	
	function addUser(data){
		$.ajax({
		  url: "http://localhost:3000/users",
		  method: "POST",
		  dataType: "json",
		  data: data,
		  success: function(data){ }
		})
	}

	function showUser(data){
		$('#show-new-user').html('')
		$('#title').html('')
		$('#title').append('<h3>You added successfully a new user!</h3>')
		$('#show-new-user').append('<div class="card">' + ' <img src="../img/avatar.png" alt="Avatar" style="width:100%"> ' + '<div class="container">' + '<h4>' + data.name + " " + data.surname + '</h4>' + "<br>" + '<p id="name">' + "<b>NAME </b>" + data.name + '</p>' + "<br>" + '<p id="surname">' + "<b>SURNAME </b>" + data.surname + '</p>' + "<br>" + '<p id="birthday">' + "<b>DATE OF BIRTH </b>" + data.birthday +  '</p>' + "<br>" + '<p id="mail">' + "<b>MAIL </b>" + data.mail + '</p>' + "<br>" + '</div>')


	}

})
